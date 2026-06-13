<script setup>
import Banner from './Banner.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

useScrollReveal('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const products = [
    { id: 1, name: 'Morning Kick',     category: 'Dark Roast',   price: 18.99, img: 'https://i.pinimg.com/1200x/b2/2b/4c/b22b4c4341dc0514ba5126c917839ba7.jpg' },
    { id: 2, name: 'Velvet Espresso',  category: 'Espresso',     price: 22.99, img: 'https://i.pinimg.com/736x/ab/c8/06/abc80650578ef473de92a69aae13c342.jpg' },
    { id: 3, name: 'House Blend',      category: 'Medium Roast', price: 16.99, img: 'https://i.pinimg.com/736x/9f/f8/d4/9ff8d46793a445dbf8781756aed736f4.jpg' },
    { id: 4, name: 'Mountain Peak',    category: 'Single Origin', price: 24.99, img: 'https://i.pinimg.com/736x/8a/3e/ef/8a3eeffd8e8311e24c4f2bae68d57434.jpg' },
    { id: 5, name: 'Caramel Craze',    category: 'Flavored',     price: 19.99, img: 'https://i.pinimg.com/736x/1f/92/5e/1f925e6b3751d194cc96e00af710f0bc.jpg' },
    { id: 6, name: 'Dark Knight',      category: 'Dark Roast',   price: 26.99, img: 'https://i.pinimg.com/736x/44/0c/90/440c90f0128e86448c665aba221eeadf.jpg' },
    { id: 7, name: 'Sunset Decaf',     category: 'Decaf',        price: 15.99, img: 'https://i.pinimg.com/1200x/df/da/10/dfda10570d58c4d39a850516327ceb38.jpg' },
    { id: 8, name: 'Golden Hazelnut',  category: 'Flavored',     price: 20.99, img: 'https://i.pinimg.com/736x/65/d9/1e/65d91ec708702137fedc9ab7b0ce1f0c.jpg' },
];

const perks = [
    { icon: 'bi-truck', title: 'Free Delivery', desc: 'On orders over $50 — right to your door.' },
    { icon: 'bi-award', title: 'Award-Winning', desc: '8 international roasting awards and counting.' },
    { icon: 'bi-leaf', title: 'Sustainably Sourced', desc: 'Direct trade from ethical, eco-friendly farms.' },
    { icon: 'bi-cup-hot', title: 'Fresh Roasted', desc: 'Beans roasted within 48h of your order.' },
];
</script>

