<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
    name: '',
    description: '',
    status: true,
})

const errors = ref({})

function validate() {
    const errs = {}
    if (!form.value.name.trim()) {
        errs.name = 'Vui lòng nhập tên danh mục.'
    } else if (form.value.name.trim().length < 2) {
        errs.name = 'Tên danh mục phải ít nhất 2 ký tự.'
    }
    if (!form.value.description.trim()) {
        errs.description = 'Vui lòng nhập mô tả.'
    }
    errors.value = errs
    return Object.keys(errs).length === 0
}

function handleSubmit() {
    if (!validate()) return
    // TODO: gọi API POST /api/admin/categories
    console.log('Thêm danh mục:', form.value)
    alert('Thêm danh mục thành công!')
    router.push('/categorylist')
}
</script>

<template>
    <div class="p-4">

        <!-- Page Header -->
        <div class="d-flex align-items-center gap-3 mb-4">
            <RouterLink to="/categorylist" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i>
            </RouterLink>
            <div>
                <h4 class="fw-bold mb-0">Thêm danh mục</h4>
                <p class="text-muted small mb-0">Tạo danh mục sản phẩm mới</p>
            </div>
        </div>

        <!-- Form Card -->
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="card border-0 shadow-sm rounded-3">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="fw-semibold mb-0">
                            <i class="bi bi-tags me-2 text-success"></i>Thông tin danh mục
                        </h6>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="handleSubmit" novalidate>

                            <!-- Tên danh mục -->
                            <div class="mb-3">
                                <label for="catName" class="form-label fw-semibold">
                                    Tên danh mục <span class="text-danger">*</span>
                                </label>
                                <input
                                    id="catName"
                                    v-model="form.name"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.name }"
                                    placeholder="Nhập tên danh mục..."
                                    maxlength="100"
                                />
                                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                                <div class="text-muted small mt-1">{{ form.name.length }}/100 ký tự</div>
                            </div>

                            <!-- Mô tả -->
                            <div class="mb-3">
                                <label for="catDesc" class="form-label fw-semibold">
                                    Mô tả <span class="text-danger">*</span>
                                </label>
                                <textarea
                                    id="catDesc"
                                    v-model="form.description"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.description }"
                                    rows="3"
                                    placeholder="Nhập mô tả danh mục..."
                                ></textarea>
                                <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                            </div>

                            <!-- Trạng thái -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold">Trạng thái</label>
                                <div class="d-flex gap-3">
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            v-model="form.status"
                                            :value="true"
                                            id="statusActive"
                                        />
                                        <label class="form-check-label" for="statusActive">
                                            <span class="badge text-bg-success">Hoạt động</span>
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            v-model="form.status"
                                            :value="false"
                                            id="statusHidden"
                                        />
                                        <label class="form-check-label" for="statusHidden">
                                            <span class="badge text-bg-secondary">Ẩn</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="d-flex gap-2">
                                <RouterLink to="/categorylist" class="btn btn-outline-secondary flex-fill">
                                    Hủy
                                </RouterLink>
                                <button type="submit" class="btn btn-success flex-fill fw-semibold">
                                    <i class="bi bi-check-lg me-1"></i> Lưu danh mục
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>