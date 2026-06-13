<script setup>
import { ref } from 'vue'

// ─── Hệ thống thông báo (Toast System) ─────────────────────────
const toasts = ref([])
function showToast(message, type = 'success') {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
        removeToast(id)
    }, 3000)
}
function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
}

// ─── Dữ liệu Admin mẫu ─────────────────────────────────────────
const adminInfo = ref({
    name: 'Quản trị viên chính',
    email: 'admin@brewadmin.com',
    phone: '0901234567',
    role: 'SUPER ADMIN',
    bio: 'Chịu trách nhiệm quản lý toàn bộ hệ thống cửa hàng, thực đơn, doanh thu và vận hành của Brew Coffee Shop.',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZ-x8vy8u3RaZ0iF_cof4U3pTMPa54T_y6w&s',
    createdAt: '2025-01-01'
})

const form = ref({ ...adminInfo.value })
const errors = ref({})
const isEditing = ref(false)
const isSaving = ref(false)

function startEdit() {
    form.value = { ...adminInfo.value }
    errors.value = {}
    isEditing.value = true
}

function cancelEdit() {
    isEditing.value = false
    errors.value = {}
}

function validate() {
    const errs = {}
    if (!form.value.name.trim()) {
        errs.name = 'Họ và tên không được để trống.'
    } else if (form.value.name.trim().length < 2) {
        errs.name = 'Tên phải dài ít nhất 2 ký tự.'
    }

    if (!form.value.email.trim()) {
        errs.email = 'Email không được để trống.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errs.email = 'Định dạng email không hợp lệ.'
    }

    if (!form.value.phone.trim()) {
        errs.phone = 'Số điện thoại không được để trống.'
    } else if (!/^(0[3-9]\d{8})$/.test(form.value.phone)) {
        errs.phone = 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03-09).'
    }

    errors.value = errs
    return Object.keys(errs).length === 0
}

function handleSave() {
    if (!validate()) {
        showToast('Vui lòng kiểm tra lại các thông tin lỗi!', 'danger')
        return
    }
    
    isSaving.value = true
    showToast('Đang lưu thông tin cá nhân...', 'info')

    // Mô phỏng gọi API lưu
    setTimeout(() => {
        adminInfo.value = { ...form.value }
        isEditing.value = false
        isSaving.value = false
        showToast('Cập nhật thông tin cá nhân thành công!', 'success')
    }, 1000)
}
</script>

