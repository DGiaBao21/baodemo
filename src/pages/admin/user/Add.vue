<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: true,
})

const errors      = ref({})
const showPass    = ref(false)
const showConfirm = ref(false)

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

function handleSubmit() {
    if (!validate()) return
    // TODO: gọi API POST /api/admin/users
    const { confirmPassword, ...payload } = form.value
    console.log('Thêm người dùng:', payload)
    alert('Thêm người dùng thành công!')
    router.push('/userlist')
}
</script>

<template>
    <div class="p-4">

        <!-- Page Header -->
        <div class="d-flex align-items-center gap-3 mb-4">
            <RouterLink to="/userlist" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i>
            </RouterLink>
            <div>
                <h4 class="fw-bold mb-0">Thêm người dùng</h4>
                <p class="text-muted small mb-0">Tạo tài khoản mới cho hệ thống</p>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-lg-7">
                <form @submit.prevent="handleSubmit" novalidate>

                    <!-- Thông tin cơ bản -->
                    <div class="card border-0 shadow-sm rounded-3 mb-4">
                        <div class="card-header bg-white border-bottom py-3">
                            <h6 class="fw-semibold mb-0">
                                <i class="bi bi-person me-2 text-success"></i>Thông tin cơ bản
                            </h6>
                        </div>
                        <div class="card-body p-4">

                            <!-- Họ tên -->
                            <div class="mb-3">
                                <label for="userName" class="form-label fw-semibold">
                                    Họ và tên <span class="text-danger">*</span>
                                </label>
                                <input
                                    id="userName"
                                    v-model="form.name"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.name }"
                                    placeholder="Nhập họ và tên..."
                                />
                                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                            </div>

                            <!-- Email -->
                            <div class="mb-3">
                                <label for="userEmail" class="form-label fw-semibold">
                                    Email <span class="text-danger">*</span>
                                </label>
                                <input
                                    id="userEmail"
                                    v-model="form.email"
                                    type="email"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.email }"
                                    placeholder="example@gmail.com"
                                />
                                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                            </div>

                            <!-- SĐT -->
                            <div class="mb-0">
                                <label for="userPhone" class="form-label fw-semibold">
                                    Số điện thoại <span class="text-danger">*</span>
                                </label>
                                <input
                                    id="userPhone"
                                    v-model="form.phone"
                                    type="tel"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.phone }"
                                    placeholder="0901234567"
                                    maxlength="10"
                                />
                                <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                            </div>

                        </div>
                    </div>

                    <!-- Mật khẩu -->
                    <div class="card border-0 shadow-sm rounded-3 mb-4">
                        <div class="card-header bg-white border-bottom py-3">
                            <h6 class="fw-semibold mb-0">
                                <i class="bi bi-lock me-2 text-warning"></i>Mật khẩu
                            </h6>
                        </div>
                        <div class="card-body p-4">

                            <!-- Password -->
                            <div class="mb-3">
                                <label for="userPass" class="form-label fw-semibold">
                                    Mật khẩu <span class="text-danger">*</span>
                                </label>
                                <div class="input-group" :class="{ 'has-validation': errors.password }">
                                    <input
                                        id="userPass"
                                        v-model="form.password"
                                        :type="showPass ? 'text' : 'password'"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.password }"
                                        placeholder="Nhập mật khẩu..."
                                    />
                                    <button type="button" class="btn btn-outline-secondary" @click="showPass = !showPass">
                                        <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                    <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
                                </div>
                                <div class="form-text">Ít nhất 6 ký tự.</div>
                            </div>

                            <!-- Confirm Password -->
                            <div class="mb-0">
                                <label for="userConfirm" class="form-label fw-semibold">
                                    Xác nhận mật khẩu <span class="text-danger">*</span>
                                </label>
                                <div class="input-group" :class="{ 'has-validation': errors.confirmPassword }">
                                    <input
                                        id="userConfirm"
                                        v-model="form.confirmPassword"
                                        :type="showConfirm ? 'text' : 'password'"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.confirmPassword }"
                                        placeholder="Nhập lại mật khẩu..."
                                    />
                                    <button type="button" class="btn btn-outline-secondary" @click="showConfirm = !showConfirm">
                                        <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                    <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Vai trò & Trạng thái -->
                    <div class="card border-0 shadow-sm rounded-3 mb-4">
                        <div class="card-header bg-white border-bottom py-3">
                            <h6 class="fw-semibold mb-0">
                                <i class="bi bi-gear me-2 text-secondary"></i>Cài đặt tài khoản
                            </h6>
                        </div>
                        <div class="card-body p-4">

                            <!-- Role -->
                            <div class="mb-3">
                                <label for="userRole" class="form-label fw-semibold">Vai trò</label>
                                <select id="userRole" v-model="form.role" class="form-select">
                                    <option value="user">Người dùng (User)</option>
                                    <option value="admin">Quản trị (Admin)</option>
                                </select>
                            </div>

                            <!-- Status -->
                            <div class="mb-0">
                                <label class="form-label fw-semibold">Trạng thái</label>
                                <div class="d-flex gap-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio"
                                            v-model="form.status" :value="true" id="stAddActive" />
                                        <label class="form-check-label" for="stAddActive">
                                            <span class="badge text-bg-success">Hoạt động</span>
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio"
                                            v-model="form.status" :value="false" id="stAddLocked" />
                                        <label class="form-check-label" for="stAddLocked">
                                            <span class="badge text-bg-secondary">Bị khóa</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="d-flex gap-2">
                        <RouterLink to="/userlist" class="btn btn-outline-secondary flex-fill">Hủy</RouterLink>
                        <button type="submit" class="btn btn-success flex-fill fw-semibold">
                            <i class="bi bi-check-lg me-1"></i> Lưu người dùng
                        </button>
                    </div>

                </form>
            </div>
        </div>

    </div>
</template>
