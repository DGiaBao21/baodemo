<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { BlogService } from '../../services/blog.service.js'
import { CommentService } from '../../services/comment.service.js'
import { UserService } from '../../services/user.service.js'
import { BlogCategoryService } from '../../services/blog-category.service.js'
import { currentUser } from '../../composables/auth.js'

const blogService = new BlogService()
const commentService = new CommentService()
const userService = new UserService()
const blogCategoryService = new BlogCategoryService()

const categories = ref([])

const myPosts = ref([])
const isLoading = ref(true)

onMounted(async () => {
    try {
        const [blogRes, cmtRes, userRes, catRes] = await Promise.all([
            blogService.list(),
            commentService.list(),
            userService.list(),
            blogCategoryService.list()
        ])
        const allBlogs = blogRes.status === 200 ? blogRes.data : []
        const allComments = cmtRes.status === 200 ? cmtRes.data : []
        const allUsers = userRes.status === 200 ? userRes.data : []
        if (catRes.status === 200) categories.value = catRes.data.filter(c => c.status)

        // Lọc bài viết của user hiện tại
        const mine = allBlogs.filter(b => b.author === currentUser.value?.name || b.authorId === currentUser.value?.id)

        myPosts.value = mine.map(b => {
            const comments = allComments.filter(c => String(c.blogId) === String(b.id)).map(c => {
                const u = allUsers.find(usr => usr.email === c.email)
                return {
                    ...c,
                    avatar: u ? u.avatar : `https://ui-avatars.com/api/?name=${c.author}&background=random&color=fff`
                }
            })
            return {
                id: b.id,
                title: b.title,
                category: b.category,
                thumbnail: b.thumbnail,
                likes: b.likes || 0,
                comments: comments,
                status: b.status,
                createdAt: b.createdAt
            }
        })
    } catch (error) {
        console.error('Lỗi tải bài viết:', error)
    } finally {
        isLoading.value = false
    }
})

