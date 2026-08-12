<template>
    <div id="carouselExampleIndicators" class="carousel slide organic-theme">

        <!-- Indicators -->
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                aria-label="Slide 3"></button>
        </div>

        <div class="carousel-inner">

            <!-- Slide 1 -->
            <div class="carousel-item box-banner active">
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&h=700&fit=crop&q=90"
                    class="d-block w-100" alt="Coffee shop ambiance">
                <div class="carousel-overlay overlay-warm"></div>
                <div class="carousel-caption-custom">
                    <span class="banner-tag text-uppercase tracking-widest"><i class="bi bi-shop me-2"></i> Chào mừng đến BrewShop</span>
                    <h1 class="banner-title font-serif text-sand">Hương Vị<br><span class="text-olive">Nguyên Bản</span></h1>
                    <p class="banner-subtitle font-inter text-cream-50">Từng hạt cà phê được lựa chọn cẩn thận và rang mộc thủ công, mang đến trải nghiệm thuần khiết nhất từ thiên nhiên.</p>
                    <div class="banner-actions">
                        <RouterLink to="/product" class="btn btn-olive banner-btn text-uppercase tracking-wide">Xem Thực Đơn</RouterLink>
                        <RouterLink to="/about" class="btn btn-outline-sand banner-btn-ghost text-uppercase tracking-wide">Câu Chuyện</RouterLink>
                    </div>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-item box-banner">
                <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&h=700&fit=crop&q=90"
                    class="d-block w-100" alt="Premium coffee beans">
                <div class="carousel-overlay overlay-warm-center"></div>
                <div class="carousel-caption-custom caption-center">
                    <span class="banner-tag text-uppercase tracking-widest"><i class="bi bi-tree me-2"></i> Single Origin</span>
                    <h1 class="banner-title font-serif text-sand">Mộc Mạc &<br><span class="text-olive">Tinh Tế</span></h1>
                    <p class="banner-subtitle font-inter text-cream-50">Khám phá bộ sưu tập cà phê đặc sản nguồn gốc đơn (Single Origin) từ những nông trại hữu cơ hàng đầu.</p>
                    <div class="banner-actions justify-content-center">
                        <RouterLink to="/product" class="btn btn-olive banner-btn text-uppercase tracking-wide">Mua Hạt Ngay</RouterLink>
                    </div>
                </div>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-item box-banner">
                <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600&h=700&fit=crop&q=90"
                    class="d-block w-100" alt="Coffee art latte">
                <div class="carousel-overlay overlay-warm"></div>
                <div class="carousel-caption-custom">
                    <span class="banner-tag text-uppercase tracking-widest"><i class="bi bi-cup-hot me-2"></i> Ưu đãi mỗi ngày</span>
                    <h1 class="banner-title font-serif text-sand">Thưởng Thức<br><span class="text-olive">Đậm Đà</span></h1>
                    <p class="banner-subtitle font-inter text-cream-50">Tận hưởng những mẻ rang mới nhất cùng mức giá ưu đãi dành riêng cho những người sành cà phê thực thụ.</p>
                    <div class="banner-actions">
                        <RouterLink to="/product" class="btn btn-olive banner-btn text-uppercase tracking-wide">Khám Phá Ưu Đãi</RouterLink>
                    </div>
                </div>
            </div>

        </div>

        <!-- Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <div class="ctrl-btn">
                <i class="bi bi-chevron-left"></i>
            </div>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <div class="ctrl-btn">
                <i class="bi bi-chevron-right"></i>
            </div>
        </button>

    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { Carousel } from 'bootstrap';

let carouselInstance = null;

onMounted(() => {
    const el = document.getElementById('carouselExampleIndicators');
    if (el) {
        carouselInstance = new Carousel(el, {
            interval: 5000,
            ride: 'carousel',
            pause: 'hover',
            wrap: true
        });
        carouselInstance.cycle();
    }
});

onBeforeUnmount(() => {
    if (carouselInstance) {
        carouselInstance.dispose();
        carouselInstance = null;
    }
});
</script>

<style scoped>
/* ===== ORGANIC COLOR PALETTE & UTILS ===== */
.organic-theme { font-family: "Inter", sans-serif; }
.font-serif { font-family: "Playfair Display", "Merriweather", serif; }
.font-inter { font-family: "Inter", sans-serif; }

