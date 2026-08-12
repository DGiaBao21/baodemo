<script setup>
import { ref, computed, onMounted } from 'vue'
import { BlogCategoryService } from '../../../services/blog-category.service.js'

const categoryService = new BlogCategoryService()

const categories = ref([])
const isLoading = ref(false)
const error = ref(null)

const getData = async () => {
    isLoading.value = true
    try {
        const result = await categoryService.list()
        if (result.status === 200) categories.value = result.data
    } catch (e) {
        error.value = 'Không thể tải dữ liệu.'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => { getData() })

// ─── Modal Thêm/Sửa ──────────────────────────────────────────
const showModal = ref(false)
const isSaving = ref(false)
const isEditMode = ref(false)
const form = ref({ id: null, name: '', description: '', status: true, createdAt: '' })

const openCreateModal = () => {
    isEditMode.value = false
    form.value = { id: null, name: '', description: '', status: true, createdAt: new Date().toISOString().split('T')[0] }
    showModal.value = true
}

const openEditModal = (cat) => {
    isEditMode.value = true
    form.value = { ...cat }
    showModal.value = true
}

const closeModal = () => { showModal.value = false }

const handleSave = async () => {
    if (!form.value.name) return
    isSaving.value = true
    try {
        if (isEditMode.value) {
            const { id, ...data } = form.value
            await categoryService.put(id, data).catch(async () => {
                 // fallback if put not supported by json server properly
                 await categoryService.patch(id, data)
            })
            // or just patch
        } else {
            const { id, ...data } = form.value
            await categoryService.create(data)
        }
        await getData()
        closeModal()
    } catch (e) {
        console.error(e)
    } finally {
        isSaving.value = false
    }
}

// override put with patch for ease
const handleSaveReal = async () => {
    if (!form.value.name.trim()) return
    isSaving.value = true
    try {
        if (isEditMode.value) {
            const { id, ...data } = form.value
            await categoryService.patch(id, data)
        } else {
            const postData = { ...form.value }
            delete postData.id
            await categoryService.create(postData)
        }
        await getData()
        closeModal()
    } catch (e) {
        console.error(e)
    } finally {
        isSaving.value = false
    }
}

// ─── Xóa ────────────────────────────────────────────────────
const deleteTarget = ref(null)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const openDeleteModal = (cat) => { deleteTarget.value = cat; showDeleteModal.value = true }
const closeDeleteModal = () => { deleteTarget.value = null; showDeleteModal.value = false }

const confirmDelete = async () => {
    isDeleting.value = true
    try {
        await categoryService.delete(deleteTarget.value.id)
        categories.value = categories.value.filter(c => c.id !== deleteTarget.value.id)
        closeDeleteModal()
    } catch (e) { console.error(e) }
    finally { isDeleting.value = false }
}

const toggleStatus = async (c) => {
    try {
        await categoryService.patch(c.id, { status: c.status })
    } catch (e) {
        c.status = !c.status
        console.error(e)
    }
}
</script>

<template>
    <div class="p-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Danh mục bài viết</h4>
                <p class="text-muted small mb-0">Quản lý các chuyên mục blog</p>
            </div>
            <button class="btn btn-success fw-semibold px-4" @click="openCreateModal">
                <i class="bi bi-plus-lg me-2"></i>Thêm danh mục
            </button>
        </div>

        <!-- Table -->
        <div class="card shadow-sm border-0 rounded-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 50px">#</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th style="width: 150px">Ngày tạo</th>
                            <th style="width: 150px">Trạng thái</th>
                            <th style="width: 120px" class="text-end">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="categories.length === 0">
                            <td colspan="6" class="text-center text-muted py-5">
                                <i class="bi bi-folder2-open fs-1 d-block mb-2"></i>
                                Chưa có danh mục nào
                            </td>
                        </tr>
                        <tr v-for="(c, idx) in categories" :key="c.id">
                            <td class="text-muted">{{ idx + 1 }}</td>
                            <td class="fw-semibold">{{ c.name }}</td>
                            <td class="text-muted">{{ c.description || 'Không có mô tả' }}</td>
                            <td class="text-muted">{{ c.createdAt }}</td>
                            <td>
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input cursor-pointer" type="checkbox" role="switch"
                                        :id="`status-${c.id}`" v-model="c.status" @change="toggleStatus(c)" />
                                    <label class="form-check-label small cursor-pointer" :for="`status-${c.id}`"
                                        :class="c.status ? 'text-success fw-semibold' : 'text-muted'">
                                        {{ c.status ? 'Hoạt động' : 'Đã ẩn' }}
                                    </label>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-outline-warning" @click="openEditModal(c)" title="Sửa">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="openDeleteModal(c)" title="Xóa">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Thêm/Sửa -->
        <Teleport to="body">
            <div v-if="showModal" class="modal-backdrop fade show"></div>
            <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="fw-bold mb-0">{{ isEditMode ? 'Sửa danh mục' : 'Thêm danh mục mới' }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label fw-semibold small">Tên danh mục <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="form.name" placeholder="Nhập tên danh mục">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold small">Mô tả</label>
                                <textarea class="form-control" v-model="form.description" rows="3" placeholder="Nhập mô tả ngắn..."></textarea>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="catStatus" v-model="form.status">
                                <label class="form-check-label small" for="catStatus">Kích hoạt ngay</label>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 pt-0">
                            <button type="button" class="btn btn-outline-secondary" @click="closeModal" :disabled="isSaving">Hủy</button>
                            <button type="button" class="btn btn-success px-4" @click="handleSaveReal" :disabled="isSaving || !form.name.trim()">
                                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                                Lưu lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Delete -->
            <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
            <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content border-0 shadow text-center">
                        <div class="modal-body p-4">
                            <div class="mb-3">
                                <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                            </div>
                            <h5 class="fw-bold mb-2">Xác nhận xóa</h5>
                            <p class="text-muted small mb-4">Bạn có chắc chắn muốn xóa danh mục <strong>{{ deleteTarget?.name }}</strong> không? Hành động này không thể hoàn tác.</p>
                            <div class="d-flex gap-2 justify-content-center">
                                <button type="button" class="btn btn-outline-secondary px-4" @click="closeDeleteModal" :disabled="isDeleting">Hủy</button>
                                <button type="button" class="btn btn-danger px-4" @click="confirmDelete" :disabled="isDeleting">
                                    <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>
