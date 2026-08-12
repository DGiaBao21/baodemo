<script setup>
import Banner from './Banner.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

useScrollReveal('.reveal, .reveal-left, .reveal-right, .reveal-scale');

import { ref, onMounted } from 'vue';
import { ProductService } from '../../services/product.service.js';

const productService = new ProductService();
const products = ref([]);

onMounted(async () => {
    try {
        const res = await productService.list();
        if (res.status === 200) {
            // Lấy 8 sản phẩm mới nhất hoặc hiển thị
            products.value = res.data.filter(p => p.status).slice(0, 8);
        }
    } catch (e) {
        console.error('Lỗi tải sản phẩm trang chủ:', e);
    }
});

const perks = [
    { icon: 'bi-truck', title: 'Giao Hàng Tận Nơi', desc: 'Miễn phí vận chuyển cho đơn hàng trên 500k.' },
    { icon: 'bi-award', title: 'Chất Lượng Thượng Hạng', desc: 'Đạt giải thưởng cà phê ngon nhất khu vực.' },
    { icon: 'bi-leaf', title: 'Nguồn Gốc Bền Vững', desc: 'Thu mua trực tiếp từ nông trại đạt chuẩn.' },
    { icon: 'bi-cup-hot', title: 'Rang Mới Mỗi Ngày', desc: 'Đảm bảo mẻ rang tươi mới trong vòng 48h.' },
];
</script>

