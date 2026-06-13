<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useScrollReveal } from '@/composables/useScrollReveal';
useScrollReveal('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const searchQuery = ref('');
const selectedCategories = ref([]);
const minPrice = ref('');
const maxPrice = ref('');

const categories = ['Dark Roast', 'Medium Roast', 'Light Roast', 'Espresso', 'Decaf', 'Single Origin', 'Flavored'];

const products = ref([
    { id: 1, name: 'Morning Kick', category: 'Dark Roast', price: 18.99, rating: 4, reviews: 112, badge: '', description: 'A bold and vibrant dark roast, perfect for a powerful start to your day.', img: 'https://i.pinimg.com/1200x/b2/2b/4c/b22b4c4341dc0514ba5126c917839ba7.jpg' },
    { id: 2, name: 'Velvet Espresso', category: 'Espresso', price: 22.99, rating: 5, reviews: 94, badge: '', description: 'A rich and smooth blend with notes of chocolate and caramel, creating a luxurious espresso shot.', img: 'https://i.pinimg.com/736x/ab/c8/06/abc80650578ef473de92a69aae13c342.jpg' },
    { id: 3, name: 'Dark Knight Roast', category: 'Dark Roast', price: 26.99, rating: 4, reviews: 178, badge: '', description: 'A powerful, smoky-flavored coffee with low acidity and a long, lingering finish.', img: 'https://i.pinimg.com/736x/44/0c/90/440c90f0128e86448c665aba221eeadf.jpg' },
    { id: 4, name: 'House Blend', category: 'Medium Roast', price: 16.99, rating: 4, reviews: 203, badge: 'New', description: 'Our signature, medium-roast coffee, offering a perfectly balanced and consistent flavor.', img: 'https://i.pinimg.com/736x/9f/f8/d4/9ff8d46793a445dbf8781756aed736f4.jpg' },
    { id: 5, name: 'Caramel Craze', category: 'Flavored', price: 19.99, rating: 5, reviews: 87, badge: '', description: 'A delightfully sweet and creamy coffee infused with a rich, buttery caramel flavor.', img: 'https://i.pinimg.com/736x/1f/92/5e/1f925e6b3751d194cc96e00af710f0bc.jpg' },
    { id: 6, name: 'Mountain Peak', category: 'Single Origin', price: 24.99, rating: 4, reviews: 65, badge: 'Sale', description: 'A bright and clean single-origin coffee from the highlands, featuring a crisp, refreshing finish.', img: 'https://i.pinimg.com/736x/8a/3e/ef/8a3eeffd8e8311e24c4f2bae68d57434.jpg' },
    { id: 7, name: 'Sunset Decaf', category: 'Decaf', price: 15.99, rating: 3, reviews: 54, badge: '', description: 'All the rich flavor of a classic roast, without the caffeine, for a relaxing evening cup.', img: 'https://i.pinimg.com/1200x/df/da/10/dfda10570d58c4d39a850516327ceb38.jpg' },
    { id: 8, name: 'Golden Hazelnut', category: 'Flavored', price: 20.99, rating: 4, reviews: 139, badge: 'New', description: 'A warm, nutty coffee with the irresistible aroma and taste of toasted hazelnuts.', img: 'https://i.pinimg.com/736x/65/d9/1e/65d91ec708702137fedc9ab7b0ce1f0c.jpg' },
    { id: 9, name: 'Breakfast Blend', category: 'Light Roast', price: 14.99, rating: 4, reviews: 112, badge: '', description: 'A light, bright coffee perfect for starting your morning with energy and clarity.', img: 'https://i.pinimg.com/736x/3e/a9/9a/3ea99a7e001b76b02ee2dee19a2f1cba.jpg' },
]);

function toggleCategory(cat) {
    const idx = selectedCategories.value.indexOf(cat);
    if (idx === -1) selectedCategories.value.push(cat);
    else selectedCategories.value.splice(idx, 1);
}

function clearFilters() {
    searchQuery.value = '';
    selectedCategories.value = [];
    minPrice.value = '';
    maxPrice.value = '';
}

const filteredProducts = computed(() => {
    return products.value.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchCat = selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category);
        const matchMin = minPrice.value === '' || p.price >= Number(minPrice.value);
        const matchMax = maxPrice.value === '' || p.price <= Number(maxPrice.value);
        return matchSearch && matchCat && matchMin && matchMax;
    });
});

