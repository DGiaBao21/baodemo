<template>
    <div class="about-page">

        <!-- ===== HERO ===== -->
        <section class="about-hero text-white text-center py-5">
            <div class="container py-4">
                <span class="badge bg-white bg-opacity-10 border border-white border-opacity-25 rounded-pill px-3 py-2 fw-semibold d-inline-block mb-3 reveal">
                    <i class="bi bi-cup-hot-fill me-1 float-anim"></i> Our Story
                </span>
                <h1 class="display-5 fw-bold mb-3 reveal delay-1">Crafting Coffee,<br>Building Community</h1>
                <p class="lead text-white-50 mx-auto reveal delay-2" style="max-width:580px;">
                    From a single coffee cart to a beloved roastery — we've spent years sourcing,
                    roasting, and brewing the world's finest beans.
                </p>
            </div>
        </section>

        <!-- ===== STATS ===== -->
        <section class="py-5 bg-white border-bottom">
            <div class="container">
                <div class="row g-4 text-center">
                    <div class="col-6 col-md-3">
                        <div class="stat-card py-4 rounded-3 reveal-scale">
                            <div class="display-5 fw-bold text-success pulse-ring">12+</div>
                            <div class="text-muted small text-uppercase mt-2" style="letter-spacing: 0.06em;">Years of Roasting</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-card py-4 rounded-3 reveal-scale delay-1">
                            <div class="display-5 fw-bold text-success">40+</div>
                            <div class="text-muted small text-uppercase mt-2" style="letter-spacing: 0.06em;">Coffee Origins</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-card py-4 rounded-3 reveal-scale delay-2">
                            <div class="display-5 fw-bold text-success">15K+</div>
                            <div class="text-muted small text-uppercase mt-2" style="letter-spacing: 0.06em;">Happy Customers</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-card py-4 rounded-3 reveal-scale delay-3">
                            <div class="display-5 fw-bold text-success">8</div>
                            <div class="text-muted small text-uppercase mt-2" style="letter-spacing: 0.06em;">Awards Won</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== OUR STORY ===== -->
        <section class="py-5 bg-light">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-6 reveal-left">
                        <div class="story-img-wrap position-relative">
                            <img
                                src="https://i.pinimg.com/736x/3e/a9/9a/3ea99a7e001b76b02ee2dee19a2f1cba.jpg"
                                alt="Our story"
                                class="img-fluid rounded-4 shadow"
                                style="width:100%;height:400px;object-fit:cover;"
                            />
                            <!-- Floating badge -->
                            <div class="story-badge position-absolute bg-success text-white rounded-3 p-3 shadow float-anim">
                                <i class="bi bi-award-fill fs-4"></i>
                                <div class="fw-bold mt-1">Est. 2012</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 reveal-right">
                        <span class="badge bg-success bg-opacity-10 text-success fw-semibold mb-3 px-3 py-2" style="font-size:0.78rem;letter-spacing:0.08em;">WHO WE ARE</span>
                        <h2 class="fw-bold mb-4" style="font-size:2rem;line-height:1.2;">
                            Passionate About Every Cup We Serve
                        </h2>
                        <p class="text-muted mb-3 lh-lg">
                            BrewShop was born from a simple obsession: the perfect cup of coffee. In 2012, our
                            founders started with a small roasting drum and a dream of bringing exceptional
                            single-origin coffees to everyday coffee lovers.
                        </p>
                        <p class="text-muted mb-4 lh-lg">
                            Today, we source beans directly from farmers across Ethiopia, Colombia, Vietnam
                            and beyond — building lasting relationships that ensure fair pay and sustainable
                            farming practices.
                        </p>
                        <div class="d-flex flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-2 text-success fw-medium">
                                <i class="bi bi-check-circle-fill"></i> Direct Trade
                            </div>
                            <div class="d-flex align-items-center gap-2 text-success fw-medium">
                                <i class="bi bi-check-circle-fill"></i> Freshly Roasted
                            </div>
                            <div class="d-flex align-items-center gap-2 text-success fw-medium">
                                <i class="bi bi-check-circle-fill"></i> Carbon Neutral
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== VALUES ===== -->
        <section class="py-5 bg-white">
            <div class="container">
                <div class="text-center mb-5 reveal">
                    <span class="badge bg-success bg-opacity-10 text-success fw-semibold mb-3 px-3 py-2" style="font-size:0.78rem;letter-spacing:0.08em;">OUR VALUES</span>
                    <h2 class="fw-bold" style="font-size:1.85rem;">What Drives Us Forward</h2>
                </div>
                <div class="row g-4">
                    <div class="col-md-4 reveal" :class="'delay-' + (values.indexOf(val) + 1)" v-for="val in values" :key="val.title">
                        <div class="value-card h-100 p-4 rounded-4 border text-center">
                            <div class="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10" style="width: 64px; height: 64px;">
                                <i :class="val.icon + ' text-success fs-4'"></i>
                            </div>
                            <h5 class="fw-bold mb-2">{{ val.title }}</h5>
                            <p class="text-muted small lh-lg mb-0">{{ val.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== TEAM ===== -->
        <section class="py-5 bg-light">
            <div class="container">
                <div class="text-center mb-5 reveal">
                    <span class="badge bg-success bg-opacity-10 text-success fw-semibold mb-3 px-3 py-2" style="font-size:0.78rem;letter-spacing:0.08em;">THE TEAM</span>
                    <h2 class="fw-bold" style="font-size:1.85rem;">Meet the Brew Masters</h2>
                </div>
                <div class="row g-4 justify-content-center">
                    <div class="col-sm-6 col-lg-3 reveal-scale" :class="'delay-' + (team.indexOf(member) + 1)" v-for="member in team" :key="member.name">
                        <div class="team-card text-center p-4 rounded-4 bg-white border h-100">
                            <img :src="member.avatar" :alt="member.name"
                                class="rounded-circle mb-3 border border-3 border-success"
                                style="width: 90px; height: 90px; object-fit: cover;"
                            />
                            <h6 class="fw-bold mb-1">{{ member.name }}</h6>
                            <p class="text-success small fw-medium mb-2">{{ member.role }}</p>
                            <p class="text-muted small mb-3">{{ member.bio }}</p>
                            <div class="d-flex justify-content-center gap-2">
                                <a href="#" class="btn btn-light btn-sm text-secondary rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 32px; height: 32px;"><i class="bi bi-linkedin"></i></a>
                                <a href="#" class="btn btn-light btn-sm text-secondary rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 32px; height: 32px;"><i class="bi bi-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== CTA ===== -->
        <section class="py-5 bg-success text-white text-center">
            <div class="container py-3 reveal">
                <i class="bi bi-cup-hot-fill fs-2 mb-3 d-block float-anim"></i>
                <h2 class="fw-bold mb-3">Ready to Find Your Perfect Roast?</h2>
                <p class="text-white-50 mb-4">Browse our full collection of single-origin and blended coffees.</p>
                <RouterLink to="/product" class="btn btn-light text-success fw-bold rounded-pill px-5 py-2">
                    Shop Now <i class="bi bi-arrow-right ms-2"></i>
                </RouterLink>
            </div>
        </section>

    </div>
</template>

<script setup>
import { useScrollReveal } from '@/composables/useScrollReveal';
useScrollReveal('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const values = [
    {
        icon: 'bi bi-globe2',
        title: 'Ethical Sourcing',
        desc: 'We partner directly with farmers, ensuring fair wages and sustainable agricultural practices across all our origins.'
    },
    {
        icon: 'bi bi-fire',
        title: 'Master Roasting',
        desc: 'Our roasters obsess over every batch — adjusting temperature, time, and airflow to unlock each bean\'s fullest flavor.'
    },
    {
        icon: 'bi bi-heart-fill',
        title: 'Community First',
        desc: 'Coffee is a shared experience. We reinvest in local communities and donate 1% of profits to clean water initiatives.'
    },
];

const team = [
    {
        name: 'Minh Tuan',
        role: 'Head Roaster',
        bio: '12 years in specialty coffee. Certified Q-Grader and SCA member.',
        avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
        name: 'Lan Anh',
        role: 'Co-Founder & CEO',
        bio: 'Former barista champion turned entrepreneur with a love for single-origins.',
        avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
        name: 'David Nguyen',
        role: 'Sourcing Director',
        bio: 'Travels 6 months a year visiting farms in Ethiopia, Colombia, and Vietnam.',
        avatar: 'https://i.pravatar.cc/150?img=15'
    },
    {
        name: 'Sophie Le',
        role: 'Lead Barista Trainer',
        bio: 'Specializes in brew methods and helps customers find their perfect cup.',
        avatar: 'https://i.pravatar.cc/150?img=9'
    },
];
</script>

<style scoped>
/* ===== HERO ===== */
.about-hero {
    background: linear-gradient(135deg, #0f3d20 0%, #145c30 50%, #198754 100%);
    position: relative;
    overflow: hidden;
}

.about-hero::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 40px;
    background: #fff;
    clip-path: ellipse(55% 100% at 50% 100%);
}

/* ===== STATS ===== */
.stat-card {
    transition: transform 0.25s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
}

/* ===== STORY ===== */
.story-badge {
    bottom: -20px;
    right: -16px;
    text-align: center;
    min-width: 90px;
}

/* ===== VALUES ===== */
.value-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.value-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08) !important;
    border-color: #198754 !important;
}

/* ===== TEAM ===== */
.team-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08) !important;
}
</style>