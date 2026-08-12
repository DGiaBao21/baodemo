<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { currentUser } from '../../composables/auth.js'
import { CommentService } from '../../services/comment.service.js'
import { BlogService }    from '../../services/blog.service.js'

const commentService = new CommentService()
const blogService    = new BlogService()

const myComments = ref([])
const isLoading  = ref(true)

// ── Load tất cả comments + blog titles, lọc theo author ────────
onMounted(async () => {
    try {
        const [cmtRes, blogRes] = await Promise.all([
            commentService.list(),
            blogService.list(),
        ])
        const allComments = cmtRes.status === 200 ? cmtRes.data : []
        const allBlogs    = blogRes.status === 200 ? blogRes.data : []

        // Lọc comment của user hiện tại (theo tên hoặc email)
        const mine = allComments.filter(c =>
            c.author === currentUser.value?.name ||
            c.email  === currentUser.value?.email
        )

        // Gắn postTitle từ blog list
        myComments.value = mine.map(c => {
            const blog = allBlogs.find(b => String(b.id) === String(c.blogId))
            return {
                ...c,
                postId:    c.blogId,
                postTitle: blog?.title || c.postTitle || `Bài viết #${c.blogId}`,
            }
        })
    } catch (e) {
        console.error('Lỗi tải bình luận:', e)
    } finally {
        isLoading.value = false
    }
})

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
const isDeleting      = ref(false)
function openDeleteModal(c)  { deleteTarget.value = c; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
async function confirmDelete() {
    if (!deleteTarget.value) return
    isDeleting.value = true
    try {
        await commentService.delete(deleteTarget.value.id)
        myComments.value = myComments.value.filter(c => c.id !== deleteTarget.value.id)
        closeDeleteModal()
    } catch (e) {
        console.error('Xóa thất bại:', e)
    } finally {
        isDeleting.value = false
    }
}
// Sửa bình luận
function startEditComment(c) {
    c._isEditing = true
    c._editContent = c.content
}

function cancelEditComment(c) {
    c._isEditing = false
}

async function saveEditComment(c) {
    if (!c._editContent.trim()) {
        alert('Nội dung bình luận không được để trống')
        return
    }
    c._isSaving = true
    try {
        await commentService.patch(c.id, { content: c._editContent.trim() })
        c.content = c._editContent.trim()
        c._isEditing = false
    } catch (e) {
        console.error('Cập nhật thất bại:', e)
        alert('Cập nhật thất bại, vui lòng thử lại.')
    } finally {
        c._isSaving = false
    }
}

const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''
</script>

<template>
    <div class="container py-5" style="max-width:760px">

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="d-flex flex-column gap-3">
            <div v-for="n in 3" :key="n" class="card border-0 shadow-sm rounded-3 p-4">
                <div class="skeleton mb-2" style="height:14px;width:50%;border-radius:6px"></div>
                <div class="skeleton mb-3" style="height:16px;border-radius:6px"></div>
                <div class="skeleton" style="height:12px;width:30%;border-radius:6px"></div>
            </div>
        </div>

        <template v-else>

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
                    <div v-if="c._isEditing" class="mb-3">
                        <textarea v-model="c._editContent" class="form-control form-control-sm mb-2" rows="2"></textarea>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm px-3" @click="saveEditComment(c)" :disabled="c._isSaving">
                                <span v-if="c._isSaving" class="spinner-border spinner-border-sm me-1"></span>
                                Lưu
                            </button>
                            <button class="btn btn-outline-secondary btn-sm px-3" @click="cancelEditComment(c)" :disabled="c._isSaving">Hủy</button>
                        </div>
                    </div>
                    <p v-else class="mb-2 text-secondary">{{ c.content }}</p>

                    <!-- Meta + actions -->
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-muted small">
                            <i class="bi bi-calendar3 me-1"></i>{{ formatDate(c.createdAt) || c.createdAt }}
                        </span>
                        <div v-if="!c._isEditing">
                            <button class="btn btn-outline-primary btn-sm me-2" @click="startEditComment(c)">
                                <i class="bi bi-pencil-square me-1"></i>Sửa
                            </button>
                            <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(c)">
                                <i class="bi bi-trash me-1"></i>Xóa
                            </button>
                        </div>
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
                            <button class="btn btn-outline-secondary flex-fill" @click="closeDeleteModal" :disabled="isDeleting">Hủy</button>
                            <button class="btn btn-danger flex-fill fw-semibold" @click="confirmDelete" :disabled="isDeleting">
                                <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-trash me-1"></i>
                                {{ isDeleting ? 'Đang xóa...' : 'Xóa' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        </template><!-- end v-else -->
    </div>
</template>

<style scoped>
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
}
</style>
