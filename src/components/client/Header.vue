<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn, currentUser, logout } from '../../composables/auth.js';

const router = useRouter();

// Hiệu ứng: header đổi nền khi cuộn xuống
const scrolled = ref(false);
function handleScroll() {
    scrolled.value = window.scrollY > 20;
}
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// Toggle search bar trên mobile
const searchOpen = ref(false);

function handleLogout() {
    logout();
    router.push('/login');
}
</script>

<template>
    <header :class="['header-wrap', 'sticky-top', scrolled ? 'scrolled' : '']">
        <nav class="navbar navbar-expand-lg py-0">
            <div class="container">

                <!-- ===== LOGO ===== -->
                <RouterLink class="navbar-brand d-flex align-items-center gap-2 py-3 me-4" to="/">
                    <div class="logo-icon d-flex align-items-center justify-content-center">
                        <i class="bi bi-cup-hot-fill"></i>
                    </div>
                    <span class="logo-text">Brew<span class="text-success">Shop</span></span>
                </RouterLink>

                <!-- ===== MOBILE TOGGLER ===== -->
                <div class="d-flex align-items-center gap-2 d-lg-none ms-auto">
                    <!-- Mobile search icon -->
                    <button class="btn btn-sm btn-outline-secondary rounded-circle p-1 lh-1" @click="searchOpen = !searchOpen">
                        <i class="bi bi-search" style="font-size:1rem;"></i>
                    </button>
                    <button class="navbar-toggler border-0 shadow-none p-1" type="button"
                        data-bs-toggle="collapse" data-bs-target="#headerNav"
                        aria-controls="headerNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>

                <!-- ===== COLLAPSE MENU ===== -->
                <div class="collapse navbar-collapse" id="headerNav">

                    <!-- Nav Links -->
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-item-link" active-class="nav-active" to="/">
                                <i class="bi bi-house me-1"></i>Home
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-item-link" active-class="nav-active" to="/product">
                                <i class="bi bi-box-seam me-1"></i>Products
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-item-link" active-class="nav-active" to="/about">
                                <i class="bi bi-info-circle me-1"></i>About Us
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-item-link" active-class="nav-active" to="/contact">
                                <i class="bi bi-envelope me-1"></i>Contact
                            </RouterLink>
                        </li>
                          <li class="nav-item">
                            <RouterLink class="nav-link nav-item-link" active-class="nav-active" to="/blog">
                                <i class="bi bi-newspaper me-1"></i>Blog
                            </RouterLink>
                        </li>
                    </ul>

                    <!-- Right Actions -->
                    <div class="d-flex align-items-center gap-2 gap-lg-3 mt-3 mt-lg-0 pb-3 pb-lg-0">

                        <!-- Search -->
                        <div class="search-wrap d-none d-lg-flex align-items-center">
                            <div class="input-group search-group">
                                <span class="input-group-text search-prefix">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    class="form-control search-input"
                                    placeholder="Search coffees..."
                                    aria-label="Search"
                                />
                            </div>
                        </div>


                        <!-- Chưa đăng nhập -->
                        <template v-if="!isLoggedIn">
                            <RouterLink to="/login"
                                class="btn btn-outline-success rounded-pill px-3 py-1 fw-medium header-btn-login d-flex align-items-center gap-2">
                                <i class="bi bi-person"></i>
                                <span>Login</span>
                            </RouterLink>
                            <RouterLink to="/register"
                                class="btn btn-success rounded-pill px-3 py-1 fw-medium d-none d-xl-flex align-items-center gap-2">
                                <i class="bi bi-person-plus"></i>
                                <span>Sign Up</span>
                            </RouterLink>
                        </template>

                        <!-- Đã đăng nhập: dropdown -->
                        <div v-else class="dropdown">
                            <button
                                class="btn btn-outline-secondary rounded-pill px-3 py-1 d-flex align-items-center gap-2 dropdown-toggle"
                                style="font-size:0.875rem"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i class="bi bi-person-circle"></i>
                                <span class="d-none d-lg-inline fw-medium">{{ currentUser?.name?.split(' ').slice(-1)[0] }}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-1">
                                <li>
                                    <span class="dropdown-item-text text-muted small">{{ currentUser?.email }}</span>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <RouterLink to="/profile" class="dropdown-item">
                                        <i class="bi bi-person me-2"></i>Thông tin cá nhân
                                    </RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/my-comments" class="dropdown-item">
                                        <i class="bi bi-chat-dots me-2"></i>Bình luận của tôi
                                    </RouterLink>
                                </li>
                                <li v-if="currentUser?.role === 'admin'">
                                    <RouterLink to="/admin" class="dropdown-item">
                                        <i class="bi bi-shield-lock me-2"></i>Trang Admin
                                    </RouterLink>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <button class="dropdown-item text-danger" @click="handleLogout">
                                        <i class="bi bi-box-arrow-left me-2"></i>Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </nav>

        <!-- Mobile Search Bar (hiện khi click icon search) -->
        <div v-show="searchOpen" class="mobile-search border-top px-3 py-2 d-lg-none">
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                </span>
                <input type="search" class="form-control border-start-0 ps-0" placeholder="Search coffees..." />
            </div>
        </div>
    </header>
