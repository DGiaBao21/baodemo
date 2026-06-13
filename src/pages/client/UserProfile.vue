<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Mock — thay bằng user từ store/API
const user = ref({
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0901234567',
    bio: 'Yêu thích cà phê, lập trình và khám phá ẩm thực.',
})

const form    = ref({ ...user.value })
const errors  = ref({})
const editing = ref(false)
const success  = ref(false)

function startEdit() { form.value = { ...user.value }; editing.value = true; success.value = false }
function cancelEdit() { editing.value = false; errors.value = {} }

function validate() {
    const errs = {}
    if (!form.value.name.trim()) errs.name = 'Vui lòng nhập họ và tên.'
    if (!form.value.email.trim()) errs.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errs.email = 'Email không hợp lệ.'
    if (form.value.phone && !/^(0[3-9]\d{8})$/.test(form.value.phone)) errs.phone = 'Số điện thoại không hợp lệ.'
    errors.value = errs
    return Object.keys(errs).length === 0
}

function handleSave() {
    if (!validate()) return
    user.value = { ...form.value }
    editing.value = false
    success.value = true
    // TODO: gọi API PUT /api/user/profile
}
</script>

<template>
    <div class="container py-5" style="max-width:720px">

        <h4 class="fw-bold mb-1">Thông tin cá nhân</h4>
        <p class="text-muted small mb-4">Quản lý thông tin tài khoản của bạn</p>

        <!-- Thông báo thành công -->
        <div v-if="success" class="alert alert-success alert-dismissible d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-check-circle-fill"></i>
            Cập nhật thông tin thành công!
            <button type="button" class="btn-close" @click="success = false"></button>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">

                <!-- Ảnh đại diện + tên (chế độ xem) -->
                <div v-if="!editing" class="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                    <div class="rounded-circle bg-dark d-flex align-items-center justify-content-center flex-shrink-0"
                        style="width:72px;height:72px">
                        <i class="bi bi-person-fill text-white fs-2"></i>
                    </div>
                    <div>
                        <h5 class="fw-bold mb-1">{{ user.name }}</h5>
                        <p class="text-muted small mb-0">{{ user.email }}</p>
                    </div>
                    <button class="btn btn-outline-secondary btn-sm ms-auto" @click="startEdit">
                        <i class="bi bi-pencil me-1"></i> Chỉnh sửa
                    </button>
                </div>

                <!-- Các dòng thông tin (chế độ xem) -->
                <div v-if="!editing">
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label class="form-label text-muted small fw-semibold text-uppercase">Họ và tên</label>
                            <p class="fw-semibold mb-0">{{ user.name }}</p>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label text-muted small fw-semibold text-uppercase">Email</label>
                            <p class="fw-semibold mb-0">{{ user.email }}</p>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label text-muted small fw-semibold text-uppercase">Số điện thoại</label>
                            <p class="fw-semibold mb-0">{{ user.phone || '—' }}</p>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-muted small fw-semibold text-uppercase">Giới thiệu</label>
                            <p class="mb-0 text-secondary">{{ user.bio || '—' }}</p>
                        </div>
                    </div>

                    <hr class="my-4" />

                    <div class="d-flex gap-2 flex-wrap">
                        <RouterLink to="/my-comments" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-chat-dots me-1"></i> Bình luận của tôi
                        </RouterLink>
                        <RouterLink to="/login" class="btn btn-outline-danger btn-sm">
                            <i class="bi bi-box-arrow-left me-1"></i> Đăng xuất
                        </RouterLink>
                    </div>
                </div>

                <!-- Biểu mẫu chỉnh sửa (Edit form) -->
                <form v-else @submit.prevent="handleSave" novalidate>
                    <div class="row g-3 mb-4">

                        <div class="col-sm-6">
                            <label for="profName" class="form-label fw-semibold">Họ và tên <span class="text-danger">*</span></label>
                            <input id="profName" v-model="form.name" type="text"
                                class="form-control" :class="{ 'is-invalid': errors.name }"
                                placeholder="Nhập họ và tên..." />
                            <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="profEmail" class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                            <input id="profEmail" v-model="form.email" type="email"
                                class="form-control" :class="{ 'is-invalid': errors.email }"
                                placeholder="example@gmail.com" />
                            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="profPhone" class="form-label fw-semibold">Số điện thoại</label>
                            <input id="profPhone" v-model="form.phone" type="tel"
                                class="form-control" :class="{ 'is-invalid': errors.phone }"
                                placeholder="0901234567" maxlength="10" />
                            <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                        </div>

                        <div class="col-12">
                            <label for="profBio" class="form-label fw-semibold">Giới thiệu</label>
                            <textarea id="profBio" v-model="form.bio" class="form-control"
                                rows="3" placeholder="Viết vài dòng về bản thân..."></textarea>
                        </div>

                    </div>

                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">Hủy</button>
                        <button type="submit" class="btn btn-dark fw-semibold px-4">
                            <i class="bi bi-check-lg me-1"></i> Lưu thay đổi
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>
