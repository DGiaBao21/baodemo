<template>
    <div class="contact-page">

        <!-- ===== HERO ===== -->
        <section class="contact-hero text-white text-center py-5">
            <div class="container py-4">
                <span class="badge bg-white bg-opacity-10 border border-white border-opacity-25 rounded-pill px-3 py-2 fw-semibold d-inline-block mb-3 reveal">
                    <i class="bi bi-chat-heart-fill me-1 float-anim"></i> Get In Touch
                </span>
                <h1 class="display-5 fw-bold mb-3 reveal delay-1">We'd Love to<br>Hear From You</h1>
                <p class="lead text-white-50 mx-auto reveal delay-2" style="max-width:520px;">
                    Whether it's a question about our blends, a bulk order, or just a coffee chat —
                    our team is always happy to help.
                </p>
            </div>
        </section>

        <!-- ===== MAIN CONTENT ===== -->
        <section class="py-5 bg-light">
            <div class="container">
                <div class="row g-5 align-items-start">

                    <!-- ===== LEFT: INFO ===== -->
                    <div class="col-lg-5 reveal-left">
                        <h2 class="fw-bold mb-2" style="font-size:1.65rem;">Contact Information</h2>
                        <p class="text-muted mb-4">Stop by the roastery, drop us a message, or follow us on social media.</p>

                        <!-- Info Cards -->
                        <div class="d-flex flex-column gap-3 mb-4">
                            <div class="info-card d-flex gap-3 align-items-start p-3 rounded-3 bg-white border" v-for="item in contactInfo" :key="item.label">
                                <div class="d-flex align-items-center justify-content-center rounded-2 bg-success bg-opacity-10 flex-shrink-0 text-success" style="width: 44px; height: 44px; font-size: 1.1rem;">
                                    <i :class="item.icon"></i>
                                </div>
                                <div>
                                    <div class="fw-semibold mb-0" style="font-size:0.88rem;">{{ item.label }}</div>
                                    <div class="text-muted small mt-1">{{ item.value }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Social -->
                        <h6 class="fw-bold mb-3 text-uppercase" style="letter-spacing:0.08em;font-size:0.75rem;">Follow Us</h6>
                        <div class="d-flex gap-2">
                            <a href="#" class="btn btn-light btn-sm text-secondary rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 38px; height: 38px;" title="Facebook"><i class="bi bi-facebook"></i></a>
                            <a href="#" class="btn btn-light btn-sm text-secondary rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 38px; height: 38px;" title="Instagram"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="btn btn-light btn-sm text-secondary rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 38px; height: 38px;" title="Twitter/X"><i class="bi bi-twitter-x"></i></a>
                            <a href="#" class="btn btn-light btn-sm text-secondary rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 38px; height: 38px;" title="YouTube"><i class="bi bi-youtube"></i></a>
                        </div>

                        <!-- Map embed -->
                        <div class="mt-4 rounded-3 overflow-hidden border" style="height:220px;">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447392956838!2d106.6982!3d10.7723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzIwLjMiTiAxMDbCsDQxJzU0LjAiRQ!5e0!3m2!1svi!2svn!4v1620000000000!5m2!1svi!2svn"
                                width="100%"
                                height="220"
                                style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                title="BrewShop Location"
                            ></iframe>
                        </div>
                    </div>

                    <!-- ===== RIGHT: FORM ===== -->
                    <div class="col-lg-7 reveal-right">
                        <div class="contact-form-wrap bg-white rounded-4 shadow-sm p-4 p-md-5">
                            <h3 class="fw-bold mb-1" style="font-size:1.4rem;">Send Us a Message</h3>
                            <p class="text-muted small mb-4">We typically reply within 24 hours.</p>

                            <form @submit.prevent="handleSubmit" novalidate>
                                <!-- Name + Email -->
                                <div class="row g-3 mb-3">
                                    <div class="col-sm-6">
                                        <label class="form-label fw-medium small">Full Name <span class="text-danger">*</span></label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-person text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                class="form-control border-start-0 ps-0"
                                                :class="{ 'is-invalid': submitted && !form.name }"
                                                placeholder="Nguyen Van A"
                                                v-model="form.name"
                                            />
                                            <div class="invalid-feedback">Please enter your name.</div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label class="form-label fw-medium small">Email Address <span class="text-danger">*</span></label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                class="form-control border-start-0 ps-0"
                                                :class="{ 'is-invalid': submitted && !form.email }"
                                                placeholder="example@email.com"
                                                v-model="form.email"
                                            />
                                            <div class="invalid-feedback">Please enter a valid email.</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Phone + Subject -->
                                <div class="row g-3 mb-3">
                                    <div class="col-sm-6">
                                        <label class="form-label fw-medium small">Phone Number</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-telephone text-muted"></i>
                                            </span>
                                            <input
                                                type="tel"
                                                class="form-control border-start-0 ps-0"
                                                placeholder="+84 123 456 789"
                                                v-model="form.phone"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label class="form-label fw-medium small">Subject <span class="text-danger">*</span></label>
                                        <select
                                            class="form-select"
                                            :class="{ 'is-invalid': submitted && !form.subject }"
                                            v-model="form.subject"
                                        >
                                            <option value="" disabled>Select a topic...</option>
                                            <option>Product Inquiry</option>
                                            <option>Bulk / Wholesale Order</option>
                                            <option>Shipping & Delivery</option>
                                            <option>Partnership</option>
                                            <option>Other</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a subject.</div>
                                    </div>
                                </div>

                                <!-- Message -->
                                <div class="mb-4">
                                    <label class="form-label fw-medium small">Message <span class="text-danger">*</span></label>
                                    <textarea
                                        class="form-control"
                                        :class="{ 'is-invalid': submitted && !form.message }"
                                        rows="5"
                                        placeholder="Tell us how we can help you..."
                                        v-model="form.message"
                                    ></textarea>
                                    <div class="invalid-feedback">Please enter your message.</div>
                                    <div class="text-muted text-end mt-1" style="font-size:0.75rem;">{{ form.message.length }} / 500</div>
                                </div>

                                <!-- Submit -->
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                    <button type="submit" class="btn btn-success rounded-pill px-5 py-2 fw-semibold d-flex align-items-center gap-2" :disabled="sending">
                                        <span v-if="sending" class="spinner-border spinner-border-sm"></span>
                                        <i v-else class="bi bi-send-fill"></i>
                                        {{ sending ? 'Sending...' : 'Send Message' }}
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium" @click="resetForm">
                                        Reset
                                    </button>
                                </div>

                                <!-- Success Alert -->
                                <div v-if="success" class="alert alert-success d-flex align-items-center gap-2 mt-4 rounded-3" role="alert">
                                    <i class="bi bi-check-circle-fill fs-5"></i>
                                    <div>
                                        <strong>Message sent!</strong> Thank you, we'll get back to you soon.
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ===== FAQ ===== -->
        <section class="py-5 bg-white">
            <div class="container" style="max-width:760px;">
                <div class="text-center mb-5 reveal">
                    <span class="badge bg-success bg-opacity-10 text-success fw-semibold mb-3 px-3 py-2" style="font-size:0.78rem;letter-spacing:0.08em;">FAQ</span>
                    <h2 class="fw-bold" style="font-size:1.75rem;">Frequently Asked Questions</h2>
                </div>
                <div class="accordion accordion-flush reveal" id="faqAccordion">
                    <div class="accordion-item border rounded-3 mb-2 overflow-hidden" v-for="(faq, i) in faqs" :key="i">
                        <h2 class="accordion-header">
                            <button
                                class="accordion-button collapsed fw-medium"
                                type="button"
                                :data-bs-target="'#faq' + i"
                                data-bs-toggle="collapse"
                                :aria-controls="'faq' + i"
                            >
                                {{ faq.q }}
                            </button>
                        </h2>
                        <div :id="'faq' + i" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body text-muted">{{ faq.a }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
useScrollReveal('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const form = ref({ name: '', email: '', phone: '', subject: '', message: '' });
const submitted = ref(false);
const sending = ref(false);
const success = ref(false);

function handleSubmit() {
    submitted.value = true;
    if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) return;

    sending.value = true;
    // Simulate API call
    setTimeout(() => {
        sending.value = false;
        success.value = true;
        resetForm();
        setTimeout(() => (success.value = false), 5000);
    }, 1500);
}

function resetForm() {
    form.value = { name: '', email: '', phone: '', subject: '', message: '' };
    submitted.value = false;
}

const contactInfo = [
    { icon: 'bi bi-geo-alt-fill', label: 'Our Roastery', value: '123 Coffee Lane, Brew District, Ho Chi Minh City' },
    { icon: 'bi bi-telephone-fill', label: 'Phone', value: '+84 123 456 789 (Mon–Sat, 8am–10pm)' },
    { icon: 'bi bi-envelope-fill', label: 'Email', value: 'hello@brewshop.vn' },
    { icon: 'bi bi-clock-fill', label: 'Opening Hours', value: 'Monday – Saturday: 8:00 AM – 10:00 PM' },
];

const faqs = [
    { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on all orders over $50. Standard delivery typically takes 2–4 business days.' },
    { q: 'Can I visit the roastery in person?', a: 'Absolutely. Our roastery is open Monday to Saturday from 8am–10pm. Come in for a free tasting!' },
    { q: 'Do you offer wholesale or bulk pricing?', a: 'Yes, we have special pricing for cafes, restaurants, and offices. Select "Bulk / Wholesale Order" in the contact form above.' },
    { q: 'How fresh are your beans when shipped?', a: 'We roast to order. Your beans will be roasted within 48 hours of your purchase and shipped the same day.' },
];
</script>

<style scoped>
/* ===== HERO ===== */
.contact-hero {
    background: linear-gradient(135deg, #0f3d20 0%, #145c30 50%, #198754 100%);
    position: relative;
    overflow: hidden;
}

.contact-hero::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 40px;
    background: #f8f9fa;
    clip-path: ellipse(55% 100% at 50% 100%);
}

/* ===== INFO CARD ===== */
.info-card {
    transition: box-shadow 0.2s ease;
}

.info-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07) !important;
}

/* ===== ACCORDION ===== */
.accordion-button:not(.collapsed) {
    color: #198754;
    background-color: rgba(25, 135, 84, 0.05);
    box-shadow: none;
}

.accordion-button:focus {
    box-shadow: none;
}

.accordion-button::after {
    filter: none;
}

.accordion-button:not(.collapsed)::after {
    filter: invert(35%) sepia(60%) saturate(600%) hue-rotate(100deg);
}
</style>