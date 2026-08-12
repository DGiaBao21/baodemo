<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProductService }  from '../../../services/product.service.js'
import { CategoryService } from '../../../services/category.service.js'

const route           = useRoute()
const router          = useRouter()
const productService  = new ProductService()
const categoryService = new CategoryService()

const categoryOptions = ref([])

// ─── Toast System ─────────────────────────────────────────────
const toasts = ref([])
function showToast(message, type = 'success') {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => { removeToast(id) }, 3000)
}
function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
}

const form       = ref({ name: '', category: '', price: '', description: '', image: '', status: true, sales: 0, revenue: 0 })
const errors     = ref({})
const previewUrl = ref('')
const loading    = ref(true)
const isLoading  = ref(false)
const notFound   = ref(false)

const customSizes     = ref(['M', 'L'])
const customSweetness = ref(['100%', '70%', '50%', 'Không đường'])
const customIce       = ref(['100%', '70%', '50%', 'Không đá'])

onMounted(async () => {
    try {
        // Load category và product song song, không để 1 lỗi chặn cả 2
        const [catRes, prodRes] = await Promise.allSettled([
            categoryService.list(),
            productService.getById(route.params.id)
        ])

        if (catRes.status === 'fulfilled' && catRes.value.status === 200) {
            categoryOptions.value = catRes.value.data
        }

        if (prodRes.status === 'fulfilled' && prodRes.value.status === 200) {
            const p = prodRes.value.data
            form.value = {
                name:        p.name        || '',
                category:    p.category    || '',
                categoryId:  p.categoryId  || '',
                price:       p.price       ?? '',
                description: p.description || '',
                image:       p.image       || '',
                status:      p.status      ?? true,
                rating:      p.rating      ?? 0,
                reviews:     p.reviews     ?? 0,
                sales:       p.sales       ?? 0,
                revenue:     p.revenue     ?? 0,
                createdAt:   p.createdAt   || ''
            }
            previewUrl.value = p.image || ''
        } else {
            notFound.value = true
        }
    } catch (e) {
        notFound.value = true
        console.error('Lỗi tải dữ liệu sản phẩm:', e)
    } finally {
        loading.value = false
    }
})

function handleImageInput(e) {
    form.value.image = e.target.value
    previewUrl.value  = e.target.value
}

const formatPrice = (n) => {
    if (n === undefined || n === null) return '0đ'
    return Number(n).toLocaleString('vi-VN') + 'đ'
}

function validate() {

    const errs = {}
    if (!form.value.name.trim())
        errs.name = 'Vui lòng nhập tên sản phẩm.'
    else if (form.value.name.trim().length < 2)
        errs.name = 'Tên phải ít nhất 2 ký tự.'

    if (!form.value.category)
        errs.category = 'Vui lòng chọn danh mục.'

    if (form.value.price === '' || form.value.price === null)
        errs.price = 'Vui lòng nhập giá bán.'
    else if (isNaN(Number(form.value.price)) || Number(form.value.price) < 0)
        errs.price = 'Giá tiền không hợp lệ.'

    if (!form.value.description.trim())
        errs.description = 'Vui lòng nhập mô tả chi tiết sản phẩm.'

    errors.value = errs
    return Object.keys(errs).length === 0
}

