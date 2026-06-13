<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ─── Hệ thống thông báo (Toast System) ─────────────────────────
const toasts = ref([])
function showToast(message, type = 'success') {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
        removeToast(id)
    }, 3000)
}
function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
}

// ─── Dữ liệu mẫu Sản phẩm (Đồng bộ với Product.vue) ─────────────
const products = [
    { id: 1, name: 'Morning Kick', category: 'Dark Roast', price: 18.99, rating: 4, reviews: 112, badge: '', description: 'A bold and vibrant dark roast, perfect for a powerful start to your day. Formulated from premium beans harvested in the highland estates.', img: 'https://i.pinimg.com/1200x/b2/2b/4c/b22b4c4341dc0514ba5126c917839ba7.jpg' },
    { id: 2, name: 'Velvet Espresso', category: 'Espresso', price: 22.99, rating: 5, reviews: 94, badge: '', description: 'A rich and smooth blend with notes of chocolate and caramel, creating a luxurious espresso shot with thick, gold crema.', img: 'https://i.pinimg.com/736x/ab/c8/06/abc80650578ef473de92a69aae13c342.jpg' },
    { id: 3, name: 'Dark Knight Roast', category: 'Dark Roast', price: 26.99, rating: 4, reviews: 178, badge: '', description: 'A powerful, smoky-flavored coffee with low acidity and a long, lingering finish. Ideal for French press and cold brews.', img: 'https://i.pinimg.com/736x/44/0c/90/440c90f0128e86448c665aba221eeadf.jpg' },
    { id: 4, name: 'House Blend', category: 'Medium Roast', price: 16.99, rating: 4, reviews: 203, badge: 'New', description: 'Our signature, medium-roast coffee, offering a perfectly balanced and consistent flavor with fruity and floral overtones.', img: 'https://i.pinimg.com/736x/9f/f8/d4/9ff8d46793a445dbf8781756aed736f4.jpg' },
    { id: 5, name: 'Caramel Craze', category: 'Flavored', price: 19.99, rating: 5, reviews: 87, badge: '', description: 'A delightfully sweet and creamy coffee infused with a rich, buttery caramel flavor, perfect for sweet dessert coffee lovers.', img: 'https://i.pinimg.com/736x/1f/92/5e/1f925e6b3751d194cc96e00af710f0bc.jpg' },
    { id: 6, name: 'Mountain Peak', category: 'Single Origin', price: 24.99, rating: 4, reviews: 65, badge: 'Sale', description: 'A bright and clean single-origin coffee from the high-altitude volcanic soils, featuring a crisp, refreshing citrus finish.', img: 'https://i.pinimg.com/736x/8a/3e/ef/8a3eeffd8e8311e24c4f2bae68d57434.jpg' },
    { id: 7, name: 'Sunset Decaf', category: 'Decaf', price: 15.99, rating: 3, reviews: 54, badge: '', description: 'All the rich flavor of a classic medium roast, without the caffeine, letting you enjoy a relaxing evening cup before sleep.', img: 'https://i.pinimg.com/1200x/df/da/10/dfda10570d58c4d39a850516327ceb38.jpg' },
    { id: 8, name: 'Golden Hazelnut', category: 'Flavored', price: 20.99, rating: 4, reviews: 139, badge: 'New', description: 'A warm, nutty coffee with the irresistible aroma and taste of slow-toasted wild hazelnuts blended in light roasted beans.', img: 'https://i.pinimg.com/736x/65/d9/1e/65d91ec708702137fedc9ab7b0ce1f0c.jpg' },
    { id: 9, name: 'Breakfast Blend', category: 'Light Roast', price: 14.99, rating: 4, reviews: 112, badge: '', description: 'A light, bright coffee perfect for starting your morning with sparkling acidity, high caffeine energy, and floral clarity.', img: 'https://i.pinimg.com/736x/3e/a9/9a/3ea99a7e001b76b02ee2dee19a2f1cba.jpg' }
]

const product = ref(null)
const notFound = ref(false)

// ─── Trạng thái Bộ sưu tập hình ảnh ─────────────────────────────
const activeImage = ref('')
const mockGallery = ref([])

