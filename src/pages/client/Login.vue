<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { login } from '../../composables/auth.js'

const router   = useRouter()
const form     = ref({ email: '', password: '' })
const errors   = ref({})
const apiError = ref('')
const showPass = ref(false)
const loading  = ref(false)

function validate() {
    const errs = {}
    if (!form.value.email.trim())
        errs.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
        errs.email = 'Email không hợp lệ.'
    if (!form.value.password)
        errs.password = 'Vui lòng nhập mật khẩu.'
    errors.value = errs
    return Object.keys(errs).length === 0
}

async function handleSubmit() {
    apiError.value = ''
    if (!validate()) return
    loading.value = true
    await new Promise(r => setTimeout(r, 600)) // Giả lập gọi API

    const result = login(form.value.email, form.value.password)
    loading.value = false

    if (!result.ok) {
        apiError.value = result.message
        return
    }

    // Điều hướng theo vai trò thành viên
    if (result.user.role === 'admin') {
        router.push('/admin')
    } else {
        router.push('/')
    }
}
</script>

<template>
    <div class="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style="background: linear-gradient(135deg, #1e1b18 0%, #2f2519 50%, #3d2b1f 100%);">
        
        <!-- Khung Đăng nhập (100% Bootstrap 5) -->
        <div class="card border-0 shadow-lg p-4 p-md-5 rounded-4 w-100 bg-white" style="max-width: 450px;">
            
            <!-- Logo & Tiêu đề -->
            <div class="text-center mb-4">
                <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center text-warning mb-3" style="width: 64px; height: 64px;">
                    <i class="bi bi-cup-hot-fill fs-3"></i>
                </div>
                <h4 class="fw-bold text-dark mb-1">Brew Coffee Shop</h4>
                <p class="text-muted small mb-0">Hương vị mộc mạc nguyên bản quyện cùng không gian nghệ thuật</p>
            </div>

            <!-- Gợi ý tài khoản demo -->
            <div class="card border-0 bg-light rounded-3 p-3 mb-4 border-start border-warning border-3 shadow-sm">
                <div class="d-flex gap-2">
                    <i class="bi bi-shield-lock-fill text-warning fs-5"></i>
                    <div>
                        <h6 class="fw-bold mb-1 text-dark" style="font-size: 12px; text-transform: uppercase;">Tài khoản thử nghiệm hệ thống:</h6>
                        <div class="font-monospace text-secondary small" style="font-size: 11px; line-height: 1.5;">
                            <span class="d-block">🔑 Admin: <strong>admin@gmail.com</strong> / 123456</span>
                            <span class="d-block">👤 User: <strong>user@gmail.com</strong> / 123456</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Biểu mẫu Đăng nhập -->
            <form @submit.prevent="handleSubmit" novalidate>
                
                <!-- Lỗi hệ thống -->
                <div v-if="apiError" class="alert alert-danger border-0 rounded-3 small py-2 px-3 mb-3 d-flex align-items-center gap-2">
                    <i class="bi bi-exclamation-octagon-fill fs-5"></i>
                    <span class="fw-semibold">{{ apiError }}</span>
                </div>

                <!-- Ô nhập Email -->
                <div class="mb-3">
                    <label for="loginEmail" class="form-label text-dark fw-bold small text-uppercase" style="letter-spacing: 0.5px; font-size: 11px;">Địa chỉ Email</label>
                    <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                        <span class="input-group-text bg-light border-0 py-2.5 text-muted">
                            <i class="bi bi-envelope"></i>
                        </span>
                        <input
                            id="loginEmail"
                            v-model="form.email"
                            type="email"
                            class="form-control border-0 bg-light py-2.5 shadow-none"
                            placeholder="nhap-email@gmail.com"
                            required
                        />
                    </div>
                    <div v-if="errors.email" class="text-danger small mt-1" style="font-size: 11px;">
                        <i class="bi bi-exclamation-circle me-1"></i>{{ errors.email }}
                    </div>
                </div>

                <!-- Ô nhập Mật khẩu -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <label for="loginPass" class="form-label text-dark fw-bold small text-uppercase mb-0" style="letter-spacing: 0.5px; font-size: 11px;">Mật khẩu</label>
                        <a href="#" class="small text-decoration-none text-warning fw-bold">Quên mật khẩu?</a>
                    </div>
                    <div class="input-group rounded-3 overflow-hidden border border-secondary border-opacity-20">
                        <span class="input-group-text bg-light border-0 py-2.5 text-muted">
                            <i class="bi bi-lock"></i>
                        </span>
                        <input
                            id="loginPass"
                            v-model="form.password"
                            :type="showPass ? 'text' : 'password'"
                            class="form-control border-0 bg-light py-2.5 shadow-none"
                            placeholder="Nhập mật khẩu..."
                            required
                        />
                        <button type="button" class="btn bg-light border-0 text-muted px-3" @click="showPass = !showPass">
                            <i class="bi" :class="showPass ? 'bi-eye-slash' : 'bi-eye'"></i>
                        </button>
                    </div>
                    <div v-if="errors.password" class="text-danger small mt-1" style="font-size: 11px;">
                        <i class="bi bi-exclamation-circle me-1"></i>{{ errors.password }}
                    </div>
                </div>

                <!-- Ghi nhớ đăng nhập -->
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="form-check p-0 d-flex align-items-center gap-2">
                        <input class="form-check-input ms-0 border-secondary border-opacity-20 shadow-none" type="checkbox" id="rememberMe" style="cursor: pointer;">
                        <label class="form-check-label text-secondary small user-select-none" for="rememberMe" style="cursor: pointer;">
                            Duy trì đăng nhập
                        </label>
                    </div>
                </div>

                <!-- Nút Submit Đăng nhập -->
                <button type="submit" class="btn btn-warning w-100 fw-bold py-2.5 rounded-pill shadow-sm border-0 d-flex align-items-center justify-content-center gap-2 text-dark" style="background: linear-gradient(135deg, #d4a373 0%, #b88a5c 100%);" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                    <span>{{ loading ? 'ĐANG XÁC THỰC...' : 'ĐĂNG NHẬP NGAY' }}</span>
                </button>

                <!-- Đăng ký tài khoản mới -->
                <div class="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center">
                    <p class="text-muted small mb-0">
                        Chưa có tài khoản thành viên?
                        <RouterLink to="/register" class="fw-bold text-warning text-decoration-none ms-1">Đăng ký thành viên</RouterLink>
                    </p>
                </div>

            </form>
        </div>
    </div>
</template>