<template>
    <div class="p-4 bg-light min-vh-100">
        
        <!-- Thông báo Toast tùy chỉnh -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 2100;">
            <transition-group name="toast-anim">
                <div 
                    v-for="t in toasts" 
                    :key="t.id" 
                    class="toast show border-0 shadow-lg mb-2" 
                    role="alert"
                    style="border-radius: 12px; overflow: hidden;"
                >
                    <div class="d-flex align-items-center p-3 text-white bg-dark">
                        <i class="bi me-2 fs-5 text-success bi-check-circle-fill"></i>
                        <div class="toast-body p-0 fw-semibold small">{{ t.message }}</div>
                        <button type="button" class="btn-close btn-close-white ms-auto" @click="removeToast(t.id)"></button>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Tiêu đề trang -->
        <div class="mb-4">
            <h4 class="fw-bold mb-1 text-dark">Thông tin cá nhân</h4>
            <p class="text-muted small mb-0">Quản lý hồ sơ và thông tin liên hệ của Quản trị viên hệ thống</p>
        </div>

        <div class="row g-4">
            <!-- Cột trái: Thẻ tóm tắt thông tin và ảnh đại diện -->
            <div class="col-12 col-lg-4">
                <div class="card border-0 shadow-sm rounded-3 text-center p-4 bg-white">
                    <div class="position-relative d-inline-block mx-auto mb-3">
                        <!-- Khung hình đại diện tròn dùng hoàn toàn class Bootstrap 5 -->
                        <div class="rounded-circle border border-warning border-3 p-1 shadow-sm d-inline-block" style="width: 126px; height: 126px;">
                            <img :src="adminInfo.avatar" alt="Admin Avatar" class="w-100 h-100 rounded-circle object-fit-cover" />
                        </div>
                        <span class="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2 shadow border border-2 border-white d-flex align-items-center justify-content-center cursor-pointer" style="width: 34px; height: 34px;" title="Thay ảnh đại diện">
                            <i class="bi bi-camera-fill" style="font-size: 13px;"></i>
                        </span>
                    </div>

                    <h5 class="fw-bold text-dark mb-1">{{ adminInfo.name }}</h5>
                    <div class="mb-3">
                        <span class="badge bg-warning bg-opacity-25 text-warning border border-warning-subtle rounded-pill px-3 py-1 font-monospace" style="font-size: 10px; letter-spacing: 0.5px;">{{ adminInfo.role }}</span>
                    </div>

                    <p class="text-secondary small px-2 mb-4">{{ adminInfo.bio }}</p>

                    <div class="border-top pt-3 text-start small">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Ngày gia nhập:</span>
                            <span class="fw-bold text-dark font-monospace">{{ adminInfo.createdAt }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted">Trạng thái hệ thống:</span>
                            <span class="fw-bold text-success"><i class="bi bi-check-circle-fill me-1"></i>Đang hoạt động</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cột phải: Biểu mẫu chỉnh sửa thông tin chi tiết -->
            <div class="col-12 col-lg-8">
                <div class="card border-0 shadow-sm rounded-3 bg-white p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h5 class="fw-bold mb-0 text-dark">
                            <i class="bi bi-person-lines-fill me-2 text-warning"></i>Chi tiết hồ sơ cá nhân
                        </h5>
                        <button v-if="!isEditing" class="btn btn-dark btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2" @click="startEdit">
                            <i class="bi bi-pencil-square"></i>
                            <span>Chỉnh sửa hồ sơ</span>
                        </button>
                    </div>

                    <!-- Chế độ Xem thông tin (View Mode) -->
                    <div v-if="!isEditing" class="row g-4 pt-2">
                        <div class="col-12 col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Họ và tên</label>
                            <p class="fw-bold text-dark fs-6 mb-0">{{ adminInfo.name }}</p>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Địa chỉ Email</label>
                            <p class="fw-bold text-dark font-monospace fs-6 mb-0">{{ adminInfo.email }}</p>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Số điện thoại</label>
                            <p class="fw-bold text-dark font-monospace fs-6 mb-0">{{ adminInfo.phone }}</p>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label text-muted small fw-bold text-uppercase">Vai trò tài khoản</label>
                            <p class="fw-bold text-dark fs-6 mb-0">{{ adminInfo.role }}</p>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-muted small fw-bold text-uppercase">Mô tả / Giới thiệu</label>
                            <p class="text-secondary lh-relaxed small mb-0">{{ adminInfo.bio }}</p>
                        </div>
                    </div>

                    <!-- Chế độ Chỉnh sửa thông tin (Edit Mode) -->
                    <form v-else @submit.prevent="handleSave" novalidate>
                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <label for="admName" class="form-label fw-bold text-dark small">Họ và tên <span class="text-danger">*</span></label>
                                <input 
                                    id="admName"
                                    v-model="form.name"
                                    type="text" 
                                    class="form-control bg-light border-0 py-2"
                                    :class="{ 'is-invalid': errors.name }"
                                    placeholder="Nhập họ và tên..."
                                />
                                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <label for="admEmail" class="form-label fw-bold text-dark small">Địa chỉ Email <span class="text-danger">*</span></label>
                                <input 
                                    id="admEmail"
                                    v-model="form.email"
                                    type="email" 
                                    class="form-control bg-light border-0 py-2 font-monospace"
                                    :class="{ 'is-invalid': errors.email }"
                                    placeholder="example@gmail.com"
                                />
                                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="admPhone" class="form-label fw-bold text-dark small">Số điện thoại <span class="text-danger">*</span></label>
                                <input 
                                    id="admPhone"
                                    v-model="form.phone"
                                    type="tel" 
                                    class="form-control bg-light border-0 py-2 font-monospace"
                                    :class="{ 'is-invalid': errors.phone }"
                                    placeholder="Nhập số điện thoại..."
                                    maxlength="10"
                                />
                                <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                            </div>

                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold text-dark small">Vai trò</label>
                                <input 
                                    type="text" 
                                    class="form-control bg-light border-0 py-2 text-muted" 
                                    :value="form.role" 
                                    readonly 
                                />
                                <div class="form-text" style="font-size: 11px;">Vai trò hệ thống được cố định cho tài khoản quản trị.</div>
                            </div>

                            <div class="col-12">
                                <label for="admBio" class="form-label fw-bold text-dark small">Mô tả / Giới thiệu</label>
                                <textarea 
                                    id="admBio"
                                    v-model="form.bio"
                                    class="form-control bg-light border-0 py-2" 
                                    rows="4" 
                                    placeholder="Viết một chút giới thiệu về nhiệm vụ của bạn..."
                                ></textarea>
                            </div>
                        </div>

                        <!-- Nút hành động trong form -->
                        <div class="d-flex gap-2 mt-4 pt-3 border-top justify-content-end">
                            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" style="border: 1px solid #ddd; background: #fff;" @click="cancelEdit" :disabled="isSaving">
                                Hủy bỏ
                            </button>
                            <button type="submit" class="btn btn-dark rounded-pill px-4 fw-bold" :disabled="isSaving">
                                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                <i v-else class="bi bi-check-circle me-1"></i>
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

/* Hoạt ảnh Toast */
.toast-anim-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-anim-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.toast-anim-enter-from {
    transform: translateY(12px) scale(0.9);
    opacity: 0;
}
.toast-anim-leave-to {
    transform: translateX(100px);
    opacity: 0;
}
</style>
