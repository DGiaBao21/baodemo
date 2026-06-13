<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    const el = document.getElementById('carouselExampleIndicators');
    if (el && window.bootstrap) {
        new window.bootstrap.Carousel(el, {
            interval: 3000,
            ride: 'carousel',
        });
    }
});
</script>

<template>
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">

        <!-- Indicators -->
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                class="active" aria-current="true" aria-label="Slide 1"></button>
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
                <div class="carousel-overlay overlay-left"></div>
                <div class="carousel-caption-custom">
                    <span class="banner-tag">☕ Welcome to BrewShop</span>
                    <h1 class="banner-title">Taste the<br><em>Perfect Moment</em></h1>
                    <p class="banner-subtitle">Handcrafted coffee blends made with love, served fresh every day in a warm, cozy atmosphere.</p>
                    <div class="banner-actions">
                        <a href="#" class="banner-btn">Explore Menu</a>
                        <a href="#" class="banner-btn-ghost">Our Story</a>
                    </div>
                    <div class="banner-stats">
                        <div class="stat-item"><strong>500+</strong><span>Blends</span></div>
                        <div class="stat-divider"></div>
                        <div class="stat-item"><strong>15k+</strong><span>Customers</span></div>
                        <div class="stat-divider"></div>
                        <div class="stat-item"><strong>4.9★</strong><span>Rating</span></div>
                    </div>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-item box-banner">
                <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&h=700&fit=crop&q=90"
                    class="d-block w-100" alt="Premium coffee beans">
                <div class="carousel-overlay overlay-center"></div>
                <div class="carousel-caption-custom caption-center">
                    <span class="banner-tag">🫘 Single Origin</span>
                    <h1 class="banner-title">Pure Coffee,<br><em>Pure Life</em></h1>
                    <p class="banner-subtitle">Single-origin beans sourced from the finest farms, roasted to perfection for an unforgettable cup.</p>
                    <div class="banner-actions">
                        <a href="#" class="banner-btn">Shop Beans</a>
                        <a href="#" class="banner-btn-ghost">Learn More</a>
                    </div>
                </div>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-item box-banner">
                <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600&h=700&fit=crop&q=90"
                    class="d-block w-100" alt="Coffee art latte">
                <div class="carousel-overlay overlay-left"></div>
                <div class="carousel-caption-custom">
                    <span class="banner-tag">🎁 Special Offer</span>
                    <h1 class="banner-title">Enjoy<br><em>Daily Deals</em></h1>
                    <p class="banner-subtitle">Fresh promotions every day — don't miss your favorite blend on sale. Limited time only.</p>
                    <div class="banner-actions">
                        <a href="#" class="banner-btn banner-btn-red">Get Deal Now</a>
                        <a href="#" class="banner-btn-ghost">View All Offers</a>
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

<style scoped>
/* ===== BASE ===== */
.carousel { position: relative; }

.carousel-inner { position: relative; width: 100%; overflow: hidden; }

/* ===== SLIDE ===== */
.box-banner {
    height: 620px;
    overflow: hidden;
    position: relative;
}

.box-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transform: scale(1.08);
    transition: transform 7s ease;
    will-change: transform;
}

.carousel-item.active img { transform: scale(1); }

/* ===== OVERLAYS ===== */
.overlay-left {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        105deg,
        rgba(8, 4, 2, 0.78) 0%,
        rgba(8, 4, 2, 0.45) 50%,
        rgba(8, 4, 2, 0.05) 100%
    );
    z-index: 1;
}

.overlay-center {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at center,
        rgba(5, 3, 1, 0.72) 0%,
        rgba(5, 3, 1, 0.35) 60%,
        transparent 100%
    );
    z-index: 1;
}

/* ===== CAPTION ===== */
.carousel-caption-custom {
    position: absolute;
    top: 50%;
    left: 8%;
    transform: translateY(-50%);
    z-index: 2;
    max-width: 560px;
    animation: fadeSlideIn 0.9s ease forwards;
}

.caption-center {
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.carousel-item:not(.active) .carousel-caption-custom { opacity: 0; }

@keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(calc(-50% + 30px)); }
    to   { opacity: 1; transform: translateY(-50%); }
}

/* ===== TAG ===== */
.banner-tag {
    display: inline-block;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.22);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 50px;
    margin-bottom: 16px;
}

/* ===== TITLE ===== */
.banner-title {
    font-size: clamp(2.2rem, 4.5vw, 3.6rem);
    font-weight: 900;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 16px;
    text-shadow: 0 4px 24px rgba(0,0,0,0.5);
    letter-spacing: -0.02em;
}

.banner-title em {
    font-style: normal;
    background: linear-gradient(90deg, #e8a84e, #f5c878);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ===== SUBTITLE ===== */
.banner-subtitle {
    font-size: 1.05rem;
    color: rgba(255,255,255,0.78);
    line-height: 1.7;
    margin-bottom: 30px;
    max-width: 440px;
}

.caption-center .banner-subtitle { margin-inline: auto; }

/* ===== ACTIONS ===== */
.banner-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 36px;
}

.banner-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 13px 32px;
    background: linear-gradient(135deg, #c8832a, #e8a84e);
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    border-radius: 50px;
    text-decoration: none;
    box-shadow: 0 6px 24px rgba(200,131,42,0.45);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.banner-btn:hover {
    background: linear-gradient(135deg, #e8a84e, #f5c878);
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(200,131,42,0.6);
    color: #fff;
}

.banner-btn-red {
    background: linear-gradient(135deg, #c0392b, #e74c3c) !important;
    box-shadow: 0 6px 24px rgba(231,76,60,0.45) !important;
}
.banner-btn-red:hover {
    background: linear-gradient(135deg, #e74c3c, #ff6b6b) !important;
    box-shadow: 0 10px 32px rgba(231,76,60,0.6) !important;
}

.banner-btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 50px;
    text-decoration: none;
    border: 1.5px solid rgba(255,255,255,0.3);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.banner-btn-ghost:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.6);
    color: #fff;
    transform: translateY(-2px);
}

/* ===== STATS ===== */
.banner-stats {
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat-item {
    display: flex;
    flex-direction: column;
}
.stat-item strong {
    color: #fff;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1;
}
.stat-item span {
    color: rgba(255,255,255,0.55);
    font-size: 0.75rem;
    margin-top: 3px;
    letter-spacing: 0.05em;
}
.stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255,255,255,0.2);
}

/* ===== INDICATORS ===== */
.carousel-indicators {
    position: absolute;
    bottom: 24px;
    left: 0; right: 0;
    z-index: 3;
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 0;
    padding: 0;
}

.carousel-indicators button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    border: none;
    transition: all 0.35s ease;
    padding: 0;
    cursor: pointer;
}

.carousel-indicators button.active {
    background: #e8a84e;
    width: 30px;
    border-radius: 5px;
}

/* ===== CONTROLS ===== */
.carousel-control-prev,
.carousel-control-next {
    width: 52px;
    opacity: 1;
    z-index: 3;
}

.ctrl-btn {
    width: 46px;
    height: 46px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.carousel-control-prev:hover .ctrl-btn,
.carousel-control-next:hover .ctrl-btn {
    background: rgba(232,168,78,0.85);
    border-color: #e8a84e;
    transform: scale(1.08);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .box-banner { height: 460px; }
    .carousel-caption-custom { left: 5%; max-width: 90%; }
    .caption-center { left: 50%; }
    .banner-stats { display: none; }
}

@media (max-width: 480px) {
    .box-banner { height: 380px; }
    .banner-actions { flex-direction: column; align-items: flex-start; }
}
</style>
