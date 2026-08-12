<template>
    <div class="organic-theme bg-cream min-vh-100 py-5">
        <div class="container">
            <!-- Header của trang -->
            <div class="text-center mb-5">
                <span class="badge bg-sand text-olive px-4 py-2 fw-bold mb-3 rounded-3 border border-olive-light tracking-widest text-uppercase">
                    <i class="bi bi-shop me-2"></i> Trải Nghiệm Mua Sắm
                </span>
                <h1 class="display-5 fw-bold text-brown font-serif">Khám Phá Hương Vị <br> <span class="text-olive">Nguyên Bản</span></h1>
            </div>

            <div class="row g-5 align-items-start">
                <!-- ===== SIDEBAR ===== -->
                <div class="col-lg-3">
                    <div class="sidebar-sticky">

                        <!-- Tìm kiếm -->
                        <div class="organic-filter-card mb-4">
                            <div class="filter-header">
                                <i class="bi bi-search me-2"></i>Tìm kiếm
                            </div>
                            <div class="filter-body">
                                <div class="position-relative">
                                    <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-earth opacity-50"></i>
                                    <input type="text" class="organic-input w-100 ps-5"
                                        placeholder="Tên sản phẩm..." v-model="searchQuery" />
                                </div>
                            </div>
                        </div>

                        <!-- Danh mục -->
                        <div class="organic-filter-card mb-4">
                            <div class="filter-header">
                                <i class="bi bi-layers-fill me-2"></i>Danh mục
                            </div>
                            <div class="filter-body pb-2">
                                <div class="cat-item" :class="{ active: selectedCategory === 'Tất cả' }"
                                    @click="selectedCategory = 'Tất cả'">
                                    <span class="cat-indicator"></span>
                                    <span>Tất cả</span>
                                </div>
                                <div v-for="cat in categories" :key="cat.id"
                                    class="cat-item"
                                    :class="{ active: selectedCategory === cat.name }"
                                    @click="selectedCategory = cat.name">
                                    <span class="cat-indicator"></span>
                                    <span>{{ cat.name }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Khoảng giá (₫) -->
                        <div class="organic-filter-card mb-4">
                            <div class="filter-header">
                                <i class="bi bi-tag-fill me-2"></i>Khoảng giá (₫)
                            </div>
                            <div class="filter-body">
                                <div class="d-flex flex-column gap-3">
                                    <input type="number" class="organic-input"
                                        placeholder="Giá tối thiểu" v-model="minPrice" min="0" />
                                    <div class="text-center text-earth opacity-50"><i class="bi bi-arrow-down"></i></div>
                                    <input type="number" class="organic-input"
                                        placeholder="Giá tối đa" v-model="maxPrice" min="0" />
                                </div>
                            </div>
                        </div>

                        <!-- Nút reset -->
                        <button class="btn btn-outline-brown w-100 mb-4 fw-bold text-uppercase tracking-wide py-2 rounded-3" @click="clearFilters">
                            <i class="bi bi-arrow-counterclockwise me-1"></i> Làm mới
                        </button>

                    </div>
                </div>

                <!-- ===== PRODUCT GRID ===== -->
                <div class="col-lg-9">

                    <!-- Trạng thái kết quả -->
                    <div class="d-flex align-items-center justify-content-between bg-sand border border-earth-light rounded-3 px-4 py-3 mb-4">
                        <p class="mb-0 text-earth font-inter">
                            Đang hiển thị <strong class="text-brown">{{ filtered.length }}</strong> sản phẩm
                        </p>
                        <span v-if="selectedCategory !== 'Tất cả'" class="badge bg-olive text-white px-3 py-2 rounded-2 fw-semibold text-uppercase tracking-wide">
                            {{ selectedCategory }} <i class="bi bi-x-circle ms-2" style="cursor:pointer" @click="selectedCategory='Tất cả'"></i>
                        </span>
                    </div>

                    <!-- Loading skeleton -->
                    <div v-if="isLoading" class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                        <div v-for="n in 6" :key="n" class="col">
                            <div class="card border border-earth-light bg-white rounded-3 shadow-sm p-0">
                                <div class="skeleton" style="height:220px; border-radius:8px 8px 0 0"></div>
                                <div class="card-body p-4">
                                    <div class="skeleton mb-2" style="height:12px;width:40%;border-radius:4px"></div>
                                    <div class="skeleton mb-2" style="height:18px;border-radius:4px"></div>
                                    <div class="skeleton" style="height:13px;width:70%;border-radius:4px"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Trống -->
                    <div v-else-if="filtered.length === 0" class="text-center py-6 text-earth border border-earth-light bg-white rounded-3">
                        <div class="mb-4">
                            <i class="bi bi-box2-heart fs-1 opacity-50"></i>
                        </div>
                        <h4 class="fw-bold mb-2 font-serif text-brown">Không tìm thấy sản phẩm</h4>
                        <p class="mb-4">Xin lỗi, chúng tôi không có hạt cà phê nào khớp với tìm kiếm của bạn.</p>
                        <button class="btn btn-outline-brown fw-bold px-4 py-2 rounded-3 text-uppercase tracking-wide" @click="clearFilters">Xóa bộ lọc</button>
                    </div>

                    <!-- Lưới sản phẩm -->
                    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                        <div class="col" v-for="p in paginated" :key="p.id">
                            <div class="product-organic-card bg-white rounded-3 border border-earth-light h-100 d-flex flex-column" @click="router.push(`/product/${p.id}`)">
                                <!-- Ảnh -->
                                <div class="product-media position-relative overflow-hidden rounded-top-3 border-bottom border-earth-light">
                                    <img :src="p.image" :alt="p.name" class="product-img w-100" />
                                    <div class="product-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                                    <span class="position-absolute top-0 start-0 m-3 badge bg-sand text-brown border border-earth-light rounded-2 px-2 py-1 text-uppercase tracking-wide"
                                        style="font-size:10px">{{ p.category }}</span>
                                    <button class="quick-view-btn position-absolute start-50 btn btn-olive rounded-3 px-4 shadow-sm fw-bold text-uppercase tracking-wide"
                                        @click.stop="router.push(`/product/${p.id}`)">
                                        Chi tiết
                                    </button>
                                </div>
                                <!-- Body -->
                                <div class="p-4 d-flex flex-column flex-grow-1">
                                    <h5 class="fw-bold mb-2 font-serif text-brown">{{ p.name }}</h5>
                                    <p class="text-earth small mb-3 flex-grow-1 two-line-clamp font-inter lh-lg">{{ p.description }}</p>
                                    <div class="d-flex align-items-center gap-2 mb-3">
                                        <span class="text-olive" style="letter-spacing:2px;font-size:14px">{{ renderStars(p.rating || 4) }}</span>
                                    </div>
                                    <!-- Footer -->
                                    <div class="border-top border-earth-light d-flex align-items-center justify-content-between pt-3 mt-auto">
                                        <span class="fw-bold fs-5 text-brown">{{ formatPrice(p.price) }}</span>
                                        <button class="btn btn-sand btn-sm rounded-circle shadow-sm text-olive cart-btn"
                                            @click.stop="router.push(`/product/${p.id}`)">
                                            <i class="bi bi-cart-plus fs-5"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Phân trang -->
                    <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-5">
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

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ProductService }  from '../../services/product.service.js'
import { CategoryService } from '../../services/category.service.js'

