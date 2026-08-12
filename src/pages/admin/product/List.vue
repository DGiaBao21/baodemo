<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ProductService }  from '../../../services/product.service.js'
import { CategoryService } from '../../../services/category.service.js'

const productService  = new ProductService()
const categoryService = new CategoryService()

// ─── State ────────────────────────────────────────────────────
const products  = ref([])
const isLoading = ref(false)
const error     = ref(null)

const getData = async () => {
    isLoading.value = true
    error.value = null
    try {
        const result = await productService.list()
        if (result.status === 200) products.value = result.data
    } catch (e) {
        error.value = 'Không thể tải dữ liệu. Vui lòng kiểm tra server.'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

// Load danh mục cho filter
const categoryOptions = ref(['Tất cả'])
onMounted(async () => {
    await getData()
    try {
        const res = await categoryService.list()
        if (res.status === 200) {
            categoryOptions.value = ['Tất cả', ...res.data.map(c => c.name)]
        }
    } catch (e) { console.error(e) }
})

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

const currentPage  = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtered.value.slice(start, end)
})

watch([searchQuery, filterCat], () => { currentPage.value = 1 })

// ─── Toggle status ────────────────────────────────────────────
const toggleStatus = async (p) => {
    p.status = !p.status
    try {
        await productService.patch(p.id, { status: p.status })
    } catch (e) { p.status = !p.status; console.error(e) }
}

// ─── Delete modal ─────────────────────────────────────────────
const deleteTarget    = ref(null)
const showDeleteModal = ref(false)
const isDeleting      = ref(false)

function openDeleteModal(p)  { deleteTarget.value = p; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }

const confirmDelete = async () => {
    if (!deleteTarget.value) return
    isDeleting.value = true
    try {
        await productService.delete(deleteTarget.value.id)
        products.value = products.value.filter(p => p.id !== deleteTarget.value.id)
    } catch (e) { console.error(e) }
    finally { isDeleting.value = false; closeDeleteModal() }
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
                    <tbody style="min-height: 325px; display: table-row-group;">
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
            <div class="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages || 1 }} (tổng {{ filtered.length }} sản phẩm)</span>
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
