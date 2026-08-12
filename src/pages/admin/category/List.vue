<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { CategoryService } from '../../../services/category.service.js'

const categoryService = new CategoryService()

// ─── State ───────────────────────────────────────────────────
const categories  = ref([])
const isLoading   = ref(false)
const error       = ref(null)

// ─── Fetch danh sách ─────────────────────────────────────────
const getData = async () => {
    isLoading.value = true
    error.value = null
    try {
        const result = await categoryService.list()
        if (result.status === 200) {
            categories.value = result.data
        }
    } catch (e) {
        error.value = 'Không thể tải dữ liệu. Vui lòng kiểm tra json-server đang chạy tại cổng 3000.'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getData()
})

// ─── Search & Phân trang ──────────────────────────────────────
const searchQuery = ref('')

const filteredCategories = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return categories.value
    return categories.value.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
})

const currentPage  = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() =>
    Math.ceil(filteredCategories.value.length / itemsPerPage.value)
)

const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredCategories.value.slice(start, start + itemsPerPage.value)
})

watch(searchQuery, () => { currentPage.value = 1 })

// ─── Toggle status ────────────────────────────────────────────
const toggleStatus = async (cat) => {
    cat.status = !cat.status
    try {
        await categoryService.patch(cat.id, { status: cat.status })
    } catch (e) {
        cat.status = !cat.status   // rollback nếu lỗi
        console.error('Cập nhật trạng thái thất bại', e)
    }
}

// ─── Xóa ─────────────────────────────────────────────────────
const selectedCategory = ref(null)
const isDeleting       = ref(false)

const openDeleteModal = (category) => {
    selectedCategory.value = category
}

const handleDelete = async () => {
    if (!selectedCategory.value) return
    isDeleting.value = true
    try {
        const result = await categoryService.delete(selectedCategory.value.id)
        if (result.status === 200) {
            categories.value = categories.value.filter(
                c => c.id !== selectedCategory.value.id
            )
            selectedCategory.value = null
        }
    } catch (e) {
        console.error('Xóa thất bại', e)
    } finally {
        isDeleting.value = false
    }
}
</script>

<template>
    <div class="p-4">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Danh mục</h4>
                <p class="text-muted small mb-0">Quản lý toàn bộ danh mục sản phẩm</p>
            </div>
            <RouterLink to="/categoryadd" class="btn btn-success fw-semibold">
                <i class="bi bi-plus-lg me-1"></i> Thêm danh mục
            </RouterLink>
        </div>

        <!-- Error banner -->
        <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>{{ error }}</span>
            <button class="btn btn-sm btn-outline-danger ms-auto" @click="getData">
                <i class="bi bi-arrow-clockwise me-1"></i>Thử lại
            </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="card shadow-sm border-0 rounded-3 p-4">
            <div v-for="n in 5" :key="n" class="d-flex gap-3 mb-3 align-items-center">
                <div class="bg-secondary bg-opacity-10 rounded" style="width:32px;height:20px"></div>
                <div class="bg-secondary bg-opacity-10 rounded flex-fill" style="height:20px"></div>
                <div class="bg-secondary bg-opacity-10 rounded" style="width:180px;height:20px"></div>
                <div class="bg-secondary bg-opacity-10 rounded" style="width:90px;height:20px"></div>
                <div class="bg-secondary bg-opacity-10 rounded" style="width:80px;height:20px"></div>
            </div>
        </div>

        <!-- Card bảng -->
        <div v-else class="card shadow-sm border-0 rounded-3">

            <!-- Search -->
            <div class="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between gap-3">
                <div class="input-group" style="max-width: 340px;">
                    <span class="input-group-text bg-light border-end-0">
                        <i class="bi bi-search text-muted"></i>
                    </span>
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="form-control bg-light border-start-0"
                        placeholder="Tìm theo tên, mô tả..."
                    />
                </div>
                <span class="text-muted small">{{ filteredCategories.length }} danh mục</span>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width:56px">#</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th style="width:130px">Ngày tạo</th>
                            <th style="width:130px">Trạng thái</th>
                            <th style="width:120px">Hành động</th>
                        </tr>
                    </thead>
                    <tbody style="min-height: 325px; display: table-row-group;">
                        <!-- Không có dữ liệu -->
                        <tr v-if="filteredCategories.length === 0">
                            <td colspan="6" class="text-center text-muted py-5">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                Chưa có danh mục nào
                            </td>
                        </tr>

                        <!-- Dữ liệu -->
                        <tr v-for="(cat, idx) in paginatedCategories" :key="cat.id">
                            <td class="text-muted">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                            <td class="fw-semibold">{{ cat.name }}</td>
                            <td class="text-muted">{{ cat.description }}</td>
                            <td class="text-muted">{{ cat.createdAt }}</td>
                            <td>
                                <div class="form-check form-switch mb-0" style="min-width:100px">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        :id="`status-${cat.id}`"
                                        :checked="cat.status"
                                        @change="toggleStatus(cat)"
                                    />
                                    <label class="form-check-label" :for="`status-${cat.id}`">
                                        <span :class="cat.status ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                            {{ cat.status ? 'Hoạt động' : 'Ẩn' }}
                                        </span>
                                    </label>
                                </div>
                            </td>
                            <td>
                                <RouterLink
                                    :to="`/categoryedit/${cat.id}`"
                                    class="btn btn-sm btn-outline-warning me-1"
                                    title="Sửa"
                                >
                                    <i class="bi bi-pencil"></i>
                                </RouterLink>
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    title="Xóa"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                    @click="openDeleteModal(cat)"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div class="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages || 1 }} (tổng {{ filteredCategories.length }} danh mục)</span>
                <nav v-if="totalPages > 1">
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link shadow-none" @click="currentPage = 1" style="cursor: pointer;">Đầu</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link shadow-none" @click="currentPage--" style="cursor: pointer;">Trước</button>
                        </li>
                        <li
                            v-for="page in totalPages"
                            :key="page"
                            class="page-item"
                            :class="{ active: currentPage === page }"
                        >
                            <button class="page-link shadow-none" @click="currentPage = page" style="cursor: pointer;">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link shadow-none" @click="currentPage++" style="cursor: pointer;">Sau</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link shadow-none" @click="currentPage = totalPages" style="cursor: pointer;">Cuối</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal xác nhận xóa -->
        <Teleport to="body">
            <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
                    <div class="modal-content border-0 shadow-lg rounded-4 p-4 bg-white">
                        <div class="modal-header border-0 pb-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="text-center mb-3">
                            <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                            <h5 class="fw-bold mb-1">Xác nhận xóa</h5>
                            <p class="text-muted mb-0">
                                Bạn có chắc muốn xóa danh mục
                                <strong class="text-dark">{{ selectedCategory?.name }}</strong>?
                                <br /><small>Hành động này không thể hoàn tác.</small>
                            </p>
                        </div>
                        <div class="d-flex gap-2 mt-4">
                            <button class="btn btn-outline-secondary flex-fill" data-bs-dismiss="modal">
                                Hủy
                            </button>
                            <button
                                class="btn btn-danger flex-fill fw-semibold"
                                :disabled="isDeleting"
                                data-bs-dismiss="modal"
                                @click="handleDelete"
                            >
                                <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                <i v-else class="bi bi-trash me-1"></i>
                                {{ isDeleting ? 'Đang xóa...' : 'Xóa' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

    </div>
</template>