<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { BlogService }    from '../../services/blog.service.js'
import { CommentService } from '../../services/comment.service.js'
import { UserService }    from '../../services/user.service.js'
import { currentUser, isLoggedIn } from '../../composables/auth.js'

const route          = useRoute()
const blogService    = new BlogService()
const commentService = new CommentService()
const userService    = new UserService()

const post       = ref(null)
const comments   = ref([])
const isLoading  = ref(true)
const liked      = ref(false)

// ── Fetch blog + comments ──────────────────────────────────────
onMounted(async () => {
    try {
        const [blogRes, cmtRes, userRes] = await Promise.all([
            blogService.getById(route.params.id),
            commentService.getByBlogId(route.params.id),
            userService.list()
        ])
        if (blogRes.status === 200) {
            post.value = blogRes.data
            if (isLoggedIn.value && currentUser.value) {
                liked.value = (post.value.likedBy || []).includes(currentUser.value.id)
            }
        }
        
        const users = userRes.status === 200 ? userRes.data : []

        if (cmtRes.status === 200) {
            comments.value = cmtRes.data
                .filter(c => c.status !== false)
                .map(c => {
                    const u = users.find(usr => usr.email === c.email)
                    return {
                        ...c,
                        avatar: u ? u.avatar : `https://ui-avatars.com/api/?name=${c.author}&background=random&color=fff`,
                        _isOwn: isLoggedIn.value && currentUser.value && (c.email === currentUser.value.email || c.author === currentUser.value.name)
                    }
                })
        }
    } catch (e) {
        console.error('Lỗi tải bài viết:', e)
    } finally {
        isLoading.value = false
    }
})

// ── Like (Lưu API) ──────────────────────────────────────────────
const isLiking = ref(false)

