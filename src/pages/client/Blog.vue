<template>
    <div class="blog-page organic-theme bg-cream">

        <!-- ===== HERO ===== -->
        <section class="blog-hero position-relative d-flex align-items-center justify-content-center text-center">
            <!-- Ảnh nền vintage ấm áp -->
            <div class="hero-bg"></div>
            <div class="container position-relative z-2 py-6">
                <span class="badge bg-sand text-olive px-4 py-2 fw-semibold mb-4 reveal border border-olive-light">
                    <i class="bi bi-journal-text me-2"></i> Trải Nghiệm & Kiến Thức
                </span>
                <h1 class="display-3 fw-bold text-white mb-4 reveal delay-1 font-serif text-shadow-sm">
                    Góc Nhỏ Của <br> <span style="color: #e5ded3;">Người Yêu Cà Phê</span>
                </h1>
                
                <!-- Thanh tìm kiếm kiểu Organic (màu kem sáng) -->
                <div class="search-wrap mx-auto mt-5 reveal delay-2">
                    <i class="bi bi-search search-icon text-earth"></i>
                    <input v-model="searchQuery" type="text" class="search-input" placeholder="Tìm kiếm công thức, câu chuyện..." />
                </div>
            </div>
        </section>

        <div class="container py-5 mt-n4 position-relative z-3">

            <!-- Loading skeleton -->
            <div v-if="isLoading" class="row g-4 mt-2">
                <div v-for="n in 6" :key="n" class="col-lg-4 col-md-6">
                    <div class="post-card bg-white rounded-3 p-0 border border-earth-light">
                        <div class="skeleton" style="height:220px; border-radius: 8px 8px 0 0"></div>
                        <div class="p-4">
                            <div class="skeleton mb-3" style="height:14px;width:60%"></div>
                            <div class="skeleton mb-2" style="height:20px"></div>
                            <div class="skeleton mb-3" style="height:20px;width:80%"></div>
                            <div class="skeleton" style="height:14px;width:40%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <template v-else>
                <!-- ====== BÀI NỔI BẬT ====== -->
                <section class="mb-6 reveal" v-if="featuredPost && !searchQuery && activeCategory === 'Tất cả'">
                    <div class="featured-card rounded-4 overflow-hidden border border-earth-light bg-white d-flex flex-column flex-md-row" @click="router.push(`/blog/${featuredPost.id}`)">
                        <!-- Ảnh bên trái (chiếm 50% màn hình) -->
                        <div class="featured-img-wrap w-100 w-md-50 position-relative">
                            <img :src="featuredPost.thumbnail" :alt="featuredPost.title" class="featured-bg-img w-100 h-100 object-fit-cover" />
                            <div class="badge-cat position-absolute top-0 start-0 m-3 bg-olive text-white px-3 py-1 rounded-2 small fw-semibold tracking-wide text-uppercase">
                                {{ featuredPost.category }}
                            </div>
                        </div>
                        <!-- Nội dung bên phải -->
                        <div class="featured-content w-100 w-md-50 p-4 p-lg-5 d-flex flex-column justify-content-center">
                            <div class="text-olive small fw-semibold mb-3 d-flex gap-3 text-uppercase tracking-wide">
                                <span><i class="bi bi-calendar3 me-1"></i>{{ formatDate(featuredPost.createdAt) }}</span>
                                <span><i class="bi bi-clock me-1"></i>{{ readTime(featuredPost.content) }}</span>
                            </div>
                            <h2 class="display-6 fw-bold text-brown mb-3 font-serif">{{ featuredPost.title }}</h2>
                            <p class="text-earth lead mb-4 font-inter" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                {{ featuredPost.excerpt || featuredPost.content }}
                            </p>
                            <div class="d-flex align-items-center gap-3 mt-auto">
                                <button class="btn btn-outline-brown rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2" @click.stop="router.push(`/blog/${featuredPost.id}`)">
                                    Đọc Tiếp <i class="bi bi-arrow-right"></i>
                                </button>
                                <button class="btn btn-sand rounded-circle heart-btn" :class="{ 'liked': likedIds.has(featuredPost.id) }" @click.stop="toggleLike(featuredPost)" title="Yêu thích">
                                    <i :class="likedIds.has(featuredPost.id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
                                </button>
                                <span class="text-earth fw-bold">{{ featuredPost.likes || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ====== BỘ LỌC DANH MỤC ====== -->
                <div class="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-5 reveal">
                    <button v-for="cat in categories" :key="cat" class="cat-pill-btn font-serif"
                        :class="{ active: activeCategory === cat }"
                        @click="activeCategory = cat">{{ cat }}</button>
                </div>

                <!-- Lưới bài viết rỗng -->
                <div v-if="filteredPosts.length === 0" class="text-center py-6 text-earth">
                    <div class="mb-4">
                        <i class="bi bi-book fs-1 opacity-50"></i>
                    </div>
                    <h5 class="fw-bold font-serif mb-2 text-brown">Chưa có ghi chép nào</h5>
                    <p>Thử tìm bằng một từ khóa khác nhé.</p>
                </div>

                <!-- ====== LƯỚI BÀI VIẾT ====== -->
                <div class="row g-4">
                    <div class="col-lg-4 col-md-6 reveal-scale" :class="'delay-' + (index % 3 + 1)" v-for="(post, index) in paginatedPosts" :key="post.id">
                        <div class="post-organic-card bg-white rounded-3 border border-earth-light h-100 d-flex flex-column" @click="router.push(`/blog/${post.id}`)">
                            <!-- Ảnh thumbnail -->
                            <div class="post-img-wrapper overflow-hidden position-relative rounded-top-3 border-bottom border-earth-light">
                                <img :src="post.thumbnail" :alt="post.title" class="post-img w-100 h-100 object-fit-cover" />
                            </div>
                            <!-- Nội dung -->
                            <div class="p-4 d-flex flex-column flex-grow-1">
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <span class="text-olive small fw-bold text-uppercase tracking-wide">{{ post.category }}</span>
                                    <span class="text-earth small"><i class="bi bi-clock me-1"></i>{{ readTime(post.content) }}</span>
                                </div>
                                <h5 class="post-title fw-bold text-brown mb-2 font-serif">{{ post.title }}</h5>
                                <p class="text-earth small post-desc mb-4 flex-grow-1">{{ post.excerpt || post.content }}</p>
                                <!-- Footer card -->
                                <div class="d-flex align-items-center justify-content-between border-top border-earth-light pt-3 mt-auto">
                                    <span class="text-earth small fw-semibold"><i class="bi bi-person me-1"></i>{{ post.author }}</span>
                                    <button class="btn btn-sm btn-sand rounded-circle like-sm-btn" :class="{ 'text-danger': likedIds.has(post.id) }" @click.stop="toggleLike(post)">
                                        <i :class="likedIds.has(post.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Phân trang -->
                <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-6">
                    <ul class="pagination-organic d-flex gap-2 mb-0 list-unstyled font-serif">
                        <li>
                            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--"><i class="bi bi-chevron-left"></i></button>
                        </li>
                        <li v-for="page in totalPages" :key="page">
                            <button class="page-btn fw-bold" :class="{ active: currentPage === page }" @click="currentPage = page">{{ page }}</button>
                        </li>
                        <li>
                            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++"><i class="bi bi-chevron-right"></i></button>
                        </li>
                    </ul>
                </nav>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BlogService } from '../../services/blog.service.js'
import { useScrollReveal } from '@/composables/useScrollReveal';

useScrollReveal('.reveal, .reveal-scale');

const router = useRouter()
const blogService = new BlogService()

const allPosts    = ref([])
const isLoading   = ref(true)
const searchQuery = ref('')
const activeCategory = ref('Tất cả')
const currentPage    = ref(1)
const itemsPerPage   = 6

// ── Fetch dữ liệu ──────────────────────────────────────────────
onMounted(async () => {
    try {
        const res = await blogService.list()
        if (res.status === 200) {
            allPosts.value = res.data.filter(b => b.status !== false)
        }
    } catch (e) {
        console.error('Lỗi tải blog:', e)
    } finally {
        isLoading.value = false
    }
})

// ── Danh mục động ─────────────────────────────────────────────
const categories = computed(() => {
    const cats = [...new Set(allPosts.value.map(p => p.category).filter(Boolean))]
    return ['Tất cả', ...cats]
})

// ── Bài nổi bật (bài đầu tiên) ────────────────────────────────
const featuredPost = computed(() => allPosts.value[0] || null)

// ── Lọc + tìm kiếm ────────────────────────────────────────────
const filteredPosts = computed(() => {
    let result = allPosts.value.slice(1)
    if (activeCategory.value !== 'Tất cả') {
        result = result.filter(p => p.category === activeCategory.value)
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.author?.toLowerCase().includes(q)
        )
    }
    return result
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage))

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredPosts.value.slice(start, start + itemsPerPage)
})