// ─── Tùy chọn lựa chọn của Khách hàng ───────────────────────────
const selectedSize = ref('M')
const selectedSugar = ref('100%')
const selectedIce = ref('100%')
const quantity = ref(1)

// Giá động: Size L thêm $2.00
const dynamicPrice = computed(() => {
    if (!product.value) return 0
    let base = product.value.price
    if (selectedSize.value === 'L') base += 2.00
    return base * quantity.value
})

// ─── Trạng thái Đánh giá của Khách hàng ─────────────────────────
const reviewsList = ref([
    { author: 'John Doe', rating: 5, date: '2026-05-18', content: 'Absolutely incredible! Smooth, bold flavor with no bitter aftertaste. Will buy again!' },
    { author: 'Jane Smith', rating: 4, date: '2026-05-22', content: 'Very good medium body. The packaging keeps it extremely fresh. Highly recommended!' }
])

const newReview = ref({ author: '', rating: 5, content: '' })

// ─── Sản phẩm liên quan ─────────────────────────────────────────
const relatedProducts = computed(() => {
    if (!product.value) return []
    // Chọn ngẫu nhiên 3 sản phẩm khác với sản phẩm hiện tại
    return products
        .filter(p => p.id !== product.value.id)
        .slice(0, 3)
})

// ─── Khởi tạo & Theo dõi Tuyến đường (Route) ───────────────────
function loadProduct(id) {
    const found = products.find(p => p.id === id)
    if (!found) {
        notFound.value = true
        product.value = null
        return
    }
    notFound.value = false
    product.value = found
    activeImage.value = found.img
    
    // Tạo hình ảnh mẫu cho bộ sưu tập bằng các ảnh thu nhỏ đẹp mắt
    mockGallery.value = [
        found.img,
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop'
    ]
    
    // Đặt lại các tùy chọn lựa chọn
    selectedSize.value = 'M'
    selectedSugar.value = '100%'
    selectedIce.value = '100%'
    quantity.value = 1
}

onMounted(() => {
    loadProduct(Number(route.params.id))
})

