<template>
    <footer class="footer-wrap bg-dark text-white pt-5 pb-0 mt-5">
        <div class="container">
            <div class="row g-4">

                <!-- Col 1: Brand & About -->
                <div class="col-lg-3 col-md-6">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-cup-hot-fill text-success fs-4"></i>
                        <span class="fw-bold fs-5">BrewShop</span>
                    </div>
                    <p class="text-white-50 small lh-lg">
                        Sourcing the world's finest coffee beans and delivering
                        exceptional roasts straight to your door. Every sip, a story.
                    </p>
                    <!-- Social Icons -->
                    <div class="d-flex gap-2 mt-3">
                        <a href="#" class="social-icon" title="Facebook">
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="#" class="social-icon" title="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="#" class="social-icon" title="Twitter / X">
                            <i class="bi bi-twitter-x"></i>
                        </a>
                        <a href="#" class="social-icon" title="YouTube">
                            <i class="bi bi-youtube"></i>
                        </a>
                    </div>
                </div>

                <!-- Col 2: Quick Links -->
                <div class="col-lg-3 col-md-6">
                    <h6 class="text-uppercase text-success fw-bold mb-3 footer-heading">Quick Links</h6>
                    <ul class="list-unstyled footer-links">
                        <li>
                            <RouterLink to="/" class="text-white-50 text-decoration-none footer-link">
                                <i class="bi bi-chevron-right me-1 small"></i> Home
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/product" class="text-white-50 text-decoration-none footer-link">
                                <i class="bi bi-chevron-right me-1 small"></i> Products
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/about" class="text-white-50 text-decoration-none footer-link">
                                <i class="bi bi-chevron-right me-1 small"></i> About Us
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/contact" class="text-white-50 text-decoration-none footer-link">
                                <i class="bi bi-chevron-right me-1 small"></i> Contact
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Col 3: Contact Info -->
                <div class="col-lg-3 col-md-6">
                    <h6 class="text-uppercase text-success fw-bold mb-3 footer-heading">Contact Us</h6>
                    <ul class="list-unstyled text-white-50 small footer-contact">
                        <li class="d-flex gap-2 mb-2">
                            <i class="bi bi-geo-alt-fill text-success mt-1 flex-shrink-0"></i>
                            <span>123 Coffee Lane, Brew District, HCM City</span>
                        </li>
                        <li class="d-flex gap-2 mb-2">
                            <i class="bi bi-telephone-fill text-success mt-1 flex-shrink-0"></i>
                            <span>+84 123 456 789</span>
                        </li>
                        <li class="d-flex gap-2 mb-2">
                            <i class="bi bi-envelope-fill text-success mt-1 flex-shrink-0"></i>
                            <span>hello@brewshop.vn</span>
                        </li>
                        <li class="d-flex gap-2">
                            <i class="bi bi-clock-fill text-success mt-1 flex-shrink-0"></i>
                            <span>Mon – Sat: 8:00 AM – 10:00 PM</span>
                        </li>
                    </ul>
                </div>

                <!-- Col 4: Newsletter -->
                <div class="col-lg-3 col-md-6">
                    <h6 class="text-uppercase text-success fw-bold mb-3 footer-heading">Newsletter</h6>
                    <p class="text-white-50 small mb-3">
                        Subscribe to get the latest deals, new arrivals, and coffee tips.
                    </p>
                    <form @submit.prevent>
                        <div class="input-group mb-3">
                            <input
                                type="email"
                                class="form-control form-control-sm bg-dark border-secondary text-white newsletter-input"
                                placeholder="Your email address"
                            />
                            <button class="btn btn-success btn-sm" type="submit">
                                <i class="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </form>
                    <!-- Payment icons -->
                    <p class="text-white-50 small mb-2">We accept:</p>
                    <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-secondary text-white-50 fw-normal px-2 py-1">
                            <i class="bi bi-credit-card me-1"></i>Visa
                        </span>
                        <span class="badge bg-secondary text-white-50 fw-normal px-2 py-1">
                            <i class="bi bi-credit-card me-1"></i>Mastercard
                        </span>
                        <span class="badge bg-secondary text-white-50 fw-normal px-2 py-1">
                            <i class="bi bi-paypal me-1"></i>PayPal
                        </span>
                    </div>
                </div>

            </div>

            <!-- Divider -->
            <hr class="border-secondary mt-5 mb-0" />
        </div>

        <!-- Bottom bar -->
        <div class="bg-black py-3">
            <div class="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
                <p class="mb-0 text-white-50 small">
                    © {{ new Date().getFullYear() }} <span class="text-success fw-semibold">BrewShop</span>. All Rights Reserved.
                </p>
                <div class="d-flex gap-3">
                    <a href="#" class="text-white-50 small text-decoration-none footer-bottom-link">Privacy Policy</a>
                    <a href="#" class="text-white-50 small text-decoration-none footer-bottom-link">Terms of Service</a>
                </div>
            </div>
        </div>

    </footer>
</template>

<style scoped>
/* ===== FOOTER HEADING ===== */
.footer-heading {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
}

/* ===== LINKS ===== */
.footer-links li {
    margin-bottom: 8px;
}

.footer-link {
    font-size: 0.88rem;
    transition: color 0.2s ease;
}

.footer-link:hover {
    color: #fff !important;
}

/* ===== SOCIAL ICONS ===== */
.social-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.95rem;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease;
}

.social-icon:hover {
    background: #198754;
    color: #fff;
}

/* ===== NEWSLETTER INPUT ===== */
.newsletter-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.newsletter-input:focus {
    background: #1e1e1e !important;
    color: #fff;
    border-color: #198754 !important;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.2);
}

/* ===== BOTTOM BAR LINKS ===== */
.footer-bottom-link {
    transition: color 0.2s ease;
}

.footer-bottom-link:hover {
    color: #fff !important;
}
</style>