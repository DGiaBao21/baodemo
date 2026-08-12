<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { currentUser, isLoggedIn, logout } from '../../composables/auth.js'
import { UserService } from '../../services/user.service.js'

const router      = useRouter()
const userService = new UserService()

const isLoading = ref(true)
const editing   = ref(false)
const success   = ref(false)
const errors    = ref({})
const isSaving  = ref(false)

const user = ref(null)
const form = ref({})

// ── Cloudinary config ─────────────────────────────────────────
const CLOUD_NAME    = 'docms9p9h'   // cloud name
const UPLOAD_PRESET = 'baohehe'     // unsigned preset đã tạo sẵn

// ── Upload avatar ─────────────────────────────────────────────
const avatarInput    = ref(null)        // ref đến <input type="file">
const isUploadingAvatar = ref(false)
const avatarPreview  = ref(null)        // URL preview tạm thời (base64)
const avatarUploadError = ref('')

function openAvatarPicker() {
    avatarInput.value?.click()
}

async function onAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra loại + kích thước (tối đa 2MB)
    if (!file.type.startsWith('image/')) {
        avatarUploadError.value = 'Chỉ được chọn file ảnh (jpg, png, webp...).'
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        avatarUploadError.value = 'Ảnh không được lớn hơn 2MB.'
        return
    }
    avatarUploadError.value = ''

    // Preview ngay lập tức
    const reader = new FileReader()
    reader.onload = ev => { avatarPreview.value = ev.target.result }
    reader.readAsDataURL(file)

    // Upload lên Cloudinary
    isUploadingAvatar.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('folder', 'avatars')

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: 'POST', body: formData }
        )
        const data = await res.json()

        if (data.secure_url) {
            // Lưu URL mới vào form & user ngay
            form.value.avatar  = data.secure_url
            user.value.avatar  = data.secure_url
            avatarPreview.value = null

            // Lưu avatar lên API luôn
            await userService.patch(user.value.id, { avatar: data.secure_url })
        } else {
            throw new Error(data.error?.message || 'Upload thất bại')
        }
    } catch (err) {
        avatarUploadError.value = 'Upload ảnh thất bại: ' + (err.message || 'Lỗi không xác định')
        avatarPreview.value = null
    } finally {
        isUploadingAvatar.value = false
        // reset input để có thể chọn lại cùng file
        if (avatarInput.value) avatarInput.value.value = ''
    }
}

// ── Load user ─────────────────────────────────────────────────
onMounted(async () => {
    if (!isLoggedIn.value || !currentUser.value?.id) {
        router.push('/login')
        return
    }
    try {
        const res = await userService.getById(currentUser.value.id)
        user.value = res.status === 200 ? res.data : { ...currentUser.value }
    } catch {
        user.value = { ...currentUser.value }
    } finally {
        isLoading.value = false
    }
})

// ── Chỉnh sửa thông tin ───────────────────────────────────────
function startEdit() {
    form.value = { ...user.value }
    editing.value = true
    success.value = false
    avatarUploadError.value = ''
}
function cancelEdit() {
    editing.value = false
    errors.value = {}
    avatarPreview.value = null
    avatarUploadError.value = ''
}

function validate() {
    const errs = {}
    if (!form.value.name?.trim())  errs.name  = 'Vui lòng nhập họ và tên.'
    if (!form.value.email?.trim()) errs.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
        errs.email = 'Email không hợp lệ.'
    if (form.value.phone && !/^(0[3-9]\d{8})$/.test(form.value.phone))
        errs.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu 03–09).'
    errors.value = errs
    return Object.keys(errs).length === 0
}

async function handleSave() {
    if (!validate()) return
    isSaving.value = true
    try {
        const res = await userService.update(user.value.id, { ...user.value, ...form.value })
        if (res.status === 200) {
            user.value    = res.data
            editing.value = false
            success.value = true
        }
    } catch {
        errors.value.general = 'Cập nhật thất bại. Vui lòng thử lại.'
    } finally {
        isSaving.value = false
    }
}

// ── Đăng xuất ─────────────────────────────────────────────────
function handleLogout() {
    logout()
    router.push('/login')
}

const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : '—'
const roleLabel  = r => ({ admin: 'Quản trị viên', staff: 'Nhân viên', user: 'Thành viên' }[r] || r)
const roleColor  = r => ({ admin: 'danger', staff: 'warning', user: 'primary' }[r] || 'secondary')
</script>