watch(() => route.params.id, (newId) => {
    loadProduct(Number(newId))
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ─── Điều khiển Hành động ──────────────────────────────────────
function adjustQty(amount) {
    const next = quantity.value + amount
    if (next >= 1 && next <= 10) quantity.value = next
}

function addToCart() {
    showToast(`Success! Added ${quantity.value}x ${product.value.name} (Size: ${selectedSize.value}, Sugar: ${selectedSugar.value}, Ice: ${selectedIce.value}) to your cart!`, 'success')
}

function submitReview() {
    if (!newReview.value.author.trim() || !newReview.value.content.trim()) {
        showToast('Please fill out all review fields!', 'warning')
        return
    }
    
    // Thêm vào danh sách bộ nhớ cục bộ
    reviewsList.value.unshift({
        author: newReview.value.author,
        rating: Number(newReview.value.rating),
        date: new Date().toISOString().split('T')[0],
        content: newReview.value.content
    })
    
    showToast('Thank you! Your review has been submitted successfully.', 'success')
    
    // Đặt lại biểu mẫu (form)
    newReview.value = { author: '', rating: 5, content: '' }
}

function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('')
}
</script>

<template>
    <div class="py-4 bg-light min-vh-100">
        
        <!-- Thông báo Toast tùy chỉnh -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 2100;">
            <transition-group name="toast-anim">
                <div 
                    v-for="t in toasts" 
                    :key="t.id" 
                    class="toast show border-0 shadow-lg mb-2" 
                    role="alert"
                    style="border-radius: 12px; overflow: hidden;"
                >
                    <div class="d-flex align-items-center p-3 text-white bg-dark">
                        <i class="bi me-2 fs-5 text-success bi-check-circle-fill"></i>
                        <div class="toast-body p-0 fw-semibold small">{{ t.message }}</div>
                        <button type="button" class="btn-close btn-close-white ms-auto" @click="removeToast(t.id)"></button>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Trạng thái không tìm thấy sản phẩm -->
        <div v-if="notFound" class="container text-center py-5">
            <i class="bi bi-cup-hot fs-1 text-muted d-block mb-3"></i>
            <h4 class="fw-bold">Roast Details Not Found</h4>
            <p class="text-muted small">We can't find the coffee item you're looking for.</p>
            <RouterLink to="/product" class="btn btn-success fw-bold rounded-pill px-4 mt-2">
                Back to Roast Menu
            </RouterLink>
        </div>

        <!-- Khung chứa chi tiết sản phẩm -->
        <div v-else-if="product" class="container">
            
            <!-- Thanh điều hướng (Breadcrumbs) -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb mb-0 py-1 bg-transparent small font-monospace">
                    <li class="breadcrumb-item"><RouterLink to="/" class="text-success text-decoration-none">Home</RouterLink></li>
                    <li class="breadcrumb-item"><RouterLink to="/product" class="text-success text-decoration-none">Shop Menu</RouterLink></li>
                    <li class="breadcrumb-item active text-secondary" aria-current="page">{{ product.name }}</li>
                </ol>
            </nav>

            <!-- Khối chính Chi tiết sản phẩm -->
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white p-4 mb-4">
                <div class="row g-4">
                    
                    <!-- Cột trái: Bộ sưu tập / Hình ảnh -->
                    <div class="col-12 col-md-6 col-lg-5">
                        <!-- Hình ảnh lớn đang hiển thị -->
                        <div class="rounded-3 border overflow-hidden bg-light shadow-sm mb-3" style="height: 380px;">
                            <img 
                                :src="activeImage" 
                                :alt="product.name" 
                                class="w-100 h-100 object-fit-cover transition-all"
                            />
                        </div>
                        <!-- Danh sách ảnh thu nhỏ -->
                        <div class="row g-2">
                            <div v-for="(img, idx) in mockGallery" :key="idx" class="col-4">
                                <div 
                                    class="rounded-2 border overflow-hidden bg-light cursor-pointer shadow-sm position-relative" 
                                    style="height: 80px;"
                                    @click="activeImage = img"
                                >
                                    <img :src="img" alt="Gallery thumbnail" class="w-100 h-100 object-fit-cover" />
                                    <!-- Lớp phủ trực quan cho hình ảnh đang kích hoạt -->
                                    <div v-if="activeImage === img" class="position-absolute top-0 start-0 w-100 h-100 bg-success bg-opacity-25 border border-success border-2 rounded-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cột phải: Tiêu đề sản phẩm, Giá cả & Các điều khiển tùy chỉnh -->
                    <div class="col-12 col-md-6 col-lg-7">
                        
                        <!-- Danh mục và Nhãn (Badge) -->
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-success bg-opacity-10 text-success px-3 py-1 border border-success-subtle text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 0.5px;">
                                {{ product.category }}
                            </span>
                            <span v-if="product.badge" class="badge rounded-pill px-3 py-1 text-uppercase" :class="product.badge === 'New' ? 'bg-primary' : 'bg-danger'" style="font-size: 9px; letter-spacing: 0.3px;">
                                {{ product.badge }}
                            </span>
                        </div>

                        <!-- Tên sản phẩm -->
                        <h2 class="fw-extrabold text-dark mb-2">{{ product.name }}</h2>

                        <!-- Tóm tắt đánh giá (Rating) -->
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <span class="text-warning fs-5">{{ renderStars(product.rating) }}</span>
                            <span class="text-muted small">({{ product.reviews }} Customer Reviews)</span>
                        </div>

                        <!-- Hiển thị giá cả -->
                        <div class="mb-3 bg-light p-3 rounded-3 d-flex align-items-center justify-content-between">
                            <span class="text-secondary small fw-bold">TOTAL PRICE</span>
                            <h3 class="fw-extrabold text-success font-monospace mb-0">${{ dynamicPrice.toFixed(2) }}</h3>
                        </div>

                        <!-- Mô tả sản phẩm -->
                        <p class="text-secondary lh-relaxed small mb-4">{{ product.description }}</p>

                        <!-- Tùy chọn tùy chỉnh đồ uống cao cấp -->
                        <div class="p-3 border rounded-3 bg-light bg-opacity-50 mb-4">
                            
                            <!-- Bộ chọn kích cỡ (Size) -->
                            <div class="mb-3">
                                <label class="form-label fw-bold text-dark small">SELECT SIZE</label>
                                <div class="d-flex gap-2">
                                    <button 
                                        type="button" 
                                        class="btn btn-sm px-3 py-2 rounded-pill fw-semibold border"
                                        :class="selectedSize === 'M' ? 'btn-dark' : 'btn-outline-secondary bg-white'"
                                        @click="selectedSize = 'M'"
                                    >
                                        Standard Size M (+$0.00)
                                    </button>
                                    <button 
                                        type="button" 
                                        class="btn btn-sm px-3 py-2 rounded-pill fw-semibold border"
                                        :class="selectedSize === 'L' ? 'btn-dark' : 'btn-outline-secondary bg-white'"
                                        @click="selectedSize = 'L'"
                                    >
                                        Large Size L (+$2.00)
                                    </button>
                                </div>
                            </div>

                            <div class="row g-3">
                                <!-- Mức đường -->
                                <div class="col-12 col-sm-6">
                                    <label class="form-label fw-bold text-dark small">SUGAR LEVEL</label>
                                    <select v-model="selectedSugar" class="form-select form-select-sm bg-white border">
                                        <option value="100%">100% Sugar (Standard)</option>
                                        <option value="70%">70% Sugar</option>
                                        <option value="50%">50% Sugar</option>
                                        <option value="No Sugar">0% Sugar (No Sugar)</option>
                                    </select>
                                </div>
                                <!-- Mức đá -->
                                <div class="col-12 col-sm-6">
                                    <label class="form-label fw-bold text-dark small">ICE LEVEL</label>
                                    <select v-model="selectedIce" class="form-select form-select-sm bg-white border">
                                        <option value="100%">100% Ice (Standard)</option>
                                        <option value="70%">70% Ice</option>
                                        <option value="50%">50% Ice</option>
                                        <option value="No Ice">0% Ice (No Ice)</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <!-- Nút Số lượng và Thêm vào giỏ hàng -->
                        <div class="row g-3 align-items-center">
                            <div class="col-auto">
                                <label class="form-label fw-bold text-dark small d-block mb-1">QTY</label>
                                <div class="input-group input-group-sm border rounded-pill overflow-hidden bg-white" style="width: 120px; height: 38px;">
                                    <button class="btn btn-link text-secondary p-0 px-3 border-0 shadow-none text-decoration-none fs-5 fw-bold" type="button" @click="adjustQty(-1)">−</button>
                                    <input 
                                        type="text" 
                                        class="form-control text-center bg-transparent border-0 font-monospace fw-bold" 
                                        style="font-size: 14px;" 
                                        :value="quantity" 
                                        readonly 
                                    />
                                    <button class="btn btn-link text-secondary p-0 px-3 border-0 shadow-none text-decoration-none fs-5 fw-bold" type="button" @click="adjustQty(1)">+</button>
                                </div>
                            </div>
                            <div class="col">
                                <label class="form-label fw-bold text-dark small d-block mb-1">&nbsp;</label>
                                <button 
                                    class="btn btn-success btn-sm w-100 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 border-0"
                                    type="button"
                                    style="height: 38px;"
                                    @click="addToCart"
                                >
                                    <i class="bi bi-cart-plus fs-5"></i>
                                    <span>ADD TO CART</span>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <!-- Bảng Đánh giá của khách hàng & Gửi đánh giá -->
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white p-4 mb-4">
                <div class="row g-4">
                    
                    <!-- Trái: Danh sách Đánh giá -->
                    <div class="col-12 col-lg-7 border-end border-secondary border-opacity-10 pe-lg-4">
                        <h5 class="fw-bold mb-3 text-dark">
                            <i class="bi bi-chat-left-heart me-2 text-danger"></i>Customer Reviews ({{ reviewsList.length }})
                        </h5>
                        
                        <div class="d-flex flex-column gap-3">
                            <div 
                                v-for="(rev, idx) in reviewsList" 
                                :key="idx" 
                                class="p-3 border rounded-3 bg-light bg-opacity-25"
                            >
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-bold text-dark">{{ rev.author }}</span>
                                    <span class="text-muted font-monospace text-xs small" style="font-size: 11px;">{{ rev.date }}</span>
                                </div>
                                <div class="text-warning text-xs mb-2" style="font-size: 11px;">{{ renderStars(rev.rating) }}</div>
                                <p class="text-secondary small lh-sm mb-0">"{{ rev.content }}"</p>
                            </div>
                        </div>
                    </div>

                    <!-- Phải: Gửi đánh giá mới -->
                    <div class="col-12 col-lg-5 ps-lg-4">
                        <h5 class="fw-bold mb-3 text-dark">
                            <i class="bi bi-pencil-square me-2 text-primary"></i>Write a Review
                        </h5>
                        <form @submit.prevent="submitReview" novalidate>
                            
                            <!-- Tên tác giả -->
                            <div class="mb-3">
                                <label class="form-label fw-bold text-dark small">Your Name</label>
                                <input 
                                    v-model="newReview.author"
                                    type="text" 
                                    class="form-control form-control-sm bg-light border-0 py-2"
                                    placeholder="Enter your name..."
                                />
                            </div>

                            <!-- Chọn số sao đánh giá -->
                            <div class="mb-3">
                                <label class="form-label fw-bold text-dark small">Select Stars</label>
                                <select v-model="newReview.rating" class="form-select form-select-sm bg-light border-0 py-2">
                                    <option :value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                    <option :value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                    <option :value="3">⭐⭐⭐ (3 Stars)</option>
                                    <option :value="2">⭐⭐ (2 Stars)</option>
                                    <option :value="1">⭐ (1 Star)</option>
                                </select>
                            </div>

                            <!-- Nội dung đánh giá -->
                            <div class="mb-3">
                                <label class="form-label fw-bold text-dark small">Your Review</label>
                                <textarea 
                                    v-model="newReview.content"
                                    class="form-control form-control-sm bg-light border-0 py-2"
                                    rows="3"
                                    placeholder="How was the aroma, body, packaging..."
                                ></textarea>
                            </div>

                            <button type="submit" class="btn btn-dark btn-sm w-100 fw-bold py-2 rounded-pill shadow-sm">
                                SUBMIT REVIEW
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <!-- Phần Sản phẩm liên quan -->
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white p-4">
                <h5 class="fw-bold mb-4 text-dark text-center">
                    <i class="bi bi-cup-hot me-2 text-warning"></i>Explore Related Roasts
                </h5>
                
                <div class="row g-4">
                    <div v-for="related in relatedProducts" :key="related.id" class="col-12 col-md-4">
                        <div class="card border border-secondary border-opacity-10 h-100 overflow-hidden shadow-sm hover-card rounded-3">
                            <div class="position-relative" style="height: 160px;">
                                <img :src="related.img" :alt="related.name" class="w-100 h-100 object-fit-cover" />
                            </div>
                            <div class="card-body p-3 d-flex flex-column pb-2">
                                <span class="text-success text-uppercase fw-bold text-xs" style="font-size: 9px; letter-spacing: 0.5px;">{{ related.category }}</span>
                                <h6 class="fw-bold text-dark my-1 text-truncate">{{ related.name }}</h6>
                                <div class="text-warning text-xs mb-1" style="font-size: 11px;">{{ renderStars(related.rating) }}</div>
                                <span class="fw-extrabold text-success font-monospace mt-auto">${{ related.price.toFixed(2) }}</span>
                            </div>
                            <div class="card-footer bg-transparent border-0 px-3 pb-3 pt-0">
                                <RouterLink :to="`/product/${related.id}`" class="btn btn-outline-success btn-sm w-100 fw-bold rounded-pill py-2" style="font-size: 11.5px;">
                                    View Details
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<style scoped>
/* Chỉ dành cho hoạt ảnh toast scoped */
.toast-anim-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-anim-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.toast-anim-enter-from {
    transform: translateY(12px) scale(0.9);
    opacity: 0;
}
.toast-anim-leave-to {
    transform: translateX(100px);
    opacity: 0;
}

.transition-all {
    transition: all 0.3s ease;
}
.cursor-pointer {
    cursor: pointer;
}
</style>