watch([activeCategory, searchQuery], () => { currentPage.value = 1 })

// ── Like (local) ───────────────────────────────────────────────
const likedIds = ref(new Set())
function toggleLike(post) {
    if (likedIds.value.has(post.id)) return // Chỉ cho like 1 lần
    likedIds.value.add(post.id)
    post.likes = (post.likes || 0) + 1
}

const readTime = text => Math.max(1, Math.ceil((text || '').split(' ').length / 200)) + ' phút đọc'
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : ''
</script>

<style scoped>
/* ===== ORGANIC COLOR PALETTE & UTILS ===== */
.organic-theme { font-family: "Inter", sans-serif; }
.bg-cream { background-color: #fdfbf7; } 
.bg-sand { background-color: #f4efe6; }  
.bg-olive { background-color: #617A55; }
.text-brown { color: #3e3024; }          
.text-earth { color: #5f4f40; }          
.text-olive { color: #617A55; }          
.border-olive-light { border-color: rgba(97, 122, 85, 0.3) !important; }
.border-earth-light { border-color: #e5ded3 !important; }

.font-serif { font-family: "Playfair Display", "Merriweather", serif; }
.font-inter { font-family: "Inter", sans-serif; }
.py-6 { padding-top: 5rem; padding-bottom: 5rem; }
.mb-6 { margin-bottom: 5rem; }
.mt-n4 { margin-top: -3rem !important; }
.mt-6 { margin-top: 4rem; }
.tracking-wide { letter-spacing: 0.1em; }

/* ===== HERO ===== */
.blog-hero { min-height: 50vh; overflow: hidden; background: #2c241b; }
.hero-bg {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=2000') center/cover;
    filter: brightness(0.4) sepia(0.4);
}
.text-shadow-sm { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

/* Search Bar */
.search-wrap { position: relative; max-width: 600px; width: 100%; }
.search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); font-size: 18px; }
.search-input {
    width: 100%; padding: 16px 20px 16px 50px;
    background: #fdfbf7; border: 2px solid #e5ded3;
    border-radius: 8px; font-size: 16px; color: #3e3024;
    outline: none; transition: all 0.3s ease;
}
.search-input:focus { border-color: #617A55; }

/* ===== FEATURED POST ====== */
.featured-card { cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.featured-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(62,48,36,0.1); border-color: #dcd3c6 !important; }
.featured-img-wrap { min-height: 300px; }
.featured-bg-img { transition: transform 0.6s ease; filter: sepia(0.1); }
.featured-card:hover .featured-bg-img { transform: scale(1.05); filter: sepia(0); }

/* Buttons */
.btn-outline-brown {
    border: 1px solid #3e3024; color: #3e3024; background: transparent; transition: all 0.2s;
}
.btn-outline-brown:hover { background: #3e3024; color: #fff; }
.btn-sand { background: #f4efe6; border: 1px solid #e5ded3; color: #5f4f40; }
.btn-sand:hover { background: #e5ded3; }
.heart-btn { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.3s; }

/* ===== CATEGORY PILLS ====== */
.cat-pill-btn {
    background: transparent; border: 1px solid #e5ded3;
    padding: 8px 24px; border-radius: 4px; font-size: 15px;
    color: #5f4f40; transition: all 0.2s;
}
.cat-pill-btn:hover { border-color: #3e3024; color: #3e3024; }
.cat-pill-btn.active { background: #3e3024; color: #fdfbf7; border-color: #3e3024; }

/* ===== POST GRID ====== */
.post-organic-card {
    cursor: pointer; transition: all 0.3s ease;
}
.post-organic-card:hover {
    transform: translateY(-5px); box-shadow: 0 8px 20px rgba(62,48,36,0.06); border-color: #dcd3c6 !important;
}
.post-img-wrapper { height: 220px; }
.post-img { transition: transform 0.6s ease; filter: sepia(0.1); }
.post-organic-card:hover .post-img { transform: scale(1.05); filter: sepia(0); }

.post-title { font-size: 1.25rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
.post-organic-card:hover .post-title { color: #617A55 !important; }
.post-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.6; }

.like-sm-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.like-sm-btn:hover { background: #f8d7da; color: #dc3545; border-color: #f8d7da; }

/* ===== PAGINATION ====== */
.pagination-organic .page-btn {
    width: 40px; height: 40px; border-radius: 4px;
    border: 1px solid #e5ded3; background: white; color: #5f4f40;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.pagination-organic .page-btn:not(:disabled):hover { background: #f4efe6; border-color: #dcd3c6; }
.pagination-organic .page-btn.active { background: #3e3024; color: white; border-color: #3e3024; }
.pagination-organic .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* skeleton */
.skeleton { background: linear-gradient(90deg, #f4efe6 25%, #e5ded3 50%, #f4efe6 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

@media (min-width: 768px) {
    .w-md-50 { width: 50% !important; }
}
</style>