const handleSubmit = async () => {
    if (!validate()) {
        showToast('Vui lòng kiểm tra lại thông tin biểu mẫu!', 'danger')
        return
    }
    isLoading.value = true
    try {
        const today  = new Date().toISOString().split('T')[0]
        const payload = { ...form.value, price: Number(form.value.price), createdAt: today }
        const result  = await productService.update(route.params.id, payload)
        if (result.status === 200) {
            showToast('Cập nhật sản phẩm thành công!', 'success')
            setTimeout(() => router.push('/productlist'), 1200)
        }
    } catch (e) {
        showToast('Cập nhật thất bại. Vui lòng thử lại!', 'danger')
        console.error(e)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="p-4 bg-light min-vh-100">

        <!-- Custom Toast Notifications -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 2100;">
            <transition-group name="toast-anim">
                <div 
                    v-for="t in toasts" 
                    :key="t.id" 
                    class="toast show border-0 shadow-lg mb-2" 
                    role="alert"
                    style="border-radius: 12px; overflow: hidden;"
                >
                    <div class="d-flex align-items-center p-3" :class="t.type === 'warning' ? 'bg-warning text-dark' : t.type === 'danger' ? 'bg-danger text-white' : t.type === 'info' ? 'bg-info text-white' : 'bg-dark text-white'">
                        <i class="bi me-2 fs-5" :class="t.type === 'warning' ? 'bi-exclamation-circle-fill' : t.type === 'danger' ? 'bi-x-circle-fill' : t.type === 'info' ? 'bi-info-circle-fill' : 'bi-check-circle-fill text-success'"></i>
                        <div class="toast-body p-0 fw-semibold text-break small">{{ t.message }}</div>
                        <button type="button" class="btn-close ms-auto" :class="t.type === 'warning' ? '' : 'btn-close-white'" @click="removeToast(t.id)"></button>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Not found state -->
        <div v-if="notFound" class="text-center py-5">
            <i class="bi bi-box-seam fs-1 text-muted d-block mb-3"></i>
            <h5 class="text-muted fw-bold">Không tìm thấy sản phẩm yêu cầu</h5>
            <RouterLink to="/productlist" class="btn btn-dark mt-3 fw-semibold">
                <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách sản phẩm
            </RouterLink>
        </div>

        <!-- Loading spinner state -->
        <div v-else-if="loading" class="d-flex justify-content-center align-items-center py-5" style="min-height: 50vh;">
            <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <!-- Form container -->
        <div v-else>

            <!-- Page Header with Back Link -->
            <div class="d-flex align-items-center gap-3 mb-4">
                <RouterLink to="/productlist" class="btn btn-white btn-sm border shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background: #fff;">
                    <i class="bi bi-arrow-left fs-5 text-dark"></i>
                </RouterLink>
                <div>
                    <h4 class="fw-bold mb-0 text-dark">Chi tiết & Chỉnh sửa sản phẩm</h4>
                    <p class="text-muted small mb-0 font-monospace">Mã sản phẩm trong hệ thống: #{{ route.params.id }}</p>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
                <div class="row g-4">

                    <!-- Left Column: Main Information & Configuration -->
                    <div class="col-12 col-lg-8">
                        <div class="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="fw-bold mb-0 text-dark">
                                    <i class="bi bi-card-text me-2 text-primary"></i>Thông tin cơ bản
                                </h6>
                            </div>
                            <div class="card-body p-4">

                                <!-- Tên sản phẩm -->
                                <div class="mb-3">
                                    <label for="prodName" class="form-label fw-bold text-dark small">Tên món nước / Bánh ngọt <span class="text-danger">*</span></label>
                                    <input
                                        id="prodName"
                                        v-model="form.name"
                                        type="text"
                                        class="form-control bg-light border-0 py-2"
                                        :class="{ 'is-invalid': errors.name }"
                                        placeholder="Nhập tên sản phẩm (Ví dụ: Cà phê cốt dừa)..."
                                        maxlength="150"
                                    />
                                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                                    <div class="form-text text-end font-monospace text-xs" style="font-size: 11px;">{{ form.name.length }}/150 ký tự</div>
                                </div>

                                <!-- Mô tả chi tiết -->
                                <div class="mb-0">
                                    <label for="prodDesc" class="form-label fw-bold text-dark small">Mô tả sản phẩm <span class="text-danger">*</span></label>
                                    <textarea
                                        id="prodDesc"
                                        v-model="form.description"
                                        class="form-control bg-light border-0 py-2"
                                        :class="{ 'is-invalid': errors.description }"
                                        rows="6"
                                        placeholder="Điền hương vị, cách thức pha chế, nguồn gốc hạt cà phê hoặc thành phần dinh dưỡng..."
                                    ></textarea>
                                    <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                                </div>

                            </div>
                        </div>

                        <!-- Beverage Custom Options Card (Coffee-shop Specific Premium UI Details) -->
                        <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="fw-bold mb-0 text-dark">
                                    <i class="bi bi-sliders me-2 text-success"></i>Tùy chọn đặc trưng (Beverage Customizations)
                                </h6>
                            </div>
                            <div class="card-body p-4">
                                <div class="row g-3">
                                    <!-- Sizes selection -->
                                    <div class="col-12 col-md-4">
                                        <label class="form-label fw-bold text-dark small">Kích cỡ ly có sẵn</label>
                                        <div class="d-flex flex-wrap gap-2">
                                            <span v-for="sz in customSizes" :key="sz" class="badge text-bg-dark bg-opacity-75 rounded-pill px-3 py-1 font-monospace">Size {{ sz }}</span>
                                            <span class="badge text-bg-light border text-secondary rounded-pill px-3 py-1" style="cursor: pointer;">+ Thêm</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Sweetness options -->
                                    <div class="col-12 col-md-4">
                                        <label class="form-label fw-bold text-dark small">Mức độ ngọt ngọt</label>
                                        <div class="d-flex flex-wrap gap-2">
                                            <span v-for="sw in customSweetness" :key="sw" class="badge text-bg-light border text-dark rounded-pill px-2 py-1" style="font-size: 11px;">{{ sw }}</span>
                                        </div>
                                    </div>

                                    <!-- Ice levels -->
                                    <div class="col-12 col-md-4">
                                        <label class="form-label fw-bold text-dark small">Tỷ lệ đá lạnh</label>
                                        <div class="d-flex flex-wrap gap-2">
                                            <span v-for="ice in customIce" :key="ice" class="badge text-bg-light border text-dark rounded-pill px-2 py-1" style="font-size: 11px;">{{ ice }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Settings, Image Upload & Performance Statistics -->
                    <div class="col-12 col-lg-4">

                        <!-- Main Settings Card -->
                        <div class="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="fw-bold mb-0 text-dark">
                                    <i class="bi bi-shield-check me-2 text-secondary"></i>Quản trị & Thiết lập
                                </h6>
                            </div>
                            <div class="card-body p-4">

                                <!-- Danh mục hàng hóa -->
                                <div class="mb-3">
                                    <label for="prodCat" class="form-label fw-bold text-dark small">Danh mục sản phẩm <span class="text-danger">*</span></label>
                                    <select
                                        id="prodCat"
                                        v-model="form.category"
                                        class="form-select bg-light border-0 py-2"
                                        :class="{ 'is-invalid': errors.category }"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                                    </select>
                                    <div v-if="errors.category" class="invalid-feedback">{{ errors.category }}</div>
                                </div>

                                <!-- Giá bán phin -->
                                <div class="mb-3">
                                    <label for="prodPrice" class="form-label fw-bold text-dark small">Giá tiền sản phẩm <span class="text-danger">*</span></label>
                                    <div class="input-group" :class="{ 'has-validation': errors.price }">
                                        <input
                                            id="prodPrice"
                                            v-model="form.price"
                                            type="number"
                                            class="form-control bg-light border-0 py-2"
                                            :class="{ 'is-invalid': errors.price }"
                                            placeholder="0"
                                            min="0"
                                            step="1000"
                                        />
                                        <span class="input-group-text bg-light border-0 fw-bold">đ</span>
                                        <div v-if="errors.price" class="invalid-feedback">{{ errors.price }}</div>
                                    </div>
                                </div>

                                <!-- Trạng thái hiển thị trong Menu -->
                                <div class="mb-0">
                                    <label class="form-label fw-bold text-dark small d-block">Trạng thái bán hàng</label>
                                    <div class="form-check form-switch d-flex align-items-center justify-content-between p-0">
                                        <span class="small text-secondary fw-semibold">{{ form.status ? '✅ Cho phép hiển thị trên Menu' : '❌ Đang ẩn / Tạm ngưng bán' }}</span>
                                        <input 
                                            class="form-check-input ms-0" 
                                            type="checkbox" 
                                            role="switch" 
                                            id="product-status-switch"
                                            v-model="form.status"
                                            style="width: 46px; height: 23px; cursor: pointer;"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Image Preview & Input URL -->
                        <div class="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="fw-bold mb-0 text-dark">
                                    <i class="bi bi-image me-2 text-warning"></i>Hình ảnh sản phẩm
                                </h6>
                            </div>
                            <div class="card-body p-4">
                                <label class="form-label fw-bold text-dark small">Đường dẫn URL hình ảnh</label>
                                <input
                                    type="url"
                                    class="form-control bg-light border-0 mb-3"
                                    :value="form.image"
                                    placeholder="Dán liên kết hình ảnh trực tuyến (https://...)"
                                    @input="handleImageInput"
                                />
                                <div class="rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center text-center" style="height: 180px;">
                                    <img
                                        v-if="previewUrl"
                                        :src="previewUrl"
                                        alt="Product preview"
                                        class="w-100 h-100 object-fit-cover shadow-inner"
                                        @error="previewUrl = ''"
                                    />
                                    <div v-else class="text-muted p-3">
                                        <i class="bi bi-image-alt fs-2 d-block mb-1 opacity-50"></i>
                                        <span class="text-xs d-block">Không tải được ảnh preview hoặc URL trống</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sales Performance Statistics Mock (Connecting directly to Dashboard values!) -->
                        <div class="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden bg-white">
                            <div class="card-header bg-white border-bottom py-3">
                                <h6 class="fw-bold mb-0 text-dark">
                                    <i class="bi bi-bar-chart-line me-2 text-info"></i>Hiệu suất kinh doanh
                                </h6>
                            </div>
                            <div class="card-body p-4 bg-light bg-opacity-25">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="text-secondary small">Tổng số cốc đã bán</span>
                                    <span class="fw-bold text-dark font-monospace">{{ form.sales }} ly</span>
                                </div>
                                <div class="d-flex align-items-center justify-content-between mb-0">
                                    <span class="text-secondary small">Doanh thu mang lại</span>
                                    <span class="fw-bold text-success font-monospace">{{ formatPrice(form.revenue) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Actions Panel -->
                        <div class="d-flex gap-2">
                            <RouterLink to="/productlist" class="btn btn-outline-secondary flex-fill fw-bold py-2 shadow-sm" style="border: 1px solid #ddd; background: #fff;">
                                Hủy bỏ
                            </RouterLink>
                            <button type="submit" class="btn btn-dark flex-fill fw-bold py-2 shadow-sm" :disabled="isLoading">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                <i v-else class="bi bi-check-circle me-1"></i>
                                {{ isLoading ? 'Đang lưu...' : 'Cập nhật món' }}
                            </button>
                        </div>

                    </div>
                </div>
            </form>

        </div>
    </div>
</template>

<style scoped>
/* Toast animations */
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
