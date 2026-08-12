<template>
    <div class="contact-page organic-theme bg-cream">

        <!-- ===== HERO ===== -->
        <section class="contact-hero text-center position-relative overflow-hidden pt-6 pb-4">
            <div class="container py-5 position-relative z-2">
                <span class="badge bg-sand text-olive px-4 py-2 fw-bold mb-4 rounded-3 border border-olive-light reveal tracking-widest text-uppercase">
                    <i class="bi bi-envelope-paper-heart me-2"></i> Trò Chuyện Cùng BrewShop
                </span>
                <h1 class="display-4 fw-bold mb-4 reveal delay-1 text-brown font-serif">Kết Nối Với <br> <span class="text-olive">Nguồn Cội Hương Vị</span></h1>
                <p class="lead text-earth mx-auto reveal delay-2 fw-normal" style="max-width:600px;">
                    Dù là góp ý, hỏi đáp về hạt cà phê hay nhu cầu hợp tác thương mại, những nghệ nhân rang của chúng tôi luôn lắng nghe bạn.
                </p>
            </div>
            <!-- Hình khối lá cây mờ (Organic touch) -->
            <div class="leaf-shape leaf-1 position-absolute opacity-10"><i class="bi bi-flower1"></i></div>
            <div class="leaf-shape leaf-2 position-absolute opacity-10"><i class="bi bi-flower2"></i></div>
        </section>

        <!-- ===== MAIN CONTENT ===== -->
        <section class="py-5 pb-6">
            <div class="container">
                <div class="row g-5">
                    
                    <!-- LEFT: Form Panel -->
                    <div class="col-lg-7 form-panel reveal-left">
                        <div class="bg-white p-5 rounded-4 border border-earth-light shadow-sm">
                            <h3 class="fw-bold text-brown mb-2 font-serif">Gửi Lời Nhắn</h3>
                            <p class="text-earth mb-4">Điền vào biểu mẫu dưới đây, chúng tôi sẽ phản hồi qua email của bạn trong thời gian sớm nhất.</p>
                            
                            <!-- Success message -->
                            <div v-if="success" class="alert alert-success d-flex align-items-center gap-3 rounded-3 mb-4 border border-olive bg-sand text-olive">
                                <i class="bi bi-check-circle-fill fs-4"></i>
                                <div><strong>Tuyệt vời!</strong> Lời nhắn của bạn đã được gửi gắm thành công.</div>
                            </div>

                            <form @submit.prevent="handleSubmit" novalidate>
                                <div class="row g-4 mb-4">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label fw-semibold text-earth small text-uppercase tracking-wide">Họ và tên <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control organic-input" :class="{ 'is-invalid': submitted && !form.name }" v-model="form.name" placeholder="Vd: Nguyễn Văn A" />
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label fw-semibold text-earth small text-uppercase tracking-wide">Email <span class="text-danger">*</span></label>
                                            <input type="email" class="form-control organic-input" :class="{ 'is-invalid': submitted && !form.email }" v-model="form.email" placeholder="email@domain.com" />
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label fw-semibold text-earth small text-uppercase tracking-wide">Số điện thoại</label>
                                            <input type="tel" class="form-control organic-input" v-model="form.phone" placeholder="09xxxx" />
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label fw-semibold text-earth small text-uppercase tracking-wide">Chủ đề <span class="text-danger">*</span></label>
                                            <select class="form-select organic-input" :class="{ 'is-invalid': submitted && !form.subject }" v-model="form.subject">
                                                <option value="" disabled selected hidden>Chọn chủ đề...</option>
                                                <option>Hợp tác đại lý</option>
                                                <option>Mua sỉ cà phê hạt</option>
                                                <option>Hỗ trợ đơn hàng</option>
                                                <option>Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-group">
                                            <label class="form-label fw-semibold text-earth small text-uppercase tracking-wide">Nội dung <span class="text-danger">*</span></label>
                                            <textarea class="form-control organic-input" :class="{ 'is-invalid': submitted && !form.message }" v-model="form.message" placeholder="Ghi chú thêm thông tin..." rows="5"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-olive rounded-3 px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 text-uppercase tracking-wide" :disabled="sending">
                                    <span v-if="sending" class="spinner-border spinner-border-sm"></span>
                                    <span v-else>Gửi Đi</span>
                                    <i class="bi bi-send" v-if="!sending"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- RIGHT: Info Panel -->
                    <div class="col-lg-5 info-panel reveal-right d-flex flex-column">
                        <div class="bg-sand p-5 rounded-4 border border-earth-light flex-grow-1">
                            <h3 class="fw-bold mb-4 text-brown font-serif">Thông Tin Xưởng Rang</h3>
                            
                            <div class="d-flex flex-column gap-4 mb-5">
                                <div class="contact-item d-flex gap-3 align-items-start" v-for="item in contactInfo" :key="item.label">
                                    <div class="icon-wrap bg-white border border-earth-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-olive fs-5" style="width: 45px; height: 45px;">
                                        <i :class="item.icon"></i>
                                    </div>
                                    <div>
                                        <div class="text-olive fw-bold small text-uppercase tracking-wide mb-1">{{ item.label }}</div>
                                        <div class="fw-semibold text-brown">{{ item.value }}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr class="border-earth-light my-4">

                            <h6 class="text-olive fw-bold small text-uppercase tracking-wide mb-3">Giờ Hoạt Động</h6>
                            <ul class="list-unstyled text-earth mb-5">
                                <li class="d-flex justify-content-between mb-2">
                                    <span>Thứ 2 - Thứ 6:</span> <span class="fw-semibold">08:00 - 18:00</span>
                                </li>
                                <li class="d-flex justify-content-between mb-2">
                                    <span>Thứ 7:</span> <span class="fw-semibold">08:00 - 15:00</span>
                                </li>
                                <li class="d-flex justify-content-between">
                                    <span>Chủ Nhật:</span> <span class="fw-semibold">Nghỉ (Ủ hạt)</span>
                                </li>
                            </ul>

                            <h6 class="text-olive fw-bold small text-uppercase tracking-wide mb-3">Theo Dõi BrewShop</h6>
                            <div class="d-flex gap-2">
                                <a href="#" class="social-btn"><i class="bi bi-facebook"></i></a>
                                <a href="#" class="social-btn"><i class="bi bi-instagram"></i></a>
                                <a href="#" class="social-btn"><i class="bi bi-tiktok"></i></a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ===== MAP ===== -->
        <section class="py-0 border-top border-earth-light">
            <div class="map-container" style="height: 400px; background: #e5ded3;">
                <!-- Sử dụng iframe map có filter màu nâu nhẹ -->
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447392956838!2d106.6982!3d10.7723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzIwLjMiTiAxMDbCsDQxJzU0LjAiRQ!5e0!3m2!1svi!2svn!4v1620000000000!5m2!1svi!2svn"
                    width="100%"
                    height="100%"
                    style="border:0; filter: grayscale(40%) sepia(30%);"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
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
    setTimeout(() => {
        sending.value = false;
        success.value = true;
        form.value = { name: '', email: '', phone: '', subject: '', message: '' };
        submitted.value = false;
        setTimeout(() => (success.value = false), 5000);
    }, 1500);
}

