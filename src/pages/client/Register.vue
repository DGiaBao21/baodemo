<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
})
const errors      = ref({})
const showPass    = ref(false)
const showConfirm = ref(false)
const loading     = ref(false)

function validate() {
    const errs = {}
    if (!form.value.name.trim())
        errs.name = 'Vui lòng nhập họ và tên.'
    else if (form.value.name.trim().length < 2)
        errs.name = 'Họ và tên phải ít nhất 2 ký tự.'

    if (!form.value.email.trim())
        errs.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
        errs.email = 'Email không hợp lệ.'

    if (!form.value.phone.trim())
        errs.phone = 'Vui lòng nhập số điện thoại.'
    else if (!/^(0[3-9]\d{8})$/.test(form.value.phone))
        errs.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu 03-09).'

    if (!form.value.password)
        errs.password = 'Vui lòng nhập mật khẩu.'
    else if (form.value.password.length < 6)
        errs.password = 'Mật khẩu phải ít nhất 6 ký tự.'

    if (!form.value.confirmPassword)
        errs.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
    else if (form.value.password !== form.value.confirmPassword)
        errs.confirmPassword = 'Mật khẩu xác nhận không khớp.'

    errors.value = errs
    return Object.keys(errs).length === 0
}

async function handleSubmit() {
    if (!validate()) return
    loading.value = true
    // Giả lập API đăng ký thành viên
    await new Promise(r => setTimeout(r, 900))
    loading.value = false
    alert('Đăng ký tài khoản thành công! Hãy thực hiện đăng nhập để tham gia Brew Club.')
    router.push('/login')
}
</script>

