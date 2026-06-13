<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { currentUser, isLoggedIn } from '../../composables/auth.js'

const route = useRoute()

const allPosts = [
    { id: 1, tenBaiViet: 'Bí quyết làm chủ JavaScript trong 30 ngày', noiDung: 'Học JavaScript không khó nếu bạn có lộ trình đúng đắn. Hãy bắt đầu từ cơ bản như biến, hàm trước khi nhảy vào Async/Await. Thực hành mỗi ngày ít nhất 1 giờ, làm các dự án nhỏ để củng cố kiến thức. Ngoài ra, đọc tài liệu chính thức MDN và tham gia cộng đồng Stack Overflow sẽ giúp bạn tiến bộ nhanh chóng. Đừng bỏ qua ES6+ vì đây là nền tảng của React, Vue và các framework hiện đại.', theLoai: 'Lập trình', hinhAnh: 'https://picsum.photos/id/101/800/450', tacGia: 'Nguyễn Văn A', soLuotLike: 125, liked: false, createdAt: '10/01/2025', mangComment: [{ id: 1, username: 'Trần Bình', content: 'Bài viết rất hữu ích ạ!', createdAt: '11/01/2025' }, { id: 2, username: 'Lê An', content: 'Xin thêm lộ trình cho React với ad.', createdAt: '12/01/2025' }] },
    { id: 2, tenBaiViet: 'Top 5 quán cà phê làm việc lý tưởng tại Sài Gòn', noiDung: 'Không gian yên tĩnh, Wi-Fi tốc độ cao và những ly Latte thơm ngon là tất cả những gì một freelancer cần cho ngày làm việc. Dưới đây là 5 địa điểm mình đã thử và đánh giá cao nhất. Mỗi quán đều có đặc điểm riêng về không gian, âm nhạc và chất lượng đồ uống.', theLoai: 'Đời sống', hinhAnh: 'https://picsum.photos/id/102/800/450', tacGia: 'Trần Thị B', soLuotLike: 84, liked: false, createdAt: '15/01/2025', mangComment: [{ id: 3, username: 'Hoàng Minh', content: 'Quán số 2 đi cuối tuần hơi đông nha.', createdAt: '16/01/2025' }] },
    { id: 3, tenBaiViet: 'Xu hướng thiết kế UI/UX nổi bật năm 2026', noiDung: 'Năm nay, sự lên ngôi của Minimalist 3D và giao diện tương tác bằng giọng nói đang định hình lại cách trải nghiệm ứng dụng. Các nhà thiết kế cần nắm bắt xu hướng Dark Mode thông minh để tạo ra sản phẩm thực sự ấn tượng.', theLoai: 'Thiết kế', hinhAnh: 'https://picsum.photos/id/103/800/450', tacGia: 'Phan Công C', soLuotLike: 210, liked: false, createdAt: '20/01/2025', mangComment: [{ id: 4, username: 'Thúy Vy', content: 'Đúng xu hướng mình đang nghiên cứu.', createdAt: '21/01/2025' }] },
    { id: 4, tenBaiViet: 'Cẩm nang du lịch tự túc Kyoto mùa hoa anh đào', noiDung: 'Kyoto mùa hoa anh đào đẹp như một bức tranh. Để tránh đông đúc, bạn nên ghé thăm các đền chùa vào lúc 6 giờ sáng. Lên kế hoạch từ 3-4 tháng trước để đặt phòng và vé tàu Shinkansen.', theLoai: 'Du lịch', hinhAnh: 'https://picsum.photos/id/104/800/450', tacGia: 'Phạm Minh D', soLuotLike: 340, liked: false, createdAt: '01/02/2025', mangComment: [] },
    { id: 5, tenBaiViet: 'Hiểu về AI và Machine Learning trong 5 phút', noiDung: 'AI có thực sự thay thế con người? Hãy cùng phân biệt giữa Trí tuệ nhân tạo (AI), Học máy (Machine Learning) và Học sâu (Deep Learning). Ba khái niệm này tuy liên quan chặt chẽ nhưng có phạm vi và ứng dụng khác nhau.', theLoai: 'Công nghệ', hinhAnh: 'https://picsum.photos/id/106/800/450', tacGia: 'Nguyễn Vũ E', soLuotLike: 450, liked: false, createdAt: '10/02/2025', mangComment: [{ id: 5, username: 'Quốc Bảo', content: 'Ví dụ rất dễ hiểu, cảm ơn tác giả.', createdAt: '11/02/2025' }] },
]

const post = computed(() => allPosts.find(p => p.id === Number(route.params.id)) || null)

// Like
function toggleLike() {
    if (!post.value) return
    post.value.liked = !post.value.liked
    post.value.soLuotLike += post.value.liked ? 1 : -1
}

// Comment — username lấy từ user đang đăng nhập
const newComment   = ref('')
const commentError = ref('')