</template>

<style scoped>
/* ===== HEADER WRAPPER ===== */
.header-wrap {
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease, background 0.3s ease;
    z-index: 1030;
}

.header-wrap.scrolled {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

/* ===== LOGO ===== */
.logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #198754, #20c997);
    border-radius: 10px;
    color: #fff;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -0.03em;
}

/* ===== NAV LINKS ===== */
.nav-item-link {
    color: #444;
    font-weight: 500;
    font-size: 0.92rem;
    padding: 1.25rem 0.85rem !important;
    position: relative;
    transition: color 0.25s ease;
    white-space: nowrap;
}

.nav-item-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0.85rem;
    right: 0.85rem;
    height: 2.5px;
    background: #198754;
    border-radius: 2px 2px 0 0;
    transform: scaleX(0);
    transition: transform 0.25s ease;
}

.nav-item-link:hover {
    color: #198754;
}

.nav-item-link:hover::after {
    transform: scaleX(1);
}

/* Active state */
.nav-active {
    color: #198754 !important;
    font-weight: 600;
}

.nav-active::after {
    transform: scaleX(1) !important;
}

/* ===== SEARCH ===== */
.search-group {
    width: 220px;
    transition: width 0.3s ease;
}

.search-group:focus-within {
    width: 270px;
}

.search-prefix {
    background: #f8f9fa;
    border: 1.5px solid #dee2e6;
    border-right: none;
    color: #6c757d;
    border-radius: 50px 0 0 50px !important;
    padding: 0 12px;
    font-size: 0.85rem;
}

.search-input {
    background: #f8f9fa;
    border: 1.5px solid #dee2e6;
    border-left: none;
    border-radius: 0 50px 50px 0 !important;
    font-size: 0.875rem;
    box-shadow: none !important;
    padding: 0.45rem 1rem;
}

.search-input:focus {
    background: #fff;
    border-color: #198754;
}

.search-input:focus ~ .search-prefix,
.search-group:focus-within .search-prefix {
    background: #fff;
    border-color: #198754;
}

/* ===== CART ICON BUTTON ===== */
.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f5f5f5;
    color: #333;
    font-size: 1.15rem;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease;
    flex-shrink: 0;
}

.icon-btn:hover {
    background: #198754;
    color: #fff;
}

.cart-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #dc3545;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #fff;
    line-height: 1;
}

/* ===== AUTH BUTTONS ===== */
.header-btn-login {
    font-size: 0.875rem;
}

/* ===== MOBILE SEARCH ===== */
.mobile-search {
    background: #fff;
    animation: slideDown 0.2s ease;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>