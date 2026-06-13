<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

const searchQuery  = ref('')
const filterStatus = ref('all')
const filterCat    = ref('Tất cả')

const blogs = ref([
    { id: 1, title: 'Bí quyết pha cà phê ngon tại nhà',          category: 'Hướng dẫn', author: 'Admin',  thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=360&fit=crop', status: true,  createdAt: '2025-03-10', comments: 5,  likes: 42 },
    { id: 2, title: 'Top 10 loại trà thảo mộc tốt cho sức khỏe', category: 'Sức khỏe',  author: 'Editor', thumbnail: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=360&fit=crop', status: true,  createdAt: '2025-03-18', comments: 2,  likes: 28 },
    { id: 3, title: 'Lịch sử hạt cà phê Arabica và Robusta',      category: 'Kiến thức', author: 'Admin',  thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=360&fit=crop', status: false, createdAt: '2025-04-02', comments: 0,  likes: 15 },
    { id: 4, title: 'Menu mùa hè: Thức uống làm mát tuyệt vời',   category: 'Menu',      author: 'Editor', thumbnail: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=360&fit=crop', status: true,  createdAt: '2025-04-20', comments: 8,  likes: 67 },
    { id: 5, title: 'Cách chọn máy pha cà phê phù hợp',           category: 'Hướng dẫn', author: 'Admin',  thumbnail: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=360&fit=crop', status: false, createdAt: '2025-05-05', comments: 1,  likes: 9  },
    { id: 6, title: 'Cà phê Cold Brew — cách làm tại nhà',        category: 'Hướng dẫn', author: 'Admin',  thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=360&fit=crop', status: true,  createdAt: '2025-05-15', comments: 3,  likes: 31 },
])

const categories = computed(() => ['Tất cả', ...new Set(blogs.value.map(b => b.category))])

const filtered = computed(() => {
    let list = blogs.value
    if (filterStatus.value === 'active') list = list.filter(b => b.status)
    if (filterStatus.value === 'hidden') list = list.filter(b => !b.status)
    if (filterCat.value !== 'Tất cả')   list = list.filter(b => b.category === filterCat.value)
    const q = searchQuery.value.trim().toLowerCase()
    if (q) list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    )
    return list
})

const currentPage = ref(1)
const itemsPerPage = ref(3)

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))

const paginatedBlogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtered.value.slice(start, end)
})

watch([searchQuery, filterStatus, filterCat], () => {
    currentPage.value = 1
})

function toggleStatus(b) { b.status = !b.status }

const deleteTarget    = ref(null)
const showDeleteModal = ref(false)
function openDeleteModal(b)  { deleteTarget.value = b; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
function confirmDelete() {
    blogs.value = blogs.value.filter(b => b.id !== deleteTarget.value.id)
    closeDeleteModal()
}
</script>

<template>
    <div class="p-4">

        <!-- ── Page Header ── -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Bài viết</h4>
                <p class="text-muted small mb-0">Quản lý toàn bộ bài viết trên blog</p>
            </div>
            <RouterLink to="/blogadd" class="btn btn-success fw-semibold px-4">
                <i class="bi bi-plus-lg me-1"></i> Thêm bài viết
            </RouterLink>
        </div>

        <!-- ── Stats ── -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm rounded-3 h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style="width:48px;height:48px">
                            <i class="bi bi-newspaper text-primary fs-4"></i>
                        </div>
                        <div>
                            <div class="fw-bold fs-5">{{ blogs.length }}</div>
                            <div class="text-muted small">Tổng bài viết</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm rounded-3 h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style="width:48px;height:48px">
                            <i class="bi bi-eye text-success fs-4"></i>
                        </div>
                        <div>
                            <div class="fw-bold fs-5">{{ blogs.filter(b => b.status).length }}</div>
                            <div class="text-muted small">Đang hiển thị</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm rounded-3 h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style="width:48px;height:48px">
                            <i class="bi bi-eye-slash text-secondary fs-4"></i>
                        </div>
                        <div>
                            <div class="fw-bold fs-5">{{ blogs.filter(b => !b.status).length }}</div>
                            <div class="text-muted small">Đang ẩn</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm rounded-3 h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-warning bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0" style="width:48px;height:48px">
                            <i class="bi bi-tags text-warning fs-4"></i>
                        </div>
                        <div>
                            <div class="fw-bold fs-5">{{ new Set(blogs.map(b => b.category)).size }}</div>
                            <div class="text-muted small">Chủ đề</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Toolbar Card ── -->
        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body py-3 px-4">
                <div class="row g-3 align-items-end">

                    <!-- Search -->
                    <div class="col-md-4">
                        <label class="form-label text-muted small fw-semibold mb-1">
                            <i class="bi bi-search me-1"></i>TÌM KIẾM
                        </label>
                        <div class="input-group">
                            <input v-model="searchQuery" type="text"
                                class="form-control bg-light"
                                placeholder="Tiêu đề, tác giả..." />
                            <button v-if="searchQuery" class="btn btn-outline-secondary" @click="searchQuery = ''">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Trạng thái -->
                    <div class="col-md-4">
                        <label class="form-label text-muted small fw-semibold mb-1">
                            <i class="bi bi-toggles me-1"></i>TRẠNG THÁI
                        </label>
                        <div class="btn-group w-100" role="group">
                            <input type="radio" class="btn-check" v-model="filterStatus" value="all"    id="s-all"    />
                            <label class="btn btn-outline-secondary" for="s-all">
                                <i class="bi bi-list me-1"></i>Tất cả
                                <span class="badge bg-secondary ms-1">{{ blogs.length }}</span>
                            </label>

                            <input type="radio" class="btn-check" v-model="filterStatus" value="active" id="s-active" />
                            <label class="btn btn-outline-success" for="s-active">
                                <i class="bi bi-eye me-1"></i>Hiển thị
                                <span class="badge bg-success ms-1">{{ blogs.filter(b=>b.status).length }}</span>
                            </label>

                            <input type="radio" class="btn-check" v-model="filterStatus" value="hidden" id="s-hidden" />
                            <label class="btn btn-outline-secondary" for="s-hidden">
                                <i class="bi bi-eye-slash me-1"></i>Ẩn
                                <span class="badge bg-secondary ms-1">{{ blogs.filter(b=>!b.status).length }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Danh mục -->
                    <div class="col-md-4">
                        <label class="form-label text-muted small fw-semibold mb-1">
                            <i class="bi bi-tag me-1"></i>CHỦ ĐỀ
                        </label>
                        <select v-model="filterCat" class="form-select bg-light">
                            <option v-for="cat in categories" :key="cat" :value="cat">
                                {{ cat === 'Tất cả' ? '📚 Tất cả chủ đề' : cat }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Result count -->
                <div class="mt-3 pt-2 border-top d-flex align-items-center gap-2">
                    <i class="bi bi-funnel text-muted small"></i>
                    <span class="text-muted small">
                        Đang hiển thị <strong class="text-dark">{{ filtered.length }}</strong> / {{ blogs.length }} bài viết
                    </span>
                    <button v-if="searchQuery || filterStatus !== 'all' || filterCat !== 'Tất cả'"
                        class="btn btn-link btn-sm text-danger p-0 ms-2"
                        @click="searchQuery = ''; filterStatus = 'all'; filterCat = 'Tất cả'">
                        <i class="bi bi-x-circle me-1"></i>Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Empty ── -->
        <div v-if="filtered.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-journal-x fs-1 d-block mb-3 opacity-25"></i>
            <p class="mb-0">Không tìm thấy bài viết nào.</p>
        </div>

        <!-- ── Card Grid ── -->
        <div class="row g-4">
            <div v-for="b in paginatedBlogs" :key="b.id" class="col-xl-4 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">

                    <!-- Thumbnail -->
                    <div class="position-relative overflow-hidden rounded-top-4" style="height:190px">
                        <img :src="b.thumbnail" :alt="b.title"
                            class="w-100 h-100 object-fit-cover"
                            style="transition:transform 0.4s ease"
                            @mouseover="$event.target.style.transform='scale(1.06)'"
                            @mouseleave="$event.target.style.transform='scale(1)'" />

                        <!-- Overlay mờ khi ẩn -->
                        <div v-if="!b.status"
                            class="position-absolute inset-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style="background:rgba(0,0,0,0.45)">
                            <span class="badge bg-dark fs-6 px-3 py-2">
                                <i class="bi bi-eye-slash me-1"></i>Đang ẩn
                            </span>
                        </div>

                        <!-- Category -->
                        <span class="position-absolute bottom-0 start-0 m-2 badge text-bg-dark bg-opacity-75 px-2 py-1">
                            <i class="bi bi-tag me-1"></i>{{ b.category }}
                        </span>
                    </div>

                    <!-- Body -->
                    <div class="card-body d-flex flex-column p-3">

                        <h6 class="fw-bold lh-sm mb-2"
                            style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.8em">
                            {{ b.title }}
                        </h6>

                        <!-- Meta -->
                        <div class="d-flex flex-wrap gap-3 text-muted small mb-3">
                            <span class="d-flex align-items-center gap-1">
                                <i class="bi bi-person-circle"></i>{{ b.author }}
                            </span>
                            <span class="d-flex align-items-center gap-1">
                                <i class="bi bi-calendar3"></i>{{ b.createdAt }}
                            </span>
                            <span class="d-flex align-items-center gap-1">
                                <i class="bi bi-heart text-danger"></i>{{ b.likes }}
                            </span>
                            <span class="d-flex align-items-center gap-1">
                                <i class="bi bi-chat-dots text-primary"></i>{{ b.comments }}
                            </span>
                        </div>

                        <!-- Footer actions -->
                        <div class="d-flex align-items-center gap-2 mt-auto pt-2 border-top">

                            <!-- Toggle hiển thị -->
                            <div class="form-check form-switch mb-0 me-auto">
                                <input class="form-check-input" type="checkbox" role="switch"
                                    :id="`tog-${b.id}`" :checked="b.status" @change="toggleStatus(b)" />
                                <label class="form-check-label small" :for="`tog-${b.id}`"
                                    :class="b.status ? 'text-success fw-semibold' : 'text-muted'">
                                    {{ b.status ? 'Hiển thị' : 'Đã ẩn' }}
                                </label>
                            </div>

                            <RouterLink :to="`/blogedit/${b.id}`"
                                class="btn btn-outline-warning btn-sm" title="Chỉnh sửa">
                                <i class="bi bi-pencil"></i>
                            </RouterLink>
                            <button class="btn btn-outline-danger btn-sm" title="Xóa"
                                @click="openDeleteModal(b)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Phân trang Bootstrap 5 -->
        <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
            <ul class="pagination pagination-sm">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link shadow-none" @click="currentPage = 1" style="cursor: pointer;">Trang đầu</button>
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
                    <button class="page-link shadow-none" @click="currentPage = totalPages" style="cursor: pointer;">Trang cuối</button>
                </li>
            </ul>
        </nav>

        <!-- ── Delete Modal ── -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
            <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" @click.self="closeDeleteModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0 pb-0">
                            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
                        </div>
                        <div class="modal-body text-center pt-0 px-4 pb-2">
                            <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                            <h5 class="fw-bold mb-1">Xác nhận xóa bài viết</h5>
                            <p class="text-muted mb-0 fst-italic small">"{{ deleteTarget?.title }}"</p>
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
