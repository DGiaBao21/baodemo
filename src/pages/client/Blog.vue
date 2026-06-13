<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('Tất cả')
const currentPage = ref(1)
const itemsPerPage = ref(3)

const posts = ref([
    { id: 1, tenBaiViet: "Bí quyết làm chủ JavaScript trong 30 ngày", noiDung: "Học JavaScript không khó nếu bạn có lộ trình đúng đắn. Hãy bắt đầu từ cơ bản như biến, hàm trước khi nhảy vào Async/Await...", theLoai: "Lập trình", hinhAnh: "https://picsum.photos/id/101/800/450", tacGia: "Nguyễn Văn A", soLuotLike: 125, liked: false, mangComment: [{ username: "Trần Bình", content: "Bài viết rất hữu ích ạ!" }, { username: "Lê An", content: "Xin thêm lộ trình cho React với ad." }] },
    { id: 2, tenBaiViet: "Top 5 quán cà phê làm việc lý tưởng tại Sài Gòn", noiDung: "Không gian yên tĩnh, Wi-Fi tốc độ cao và những ly Latte thơm ngon là tất cả những gì một freelancer cần cho ngày làm việc...", theLoai: "Đời sống", hinhAnh: "https://picsum.photos/id/102/800/450", tacGia: "Trần Thị B", soLuotLike: 84, liked: false, mangComment: [{ username: "Hoàng Minh", content: "Quán số 2 đi cuối tuần hơi đông nha." }] },
    { id: 3, tenBaiViet: "Xu hướng thiết kế UI/UX nổi bật năm 2026", noiDung: "Năm nay, sự lên ngôi của Minimalist 3D và giao diện tương tác bằng giọng nói đang định hình lại cách trải nghiệm ứng dụng...", theLoai: "Thiết kế", hinhAnh: "https://picsum.photos/id/103/800/450", tacGia: "Phan Công C", soLuotLike: 210, liked: false, mangComment: [{ username: "Thúy Vy", content: "Đúng xu hướng mình đang nghiên cứu." }] },
    { id: 4, tenBaiViet: "Cẩm nang du lịch tự túc Kyoto mùa hoa anh đào", noiDung: "Kyoto mùa hoa anh đào đẹp như một bức tranh. Để tránh đông đúc, bạn nên ghé thăm các đền chùa vào lúc 6 giờ sáng...", theLoai: "Du lịch", hinhAnh: "https://picsum.photos/id/104/800/450", tacGia: "Phạm Minh D", soLuotLike: 340, liked: false, mangComment: [] },
    { id: 5, tenBaiViet: "Hiểu về AI và Machine Learning trong 5 phút", noiDung: "AI có thực sự thay thế con người? Hãy cùng phân biệt giữa Trí tuệ nhân tạo (AI), Học máy (Machine Learning) và Học sâu...", theLoai: "Công nghệ", hinhAnh: "https://picsum.photos/id/106/800/450", tacGia: "Nguyễn Vũ E", soLuotLike: 450, liked: false, mangComment: [{ username: "Quốc Bảo", content: "Ví dụ rất dễ hiểu, cảm ơn tác giả." }] },
    { id: 6, tenBaiViet: "Chế độ ăn Eat Clean cho người bận rộn", noiDung: "Bạn không có thời gian nấu nướng? Phương pháp Meal Prep chính là cứu tinh của bạn. Chuẩn bị thức ăn cho cả tuần chỉ trong 2 tiếng...", theLoai: "Sức khỏe", hinhAnh: "https://picsum.photos/id/107/800/450", tacGia: "Đặng Thu G", soLuotLike: 95, liked: false, mangComment: [{ username: "Ngọc Hân", content: "Mình đã thử và giảm được 2kg trong một tháng nè." }] },
    { id: 7, tenBaiViet: "Những cuốn sách thay đổi tư duy tài chính của tôi", noiDung: "Thay vì học cách kiếm tiền trước, hãy học cách quản lý tiền. Dưới đây là 3 cuốn sách gối đầu giường về tư duy tài chính...", theLoai: "Sách", hinhAnh: "https://picsum.photos/id/108/800/450", tacGia: "Lý Hoàng H", soLuotLike: 189, liked: false, mangComment: [{ username: "Tuấn Kiệt", content: "Cuốn 'Tâm lý học về tiền' thực sự rất hay." }] },
    { id: 8, tenBaiViet: "Cách tối ưu SEO On-page cho website mới", noiDung: "Để bài viết đạt thứ hạng cao trên Google, việc tối ưu thẻ Title, Meta Description và cấu trúc Heading là điều bắt buộc...", theLoai: "Marketing", hinhAnh: "https://picsum.photos/id/109/800/450", tacGia: "Vũ Hải L", soLuotLike: 73, liked: false, mangComment: [] },
    { id: 9, tenBaiViet: "Lợi ích của việc dậy sớm từ 5 giờ sáng", noiDung: "Dậy sớm không chỉ giúp bạn có thêm thời gian, mà đó còn là lúc não bộ hoạt động hiệu quả nhất, không bị xao nhãng...", theLoai: "Phát triển bản thân", hinhAnh: "https://picsum.photos/id/110/800/450", tacGia: "Bùi Tiến M", soLuotLike: 295, liked: false, mangComment: [{ username: "Hải Yến", content: "Thèm ngủ lắm ad ơi, làm sao duy trì được?" }] },
    { id: 10, tenBaiViet: "Nghệ thuật chụp ảnh ngoại cảnh bằng điện thoại", noiDung: "Bạn không cần một chiếc máy ảnh đắt tiền. Chỉ cần áp dụng quy tắc 1/3 và tận dụng ánh sáng giờ vàng (Golden Hour)...", theLoai: "Nhiếp ảnh", hinhAnh: "https://picsum.photos/id/111/800/450", tacGia: "Đỗ Chí N", soLuotLike: 167, liked: false, mangComment: [{ username: "Mạnh Hùng", content: "Chiều nay phải lôi điện thoại ra test liền." }] }
])