const router          = useRouter()
const productService  = new ProductService()
const categoryService = new CategoryService()

const allProducts  = ref([])
const categories   = ref([])
const isLoading    = ref(true)

const searchQuery        = ref('')
const selectedCategory   = ref('Tất cả')
const minPrice           = ref('')
const maxPrice           = ref('')
const currentPage        = ref(1)
const itemsPerPage       = 9

onMounted(async () => {
    try {
        const [prodRes, catRes] = await Promise.all([
            productService.list(),
            categoryService.list()
        ])
        if (prodRes.status === 200) allProducts.value = prodRes.data.filter(p => p.status !== false)
        if (catRes.status === 200) categories.value = catRes.data
    } catch (e) {
        console.error('Lỗi fetch data:', e)
    } finally {
        isLoading.value = false
    }
})

const filtered = computed(() => {
    let result = allProducts.value
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(p => p.name.toLowerCase().includes(q))
    }
    if (selectedCategory.value !== 'Tất cả') {
        result = result.filter(p => p.category === selectedCategory.value)
    }
    const min = parseFloat(minPrice.value)
    if (!isNaN(min)) {
        result = result.filter(p => p.price >= min)
    }
    const max = parseFloat(maxPrice.value)
    if (!isNaN(max)) {
        result = result.filter(p => p.price <= max)
    }
    return result
})

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage))
const paginated = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filtered.value.slice(start, start + itemsPerPage)
})

watch([searchQuery, selectedCategory, minPrice, maxPrice], () => {
    currentPage.value = 1
})