const currentPage = ref(1);
const itemsPerPage = ref(6);

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value));

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProducts.value.slice(start, end);
});

watch([searchQuery, selectedCategories, minPrice, maxPrice], () => {
    currentPage.value = 1;
});

function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('');
}
</script>

<template>
    <div class="container py-4">
        <div class="row g-4 align-items-start">

            <!-- ===== THANH BÊN (Sidebar) ===== -->
            <div class="col-lg-3 reveal-left">
                <div class="sidebar-sticky">

                    <!-- Tìm kiếm -->
                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-header bg-success text-white fw-semibold border-0">
                            <i class="bi bi-search me-2"></i> Search
                        </div>
                        <div class="card-body">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    class="form-control border-start-0 ps-0"
                                    placeholder="Find your roast..."
                                    v-model="searchQuery"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Danh mục -->
                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-header bg-success text-white fw-semibold border-0">
                            <i class="bi bi-layers-fill me-2"></i> Categories
                        </div>
                        <div class="card-body pb-2 px-2">
                            <div
                                v-for="cat in categories"
                                :key="cat"
                                class="d-flex align-items-center gap-2 px-2 py-2 rounded mb-1 category-chip"
                                :class="{ 'bg-success bg-opacity-10 fw-semibold text-success': selectedCategories.includes(cat) }"
                                @click="toggleCategory(cat)"
                                role="button"
                            >
                                <span
                                    class="d-flex align-items-center justify-content-center rounded-1 flex-shrink-0 chip-check"
                                    :class="selectedCategories.includes(cat) ? 'bg-success text-white border-success' : 'border'"
                                >
                                    <i class="bi bi-check2" style="font-size:0.65rem;"></i>
                                </span>
                                <span class="small">{{ cat }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Khoảng giá -->
                    <div class="card border-0 shadow-sm mb-3">
                        <div class="card-header bg-success text-white fw-semibold border-0">
                            <i class="bi bi-tag-fill me-2"></i> Price Range
                        </div>
                        <div class="card-body">
                            <div class="row g-2 align-items-center">
                                <div class="col">
                                    <div class="input-group input-group-sm">
                                        <span class="input-group-text">$</span>
                                        <input
                                            type="number"
                                            class="form-control"
                                            placeholder="Min"
                                            v-model="minPrice"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div class="col-auto text-muted fw-bold">—</div>
                                <div class="col">
                                    <div class="input-group input-group-sm">
                                        <span class="input-group-text">$</span>
                                        <input
                                            type="number"
                                            class="form-control"
                                            placeholder="Max"
                                            v-model="maxPrice"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Nút đặt lại bộ lọc (Reset) -->
                    <button class="btn btn-outline-success w-100 mb-3 fw-semibold" @click="clearFilters">
                        <i class="bi bi-x-circle me-1"></i> Reset Filters
                    </button>

                    <!-- Thống kê -->
                    <div class="card border-0 shadow-sm text-center bg-success text-white">
                        <div class="card-body d-flex align-items-center justify-content-around py-3">
                            <div>
                                <div class="fs-3 fw-bold">{{ filteredProducts.length }}</div>
                                <div class="small text-white-50 text-uppercase" style="letter-spacing:0.08em;">Products</div>
                            </div>
                            <div class="vr bg-white opacity-25 mx-2" style="height:40px;"></div>
                            <div>
                                <div class="fs-3 fw-bold">{{ categories.length }}</div>
                                <div class="small text-white-50 text-uppercase" style="letter-spacing:0.08em;">Categories</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- ===== LƯỚI SẢN PHẨM (Product Grid) ===== -->
            <div class="col-lg-9">

                <!-- Thanh hiển thị số lượng kết quả -->
                <div class="d-flex align-items-center justify-content-between bg-white border rounded px-3 py-2 mb-4 shadow-sm reveal">
                    <p class="mb-0 small text-secondary">
                        Showing <strong class="text-dark">{{ filteredProducts.length }}</strong>
                        of <strong class="text-dark">{{ products.length }}</strong> products
                    </p>
                </div>

                <!-- Trạng thái trống (Không tìm thấy kết quả) -->
                <div v-if="filteredProducts.length === 0" class="text-center py-5 reveal">
                    <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3" style="width:80px;height:80px;">
                        <i class="bi bi-cup-hot fs-2 text-success"></i>
                    </div>
                    <h3 class="fw-bold mb-2">No Coffee Found</h3>
                    <p class="text-muted mb-4">Try adjusting your filters or search term.</p>
                    <button class="btn btn-outline-success fw-semibold" @click="clearFilters">Clear All Filters</button>
                </div>

                <!-- Lưới sản phẩm -->
                <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                    <div
                        class="col reveal-scale"
                        :style="{ transitionDelay: (paginatedProducts.indexOf(product) % 3) * 0.1 + 's' }"
                        v-for="product in paginatedProducts"
                        :key="product.id"
                    >
                        <div class="card h-100 border-0 shadow-sm product-card">

                            <!-- Hình ảnh sản phẩm -->
                            <div class="product-media position-relative overflow-hidden">
                                <img :src="product.img" :alt="product.name" class="product-img w-100" />

                                <!-- Lớp phủ (Overlay) -->
                                <div class="product-overlay position-absolute top-0 start-0 w-100 h-100"></div>

                                <!-- Nhãn (Badge) -->
                                <span
                                    v-if="product.badge"
                                    class="position-absolute top-0 start-0 m-2 badge rounded-pill"
                                    :class="product.badge === 'New' ? 'bg-primary' : 'bg-danger'"
                                >
                                    {{ product.badge }}
                                </span>

                                <!-- Xem nhanh / Chi tiết -->
                                <RouterLink 
                                    :to="`/product/${product.id}`"
                                    class="quick-view-btn position-absolute start-50 translate-middle-x btn btn-sm btn-light rounded-pill px-3 text-decoration-none text-dark shadow-sm fw-semibold"
                                >
                                    <i class="bi bi-eye me-1"></i> View Details
                                </RouterLink>
                            </div>

                            <!-- Phần thân (Body) -->
                            <div class="card-body d-flex flex-column pb-2">
                                <span class="text-success text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.1em;">{{ product.category }}</span>
                                <h5 class="fw-bold mb-2 mt-1">{{ product.name }}</h5>
                                <p class="text-muted small mb-2 two-line-clamp">{{ product.description }}</p>
                                <div class="d-flex align-items-center gap-2 mt-auto">
                                    <span class="text-warning" style="letter-spacing:1.5px;">{{ renderStars(product.rating) }}</span>
                                    <span class="text-muted" style="font-size:0.78rem;">({{ product.reviews }} reviews)</span>
                                </div>
                            </div>

                            <!-- Phần chân (Footer) -->
                            <div class="card-footer bg-transparent border-top d-flex align-items-center justify-content-between px-3 pb-3 pt-2">
                                <span class="fw-bold fs-5">${{ product.price.toFixed(2) }}</span>
                                <button class="btn btn-outline-success btn-sm d-flex align-items-center gap-2 rounded-pill px-3">
                                    <i class="bi bi-cart3"></i>
                                    <span>Add to Cart</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Phân trang Bootstrap 5 -->
                <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
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
        </div>
    </div>
</template>

<style scoped>
/* ===== BỐ CỤC (Layout) ===== */
.sidebar-sticky {
    position: sticky;
    top: 24px;
}

/* ===== CHIP DANH MỤC (Category Chip) ===== */
.category-chip {
    cursor: pointer;
    transition: background 0.2s ease;
    color: #444;
    user-select: none;
    font-size: 0.88rem;
}

.category-chip:hover {
    background-color: rgba(25, 135, 84, 0.07);
}

.chip-check {
    width: 18px;
    height: 18px;
    font-size: 0.75rem;
    transition: all 0.2s ease;
}

/* ===== THẸ SẢN PHẨM (Product Card) ===== */
.product-card {
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12) !important;
}

/* Hình ảnh */
.product-media {
    height: 220px;
}

.product-img {
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
}

.product-card:hover .product-img {
    transform: scale(1.07);
}

/* Lớp phủ */
.product-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.product-card:hover .product-overlay {
    opacity: 1;
}

/* Nút Xem nhanh */
.quick-view-btn {
    bottom: 14px;
    transform: translateX(-50%) translateY(12px);
    opacity: 0;
    font-size: 0.8rem;
    font-weight: 600;
    transition: opacity 0.3s ease, transform 0.3s ease;
    white-space: nowrap;
}

.product-card:hover .quick-view-btn {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Giới hạn số dòng của mô tả (Line clamp) */
.two-line-clamp {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>