// Delete modal
const deleteTarget    = ref(null)
const showDeleteModal = ref(false)
const isDeleting      = ref(false)
function openDeleteModal(p)  { deleteTarget.value = p; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
async function confirmDelete() {
    if (!deleteTarget.value) return
    isDeleting.value = true
    try {
        await blogService.delete(deleteTarget.value.id)
        myPosts.value = myPosts.value.filter(p => p.id !== deleteTarget.value.id)
        closeDeleteModal()
    } catch (error) {
        console.error('Lỗi xóa bài viết:', error)
    } finally {
        isDeleting.value = false
    }
}

// Comments modal
const commentsTarget    = ref(null)
const showCommentsModal = ref(false)
function openCommentsModal(p) { commentsTarget.value = p; showCommentsModal.value = true; }
function closeCommentsModal() { commentsTarget.value = null; showCommentsModal.value = false; }

const replyingTo = ref(null)
const replyContent = ref('')
const isSubmittingReply = ref(false)

function getTopLevel(comments) {
    return (comments || []).filter(c => !c.parentId)
}
function getReplies(comments, parentId) {
    return (comments || []).filter(c => String(c.parentId) === String(parentId))
}

function startReply(c) {
    replyingTo.value = c.id
    replyContent.value = ''
}
function cancelReply() {
    replyingTo.value = null
    replyContent.value = ''
}

async function submitReply(parentId) {
    if (!replyContent.value.trim() || !commentsTarget.value) return
    isSubmittingReply.value = true
    try {
        const data = {
            blogId:    String(commentsTarget.value.id),
            author:    currentUser.value?.name || 'Admin',
            email:     currentUser.value?.email || '',
            content:   replyContent.value.trim(),
            status:    true,
            createdAt: new Date().toISOString().split('T')[0],
            parentId:  parentId,
        }
        const res = await commentService.create(data)
        if (res.status === 201) {
            commentsTarget.value.comments.push({ 
                ...res.data, 
                avatar: currentUser.value?.avatar || `https://ui-avatars.com/api/?name=${data.author}&background=random&color=fff`,
            })
            cancelReply()
        }
    } catch (e) {
        alert('Gửi phản hồi thất bại.')
    } finally {
        isSubmittingReply.value = false
    }
}

// Create / Edit modal
const showPostModal = ref(false)
const isSaving = ref(false)
const isEditMode = ref(false)
const postForm = ref({ id: null, title: '', category: '', thumbnail: '', excerpt: '', content: '', status: true })

function openCreateModal() { 
    isEditMode.value = false;
    postForm.value = { id: null, title: '', category: '', thumbnail: '', excerpt: '', content: '', status: true };
    showPostModal.value = true; 
}
function openEditModal(post) {
    isEditMode.value = true;
    postForm.value = { ...post };
    showPostModal.value = true;
}
function closePostModal() { 
    showPostModal.value = false; 
}

async function handleSavePost() {
    if (!postForm.value.title || !postForm.value.content) return
    isSaving.value = true
    try {
        if (isEditMode.value) {
            // Edit
            const { id, comments, ...dataToSave } = postForm.value
            const res = await blogService.patch(id, dataToSave)
            if (res.status === 200) {
                const idx = myPosts.value.findIndex(p => p.id === id)
                if (idx !== -1) myPosts.value[idx] = { ...myPosts.value[idx], ...dataToSave }
                closePostModal()
            }
        } else {
            // Create
            const postData = {
                ...postForm.value,
                author: currentUser.value?.name || 'User',
                authorId: currentUser.value?.id,
                createdAt: new Date().toISOString(),
                likes: 0
            }
            delete postData.id // Let JSON server generate
            const res = await blogService.create(postData)
            if (res.status === 201 || res.status === 200) {
                myPosts.value.unshift({ ...postData, id: res.data.id, comments: [] })
                closePostModal()
            }
        }
    } catch (error) {
        console.error('Lỗi lưu bài viết:', error)
    } finally {
        isSaving.value = false
    }
}

// Stats
const totalLikes    = computed(() => myPosts.value.reduce((s, p) => s + (p.likes || 0), 0))
const totalComments = computed(() => myPosts.value.reduce((s, p) => s + (p.comments?.length || 0), 0))

const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''
</script>

<template>
    <div class="container py-5">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">Bài viết của tôi</h4>
                <p class="text-muted small mb-0">Quản lý các bài viết bạn đã đăng</p>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-success btn-sm fw-semibold" @click="openCreateModal">
                    <i class="bi bi-plus-lg me-1"></i> Thêm bài viết
                </button>
                <RouterLink to="/profile" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-arrow-left me-1"></i> Trang cá nhân
                </RouterLink>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Đang tải bài viết...</p>
        </div>
        
        <template v-else>
            <!-- Stats -->
            <div class="row g-3 mb-4">
                <div class="col-4">
                    <div class="card border-0 bg-light rounded-3 text-center p-3">
                        <div class="fs-4 fw-bold text-dark">{{ myPosts.length }}</div>
                        <div class="text-muted small">Bài viết</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card border-0 bg-light rounded-3 text-center p-3">
                        <div class="fs-4 fw-bold text-danger">{{ totalLikes }}</div>
                        <div class="text-muted small">Lượt thích</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card border-0 bg-light rounded-3 text-center p-3">
                        <div class="fs-4 fw-bold text-primary">{{ totalComments }}</div>
                        <div class="text-muted small">Bình luận</div>
                    </div>
                </div>
            </div>

            <!-- Empty -->
            <div v-if="myPosts.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-journal-x fs-1 d-block mb-3 opacity-25"></i>
                <p>Bạn chưa có bài viết nào.</p>
            </div>

            <!-- Post list -->
            <div class="row g-4">
                <div class="col-md-6 col-lg-4" v-for="p in myPosts" :key="p.id">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="position-relative overflow-hidden rounded-top-4" style="height:180px">
                            <img :src="p.thumbnail" :alt="p.title"
                                class="w-100 h-100 object-fit-cover" />
                            <span class="position-absolute top-0 start-0 m-2">
                                <span :class="p.status ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                    {{ p.status ? 'Công khai' : 'Bản nháp' }}
                                </span>
                            </span>
                            <span class="position-absolute top-0 end-0 m-2 badge text-bg-light text-dark border">
                                {{ p.category }}
                            </span>
                        </div>
                        <div class="card-body d-flex flex-column p-3">
                            <h6 class="fw-bold mb-2 lh-sm" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                                {{ p.title }}
                            </h6>
                            <div class="d-flex gap-3 text-muted small mb-3">
                                <span><i class="bi bi-heart me-1"></i>{{ p.likes }}</span>
                                <span><i class="bi bi-chat-dots me-1"></i>{{ p.comments.length }}</span>
                                <span class="ms-auto"><i class="bi bi-calendar3 me-1"></i>{{ formatDate(p.createdAt) }}</span>
                            </div>
                            <div class="d-flex gap-2 mt-auto">
                                <RouterLink :to="`/blog/${p.id}`"
                                    class="btn btn-outline-secondary btn-sm flex-fill">
                                    <i class="bi bi-eye me-1"></i> Xem
                                </RouterLink>
                                <button class="btn btn-outline-warning btn-sm" @click="openEditModal(p)" title="Sửa">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-outline-info btn-sm" @click="openCommentsModal(p)" title="Bình luận">
                                    <i class="bi bi-chat-dots"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(p)" title="Xóa">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

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
                            <h5 class="fw-bold mb-1">Xác nhận xóa</h5>
                            <p class="text-muted mb-0">Bạn có chắc muốn xóa bài viết
                                <strong class="text-dark">{{ deleteTarget?.title }}</strong>?
                            </p>
                            <small class="text-muted">Hành động này không thể hoàn tác.</small>
                        </div>
                        <div class="modal-footer border-0 pt-2">
                            <button class="btn btn-outline-secondary flex-fill" @click="closeDeleteModal">Hủy</button>
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

        <!-- Thêm/Sửa bài viết Modal -->
        <Teleport to="body">
            <div v-if="showPostModal" class="modal-backdrop fade show"></div>
            <div v-if="showPostModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-bottom-0 pb-0">
                            <h5 class="modal-title fw-bold">{{ isEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết mới' }}</h5>
                            <button type="button" class="btn-close" @click="closePostModal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-md-8">
                                    <label class="form-label small fw-semibold">Tiêu đề bài viết <span class="text-danger">*</span></label>
                                    <input v-model="postForm.title" type="text" class="form-control" placeholder="Nhập tiêu đề...">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-semibold">Danh mục</label>
                                    <select v-model="postForm.category" class="form-select">
                                        <option value="">-- Chọn chủ đề --</option>
                                        <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Link ảnh thu nhỏ (Thumbnail)</label>
                                    <input v-model="postForm.thumbnail" type="text" class="form-control" placeholder="https://example.com/image.jpg">
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Đoạn trích (Excerpt)</label>
                                    <textarea v-model="postForm.excerpt" class="form-control" rows="2" placeholder="Tóm tắt ngắn gọn bài viết..."></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-semibold">Nội dung <span class="text-danger">*</span></label>
                                    <textarea v-model="postForm.content" class="form-control" rows="6" placeholder="Nhập nội dung chi tiết..."></textarea>
                                </div>
                                <div class="col-12">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" role="switch" id="statusSwitch" v-model="postForm.status">
                                        <label class="form-check-label small" for="statusSwitch">
                                            Trạng thái: <strong :class="postForm.status ? 'text-success' : 'text-secondary'">{{ postForm.status ? 'Công khai' : 'Lưu nháp' }}</strong>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 pt-0">
                            <button type="button" class="btn btn-outline-secondary" @click="closePostModal" :disabled="isSaving">Hủy</button>
                            <button type="button" class="btn btn-success px-4" @click="handleSavePost" :disabled="isSaving">
                                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isEditMode ? 'Lưu thay đổi' : 'Tạo bài viết' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Comments Modal -->
        <Teleport to="body">
            <div v-if="showCommentsModal" class="modal-backdrop fade show"></div>
            <div v-if="showCommentsModal" class="modal fade show d-block" tabindex="-1" @click.self="closeCommentsModal">
                <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header">
                            <h5 class="modal-title fw-bold">
                                Bình luận: <span class="text-muted fs-6">{{ commentsTarget?.title }}</span>
                            </h5>
                            <button type="button" class="btn-close" @click="closeCommentsModal"></button>
                        </div>
                        <div class="modal-body bg-light">
                            <div v-if="!commentsTarget?.comments || commentsTarget.comments.length === 0" class="text-center text-muted py-5">
                                <i class="bi bi-chat-square-text fs-1 d-block mb-3 opacity-25"></i>
                                <p>Chưa có bình luận nào cho bài viết này.</p>
                            </div>
                            <div v-else class="d-flex flex-column gap-3">
                                <div class="card border-0 shadow-sm rounded-3" v-for="c in getTopLevel(commentsTarget.comments)" :key="c.id">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <div class="d-flex align-items-center gap-2">
                                                <img :src="c.avatar" 
                                                     :alt="c.author" class="rounded-circle border border-light shadow-sm" style="width:36px;height:36px;object-fit:cover;" />
                                                <div>
                                                    <h6 class="mb-0 fw-bold">{{ c.author }}</h6>
                                                    <small class="text-muted">{{ c.email }}</small>
                                                </div>
                                            </div>
                                            <small class="text-muted">{{ formatDate(c.createdAt) }}</small>
                                        </div>
                                        <p class="mb-2 text-dark">{{ c.content }}</p>
                                        
                                        <button v-if="c.id !== replyingTo" class="btn btn-link btn-sm text-secondary p-0 text-decoration-none" @click="startReply(c)">
                                            <i class="bi bi-reply-fill"></i> Phản hồi
                                        </button>

                                        <!-- Reply Form -->
                                        <div v-if="replyingTo === c.id" class="mt-2 p-2 bg-white rounded border">
                                            <textarea v-model="replyContent" class="form-control form-control-sm mb-2" rows="2" placeholder="Nhập phản hồi..."></textarea>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-primary btn-sm px-3" @click="submitReply(c.id)" :disabled="isSubmittingReply">Gửi</button>
                                                <button class="btn btn-outline-secondary btn-sm px-3" @click="cancelReply">Hủy</button>
                                            </div>
                                        </div>

                                        <!-- Replies -->
                                        <div v-if="getReplies(commentsTarget.comments, c.id).length > 0" class="mt-3 ps-3 border-start border-2 border-secondary border-opacity-25">
                                            <div v-for="r in getReplies(commentsTarget.comments, c.id)" :key="r.id" class="d-flex justify-content-between align-items-start mb-2 mt-2">
                                                <div class="d-flex align-items-center gap-2">
                                                    <img :src="r.avatar" :alt="r.author" class="rounded-circle border border-light shadow-sm" style="width:28px;height:28px;object-fit:cover;" />
                                                    <div>
                                                        <h6 class="mb-0 fw-bold" style="font-size:0.85rem">{{ r.author }} <span class="badge text-bg-primary fw-normal" style="font-size:0.6rem">Tác giả</span></h6>
                                                        <p class="mb-0 text-dark small mt-1">{{ r.content }}</p>
                                                    </div>
                                                </div>
                                                <small class="text-muted" style="font-size:0.7rem">{{ formatDate(r.createdAt) }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeCommentsModal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

    </div>
</template>