function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'Tất cả'
    minPrice.value = ''
    maxPrice.value = ''
}

const formatPrice = n => new Intl.NumberFormat('vi-VN').format(n) + '₫'

function renderStars(r) {
    return Array.from({ length: 5 }, (_, i) => i < r ? '★' : '☆').join('')
}
</script>

<style scoped>
/* ===== ORGANIC COLOR PALETTE & UTILS ===== */
.organic-theme { font-family: "Inter", sans-serif; }
.bg-cream { background-color: #fdfbf7; } 
.bg-sand { background-color: #f4efe6; }  
.bg-olive { background-color: #617A55; }
.text-brown { color: #3e3024; }          
.text-earth { color: #5f4f40; }          
.text-olive { color: #617A55 !important; }          
.border-olive-light { border-color: rgba(97, 122, 85, 0.3) !important; }
.border-earth-light { border-color: #e5ded3 !important; }

.font-serif { font-family: "Playfair Display", "Merriweather", serif; }
.font-inter { font-family: "Inter", sans-serif; }
.tracking-wide { letter-spacing: 0.1em; }
.tracking-widest { letter-spacing: 0.15em; }

.py-6 { padding-top: 5rem; padding-bottom: 5rem; }

/* Buttons */
.btn-olive {
    background-color: #617A55; border: 1px solid #617A55; color: white; transition: all 0.2s ease;
}
.btn-olive:hover { background-color: #4A5D23; border-color: #4A5D23; color: white; }

.btn-outline-brown {
    border: 1px solid #3e3024; color: #3e3024; background: transparent; transition: all 0.2s ease;
}
.btn-outline-brown:hover { background: #3e3024; color: #fff; }

.btn-sand { background: #f4efe6; border: 1px solid #e5ded3; color: #3e3024; transition: all 0.2s ease; }
.btn-sand:hover { background: #e5ded3; color: #3e3024; }

/* ===== SIDEBAR FILTERS ===== */
.sidebar-sticky { position: sticky; top: 20px; }

.organic-filter-card {
    background: #fff; border: 1px solid #e5ded3; border-radius: 8px; overflow: hidden;
}
.filter-header {
    background: #f4efe6; padding: 14px 20px; font-weight: 700; color: #3e3024;
    border-bottom: 1px solid #e5ded3; font-family: "Playfair Display", serif;
}
.filter-body { padding: 20px; }

.organic-input {
    background-color: #fdfbf7; border: 1px solid #e5ded3; color: #3e3024;
    padding: 10px 16px; border-radius: 6px; box-shadow: none; transition: border-color 0.2s; width: 100%;
}
.organic-input:focus { border-color: #617A55; outline: none; }
.organic-input::placeholder { color: #b5ac9d; }

/* Category Items */
.cat-item {
    display: flex; align-items: center; padding: 10px 12px; margin-bottom: 8px;
    border-radius: 6px; cursor: pointer; transition: all 0.2s; color: #5f4f40;
}
.cat-item:hover { background: #f4efe6; color: #3e3024; }
.cat-item.active { background: #f4efe6; color: #617A55; font-weight: 600; }
.cat-indicator {
    width: 8px; height: 8px; border-radius: 50%; background: #e5ded3; margin-right: 12px; transition: background 0.2s;
}
.cat-item.active .cat-indicator { background: #617A55; }

/* ===== PRODUCT GRID ===== */
.product-organic-card {
    cursor: pointer; transition: all 0.3s ease;
}
.product-organic-card:hover {
    transform: translateY(-5px); box-shadow: 0 10px 25px rgba(62,48,36,0.08); border-color: #dcd3c6 !important;
}
.product-media { height: 260px; background: #f4efe6; }
.product-img {
    height: 100%; object-fit: cover; display: block;
    transition: transform 0.6s ease; filter: sepia(0.1);
}
.product-organic-card:hover .product-img { transform: scale(1.05); filter: sepia(0); }

.product-overlay {
    background: linear-gradient(to top, rgba(62,48,36,0.3) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.3s; pointer-events: none;
}
.product-organic-card:hover .product-overlay { opacity: 1; }

.quick-view-btn {
    bottom: 20px; transform: translateX(-50%) translateY(15px); opacity: 0;
    transition: all 0.3s ease; white-space: nowrap;
}
.product-organic-card:hover .quick-view-btn { opacity: 1; transform: translateX(-50%) translateY(0); }

.cart-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
.cart-btn:hover { background: #617A55; color: white !important; border-color: #617A55; }

.two-line-clamp {
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

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
</style>