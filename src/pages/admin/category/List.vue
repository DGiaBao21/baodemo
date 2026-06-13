<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

// ─── Mock data ───────────────────────────────────────────────
const categories = ref([
    { id: 1, name: 'Cà phê',    description: 'Các loại cà phê đặc trưng',    status: true,  createdAt: '2025-01-10' },
    { id: 2, name: 'Trà',       description: 'Trà xanh, trà đào, trà sữa',   status: true,  createdAt: '2025-01-15' },
    { id: 3, name: 'Sinh tố',   description: 'Sinh tố hoa quả tươi',          status: true,  createdAt: '2025-02-03' },
    { id: 4, name: 'Nước ép',   description: 'Nước ép nguyên chất 100%',      status: false, createdAt: '2025-02-20' },
    { id: 5, name: 'Bánh ngọt', description: 'Bánh cake, cookie, croissant',  status: true,  createdAt: '2025-03-05' },
    { id: 6, name: 'Đồ ăn nhẹ',description: 'Snack, sandwich, salad',        status: true,  createdAt: '2025-03-18' },
    { id: 7, name: 'Đồ uống đá',description: 'Các loại đồ uống có đá',       status: false, createdAt: '2025-04-01' },
])

// ─── Search ──────────────────────────────────────────────────
const searchQuery = ref('')
const filteredCategories = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return categories.value
    return categories.value.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage.value))

const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredCategories.value.slice(start, end)
})

watch(searchQuery, () => {
    currentPage.value = 1
})

// ─── Toggle status ───────────────────────────────────────────
function toggleStatus(cat) {
    cat.status = !cat.status
}

// ─── Delete confirm modal ─────────────────────────────────────
const deleteTarget = ref(null)
const showDeleteModal = ref(false)

function openDeleteModal(cat) {
    deleteTarget.value = cat
    showDeleteModal.value = true
}

function closeDeleteModal() {
    deleteTarget.value = null
    showDeleteModal.value = false
}

function confirmDelete() {
    if (!deleteTarget.value) return
    const idx = categories.value.findIndex(c => c.id === deleteTarget.value.id)
    if (idx !== -1) categories.value.splice(idx, 1)
    closeDeleteModal()
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

        <!-- Card -->
        <div class="card shadow-sm border-0 rounded-3">

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
                    <tbody>
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
                                <!-- Toggle switch -->
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
            <div v-if="totalPages > 1" class="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages }} (tổng {{ filteredCategories.length }} danh mục)</span>
                <nav>
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

        <!-- Delete Confirm Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.45);" @click.self="closeDeleteModal">
                <div class="modal-dialog modal-dialog-centered" style="max-width: 400px; margin: 1.75rem auto;">
                    <div class="modal-content border-0 shadow-lg rounded-4 p-4 bg-white">
                        <div class="text-center mb-3">
                            <div class="mb-3">
                                <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                            </div>
                            <h5 class="fw-bold mb-1">Xác nhận xóa</h5>
                            <p class="text-muted mb-0">
                                Bạn có chắc muốn xóa danh mục
                                <strong class="text-dark">{{ deleteTarget?.name }}</strong>?
                                <br /><small>Hành động này không thể hoàn tác.</small>
                            </p>
                        </div>
                        <div class="d-flex gap-2 mt-4">
                            <button class="btn btn-outline-secondary flex-fill" @click="closeDeleteModal">
                                Hủy
                            </button>
                            <button class="btn btn-danger flex-fill fw-semibold" @click="confirmDelete">
                                <i class="bi bi-trash me-1"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

    </div>
</template>