.text-olive { color: #617A55 !important; }
.text-sand { color: #f4efe6 !important; }
.text-cream-50 { color: rgba(253, 251, 247, 0.8) !important; }
.tracking-widest { letter-spacing: 0.15em; }
.tracking-wide { letter-spacing: 0.1em; }

/* ===== BASE ===== */
.carousel { position: relative; }
.carousel-inner { position: relative; width: 100%; overflow: hidden; }

/* ===== SLIDE ===== */
.box-banner { height: 650px; overflow: hidden; position: relative; background: #2c241b; }
.box-banner img {
    width: 100%; height: 100%; object-fit: cover; object-position: center top;
    transform: scale(1.05); transition: transform 8s ease; will-change: transform;
    filter: sepia(0.3) brightness(0.8);
}
.carousel-item.active img { transform: scale(1); }

/* ===== OVERLAYS ===== */
.overlay-warm {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, rgba(62, 48, 36, 0.85) 0%, rgba(62, 48, 36, 0.5) 50%, rgba(62, 48, 36, 0.1) 100%);
    z-index: 1;
}
.overlay-warm-center {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(62, 48, 36, 0.8) 0%, rgba(62, 48, 36, 0.4) 60%, transparent 100%);
    z-index: 1;
}

/* ===== CAPTION ===== */
.carousel-caption-custom {
    position: absolute; top: 50%; left: 8%; transform: translateY(-50%);
    z-index: 2; max-width: 600px;
    animation: fadeSlideIn 1s ease forwards;
}
.caption-center { left: 50%; transform: translate(-50%, -50%); text-align: center; }
.carousel-item:not(.active) .carousel-caption-custom { opacity: 0; }

@keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(calc(-50% + 30px)); }
    to { opacity: 1; transform: translateY(-50%); }
}

/* ===== TAG ===== */
.banner-tag {
    display: inline-block; background: transparent; border: 1px solid #617A55; color: #617A55;
    font-size: 0.8rem; font-weight: 700; padding: 6px 18px; border-radius: 4px; margin-bottom: 20px;
}

/* ===== TITLE ===== */
.banner-title {
    font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; line-height: 1.2; margin-bottom: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* ===== SUBTITLE ===== */
.banner-subtitle { font-size: 1.1rem; line-height: 1.6; margin-bottom: 35px; max-width: 500px; }
.caption-center .banner-subtitle { margin-inline: auto; }

/* ===== ACTIONS ===== */
.banner-actions { display: flex; align-items: center; gap: 15px; flex-wrap: wrap; margin-bottom: 30px; }

/* Nút bấm Organic */
.btn-olive {
    background-color: #617A55; border: 1px solid #617A55; color: white;
    padding: 14px 32px; font-weight: 600; font-size: 0.9rem; border-radius: 4px;
    transition: all 0.3s ease; text-decoration: none; display: inline-block;
}
.btn-olive:hover { background-color: #4A5D23; border-color: #4A5D23; color: white; transform: translateY(-2px); }

.btn-outline-sand {
    background-color: transparent; border: 1px solid #f4efe6; color: #f4efe6;
    padding: 14px 32px; font-weight: 600; font-size: 0.9rem; border-radius: 4px;
    transition: all 0.3s ease; text-decoration: none; display: inline-block;
}
.btn-outline-sand:hover { background-color: #f4efe6; color: #3e3024; transform: translateY(-2px); }

/* ===== INDICATORS ===== */
.carousel-indicators { position: absolute; bottom: 30px; z-index: 3; gap: 10px; margin: 0; padding: 0; }
.carousel-indicators button {
    width: 12px; height: 12px; border-radius: 50%; background: transparent; border: 1px solid #f4efe6;
    transition: all 0.3s ease; padding: 0; cursor: pointer; opacity: 0.6;
}
.carousel-indicators button.active { background: #617A55; border-color: #617A55; opacity: 1; transform: scale(1.2); }

/* ===== CONTROLS ===== */
.carousel-control-prev, .carousel-control-next { width: 60px; opacity: 1; z-index: 3; }
.ctrl-btn {
    width: 50px; height: 50px; background: transparent; border: 1px solid rgba(244, 239, 230, 0.5);
    border-radius: 4px; display: flex; align-items: center; justify-content: center;
    color: #f4efe6; font-size: 1.2rem; transition: all 0.3s ease;
}
.carousel-control-prev:hover .ctrl-btn, .carousel-control-next:hover .ctrl-btn {
    background: #617A55; border-color: #617A55; color: white; transform: scale(1.05);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .box-banner { height: 500px; }
    .carousel-caption-custom { left: 5%; max-width: 90%; }
    .caption-center { left: 50%; }
}
@media (max-width: 480px) {
    .box-banner { height: 450px; }
    .banner-actions { flex-direction: column; align-items: flex-start; width: 100%; }
    .banner-btn, .banner-btn-ghost { width: 100%; text-align: center; }
}
</style>
