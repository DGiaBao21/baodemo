<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CategoryService } from '../../../services/category.service.js'

const route           = useRoute()
const router          = useRouter()
const categoryService = new CategoryService()

const form     = ref({ name: '', description: '', status: true, createdAt: '' })
const errors   = ref({})
const isLoading = ref(false)
const isFetching = ref(true)
const notFound = ref(false)

onMounted(async () => {
    try {
        const result = await categoryService.getById(route.params.id)
        if (result.status === 200) {
            const { name, description, status, createdAt } = result.data
            form.value = { name, description, status, createdAt: createdAt || '' }
        }
    } catch (e) {
        notFound.value = true
        console.error(e)
    } finally {
        isFetching.value = false
    }
})

function validate() {
    const errs = {}
    if (!form.value.name.trim())
        errs.name = 'Vui lòng nhập tên danh mục.'
    else if (form.value.name.trim().length < 2)
        errs.name = 'Tên danh mục phải ít nhất 2 ký tự.'
    if (!form.value.description.trim())
        errs.description = 'Vui lòng nhập mô tả.'
    errors.value = errs
    return Object.keys(errs).length === 0
}

const handleSubmit = async () => {
    if (!validate()) return
    isLoading.value = true
    try {
        const today = new Date().toISOString().split('T')[0]
        const result = await categoryService.update(route.params.id, {
            ...form.value,
            createdAt: today
        })
        if (result.status === 200) {
            router.push('/categorylist')
        }
    } catch (e) {
        console.error('Cập nhật thất bại', e)
    } finally {
        isLoading.value = false
    }
}

</script>

<template>
    <div class="p-4">

        <!-- Not found -->
        <div v-if="notFound" class="text-center py-5 text-muted">
            <i class="bi bi-tags fs-1 d-block mb-2"></i>
            <h5>Không tìm thấy danh mục</h5>
            <RouterLink to="/categorylist" class="btn btn-outline-secondary mt-2">
                <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
            </RouterLink>
        </div>

        <!-- Loading -->
        <div v-else-if="isFetching" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
        </div>

        <!-- Form -->
        <div v-else>

            <!-- Page Header -->
            <div class="d-flex align-items-center gap-3 mb-4">
                <RouterLink to="/categorylist" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-arrow-left"></i>
                </RouterLink>
                <div>
                    <h4 class="fw-bold mb-0">Chỉnh sửa danh mục</h4>
                    <p class="text-muted small mb-0">Cập nhật thông tin danh mục #{{ route.params.id }}</p>
                </div>
            </div>

            <!-- Form Card -->
            <div class="row justify-content-center">
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm rounded-3">
                        <div class="card-header bg-white border-bottom py-3">
                            <h6 class="fw-semibold mb-0">
                                <i class="bi bi-pencil-square me-2 text-warning"></i>Thông tin danh mục
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
                                            <input class="form-check-input" type="radio" v-model="form.status" :value="true" id="statusActive" />
                                            <label class="form-check-label" for="statusActive">
                                                <span class="badge text-bg-success">Hoạt động</span>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" v-model="form.status" :value="false" id="statusHidden" />
                                            <label class="form-check-label" for="statusHidden">
                                                <span class="badge text-bg-secondary">Ẩn</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="d-flex gap-2">
                                    <RouterLink to="/categorylist" class="btn btn-outline-secondary flex-fill">Hủy</RouterLink>
                                    <button type="submit" class="btn btn-warning flex-fill fw-semibold" :disabled="isLoading">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                        <i v-else class="bi bi-check-lg me-1"></i>
                                        {{ isLoading ? 'Đang lưu...' : 'Cập nhật' }}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
