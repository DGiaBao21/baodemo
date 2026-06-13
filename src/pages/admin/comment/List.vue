<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

// Mock data bình luận
const comments = ref([
    { id: 1, postTitle: 'Bí quyết làm chủ JavaScript trong 30 ngày', author: 'Trần Bình',   email: 'binh@gmail.com', content: 'Bài viết rất hữu ích ạ!',                   status: true,  createdAt: '2025-01-11' },
    { id: 2, postTitle: 'Bí quyết làm chủ JavaScript trong 30 ngày', author: 'Lê An',       email: 'lean@gmail.com', content: 'Xin thêm lộ trình cho React với ad.',        status: true,  createdAt: '2025-01-12' },
    { id: 3, postTitle: 'Top 5 quán cà phê làm việc lý tưởng',       author: 'Hoàng Minh',  email: 'minh@gmail.com', content: 'Quán số 2 đi cuối tuần hơi đông nha.',       status: false, createdAt: '2025-01-16' },
    { id: 4, postTitle: 'Xu hướng thiết kế UI/UX nổi bật năm 2026',  author: 'Thúy Vy',     email: 'vy@gmail.com',   content: 'Đúng xu hướng mình đang nghiên cứu.',        status: true,  createdAt: '2025-01-21' },
    { id: 5, postTitle: 'Hiểu về AI và Machine Learning trong 5 phút',author: 'Quốc Bảo',   email: 'bao@gmail.com',  content: 'Ví dụ rất dễ hiểu, cảm ơn tác giả.',        status: true,  createdAt: '2025-02-11' },
    { id: 6, postTitle: 'Lợi ích của việc dậy sớm từ 5 giờ sáng',    author: 'Hải Yến',     email: 'yen@gmail.com',  content: 'Thèm ngủ lắm ad ơi, làm sao duy trì được?', status: false, createdAt: '2025-02-20' },
])

// Search
const searchQuery = ref('')
const filterStatus = ref('all')

const filtered = computed(() => {
    let list = comments.value
    if (filterStatus.value === 'shown')  list = list.filter(c => c.status)
    if (filterStatus.value === 'hidden') list = list.filter(c => !c.status)
    const q = searchQuery.value.trim().toLowerCase()
    if (q) list = list.filter(c =>
        c.author.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.postTitle.toLowerCase().includes(q)
    )
    return list
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))

const paginatedComments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtered.value.slice(start, end)
})

watch([searchQuery, filterStatus], () => {
    currentPage.value = 1
})

// Toggle status
function toggleStatus(c) { c.status = !c.status }

// Delete modal
const deleteTarget    = ref(null)
const showDeleteModal = ref(false)
function openDeleteModal(c)  { deleteTarget.value = c; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
function confirmDelete() {
    const idx = comments.value.findIndex(c => c.id === deleteTarget.value.id)
    if (idx !== -1) comments.value.splice(idx, 1)
    closeDeleteModal()
}
</script>

<template>
    <div class="p-4">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Bình luận</h4>
                <p class="text-muted small mb-0">Quản lý toàn bộ bình luận trong hệ thống</p>
            </div>
        </div>

        <!-- Card -->
        <div class="card shadow-sm border-0 rounded-3">

            <!-- Toolbar -->
            <div class="card-header bg-white border-bottom py-3">
                <div class="d-flex flex-wrap gap-3 align-items-center">

                    <!-- Search -->
                    <div class="input-group" style="max-width:300px">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                        <input v-model="searchQuery" type="text"
                            class="form-control bg-light border-start-0"
                            placeholder="Tìm tác giả, nội dung..." />
                    </div>

                    <!-- Filter -->
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm"
                            :class="filterStatus === 'all' ? 'btn-dark' : 'btn-outline-secondary'"
                            @click="filterStatus = 'all'">Tất cả</button>
                        <button class="btn btn-sm"
                            :class="filterStatus === 'shown' ? 'btn-success' : 'btn-outline-secondary'"
                            @click="filterStatus = 'shown'">Hiển thị</button>
                        <button class="btn btn-sm"
                            :class="filterStatus === 'hidden' ? 'btn-secondary' : 'btn-outline-secondary'"
                            @click="filterStatus = 'hidden'">Ẩn</button>
                    </div>

                    <span class="text-muted small ms-auto">{{ filtered.length }} bình luận</span>
                </div>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width:50px">#</th>
                            <th>Tác giả</th>
                            <th>Nội dung</th>
                            <th>Bài viết</th>
                            <th style="width:115px">Ngày</th>
                            <th style="width:130px">Trạng thái</th>
                            <th style="width:90px">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filtered.length === 0">
                            <td colspan="7" class="text-center text-muted py-5">
                                <i class="bi bi-chat-square-x fs-1 d-block mb-2"></i>
                                Không có bình luận nào
                            </td>
                        </tr>
                        <tr v-for="(c, idx) in paginatedComments" :key="c.id">
                            <td class="text-muted">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                            <td>
                                <div class="fw-semibold">{{ c.author }}</div>
                                <div class="text-muted" style="font-size:12px">{{ c.email }}</div>
                            </td>
                            <td>
                                <p class="mb-0 text-secondary small" style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    {{ c.content }}
                                </p>
                            </td>
                            <td>
                                <span class="text-muted small" style="max-width:180px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    {{ c.postTitle }}
                                </span>
                            </td>
                            <td class="text-muted small">{{ c.createdAt }}</td>
                            <td>
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                        :id="`cmt-${c.id}`" :checked="c.status" @change="toggleStatus(c)" />
                                    <label class="form-check-label" :for="`cmt-${c.id}`">
                                        <span :class="c.status ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                            {{ c.status ? 'Hiển thị' : 'Ẩn' }}
                                        </span>
                                    </label>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger" title="Xóa" @click="openDeleteModal(c)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Footer -->
            <div v-if="totalPages > 1" class="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages }} (tổng {{ filtered.length }} bình luận)</span>
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

        <!-- Delete Modal -->
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
                            <h5 class="fw-bold mb-1">Xác nhận xóa bình luận</h5>
                            <p class="text-muted mb-1">Bình luận của <strong>{{ deleteTarget?.author }}</strong>:</p>
                            <p class="fst-italic text-secondary small">"{{ deleteTarget?.content }}"</p>
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