<template>
    <div>
        <!-- ===== BANNER ===== -->
        <Banner />

        <!-- ===== FEATURED PRODUCTS ===== -->
        <section class="py-5">
            <div class="container">

                <!-- Section Header -->
                <div class="section-header d-flex align-items-end justify-content-between mb-4 reveal">
                    <div>
                        <span class="d-inline-block text-success fw-bold text-uppercase small" style="letter-spacing: 0.1em; margin-bottom: 6px;">☕ Handpicked for You</span>
                        <h2 class="fs-3 fw-bold text-dark mb-0" style="letter-spacing: -0.02em;">Featured Products</h2>
                    </div>
                    <RouterLink to="/product" class="btn btn-outline-success rounded-pill px-4 btn-sm fw-semibold">
                        View All <i class="bi bi-arrow-right ms-1"></i>
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
                        <div class="home-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            <!-- Image -->
                            <div class="home-card-img-wrap overflow-hidden">
                                <img :src="p.img" :alt="p.name" class="home-card-img w-100" />
                                <div class="home-card-overlay"></div>
                                <div class="home-card-actions">
                                    <RouterLink to="/product" class="btn btn-light btn-sm rounded-pill px-3">
                                        <i class="bi bi-eye me-1"></i> View
                                    </RouterLink>
                                </div>
                            </div>
                            <!-- Body -->
                            <div class="card-body px-3 pt-3 pb-2">
                                <span class="d-inline-block text-success fw-bold text-uppercase" style="font-size: 0.68rem; letter-spacing: 0.08em;">{{ p.category }}</span>
                                <h6 class="fw-bold mt-1 mb-0">{{ p.name }}</h6>
                            </div>
                            <!-- Footer -->
                            <div class="card-footer bg-transparent border-0 d-flex align-items-center justify-content-between px-3 pb-3">
                                <span class="fw-bold text-dark">${{ p.price.toFixed(2) }}</span>
                                <button class="btn btn-outline-success btn-sm rounded-pill px-3">
                                    <i class="bi bi-cart3 me-1"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5 bg-light border-top border-bottom">
            <div class="container">
                <div class="text-center mb-5 reveal">
                    <span class="d-inline-block text-success fw-bold text-uppercase small" style="letter-spacing: 0.1em; margin-bottom: 6px;">🌿 Our Promise</span>
                    <h2 class="fs-3 fw-bold text-dark mb-0" style="letter-spacing: -0.02em;">Why Choose BrewShop?</h2>
                </div>
                <div class="row g-4 text-center">
                    <div
                        v-for="(perk, i) in perks"
                        :key="perk.title"
                        class="col-sm-6 col-lg-3 reveal"
                        :style="{ transitionDelay: i * 0.1 + 's' }"
                    >
                        <div class="perk-card h-100 py-4 px-3 rounded-4 bg-white border">
                            <div class="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10" style="width: 60px; height: 60px;">
                                <i :class="'bi ' + perk.icon + ' text-success fs-4'"></i>
                            </div>
                            <h6 class="fw-bold mb-2">{{ perk.title }}</h6>
                            <p class="text-muted small mb-0 lh-lg">{{ perk.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== PROMO BANNER ===== -->
        <section class="py-5">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-6 reveal-left">
                        <div class="promo-card promo-card--green rounded-4 overflow-hidden position-relative">
                            <img
                                src="https://i.pinimg.com/736x/3e/a9/9a/3ea99a7e001b76b02ee2dee19a2f1cba.jpg"
                                alt="Light Roast"
                                class="promo-img"
                            />
                            <div class="promo-overlay"></div>
                            <div class="promo-content position-absolute bottom-0 start-0 p-4 text-white" style="z-index: 2;">
                                <span class="badge bg-success rounded-pill px-3 py-2 fw-bold text-uppercase small" style="letter-spacing: 0.08em;">New Arrival</span>
                                <h4 class="fw-bold mt-2 mb-1">Breakfast Blend</h4>
                                <p class="small text-white-50 mb-3">A bright, light roast perfect for slow mornings.</p>
                                <RouterLink to="/product" class="btn btn-light btn-sm rounded-pill px-4 fw-semibold text-success">
                                    Shop Now <i class="bi bi-arrow-right ms-1"></i>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 reveal-right">
                        <div class="promo-card rounded-4 overflow-hidden position-relative">
                            <img
                                src="https://i.pinimg.com/736x/22/08/e2/2208e2f94927a972a7dc45bc7dab2bcd.jpg"
                                alt="Coffee sale"
                                class="promo-img"
                            />
                            <div class="promo-overlay"></div>
                            <div class="promo-content position-absolute bottom-0 start-0 p-4 text-white" style="z-index: 2;">
                                <span class="badge bg-warning text-dark rounded-pill px-3 py-2 fw-bold text-uppercase small" style="letter-spacing: 0.08em;">Limited Deal</span>
                                <h4 class="fw-bold mt-2 mb-1">Up to 20% Off</h4>
                                <p class="small text-white-50 mb-3">Special discounts on selected single-origin bags.</p>
                                <RouterLink to="/product" class="btn btn-warning btn-sm rounded-pill px-4 fw-semibold text-white">
                                    Grab Deal <i class="bi bi-arrow-right ms-1"></i>
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
/* ===== PRODUCT CARD ===== */
.home-card {
    background: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.home-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1) !important;
}

.home-card-img-wrap {
    height: 220px;
    position: relative;
}

.home-card-img {
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
}

.home-card:hover .home-card-img {
    transform: scale(1.07);
}

.home-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.home-card:hover .home-card-overlay {
    opacity: 1;
}

.home-card-actions {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    white-space: nowrap;
}

.home-card:hover .home-card-actions {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* ===== PERK CARD ===== */
.perk-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.perk-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important;
    border-color: #198754 !important;
}

/* ===== PROMO BANNER ===== */
.promo-card {
    position: relative;
    cursor: pointer;
}

.promo-img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
}

.promo-card:hover .promo-img {
    transform: scale(1.04);
}

.promo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
    transition: background 0.3s ease;
}
</style>