<template>
    <div class="container py-5" style="max-width:760px">

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="card border-0 shadow-sm rounded-4 p-4">
            <div class="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                <div class="skeleton rounded-circle" style="width:80px;height:80px;flex-shrink:0"></div>
                <div class="flex-fill">
                    <div class="skeleton mb-2" style="height:20px;width:50%;border-radius:6px"></div>
                    <div class="skeleton" style="height:14px;width:70%;border-radius:6px"></div>
                </div>
            </div>
            <div class="row g-3">
                <div v-for="n in 4" :key="n" class="col-sm-6">
                    <div class="skeleton mb-1" style="height:12px;width:40%;border-radius:4px"></div>
                    <div class="skeleton" style="height:18px;border-radius:6px"></div>
                </div>
            </div>
        </div>

        <template v-else>
            <h4 class="fw-bold mb-1">Thông tin cá nhân</h4>
            <p class="text-muted small mb-4">Quản lý thông tin tài khoản của bạn</p>

            <!-- Alert thành công -->
            <div v-if="success" class="alert alert-success alert-dismissible d-flex align-items-center gap-2" role="alert">
                <i class="bi bi-check-circle-fill"></i>
                Cập nhật thông tin thành công!
                <button type="button" class="btn-close" @click="success = false"></button>
            </div>

            <!-- Alert lỗi chung -->
            <div v-if="errors.general" class="alert alert-danger d-flex align-items-center gap-2">
                <i class="bi bi-exclamation-triangle-fill"></i>
                {{ errors.general }}
            </div>

            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4">

                    <!-- === CHẾ ĐỘ XEM === -->
                    <div v-if="!editing">

                        <!-- Avatar + upload -->
                        <div class="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">

                            <!-- Khu vực avatar có nút camera -->
                            <div class="avatar-zone flex-shrink-0">
                                <!-- Input file ẩn -->
                                <input
                                    ref="avatarInput"
                                    type="file"
                                    accept="image/*"
                                    class="d-none"
                                    @change="onAvatarChange"
                                />
                                <!-- Avatar hiển thị -->
                                <div class="avatar-ring" @click="openAvatarPicker" title="Nhấn để thay ảnh đại diện">
                                    <!-- Đang upload: spinner overlay -->
                                    <div v-if="isUploadingAvatar" class="avatar-spinner">
                                        <div class="spinner-border text-white" style="width:28px;height:28px"></div>
                                    </div>
                                    <!-- Preview tạm (base64) -->
                                    <img v-else-if="avatarPreview" :src="avatarPreview"
                                        class="avatar-img" alt="Preview" />
                                    <!-- Ảnh thật từ API -->
                                    <img v-else-if="user?.avatar" :src="user.avatar"
                                        class="avatar-img" :alt="user.name" />
                                    <!-- Placeholder -->
                                    <div v-else class="avatar-placeholder">
                                        <i class="bi bi-person-fill fs-1"></i>
                                    </div>
                                    <!-- Icon camera hover -->
                                    <div class="avatar-camera-overlay">
                                        <i class="bi bi-camera-fill"></i>
                                        <span>Đổi ảnh</span>
                                    </div>
                                </div>
                                <!-- Lỗi upload -->
                                <p v-if="avatarUploadError" class="text-danger small mt-1 text-center" style="max-width:100px">
                                    {{ avatarUploadError }}
                                </p>
                            </div>

                            <div class="flex-fill">
                                <h5 class="fw-bold mb-1">{{ user?.name }}</h5>
                                <p class="text-muted small mb-1">{{ user?.email }}</p>
                                <span :class="`badge text-bg-${roleColor(user?.role)}`">
                                    {{ roleLabel(user?.role) }}
                                </span>
                                <p class="text-muted small mt-2 mb-0">
                                    <i class="bi bi-camera me-1"></i>
                                    Nhấn vào ảnh để thay đổi ảnh đại diện
                                </p>
                            </div>
                            <button class="btn btn-outline-secondary btn-sm align-self-start" @click="startEdit">
                                <i class="bi bi-pencil me-1"></i> Chỉnh sửa
                            </button>
                        </div>

                        <!-- Thông tin chi tiết -->
                        <div class="row g-3">
                            <div class="col-sm-6">
                                <label class="info-label">Họ và tên</label>
                                <p class="info-value">{{ user?.name || '—' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <label class="info-label">Email</label>
                                <p class="info-value">{{ user?.email || '—' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <label class="info-label">Số điện thoại</label>
                                <p class="info-value">{{ user?.phone || '—' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <label class="info-label">Ngày tham gia</label>
                                <p class="info-value">{{ formatDate(user?.createdAt) }}</p>
                            </div>
                            <div class="col-12">
                                <label class="info-label">Địa chỉ</label>
                                <p class="info-value">{{ user?.address || '—' }}</p>
                            </div>
                        </div>

                        <hr class="my-4" />

                        <div class="d-flex gap-2 flex-wrap">
                            <RouterLink to="/my-comments" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-chat-dots me-1"></i> Bình luận của tôi
                            </RouterLink>
                            <button class="btn btn-outline-danger btn-sm ms-auto" @click="handleLogout">
                                <i class="bi bi-box-arrow-left me-1"></i> Đăng xuất
                            </button>
                        </div>
                    </div>

                    <!-- === FORM CHỈNH SỬA === -->
                    <form v-else @submit.prevent="handleSave" novalidate>

                        <!-- Avatar trong form edit -->
                        <div class="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
                            <input ref="avatarInput" type="file" accept="image/*"
                                class="d-none" @change="onAvatarChange" />
                            <div class="avatar-ring" @click="openAvatarPicker" title="Nhấn để thay ảnh">
                                <div v-if="isUploadingAvatar" class="avatar-spinner">
                                    <div class="spinner-border text-white" style="width:28px;height:28px"></div>
                                </div>
                                <img v-else-if="avatarPreview || form.avatar"
                                    :src="avatarPreview || form.avatar"
                                    class="avatar-img" alt="Avatar" />
                                <div v-else class="avatar-placeholder">
                                    <i class="bi bi-person-fill fs-1"></i>
                                </div>
                                <div class="avatar-camera-overlay">
                                    <i class="bi bi-camera-fill"></i>
                                    <span>Đổi ảnh</span>
                                </div>
                            </div>
                            <div>
                                <p class="fw-semibold mb-1 small">Ảnh đại diện</p>
                                <p class="text-muted mb-1" style="font-size:12px">
                                    Nhấn vào ảnh hoặc <button type="button" class="btn btn-link p-0 small"
                                        style="font-size:12px" @click="openAvatarPicker">chọn file</button>
                                </p>
                                <p class="text-muted mb-0" style="font-size:11px">JPG, PNG, WEBP — tối đa 2MB</p>
                                <p v-if="avatarUploadError" class="text-danger mb-0" style="font-size:12px">
                                    {{ avatarUploadError }}
                                </p>
                            </div>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-sm-6">
                                <label for="profName" class="form-label fw-semibold">
                                    Họ và tên <span class="text-danger">*</span>
                                </label>
                                <input id="profName" v-model="form.name" type="text"
                                    class="form-control" :class="{ 'is-invalid': errors.name }"
                                    placeholder="Nhập họ và tên..." />
                                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                            </div>

                            <div class="col-sm-6">
                                <label for="profEmail" class="form-label fw-semibold">
                                    Email <span class="text-danger">*</span>
                                </label>
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
                                <label for="profAddress" class="form-label fw-semibold">Địa chỉ</label>
                                <input id="profAddress" v-model="form.address" type="text"
                                    class="form-control" placeholder="Nhập địa chỉ..." />
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">Hủy</button>
                            <button type="submit" class="btn btn-dark fw-semibold px-4" :disabled="isSaving || isUploadingAvatar">
                                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-check-lg me-1"></i>
                                {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
/* ── Avatar zone ─────────────────────────────────── */
.avatar-zone { position: relative; }

.avatar-ring {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 3px solid #e8eaf6;
    background: #f0f0f0;
    transition: border-color .25s;
    flex-shrink: 0;
}
.avatar-ring:hover { border-color: #6c63ff; }

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.avatar-spinner {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

/* Camera overlay hiện khi hover */
.avatar-camera-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 13px;
    gap: 3px;
    opacity: 0;
    transition: opacity .2s;
}
.avatar-ring:hover .avatar-camera-overlay { opacity: 1; }
.avatar-camera-overlay i { font-size: 20px; }

/* ── Info labels ─────────────────────────────────── */
.info-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: #999;
    margin-bottom: 4px;
}
.info-value { font-weight: 600; color: #222; margin: 0; font-size: 15px; }

/* ── Skeleton ────────────────────────────────────── */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>