<template>
    <div class="organic-theme bg-cream">
        <!-- ===== BANNER ===== -->
        <Banner />

        <!-- ===== FEATURED PRODUCTS ===== -->
        <section class="py-6 border-bottom border-earth-light">
            <div class="container">

                <!-- Section Header -->
                <div class="section-header d-flex align-items-end justify-content-between mb-5 reveal border-bottom border-earth-light pb-3">
                    <div>
                        <span class="d-inline-block text-olive fw-bold text-uppercase small tracking-widest mb-2"><i class="bi bi-star-fill me-1"></i> Lựa Chọn Tuyệt Hảo</span>
                        <h2 class="display-6 fw-bold text-brown mb-0 font-serif">Sản Phẩm Nổi Bật</h2>
                    </div>
                    <RouterLink to="/product" class="btn btn-outline-brown rounded-3 px-4 btn-sm fw-semibold tracking-wide text-uppercase">
                        Xem Tất Cả <i class="bi bi-arrow-right ms-1"></i>
                    </RouterLink>
                </div>

                <!-- Product Cards -->
                <div class="row g-4">
                    <div
                        v-for="(p, i) in products"
                        :key="p.id"
                        class="col-xl-3 col-md-4 col-sm-6 reveal-scale"
                        :style="{ transitionDelay: (i % 4) * 0.08 + 's' }"
                    >
                        <div class="home-card h-100 border border-earth-light bg-white rounded-3 overflow-hidden d-flex flex-column">
                            <!-- Image -->
                            <div class="home-card-img-wrap overflow-hidden position-relative">
                                <img :src="p.image || 'https://i.pinimg.com/736x/ab/c8/06/abc80650578ef473de92a69aae13c342.jpg'" :alt="p.name" class="home-card-img w-100" />
                                <div class="home-card-overlay"></div>
                                <div class="home-card-actions">
                                    <RouterLink :to="`/product/${p.id}`" class="btn btn-sand btn-sm rounded-3 px-3 fw-semibold shadow-sm border border-earth-light">
                                        <i class="bi bi-eye me-1"></i> Chi Tiết
                                    </RouterLink>
                                </div>
                            </div>
                            <!-- Body -->
                            <div class="card-body px-4 pt-4 pb-2 flex-grow-1">
                                <span class="d-inline-block text-olive fw-semibold text-uppercase tracking-widest" style="font-size: 0.65rem;">{{ p.category }}</span>
                                <h5 class="fw-bold text-brown mt-2 mb-0 font-serif">{{ p.name }}</h5>
                            </div>
                            <!-- Footer -->
                            <div class="card-footer bg-transparent border-top border-earth-light d-flex align-items-center justify-content-between px-4 py-3 mt-auto">
                                <span class="fw-bold text-earth fs-5">{{ Number(p.price).toLocaleString('vi-VN') }}đ</span>
                                <button class="btn btn-olive btn-sm rounded-circle shadow-sm" style="width: 35px; height: 35px;">
                                    <i class="bi bi-cart3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== PROMISE ===== -->
        <section class="py-6 bg-sand border-bottom border-earth-light">
            <div class="container">
                <div class="text-center mb-5 reveal">
                    <span class="d-inline-block text-olive fw-bold text-uppercase small tracking-widest mb-2"><i class="bi bi-patch-check me-1"></i> Lời Hứa Từ Trái Tim</span>
                    <h2 class="display-6 fw-bold text-brown mb-0 font-serif">Tại Sao Chọn BrewShop?</h2>
                </div>
                <div class="row g-4 text-center justify-content-center">
                    <div
                        v-for="(perk, i) in perks"
                        :key="perk.title"
                        class="col-sm-6 col-lg-3 reveal"
                        :style="{ transitionDelay: i * 0.1 + 's' }"
                    >
                        <div class="perk-card h-100 py-5 px-3 rounded-3 bg-cream border border-earth-light position-relative overflow-hidden">
                            <!-- Background Leaf Decoration -->
                            <i class="bi bi-tree-fill position-absolute text-earth" style="font-size: 10rem; opacity: 0.03; bottom: -40px; right: -40px;"></i>
                            <div class="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle border border-olive-light text-olive" style="width: 70px; height: 70px; background: rgba(97, 122, 85, 0.05);">
                                <i :class="'bi ' + perk.icon + ' fs-3'"></i>
                            </div>
                            <h5 class="fw-bold mb-3 text-brown font-serif">{{ perk.title }}</h5>
                            <p class="text-earth small mb-0 lh-lg">{{ perk.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== PROMO BANNER ===== -->
        <section class="py-6 bg-cream">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-6 reveal-left">
                        <div class="promo-card rounded-3 overflow-hidden position-relative border border-earth-light">
                            <img
                                src="https://i.pinimg.com/736x/3e/a9/9a/3ea99a7e001b76b02ee2dee19a2f1cba.jpg"
                                alt="Light Roast"
                                class="promo-img"
                            />
                            <div class="promo-overlay"></div>
                            <div class="promo-content position-absolute bottom-0 start-0 p-5 text-sand" style="z-index: 2;">
                                <span class="badge bg-olive text-white px-3 py-1 fw-bold text-uppercase small tracking-wide rounded-2">Vụ Mùa Mới</span>
                                <h3 class="fw-bold mt-3 mb-2 font-serif text-white">Mẻ Rang Bình Minh</h3>
                                <p class="text-white-50 mb-4 font-inter">Hương vị thanh nhẹ, chua thanh tự nhiên phù hợp cho một buổi sáng nhẹ nhàng.</p>
                                <RouterLink to="/product" class="btn btn-outline-sand rounded-3 px-4 fw-semibold tracking-wide text-uppercase">
                                    Mua Ngay <i class="bi bi-arrow-right ms-1"></i>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 reveal-right">
                        <div class="promo-card rounded-3 overflow-hidden position-relative border border-earth-light">
                            <img
                                src="https://i.pinimg.com/736x/22/08/e2/2208e2f94927a972a7dc45bc7dab2bcd.jpg"
                                alt="Coffee sale"
                                class="promo-img"
                            />
                            <div class="promo-overlay"></div>
                            <div class="promo-content position-absolute bottom-0 start-0 p-5 text-sand" style="z-index: 2;">
                                <span class="badge bg-sand text-brown px-3 py-1 fw-bold text-uppercase small tracking-wide rounded-2">Khuyến Mãi Cuối Tuần</span>
                                <h3 class="fw-bold mt-3 mb-2 font-serif text-white">Giảm Giá Lên Đến 20%</h3>
                                <p class="text-white-50 mb-4 font-inter">Ưu đãi đặc biệt cho dòng sản phẩm cà phê chồn và cà phê nguyên bản.</p>
                                <RouterLink to="/product" class="btn btn-olive rounded-3 px-4 fw-semibold tracking-wide text-uppercase">
                                    Chớp Ưu Đãi <i class="bi bi-arrow-right ms-1"></i>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<style scoped>
/* ===== ORGANIC COLOR PALETTE & UTILS ===== */
.organic-theme { font-family: "Inter", sans-serif; }
.bg-cream { background-color: #fdfbf7; } 
.bg-sand { background-color: #f4efe6; }  
.text-brown { color: #3e3024; }          
.text-earth { color: #5f4f40; }          
.text-olive { color: #617A55; }          
.border-olive-light { border-color: rgba(97, 122, 85, 0.3) !important; }
.border-earth-light { border-color: #e5ded3 !important; }

.font-serif { font-family: "Playfair Display", "Merriweather", serif; }
.font-inter { font-family: "Inter", sans-serif; }
.py-6 { padding-top: 5rem; padding-bottom: 5rem; }
.tracking-wide { letter-spacing: 0.1em; }
.tracking-widest { letter-spacing: 0.15em; }

/* Nút bấm */
.btn-olive {
    background-color: #617A55; border: 1px solid #617A55; color: white; transition: all 0.2s ease;
}
.btn-olive:hover { background-color: #4A5D23; border-color: #4A5D23; color: white; }

.btn-outline-brown {
    border: 1px solid #3e3024; color: #3e3024; background: transparent; transition: all 0.2s ease;
}
.btn-outline-brown:hover { background: #3e3024; color: #fff; }

.btn-outline-sand {
    border: 1px solid #f4efe6; color: #f4efe6; background: transparent; transition: all 0.2s ease;
}
.btn-outline-sand:hover { background: #f4efe6; color: #3e3024; }

.btn-sand { background: #f4efe6; border: 1px solid #e5ded3; color: #3e3024; transition: all 0.2s ease; }
.btn-sand:hover { background: #e5ded3; color: #3e3024; }

/* ===== PRODUCT CARD ===== */
.home-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.home-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(62, 48, 36, 0.08) !important;
    border-color: #dcd3c6 !important;
}

.home-card-img-wrap { height: 250px; }
.home-card-img {
    height: 100%; object-fit: cover; display: block;
    transition: transform 0.6s ease; filter: sepia(0.1);
}
.home-card:hover .home-card-img { transform: scale(1.05); filter: sepia(0); }

.home-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(62, 48, 36, 0.5) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
}
.home-card:hover .home-card-overlay { opacity: 1; }

.home-card-actions {
    position: absolute; bottom: 20px; left: 50%;
    transform: translateX(-50%) translateY(10px);
    opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; white-space: nowrap;
}
.home-card:hover .home-card-actions { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ===== PERK CARD ===== */
.perk-card { transition: all 0.3s ease; }
.perk-card:hover {
    transform: translateY(-5px); box-shadow: 0 10px 20px rgba(62, 48, 36, 0.05);
    background-color: #fff; border-color: #dcd3c6 !important;
}

/* ===== PROMO BANNER ===== */
.promo-card { position: relative; cursor: pointer; transition: transform 0.3s ease; }
.promo-card:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(62, 48, 36, 0.1); }

.promo-img {
    width: 100%; height: 400px; object-fit: cover; display: block;
    transition: transform 0.6s ease; filter: sepia(0.2);
}
.promo-card:hover .promo-img { transform: scale(1.05); filter: sepia(0); }

.promo-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(62, 48, 36, 0.9) 0%, rgba(62, 48, 36, 0.2) 60%, transparent 100%);
    transition: background 0.3s ease;
}
</style>