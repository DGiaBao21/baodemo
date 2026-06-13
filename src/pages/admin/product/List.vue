<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

// ─── Mock data ────────────────────────────────────────────────
const products = ref([
    { id: 1, name: 'Cà phê đen',        category: 'Cà phê',    price: 25000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop', status: true,  createdAt: '2025-01-10' },
    { id: 2, name: 'Cà phê sữa',        category: 'Cà phê',    price: 30000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop', status: true,  createdAt: '2025-01-12' },
    { id: 3, name: 'Trà đào cam sả',    category: 'Trà',       price: 45000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop', status: true,  createdAt: '2025-01-20' },
    { id: 4, name: 'Trà sữa trân châu', category: 'Trà',       price: 50000, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=80&h=80&fit=crop', status: false, createdAt: '2025-02-01' },
    { id: 5, name: 'Sinh tố xoài',      category: 'Sinh tố',   price: 55000, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=80&h=80&fit=crop', status: true,  createdAt: '2025-02-10' },
    { id: 6, name: 'Nước ép cam',       category: 'Nước ép',   price: 40000, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=80&h=80&fit=crop', status: true,  createdAt: '2025-02-15' },
    { id: 7, name: 'Bánh croissant',    category: 'Bánh ngọt', price: 35000, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', status: true,  createdAt: '2025-03-01' },
    { id: 8, name: 'Capuchino',         category: 'Cà phê',    price: 55000, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=80&h=80&fit=crop', status: false, createdAt: '2025-03-10' },
])

const categoryOptions = ['Tất cả', 'Cà phê', 'Trà', 'Sinh tố', 'Nước ép', 'Bánh ngọt']

// ─── Search & Filter ──────────────────────────────────────────
const searchQuery = ref('')
const filterCat   = ref('Tất cả')

const filtered = computed(() => {
    let list = products.value
    if (filterCat.value !== 'Tất cả')
        list = list.filter(p => p.category === filterCat.value)
    const q = searchQuery.value.trim().toLowerCase()
    if (q)
        list = list.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
    return list
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtered.value.slice(start, end)
})

watch([searchQuery, filterCat], () => {
    currentPage.value = 1
})

// ─── Toggle status ────────────────────────────────────────────
function toggleStatus(p) { p.status = !p.status }

// ─── Delete modal ─────────────────────────────────────────────
const deleteTarget    = ref(null)
const showDeleteModal = ref(false)

function openDeleteModal(p)  { deleteTarget.value = p; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
function confirmDelete() {
    if (!deleteTarget.value) return
    const idx = products.value.findIndex(p => p.id === deleteTarget.value.id)
    if (idx !== -1) products.value.splice(idx, 1)
    closeDeleteModal()
}

// ─── Format price ─────────────────────────────────────────────
const formatPrice = (n) => n.toLocaleString('vi-VN') + 'đ'
</script>

<template>
    <div class="p-4">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Sản phẩm</h4>
                <p class="text-muted small mb-0">Quản lý toàn bộ sản phẩm trong menu</p>
            </div>
            <RouterLink to="/productadd" class="btn btn-success fw-semibold">
                <i class="bi bi-plus-lg me-1"></i> Thêm sản phẩm
            </RouterLink>
        </div>

        <!-- Card -->
        <div class="card shadow-sm border-0 rounded-3">

            <!-- Toolbar -->
            <div class="card-header bg-white border-bottom py-3">
                <div class="d-flex flex-wrap gap-3 align-items-center">

                    <!-- Search -->
                    <div class="input-group" style="max-width:280px">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control bg-light border-start-0"
                            placeholder="Tìm sản phẩm..."
                        />
                    </div>

                    <!-- Filter danh mục -->
                    <div class="d-flex gap-2 flex-wrap">
                        <button
                            v-for="cat in categoryOptions"
                            :key="cat"
                            class="btn btn-sm"
                            :class="filterCat === cat ? 'btn-dark' : 'btn-outline-secondary'"
                            @click="filterCat = cat"
                        >{{ cat }}</button>
                    </div>

                    <span class="text-muted small ms-auto">{{ filtered.length }} sản phẩm</span>
                </div>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width:50px">#</th>
                            <th style="width:64px">Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th style="width:120px">Danh mục</th>
                            <th style="width:110px">Giá</th>
                            <th style="width:115px">Ngày tạo</th>
                            <th style="width:130px">Trạng thái</th>
                            <th style="width:110px">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Empty -->
                        <tr v-if="filtered.length === 0">
                            <td colspan="8" class="text-center text-muted py-5">
                                <i class="bi bi-box-seam fs-1 d-block mb-2"></i>
                                Không có sản phẩm nào
                            </td>
                        </tr>

                        <!-- Rows -->
                        <tr v-for="(p, idx) in paginatedProducts" :key="p.id">
                            <td class="text-muted">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                            <td>
                                <img
                                    :src="p.image"
                                    :alt="p.name"
                                    class="rounded-2 object-fit-cover"
                                    width="48" height="48"
                                    @error="e => e.target.src='https://placehold.co/48x48?text=?'"
                                />
                            </td>
                            <td class="fw-semibold">{{ p.name }}</td>
                            <td>
                                <span class="badge text-bg-light text-dark border">{{ p.category }}</span>
                            </td>
                            <td class="fw-semibold text-success">{{ formatPrice(p.price) }}</td>
                            <td class="text-muted">{{ p.createdAt }}</td>
                            <td>
                                <div class="form-check form-switch mb-0">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        :id="`status-${p.id}`"
                                        :checked="p.status"
                                        @change="toggleStatus(p)"
                                    />
                                    <label class="form-check-label" :for="`status-${p.id}`">
                                        <span :class="p.status ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                            {{ p.status ? 'Hiển thị' : 'Ẩn' }}
                                        </span>
                                    </label>
                                </div>
                            </td>
                            <td>
                                <RouterLink
                                    :to="`/productedit/${p.id}`"
                                    class="btn btn-sm btn-outline-warning me-1"
                                    title="Sửa"
                                >
                                    <i class="bi bi-pencil"></i>
                                </RouterLink>
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    title="Xóa"
                                    @click="openDeleteModal(p)"
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
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages }} (tổng {{ filtered.length }} sản phẩm)</span>
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

        <!-- Bootstrap 5 Delete Modal -->
        <Teleport to="body">
            <!-- Backdrop -->
            <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>

            <!-- Modal -->
            <div
                v-if="showDeleteModal"
                class="modal fade show d-block"
                tabindex="-1"
                @click.self="closeDeleteModal"
            >
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0 pb-0">
                            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
                        </div>
                        <div class="modal-body text-center pt-0 px-4 pb-2">
                            <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                            <h5 class="fw-bold mb-1">Xác nhận xóa</h5>
                            <p class="text-muted mb-0">
                                Bạn có chắc muốn xóa sản phẩm
                                <strong class="text-dark">{{ deleteTarget?.name }}</strong>?
                            </p>
                            <small class="text-muted">Hành động này không thể hoàn tác.</small>
                        </div>
                        <div class="modal-footer border-0 pt-2">
                            <button class="btn btn-outline-secondary flex-fill" @click="closeDeleteModal">Hủy</button>
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
