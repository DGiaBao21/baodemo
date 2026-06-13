<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { currentUser } from '../../composables/auth.js'

// Giả lập bình luận của user hiện tại
const myComments = ref([
    { id: 1, postId: 1, postTitle: 'Bí quyết làm chủ JavaScript trong 30 ngày', content: 'Bài viết rất hữu ích ạ!',                   createdAt: '11/01/2025' },
    { id: 2, postId: 3, postTitle: 'Xu hướng thiết kế UI/UX nổi bật năm 2026',  content: 'Đúng xu hướng mình đang nghiên cứu.',        createdAt: '21/01/2025' },
    { id: 3, postId: 5, postTitle: 'Hiểu về AI và Machine Learning trong 5 phút',content: 'Ví dụ rất dễ hiểu, cảm ơn tác giả.',        createdAt: '11/02/2025' },
])

// Search
const searchQuery = ref('')
const filtered = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return myComments.value
    return myComments.value.filter(c =>
        c.content.toLowerCase().includes(q) ||
        c.postTitle.toLowerCase().includes(q)
    )
})

// Delete modal
const deleteTarget    = ref(null)
const showDeleteModal = ref(false)
function openDeleteModal(c)  { deleteTarget.value = c; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
function confirmDelete() {
    myComments.value = myComments.value.filter(c => c.id !== deleteTarget.value.id)
    closeDeleteModal()
}
</script>

<template>
    <div class="container py-5" style="max-width:760px">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">Bình luận của tôi</h4>
                <p class="text-muted small mb-0">
                    Quản lý các bình luận bạn đã viết
                    <span v-if="currentUser"> · {{ currentUser.name }}</span>
                </p>
            </div>
            <RouterLink to="/profile" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Trang cá nhân
            </RouterLink>
        </div>

        <!-- Stats -->
        <div class="card border-0 bg-light rounded-3 p-3 mb-4">
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-chat-dots text-primary fs-5"></i>
                <span class="fw-semibold">{{ myComments.length }} bình luận</span>
                <span class="text-muted small">đã đăng</span>
            </div>
        </div>

        <!-- Search -->
        <div class="input-group mb-4" style="max-width:320px">
            <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-search text-muted"></i>
            </span>
            <input v-model="searchQuery" type="text"
                class="form-control bg-light border-start-0"
                placeholder="Tìm bình luận..." />
        </div>

        <!-- Empty -->
        <div v-if="filtered.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-chat-square fs-1 d-block mb-3 opacity-25"></i>
            <p>Không có bình luận nào.</p>
        </div>

        <!-- Comment list -->
        <div class="d-flex flex-column gap-3">
            <div v-for="c in filtered" :key="c.id" class="card border-0 shadow-sm rounded-3">
                <div class="card-body p-4">

                    <!-- Post link -->
                    <div class="mb-2">
                        <RouterLink :to="`/blog/${c.postId}`"
                            class="small fw-semibold text-decoration-none text-primary d-inline-flex align-items-center gap-1">
                            <i class="bi bi-journal-text"></i>
                            {{ c.postTitle }}
                        </RouterLink>
                    </div>

                    <!-- Comment content -->
                    <p class="mb-2 text-secondary">{{ c.content }}</p>

                    <!-- Meta + actions -->
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-muted small">
                            <i class="bi bi-calendar3 me-1"></i>{{ c.createdAt }}
                        </span>
                        <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(c)">
                            <i class="bi bi-trash me-1"></i>Xóa
                        </button>
                    </div>

                </div>
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
                            <h5 class="fw-bold mb-2">Xóa bình luận?</h5>
                            <p class="text-muted fst-italic small">"{{ deleteTarget?.content }}"</p>
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