<template>
    <div class="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style="background: linear-gradient(135deg, #1e1b18 0%, #2f2519 50%, #3d2b1f 100%);">
        
        <!-- Khung Đăng ký (100% Bootstrap 5) -->
        <div class="card border-0 shadow-lg p-4 p-md-5 rounded-4 w-100 bg-white" style="max-width: 540px;">
            
            <!-- Logo & Tiêu đề -->
            <div class="text-center mb-4">
                <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center text-warning mb-3" style="width: 64px; height: 64px;">
                    <i class="bi bi-person-plus-fill fs-3"></i>
                </div>
                <h4 class="fw-bold text-dark mb-1">Đăng ký thành viên</h4>
                <p class="text-muted small mb-0">Tham gia Brew Club để nhận ưu đãi giảm giá và đặc quyền đặc thù.</p>
            </div>

            <!-- Biểu mẫu Đăng ký -->
            <form @submit.prevent="handleSubmit" novalidate>
                
                <div class="row g-3">
                    <!-- Họ và tên -->
                    <div class="col-12">
                        <label for="regName" class="form-label text-dark fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11px;">Họ và tên</label>
                        <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                            <span class="input-group-text bg-light border-0 py-2 text-muted">
                                <i class="bi bi-person"></i>
                            </span>
                            <input
                                id="regName"
                                v-model="form.name"
                                type="text"
                                class="form-control border-0 bg-light py-2 shadow-none"
                                placeholder="Họ và tên của bạn..."
                                required
                            />
                        </div>
                        <div v-if="errors.name" class="text-danger small mt-1" style="font-size: 11px;">
                            <i class="bi bi-exclamation-circle me-1"></i>{{ errors.name }}
                        </div>
                    </div>

                    <!-- Địa chỉ Email -->
                    <div class="col-12 col-md-6">
                        <label for="regEmail" class="form-label text-dark fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11px;">Địa chỉ Email</label>
                        <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                            <span class="input-group-text bg-light border-0 py-2 text-muted">
                                <i class="bi bi-envelope"></i>
                            </span>
                            <input
                                id="regEmail"
                                v-model="form.email"
                                type="email"
                                class="form-control border-0 bg-light py-2 shadow-none"
                                placeholder="ten-cua-ban@gmail.com"
                                required
                            />
                        </div>
                        <div v-if="errors.email" class="text-danger small mt-1" style="font-size: 11px;">
                            <i class="bi bi-exclamation-circle me-1"></i>{{ errors.email }}
                        </div>
                    </div>

                    <!-- Số điện thoại -->
                    <div class="col-12 col-md-6">
                        <label for="regPhone" class="form-label text-dark fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11px;">Số điện thoại</label>
                        <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                            <span class="input-group-text bg-light border-0 py-2 text-muted">
                                <i class="bi bi-telephone"></i>
                            </span>
                            <input
                                id="regPhone"
                                v-model="form.phone"
                                type="tel"
                                class="form-control border-0 bg-light py-2 shadow-none font-monospace"
                                placeholder="09xx xxx xxx"
                                maxlength="10"
                                required
                            />
                        </div>
                        <div v-if="errors.phone" class="text-danger small mt-1" style="font-size: 11px;">
                            <i class="bi bi-exclamation-circle me-1"></i>{{ errors.phone }}
                        </div>
                    </div>

                    <!-- Mật khẩu -->
                    <div class="col-12 col-md-6">
                        <label for="regPass" class="form-label text-dark fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11px;">Mật khẩu</label>
                        <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                            <span class="input-group-text bg-light border-0 py-2 text-muted">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input
                                id="regPass"
                                v-model="form.password"
                                :type="showPass ? 'text' : 'password'"
                                class="form-control border-0 bg-light py-2 shadow-none"
                                placeholder="Tối thiểu 6 ký tự..."
                                required
                            />
                            <button type="button" class="btn bg-light border-0 text-muted px-2" @click="showPass = !showPass">
                                <i class="bi" :class="showPass ? 'bi-eye-slash' : 'bi-eye'"></i>
                            </button>
                        </div>
                        <div v-if="errors.password" class="text-danger small mt-1" style="font-size: 11px;">
                            <i class="bi bi-exclamation-circle me-1"></i>{{ errors.password }}
                        </div>
                    </div>

                    <!-- Xác nhận Mật khẩu -->
                    <div class="col-12 col-md-6">
                        <label for="regConfirm" class="form-label text-dark fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11px;">Xác nhận mật khẩu</label>
                        <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                            <span class="input-group-text bg-light border-0 py-2 text-muted">
                                <i class="bi bi-lock-fill"></i>
                            </span>
                            <input
                                id="regConfirm"
                                v-model="form.confirmPassword"
                                :type="showConfirm ? 'text' : 'password'"
                                class="form-control border-0 bg-light py-2 shadow-none"
                                placeholder="Nhập lại mật khẩu..."
                                required
                            />
                            <button type="button" class="btn bg-light border-0 text-muted px-2" @click="showConfirm = !showConfirm">
                                <i class="bi" :class="showConfirm ? 'bi-eye-slash' : 'bi-eye'"></i>
                            </button>
                        </div>
                        <div v-if="errors.confirmPassword" class="text-danger small mt-1" style="font-size: 11px;">
                            <i class="bi bi-exclamation-circle me-1"></i>{{ errors.confirmPassword }}
                        </div>
                    </div>
                </div>

                <!-- Đồng ý điều khoản -->
                <div class="form-check p-0 d-flex align-items-center gap-2 mt-4 mb-4">
                    <input class="form-check-input ms-0 border-secondary border-opacity-20 shadow-none" type="checkbox" id="agreeTerms" style="cursor: pointer;" checked required>
                    <label class="form-check-label text-secondary small user-select-none" for="agreeTerms" style="cursor: pointer;">
                        Tôi đồng ý với các <a href="#" class="text-warning fw-bold text-decoration-none">Điều khoản & Chính sách</a> của Brew Club.
                    </label>
                </div>

                <!-- Nút Submit Đăng ký -->
                <button type="submit" class="btn btn-warning w-100 fw-bold py-2.5 rounded-pill shadow-sm border-0 d-flex align-items-center justify-content-center gap-2 text-dark" style="background: linear-gradient(135deg, #d4a373 0%, #b88a5c 100%);" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                    <span>{{ loading ? 'ĐANG KHỞI TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ THÀNH VIÊN NGAY' }}</span>
                </button>

                <!-- Đăng nhập nếu đã có tài khoản -->
                <div class="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center">
                    <p class="text-muted small mb-0">
                        Đã là thành viên Brew Club?
                        <RouterLink to="/login" class="fw-bold text-warning text-decoration-none ms-1">Đăng nhập tại đây</RouterLink>
                    </p>
                </div>

            </form>
        </div>
    </div>
</template>
