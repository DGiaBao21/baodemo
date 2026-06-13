<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// Mock — bài viết của user đang đăng nhập
const myPosts = ref([
    { id: 1, tenBaiViet: 'Bí quyết làm chủ JavaScript trong 30 ngày', theLoai: 'Lập trình', hinhAnh: 'https://picsum.photos/id/101/400/220', soLuotLike: 125, mangComment: [1, 2], status: true,  createdAt: '10/01/2025' },
    { id: 3, tenBaiViet: 'Xu hướng thiết kế UI/UX nổi bật năm 2026',  theLoai: 'Thiết kế',  hinhAnh: 'https://picsum.photos/id/103/400/220', soLuotLike: 210, mangComment: [1],    status: true,  createdAt: '20/01/2025' },
    { id: 5, tenBaiViet: 'Hiểu về AI và Machine Learning trong 5 phút', theLoai: 'Công nghệ', hinhAnh: 'https://picsum.photos/id/106/400/220', soLuotLike: 450, mangComment: [1],    status: false, createdAt: '10/02/2025' },
])

// Delete modal
const deleteTarget    = ref(null)
const showDeleteModal = ref(false)
function openDeleteModal(p)  { deleteTarget.value = p; showDeleteModal.value = true }
function closeDeleteModal()  { deleteTarget.value = null; showDeleteModal.value = false }
function confirmDelete() {
    myPosts.value = myPosts.value.filter(p => p.id !== deleteTarget.value.id)
    closeDeleteModal()
}

// Stats
const totalLikes    = computed(() => myPosts.value.reduce((s, p) => s + p.soLuotLike, 0))
const totalComments = computed(() => myPosts.value.reduce((s, p) => s + p.mangComment.length, 0))
</script>

<template>
    <div class="container py-5">

        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">Bài viết của tôi</h4>
                <p class="text-muted small mb-0">Quản lý các bài viết bạn đã đăng</p>
            </div>
            <RouterLink to="/profile" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Trang cá nhân
            </RouterLink>
        </div>

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
                        <img :src="p.hinhAnh" :alt="p.tenBaiViet"
                            class="w-100 h-100 object-fit-cover" />
                        <span class="position-absolute top-0 start-0 m-2">
                            <span :class="p.status ? 'badge text-bg-success' : 'badge text-bg-secondary'">
                                {{ p.status ? 'Hiển thị' : 'Ẩn' }}
                            </span>
                        </span>
                        <span class="position-absolute top-0 end-0 m-2 badge text-bg-light text-dark border">
                            {{ p.theLoai }}
                        </span>
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <h6 class="fw-bold mb-2 lh-sm" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                            {{ p.tenBaiViet }}
                        </h6>
                        <div class="d-flex gap-3 text-muted small mb-3">
                            <span><i class="bi bi-heart me-1"></i>{{ p.soLuotLike }}</span>
                            <span><i class="bi bi-chat-dots me-1"></i>{{ p.mangComment.length }}</span>
                            <span class="ms-auto"><i class="bi bi-calendar3 me-1"></i>{{ p.createdAt }}</span>
                        </div>
                        <div class="d-flex gap-2 mt-auto">
                            <RouterLink :to="`/blog/${p.id}`"
                                class="btn btn-outline-secondary btn-sm flex-fill">
                                <i class="bi bi-eye me-1"></i> Xem
                            </RouterLink>
                            <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(p)" title="Xóa">
                                <i class="bi bi-trash"></i>
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
                            <h5 class="fw-bold mb-1">Xác nhận xóa</h5>
                            <p class="text-muted mb-0">Bạn có chắc muốn xóa bài viết
                                <strong class="text-dark">{{ deleteTarget?.tenBaiViet }}</strong>?
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
