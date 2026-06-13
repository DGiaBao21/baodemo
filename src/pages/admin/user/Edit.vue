<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()

const mockUsers = [
    { id: 1, name: 'Nguyễn Văn An',  email: 'an.nguyen@gmail.com',  phone: '0901234567', role: 'admin', status: true  },
    { id: 2, name: 'Trần Thị Bình',  email: 'binh.tran@gmail.com',  phone: '0912345678', role: 'user',  status: true  },
    { id: 3, name: 'Lê Hoàng Cường', email: 'cuong.le@gmail.com',   phone: '0923456789', role: 'user',  status: false },
    { id: 4, name: 'Phạm Thị Dung',  email: 'dung.pham@gmail.com',  phone: '0934567890', role: 'user',  status: true  },
    { id: 5, name: 'Hoàng Văn Em',   email: 'em.hoang@gmail.com',   phone: '0945678901', role: 'user',  status: true  },
    { id: 6, name: 'Ngô Thị Phương', email: 'phuong.ngo@gmail.com', phone: '0956789012', role: 'admin', status: true  },
    { id: 7, name: 'Đặng Minh Quân', email: 'quan.dang@gmail.com',  phone: '0967890123', role: 'user',  status: false },
    { id: 8, name: 'Vũ Thị Hoa',     email: 'hoa.vu@gmail.com',     phone: '0978901234', role: 'user',  status: true  },
]

const form     = ref({ name: '', email: '', phone: '', role: 'user', status: true })
const errors   = ref({})
const loading  = ref(true)
const notFound = ref(false)

onMounted(() => {
    const id   = Number(route.params.id)
    const user = mockUsers.find(u => u.id === id)
    if (!user) { notFound.value = true; loading.value = false; return }
    form.value  = { ...user }
    loading.value = false
})

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

    errors.value = errs
    return Object.keys(errs).length === 0
}

function handleSubmit() {
    if (!validate()) return
    // TODO: gọi API PUT /api/admin/users/:id
    console.log('Cập nhật người dùng:', form.value)
    alert('Cập nhật người dùng thành công!')
    router.push('/userlist')
}
</script>

<template>
    <div class="p-4">

        <!-- Not found -->
        <div v-if="notFound" class="text-center py-5">
            <i class="bi bi-person-x fs-1 text-muted d-block mb-2"></i>
            <h5 class="text-muted">Không tìm thấy người dùng</h5>
            <RouterLink to="/userlist" class="btn btn-outline-secondary mt-2">
                <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
            </RouterLink>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="d-flex justify-content-center py-5">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <!-- Form -->
        <div v-else>
            <!-- Page Header -->
            <div class="d-flex align-items-center gap-3 mb-4">
                <RouterLink to="/userlist" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-arrow-left"></i>
                </RouterLink>
                <div>
                    <h4 class="fw-bold mb-0">Chỉnh sửa người dùng</h4>
                    <p class="text-muted small mb-0">Cập nhật thông tin tài khoản #{{ route.params.id }}</p>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-7">
                    <form @submit.prevent="handleSubmit" novalidate>

                        <!-- Thông tin cơ bản -->
                        <div class="card border-0 shadow-sm rounded-3 mb-4">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="fw-semibold mb-0">
                                    <i class="bi bi-pencil-square me-2 text-warning"></i>Thông tin cơ bản
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

                        <!-- Cài đặt tài khoản -->
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
                                                v-model="form.status" :value="true" id="stEditActive" />
                                            <label class="form-check-label" for="stEditActive">
                                                <span class="badge text-bg-success">Hoạt động</span>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio"
                                                v-model="form.status" :value="false" id="stEditLocked" />
                                            <label class="form-check-label" for="stEditLocked">
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
                            <button type="submit" class="btn btn-warning flex-fill fw-semibold">
                                <i class="bi bi-check-lg me-1"></i> Cập nhật
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