const contactInfo = [
    { icon: 'bi bi-geo-alt', label: 'Xưởng Rang', value: 'Khu Công Nghiệp Lộc Sơn, Bảo Lộc, Lâm Đồng' },
    { icon: 'bi bi-shop', label: 'Cửa hàng', value: '123 Đường Cà Phê, Quận 1, TP. HCM' },
    { icon: 'bi bi-telephone', label: 'Hotline Mua Sỉ', value: '0909 123 456' },
    { icon: 'bi bi-envelope', label: 'Email', value: 'hello@brewshop.vn' },
];
</script>

<style scoped>
/* ===== ORGANIC COLOR PALETTE & UTILS ===== */
.organic-theme { font-family: "Inter", sans-serif; }
.bg-cream { background-color: #fdfbf7; } 
.bg-sand { background-color: #f4efe6; }  
.text-brown { color: #3e3024; }          
.text-earth { color: #5f4f40; }          
.text-olive { color: #617A55; }          
.border-olive { border-color: #617A55 !important; }
.border-olive-light { border-color: rgba(97, 122, 85, 0.3) !important; }
.border-earth-light { border-color: #e5ded3 !important; }

.font-serif { font-family: "Playfair Display", "Merriweather", serif; }
.pt-6 { padding-top: 5rem; }
.pb-6 { padding-bottom: 5rem; }
.tracking-wide { letter-spacing: 0.1em; }
.tracking-widest { letter-spacing: 0.15em; }

/* Buttons & Inputs */
.btn-olive {
    background-color: #617A55; border: 1px solid #617A55; color: white;
    transition: all 0.3s ease;
}
.btn-olive:hover { background-color: #4A5D23; border-color: #4A5D23; color: white; }

.organic-input {
    background-color: #fdfbf7; border: 1px solid #e5ded3; color: #3e3024;
    padding: 12px 16px; border-radius: 8px; box-shadow: none; transition: border-color 0.2s;
}
.organic-input:focus { border-color: #617A55; outline: none; box-shadow: 0 0 0 3px rgba(97,122,85,0.1); }
.organic-input::placeholder { color: #b5ac9d; }

/* Invalid form state */
.is-invalid { border-color: #B22222 !important; }

/* Hero Shapes */
.leaf-shape { font-size: 15rem; color: #617A55; z-index: 1; }
.leaf-1 { top: -50px; left: -50px; transform: rotate(-20deg); }
.leaf-2 { bottom: -80px; right: 5%; transform: rotate(15deg); }

/* Social buttons */
.social-btn {
    width: 40px; height: 40px; border-radius: 8px; background: white; border: 1px solid #e5ded3;
    display: flex; align-items: center; justify-content: center; color: #5f4f40;
    transition: all 0.2s; text-decoration: none;
}
.social-btn:hover { background: #617A55; color: white; border-color: #617A55; }
</style>