function submitComment() {
    if (!newComment.value.trim()) {
        commentError.value = 'Vui lòng nhập bình luận.'
        return
    }
    commentError.value = ''
    post.value.mangComment.push({
        id: Date.now(),
        username: currentUser.value?.name || 'Khách',
        content: newComment.value.trim(),
        createdAt: new Date().toLocaleDateString('vi-VN'),
        isOwn: true,   // đánh dấu comment của user hiện tại
    })
    newComment.value = ''
}

// Xóa comment của chính mình
function deleteComment(id) {
    const idx = post.value.mangComment.findIndex(c => c.id === id)
    if (idx !== -1) post.value.mangComment.splice(idx, 1)
}

const readTime = (text) => Math.max(1, Math.ceil(text.split(' ').length / 200)) + ' phút đọc'
</script>

<template>
    <!-- Not found -->
    <div v-if="!post" class="container py-5 text-center text-muted">
        <i class="bi bi-journal-x fs-1 d-block mb-3"></i>
        <h4>Không tìm thấy bài viết</h4>
        <RouterLink to="/blog" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-1"></i> Quay lại Blog
        </RouterLink>
    </div>

    <!-- Article -->
    <div v-else class="container py-5" style="max-width:780px">

        <!-- Back -->
        <RouterLink to="/blog" class="btn btn-outline-secondary btn-sm mb-4">
            <i class="bi bi-arrow-left me-1"></i> Quay lại Blog
        </RouterLink>

        <span class="badge text-bg-primary mb-3">{{ post.theLoai }}</span>
        <h1 class="fw-bold mb-3" style="line-height:1.3">{{ post.tenBaiViet }}</h1>

        <div class="d-flex flex-wrap gap-3 align-items-center text-muted small mb-4">
            <span><i class="bi bi-person-circle me-1"></i>{{ post.tacGia }}</span>
            <span><i class="bi bi-calendar3 me-1"></i>{{ post.createdAt }}</span>
            <span><i class="bi bi-clock me-1"></i>{{ readTime(post.noiDung) }}</span>
            <span><i class="bi bi-chat-dots me-1"></i>{{ post.mangComment.length }} bình luận</span>
        </div>

        <img :src="post.hinhAnh" :alt="post.tenBaiViet"
            class="w-100 rounded-4 mb-4 object-fit-cover" style="height:380px" />

        <div class="fs-6 lh-lg text-secondary mb-5">{{ post.noiDung }}</div>

        <!-- Like bar -->
        <div class="d-flex align-items-center gap-3 py-3 border-top border-bottom mb-5">
            <button class="btn d-flex align-items-center gap-2"
                :class="post.liked ? 'btn-danger' : 'btn-outline-secondary'"
                @click="toggleLike">
                <i :class="post.liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                {{ post.soLuotLike }} thích
            </button>
            <span class="text-muted small ms-auto">Chia sẻ:</span>
            <a href="#" class="btn btn-outline-secondary btn-sm"><i class="bi bi-facebook"></i></a>
            <a href="#" class="btn btn-outline-secondary btn-sm"><i class="bi bi-twitter-x"></i></a>
        </div>

        <!-- Comments -->
        <section>
            <h5 class="fw-bold mb-4">
                <i class="bi bi-chat-dots me-2"></i>Bình luận ({{ post.mangComment.length }})
            </h5>

            <div v-if="post.mangComment.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-chat fs-1 d-block mb-2 opacity-25"></i>
                Chưa có bình luận nào. Hãy là người đầu tiên!
            </div>

            <div v-for="c in post.mangComment" :key="c.id" class="d-flex gap-3 mb-4">
                <div class="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                    style="width:40px;height:40px">
                    <i class="bi bi-person text-secondary"></i>
                </div>
                <div class="flex-fill">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="fw-semibold small">{{ c.username }}</span>
                        <!-- Badge "Bạn" nếu là comment của mình -->
                        <span v-if="c.isOwn" class="badge text-bg-primary" style="font-size:10px">Bạn</span>
                        <span class="text-muted" style="font-size:12px">{{ c.createdAt }}</span>
                        <!-- Nút xóa: chỉ hiện nếu là comment của chính mình -->
                        <button v-if="c.isOwn"
                            class="btn btn-link btn-sm text-danger p-0 ms-auto"
                            title="Xóa bình luận này"
                            @click="deleteComment(c.id)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <p class="mb-0 text-secondary small">{{ c.content }}</p>
                </div>
            </div>

            <!-- Comment form: chỉ hiện khi đã đăng nhập -->
            <div v-if="isLoggedIn" class="card border-0 bg-light rounded-3 p-4 mt-4">
                <h6 class="fw-semibold mb-3">
                    <i class="bi bi-pencil me-1"></i>Viết bình luận
                </h6>
                <div class="mb-2">
                    <textarea v-model="newComment" class="form-control"
                        :class="{ 'is-invalid': commentError }"
                        rows="3" placeholder="Nhập bình luận của bạn..."></textarea>
                    <div v-if="commentError" class="invalid-feedback">{{ commentError }}</div>
                </div>
                <div class="text-end">
                    <button class="btn btn-dark btn-sm px-4" @click="submitComment">
                        <i class="bi bi-send me-1"></i> Gửi bình luận
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