const categories = computed(() => {
    const cats = [...new Set(posts.value.map(p => p.theLoai))]
    return ['Tất cả', ...cats]
})

const featuredPost = computed(() => posts.value[0])

const filteredPosts = computed(() => {
    let result = posts.value.slice(1)
    if (activeCategory.value !== 'Tất cả') {
        result = result.filter(p => p.theLoai === activeCategory.value)
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(p =>
            p.tenBaiViet.toLowerCase().includes(q) ||
            p.theLoai.toLowerCase().includes(q) ||
            p.tacGia.toLowerCase().includes(q)
        )
    }
    return result
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage.value))

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPosts.value.slice(start, end)
})

watch([activeCategory, searchQuery], () => {
    currentPage.value = 1
})

const toggleLike = (post) => {
    post.liked = !post.liked
    post.soLuotLike += post.liked ? 1 : -1
}

const readTime = (text) => {
    const words = text.split(' ').length
    return Math.max(1, Math.ceil(words / 200)) + ' phút đọc'
}
</script>

<template>
    <!-- Phần giới thiệu (Hero Banner) -->
    <section class="blog-hero">
        <div class="container py-5">
            <div class="text-center mb-4">
                <span class="badge-pill">📝 Blog của chúng tôi</span>
                <h1 class="hero-title mt-3">Khám phá kiến thức,<br/>truyền cảm hứng mỗi ngày</h1>
                <p class="hero-sub">Tổng hợp bài viết chất lượng về lập trình, thiết kế, đời sống và nhiều chủ đề thú vị khác.</p>
            </div>
            <!-- Khung tìm kiếm -->
            <div class="search-wrap mx-auto">
                <i class="bi bi-search search-icon"></i>
                <input v-model="searchQuery" type="text" class="search-input" placeholder="Tìm kiếm bài viết..." />
            </div>
        </div>
    </section>

    <div class="container pb-5">

        <!-- Bài viết nổi bật -->
        <section class="mb-5" v-if="!searchQuery && activeCategory === 'Tất cả'">
            <div class="section-label mb-3">✨ Bài viết nổi bật</div>
            <div class="featured-card">
                <div class="featured-img-wrap">
                    <img :src="featuredPost.hinhAnh" :alt="featuredPost.tenBaiViet" class="featured-img" />
                    <span class="featured-badge">{{ featuredPost.theLoai }}</span>
                </div>
                <div class="featured-body">
                    <div class="post-meta mb-2">
                        <span><i class="bi bi-person-circle me-1"></i>{{ featuredPost.tacGia }}</span>
                        <span class="mx-2">·</span>
                        <span><i class="bi bi-clock me-1"></i>{{ readTime(featuredPost.noiDung) }}</span>
                        <span class="mx-2">·</span>
                        <span><i class="bi bi-chat-dots me-1"></i>{{ featuredPost.mangComment.length }} bình luận</span>
                    </div>
                    <h2 class="featured-title">{{ featuredPost.tenBaiViet }}</h2>
                    <p class="featured-desc">{{ featuredPost.noiDung }}</p>
                    <div class="d-flex align-items-center gap-3 mt-4">
                        <button class="btn-read" @click="router.push(`/blog/${featuredPost.id}`)">Đọc bài viết <i class="bi bi-arrow-right ms-1"></i></button>
                        <button class="btn-like" :class="{ liked: featuredPost.liked }" @click="toggleLike(featuredPost)">
                            <i :class="featuredPost.liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                            {{ featuredPost.soLuotLike }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bộ lọc danh mục -->
        <div class="d-flex align-items-center gap-2 flex-wrap mb-4">
            <button
                v-for="cat in categories" :key="cat"
                class="cat-btn"
                :class="{ active: activeCategory === cat }"
                @click="activeCategory = cat"
            >{{ cat }}</button>
        </div>

        <!-- Lưới danh sách bài viết -->
        <div v-if="filteredPosts.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-search fs-1 d-block mb-3 opacity-25"></i>
            <p>Không tìm thấy bài viết nào phù hợp.</p>
        </div>

        <div class="row g-4">
            <div class="col-lg-4 col-md-6" v-for="post in paginatedPosts" :key="post.id">
                <div class="post-card h-100">
                    <div class="post-img-wrap">
                        <img :src="post.hinhAnh" :alt="post.tenBaiViet" class="post-img" />
                        <span class="post-category">{{ post.theLoai }}</span>
                    </div>
                    <div class="post-body">
                        <div class="post-meta mb-2">
                            <span><i class="bi bi-person me-1"></i>{{ post.tacGia }}</span>
                            <span class="mx-2">·</span>
                            <span><i class="bi bi-clock me-1"></i>{{ readTime(post.noiDung) }}</span>
                        </div>
                        <h5 class="post-title">{{ post.tenBaiViet }}</h5>
                        <p class="post-desc">{{ post.noiDung }}</p>
                        <div class="post-footer">
                            <button class="btn-read-sm" @click="router.push(`/blog/${post.id}`)">Đọc thêm</button>
                            <div class="d-flex align-items-center gap-3">
                                <button class="icon-btn" :class="{ liked: post.liked }" @click="toggleLike(post)">
                                    <i :class="post.liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                                    <span>{{ post.soLuotLike }}</span>
                                </button>
                                <button class="icon-btn">
                                    <i class="bi bi-chat-dots"></i>
                                    <span>{{ post.mangComment.length }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Phân trang Bootstrap 5 -->
        <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-5">
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

    </div>
</template>

<style scoped>
/* ---- Phần giới thiệu (Hero) ---- */
.blog-hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: #fff;
}
.badge-pill {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 13px;
    backdrop-filter: blur(8px);
}
.hero-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    line-height: 1.2;
}
.hero-sub {
    color: rgba(255,255,255,0.65);
    font-size: 16px;
    max-width: 540px;
    margin: 0 auto;
}
.search-wrap {
    position: relative;
    max-width: 520px;
}
.search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 17px;
}
.search-input {
    width: 100%;
    padding: 14px 20px 14px 48px;
    border-radius: 50px;
    border: none;
    font-size: 15px;
    outline: none;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

/* ---- Nhãn phân mục ---- */
.section-label {
    font-weight: 700;
    font-size: 15px;
    color: #555;
}

/* ---- Bài nổi bật ---- */
.featured-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    background: #fff;
}
@media (max-width: 768px) {
    .featured-card { grid-template-columns: 1fr; }
}
.featured-img-wrap {
    position: relative;
    overflow: hidden;
}
.featured-img {
    width: 100%;
    height: 100%;
    min-height: 280px;
    object-fit: cover;
    transition: transform 0.4s ease;
}
.featured-card:hover .featured-img { transform: scale(1.04); }
.featured-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(15,52,96,0.85);
    color: #fff;
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(4px);
}
.featured-body {
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.featured-title {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.3;
    color: #111;
    margin-bottom: 12px;
}
.featured-desc {
    color: #666;
    font-size: 14.5px;
    line-height: 1.7;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.post-meta {
    font-size: 12.5px;
    color: #888;
}

/* ---- Các nút điều khiển ---- */
.btn-load-more {
    background: transparent;
    color: #0f3460;
    border: 2px solid #0f3460;
    padding: 12px 36px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(15, 52, 96, 0.08);
}
.btn-load-more:hover {
    background: #0f3460;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 52, 96, 0.2);
}
.btn-load-more:active {
    transform: translateY(0);
}
.btn-read {
    background: #0f3460;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}
.btn-read:hover { background: #16213e; transform: translateY(-1px); }
.btn-like {
    background: none;
    border: 1.5px solid #ddd;
    border-radius: 50px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    color: #888;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
}
.btn-like.liked { color: #e74c3c; border-color: #e74c3c; background: #fff5f5; }
.btn-like:hover { border-color: #e74c3c; color: #e74c3c; }

/* ---- Bộ lọc danh mục ---- */
.cat-btn {
    background: #f1f3f8;
    border: none;
    border-radius: 50px;
    padding: 7px 18px;
    font-size: 13px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    transition: all 0.2s;
}
.cat-btn:hover { background: #e0e6f0; color: #0f3460; }
.cat-btn.active { background: #0f3460; color: #fff; }

/* ---- Thẻ bài viết ---- */
.post-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    transition: transform 0.25s, box-shadow 0.25s;
    display: flex;
    flex-direction: column;
}
.post-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.13); }
.post-img-wrap {
    position: relative;
    overflow: hidden;
    height: 200px;
}
.post-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}
.post-card:hover .post-img { transform: scale(1.06); }
.post-category {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(15,52,96,0.85);
    color: #fff;
    padding: 3px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    backdrop-filter: blur(4px);
}
.post-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.post-title {
    font-size: 15px;
    font-weight: 700;
    color: #111;
    line-height: 1.4;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.post-desc {
    font-size: 13.5px;
    color: #777;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    flex: 1;
    margin-bottom: 16px;
}
.post-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f0f0f0;
    padding-top: 14px;
}
.btn-read-sm {
    background: none;
    border: none;
    color: #0f3460;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
}
.btn-read-sm:hover { text-decoration: underline; }
.icon-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
    padding: 0;
}
.icon-btn:hover { color: #e74c3c; }
.icon-btn.liked { color: #e74c3c; }
</style>