async function toggleLike() {
    if (!isLoggedIn.value) {
        alert('Vui lòng đăng nhập để thích bài viết!')
        return
    }
    // Nếu đang xử lý hoặc đã like rồi thì không làm gì cả
    if (!post.value || isLiking.value || liked.value) return

    isLiking.value = true
    const userId = currentUser.value.id
    let newLikedBy = post.value.likedBy || []

    // Chỉ thực hiện Like (không có Unlike)
    if (!newLikedBy.includes(userId)) {
        newLikedBy.push(userId)
    }
    post.value.likes = (post.value.likes || 0) + 1
    
    liked.value = true
    post.value.likedBy = newLikedBy

    // Gửi lên API
    try {
        await blogService.patch(post.value.id, {
            likes: post.value.likes,
            likedBy: post.value.likedBy
        })
    } catch (e) {
        console.error('Lỗi cập nhật lượt thích:', e)
        alert('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
        isLiking.value = false
    }
}

// ── Bình luận ─────────────────────────────────────────────────
const newComment   = ref('')
const commentError = ref('')
const isSubmitting = ref(false)

async function submitComment() {
    if (!newComment.value.trim()) {
        commentError.value = 'Vui lòng nhập bình luận.'
        return
    }
    commentError.value = ''
    isSubmitting.value = true
    try {
        const data = {
            blogId:    String(route.params.id),
            author:    currentUser.value?.name || 'Khách',
            email:     currentUser.value?.email || '',
            content:   newComment.value.trim(),
            status:    true,
            createdAt: new Date().toISOString().split('T')[0],
            _isOwn:    true,
        }
        const res = await commentService.create(data)
        if (res.status === 201) {
            comments.value.push({ ...res.data, _isOwn: true })
            newComment.value = ''
        }
    } catch (e) {
        commentError.value = 'Gửi thất bại, vui lòng thử lại.'
    } finally {
        isSubmitting.value = false
    }
}

// ── Reply ──────────────────────────────────────────────────
const replyingTo = ref(null)
const replyContent = ref('')
const isSubmittingReply = ref(false)

const topLevelComments = computed(() => comments.value.filter(c => !c.parentId))
function getReplies(parentId) {
    return comments.value.filter(c => String(c.parentId) === String(parentId))
}

function startReply(c) {
    if (!isLoggedIn.value) {
        alert('Vui lòng đăng nhập để phản hồi.')
        return
    }
    replyingTo.value = c.id
    replyContent.value = ''
}

function cancelReply() {
    replyingTo.value = null
    replyContent.value = ''
}

async function submitReply(parentId) {
    if (!replyContent.value.trim()) return
    isSubmittingReply.value = true
    try {
        const data = {
            blogId:    String(route.params.id),
            author:    currentUser.value?.name || 'Khách',
            email:     currentUser.value?.email || '',
            content:   replyContent.value.trim(),
            status:    true,
            createdAt: new Date().toISOString().split('T')[0],
            parentId:  parentId,
        }
        const res = await commentService.create(data)
        if (res.status === 201) {
            comments.value.push({ 
                ...res.data, 
                avatar: currentUser.value?.avatar || `https://ui-avatars.com/api/?name=${data.author}&background=random&color=fff`,
                _isOwn: true 
            })
            cancelReply()
        }
    } catch (e) {
        alert('Gửi phản hồi thất bại, vui lòng thử lại.')
    } finally {
        isSubmittingReply.value = false
    }
}

async function deleteComment(cmt) {
    if (!cmt._isOwn) return
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return
    try {
        await commentService.delete(cmt.id)
        comments.value = comments.value.filter(c => c.id !== cmt.id)
    } catch (e) {
        console.error('Xóa thất bại:', e)
    }
}

// Chỉnh sửa bình luận
function startEditComment(cmt) {
    if (!cmt._isOwn) return
    cmt._isEditing = true
    cmt._editContent = cmt.content
}

function cancelEditComment(cmt) {
    cmt._isEditing = false
}

async function saveEditComment(cmt) {
    if (!cmt._editContent.trim()) {
        alert('Nội dung bình luận không được để trống')
        return
    }
    cmt._isSaving = true
    try {
        await commentService.patch(cmt.id, { content: cmt._editContent.trim() })
        cmt.content = cmt._editContent.trim()
        cmt._isEditing = false
    } catch (e) {
        console.error('Cập nhật thất bại:', e)
        alert('Cập nhật thất bại, vui lòng thử lại.')
    } finally {
        cmt._isSaving = false
    }
}

const readTime = text => Math.max(1, Math.ceil((text || '').split(' ').length / 200)) + ' phút đọc'
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''
</script>

<template>
    <!-- Loading -->
    <div v-if="isLoading" class="container py-5" style="max-width:780px">
        <div class="skeleton mb-4" style="height:40px;width:30%;border-radius:8px"></div>
        <div class="skeleton mb-3" style="height:380px;border-radius:16px"></div>
        <div class="skeleton mb-2" style="height:24px;width:60%;border-radius:6px"></div>
        <div class="skeleton mb-2" style="height:16px;border-radius:6px"></div>
        <div class="skeleton" style="height:16px;width:80%;border-radius:6px"></div>
    </div>

    <!-- Not found -->
    <div v-else-if="!post" class="container py-5 text-center text-muted">
        <i class="bi bi-journal-x fs-1 d-block mb-3"></i>
        <h4>Không tìm thấy bài viết</h4>
        <RouterLink to="/blog" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-1"></i> Quay lại Blog
        </RouterLink>
    </div>

    <!-- Bài viết chi tiết -->
    <div v-else class="container py-5" style="max-width:780px">

        <!-- Nút quay lại -->
        <RouterLink to="/blog" class="btn btn-outline-secondary btn-sm mb-4">
            <i class="bi bi-arrow-left me-1"></i> Quay lại Blog
        </RouterLink>

        <!-- Badge + Tiêu đề -->
        <span class="badge text-bg-primary mb-3">{{ post.category }}</span>
        <h1 class="fw-bold mb-3" style="line-height:1.3">{{ post.title }}</h1>

        <!-- Meta -->
        <div class="d-flex flex-wrap gap-3 align-items-center text-muted small mb-4">
            <span><i class="bi bi-person-circle me-1"></i>{{ post.author }}</span>
            <span><i class="bi bi-calendar3 me-1"></i>{{ formatDate(post.createdAt) }}</span>
            <span><i class="bi bi-clock me-1"></i>{{ readTime(post.content) }}</span>
            <span><i class="bi bi-chat-dots me-1"></i>{{ comments.length }} bình luận</span>
        </div>

        <!-- Ảnh thumbnail -->
        <img :src="post.thumbnail" :alt="post.title"
            class="w-100 rounded-4 mb-5 object-fit-cover" style="height:380px" />

        <!-- Nội dung bài viết -->
        <div class="blog-content fs-6 lh-lg text-secondary mb-5">{{ post.content }}</div>

        <!-- Like + Chia sẻ -->
        <div class="d-flex align-items-center gap-3 py-3 border-top border-bottom mb-5">
            <button class="btn d-flex align-items-center gap-2"
                :class="liked ? 'btn-danger' : 'btn-outline-secondary'"
                @click="toggleLike"
                :disabled="isLiking || liked"
                :title="liked ? 'Bạn đã thích bài viết này' : 'Thích bài viết'">
                <span v-if="isLiking" class="spinner-border spinner-border-sm"></span>
                <i v-else :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                {{ post.likes || 0 }} thích
            </button>
            <span class="text-muted small ms-auto">Chia sẻ:</span>
            <a href="#" class="btn btn-outline-secondary btn-sm"><i class="bi bi-facebook"></i></a>
            <a href="#" class="btn btn-outline-secondary btn-sm"><i class="bi bi-twitter-x"></i></a>
        </div>

        <!-- Bình luận -->
        <section>
            <h5 class="fw-bold mb-4">
                <i class="bi bi-chat-dots me-2"></i>Bình luận ({{ comments.length }})
            </h5>

            <div v-if="comments.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-chat fs-1 d-block mb-2 opacity-25"></i>
                Chưa có bình luận nào. Hãy là người đầu tiên!
            </div>

            <!-- Danh sách comment -->
            <div v-for="c in topLevelComments" :key="c.id" class="mb-4">
                <div class="d-flex gap-3">
                    <img :src="c.avatar" 
                         :alt="c.author" class="rounded-circle flex-shrink-0 border border-light shadow-sm" style="width:40px;height:40px;object-fit:cover;" />
                    <div class="flex-fill">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="fw-semibold small">{{ c.author }}</span>
                            <span v-if="c._isOwn" class="badge text-bg-primary" style="font-size:10px">Bạn</span>
                            <span class="text-muted" style="font-size:12px">{{ formatDate(c.createdAt) }}</span>
                            
                            <button v-if="isLoggedIn && c.id !== replyingTo" class="btn btn-link btn-sm text-secondary p-0 text-decoration-none ms-2" title="Phản hồi" @click="startReply(c)">
                                <i class="bi bi-reply-fill"></i> Phản hồi
                            </button>

                            <!-- Nút Sửa / Xóa cho chủ comment -->
                            <div v-if="c._isOwn && !c._isEditing" class="ms-auto d-flex gap-1">
                                <button class="btn btn-link btn-sm text-primary p-0 text-decoration-none"
                                    title="Sửa bình luận" @click="startEditComment(c)">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-link btn-sm text-danger p-0 ms-2 text-decoration-none"
                                    title="Xóa bình luận" @click="deleteComment(c)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Hiển thị form Sửa hoặc nội dung text -->
                        <div v-if="c._isEditing" class="mt-2">
                            <textarea v-model="c._editContent" class="form-control form-control-sm mb-2" rows="2"></textarea>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm px-3" @click="saveEditComment(c)" :disabled="c._isSaving">
                                    <span v-if="c._isSaving" class="spinner-border spinner-border-sm me-1"></span>
                                    Lưu
                                </button>
                                <button class="btn btn-outline-secondary btn-sm px-3" @click="cancelEditComment(c)" :disabled="c._isSaving">Hủy</button>
                            </div>
                        </div>
                        <p v-else class="mb-0 text-secondary small">{{ c.content }}</p>

                        <!-- Form phản hồi -->
                        <div v-if="replyingTo === c.id" class="mt-3 p-3 bg-light rounded-3 border">
                            <textarea v-model="replyContent" class="form-control form-control-sm mb-2" rows="2" placeholder="Viết phản hồi..."></textarea>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm px-3" @click="submitReply(c.id)" :disabled="isSubmittingReply">
                                    <span v-if="isSubmittingReply" class="spinner-border spinner-border-sm me-1"></span>
                                    Gửi phản hồi
                                </button>
                                <button class="btn btn-outline-secondary btn-sm px-3" @click="cancelReply">Hủy</button>
                            </div>
                        </div>

                        <!-- Danh sách phản hồi -->
                        <div v-if="getReplies(c.id).length > 0" class="mt-3 ps-3 border-start border-2">
                            <div v-for="r in getReplies(c.id)" :key="r.id" class="d-flex gap-3 mb-3 mt-2">
                                <img :src="r.avatar" :alt="r.author" class="rounded-circle flex-shrink-0 border border-light shadow-sm" style="width:32px;height:32px;object-fit:cover;" />
                                <div class="flex-fill">
                                    <div class="d-flex align-items-center gap-2 mb-1">
                                        <span class="fw-semibold small">{{ r.author }}</span>
                                        <span v-if="r._isOwn" class="badge text-bg-primary" style="font-size:10px">Bạn</span>
                                        <span class="text-muted" style="font-size:12px">{{ formatDate(r.createdAt) }}</span>
                                        
                                        <div v-if="r._isOwn && !r._isEditing" class="ms-auto d-flex gap-1">
                                            <button class="btn btn-link btn-sm text-primary p-0 text-decoration-none" title="Sửa" @click="startEditComment(r)">
                                                <i class="bi bi-pencil-square"></i>
                                            </button>
                                            <button class="btn btn-link btn-sm text-danger p-0 ms-2 text-decoration-none" title="Xóa" @click="deleteComment(r)">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div v-if="r._isEditing" class="mt-2">
                                        <textarea v-model="r._editContent" class="form-control form-control-sm mb-2" rows="2"></textarea>
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-primary btn-sm px-3" @click="saveEditComment(r)" :disabled="r._isSaving">Lưu</button>
                                            <button class="btn btn-outline-secondary btn-sm px-3" @click="cancelEditComment(r)" :disabled="r._isSaving">Hủy</button>
                                        </div>
                                    </div>
                                    <p v-else class="mb-0 text-secondary small">{{ r.content }}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Form bình luận (đã đăng nhập) -->
            <div v-if="isLoggedIn" class="card border-0 bg-light rounded-3 p-4 mt-4">
                <h6 class="fw-semibold mb-3">
                    <i class="bi bi-pencil me-1"></i>Viết bình luận
                    <span class="text-muted fw-normal small ms-1">— {{ currentUser?.name }}</span>
                </h6>
                <div class="mb-2">
                    <textarea v-model="newComment" class="form-control"
                        :class="{ 'is-invalid': commentError }"
                        rows="3" placeholder="Nhập bình luận của bạn..."></textarea>
                    <div v-if="commentError" class="invalid-feedback">{{ commentError }}</div>
                </div>
                <div class="text-end">
                    <button class="btn btn-dark btn-sm px-4" @click="submitComment" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                        <i v-else class="bi bi-send me-1"></i>
                        {{ isSubmitting ? 'Đang gửi...' : 'Gửi bình luận' }}
                    </button>
                </div>
            </div>

            <!-- Chưa đăng nhập -->
            <div v-else class="card border-0 bg-light rounded-3 p-4 mt-4 text-center text-muted">
                <i class="bi bi-lock fs-4 d-block mb-2"></i>
                <p class="mb-2 small">Vui lòng đăng nhập để bình luận.</p>
                <RouterLink to="/login" class="btn btn-dark btn-sm px-4">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </RouterLink>
            </div>
        </section>
    </div>
</template>

<style scoped>
.blog-content {
    white-space: pre-line;
    font-size: 16px;
    line-height: 1.9;
    color: #444;
}
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>
