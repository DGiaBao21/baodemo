<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ProductService } from '../../services/product.service.js'
import { OrderService }   from '../../services/order.service.js'
import { currentUser, isLoggedIn } from '../../composables/auth.js'

const route          = useRoute()
const router         = useRouter()
const productService = new ProductService()
const orderService   = new OrderService()

// ── Toast ─────────────────────────────────────────────────────
const toasts = ref([])
function showToast(message, type = 'success') {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 3500)
}
function removeToast(id) { toasts.value = toasts.value.filter(t => t.id !== id) }

// ── State ─────────────────────────────────────────────────────
const product      = ref(null)
const allProducts  = ref([])
const isLoading    = ref(true)
const notFound     = ref(false)

// Tùy chọn đặt hàng
const selectedSize  = ref('M')
const selectedSugar = ref('100%')
const selectedIce   = ref('100%')
const quantity      = ref(1)

// Giá động
const dynamicPrice = computed(() => {
    if (!product.value) return 0
    const base = product.value.price + (selectedSize.value === 'L' ? 5000 : 0)
    return base * quantity.value
})

const relatedProducts = computed(() => {
    if (!product.value) return []
    return allProducts.value
        .filter(p => p.id !== product.value.id && p.categoryId === product.value.categoryId)
        .slice(0, 3)
})

// ── Fetch ─────────────────────────────────────────────────────
async function loadProduct(id) {
    isLoading.value = true
    notFound.value  = false
    try {
        const [pRes, allRes] = await Promise.all([
            productService.getById(id),
            productService.list(),
        ])
        if (pRes.status === 200) {
            product.value = pRes.data
        } else {
            notFound.value = true
        }
        allProducts.value = allRes.status === 200 ? allRes.data.filter(p => p.status !== false) : []
    } catch {
        notFound.value = true
    } finally {
        isLoading.value = false
        selectedSize.value  = 'M'
        selectedSugar.value = '100%'
        selectedIce.value   = '100%'
        quantity.value      = 1
    }
}

onMounted(() => loadProduct(route.params.id))
watch(() => route.params.id, (id) => {
    loadProduct(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ── Điều chỉnh số lượng ───────────────────────────────────────
function adjustQty(n) {
    const next = quantity.value + n
    if (next >= 1 && next <= 20) quantity.value = next
}

// ── Đặt hàng ─────────────────────────────────────────────────
const isOrdering   = ref(false)
const showOrderModal = ref(false)
const orderForm    = ref({ name: '', phone: '', email: '', address: '', paymentMethod: 'COD' })
const orderErrors  = ref({})

function openOrderModal() {
    if (!product.value) return
    // Pre-fill nếu đã đăng nhập
    if (currentUser.value) {
        orderForm.value.name  = currentUser.value.name || ''
        orderForm.value.email = currentUser.value.email || ''
    }
    showOrderModal.value = true
}
function closeOrderModal() {
    showOrderModal.value = false
    orderErrors.value = {}
}

function validateOrder() {
    const e = {}
    if (!orderForm.value.name.trim())    e.name    = 'Vui lòng nhập họ tên.'
    if (!orderForm.value.phone.trim())   e.phone   = 'Vui lòng nhập số điện thoại.'
    else if (!/^0[3-9]\d{8}$/.test(orderForm.value.phone)) e.phone = 'Số điện thoại không hợp lệ.'
    if (!orderForm.value.address.trim()) e.address = 'Vui lòng nhập địa chỉ giao hàng.'
    orderErrors.value = e
    return Object.keys(e).length === 0
}

async function confirmOrder() {
    if (!validateOrder()) return
    isOrdering.value = true
    try {
        const code = 'BREW-' + Math.floor(1000 + Math.random() * 9000)
        const unitPrice = product.value.price + (selectedSize.value === 'L' ? 5000 : 0)
        const subtotal  = unitPrice * quantity.value
        const shipping  = 15000

        const payload = {
            code,
            customerName:    orderForm.value.name,
            customerPhone:   orderForm.value.phone,
            customerEmail:   orderForm.value.email,
            shippingAddress: orderForm.value.address,
            items: [{
                name:     product.value.name,
                price:    unitPrice,
                quantity: quantity.value,
                size:     selectedSize.value,
                sugar:    selectedSugar.value,
                ice:      selectedIce.value,
                image:    product.value.image,
            }],
            subtotal,
            shippingFee:    shipping,
            discount:       0,
            totalAmount:    subtotal + shipping,
            paymentMethod:  orderForm.value.paymentMethod,
            paymentStatus:  false,
            status:         'pending',
            createdAt:      new Date().toLocaleString('vi-VN'),
            note:           `Size: ${selectedSize.value}, Đường: ${selectedSugar.value}, Đá: ${selectedIce.value}`,
        }

        const res = await orderService.create(payload)
        if (res.status === 201) {
            closeOrderModal()
            showToast(`🎉 Đặt hàng thành công! Mã đơn: ${code}`, 'success')
            quantity.value = 1
        }
    } catch (err) {
        showToast('Đặt hàng thất bại, vui lòng thử lại.', 'danger')
        console.error(err)
    } finally {
        isOrdering.value = false
    }
}

const formatPrice = n => new Intl.NumberFormat('vi-VN').format(n) + '₫'
const renderStars = r => Array.from({ length: 5 }, (_, i) => i < r ? '★' : '☆').join('')
</script>

<template>
    <div class="py-4 bg-light min-vh-100">

        <!-- Toast -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:2100">
            <transition-group name="toast-anim">
                <div v-for="t in toasts" :key="t.id"
                    class="toast show border-0 shadow-lg mb-2" role="alert"
                    style="border-radius:12px;overflow:hidden">
                    <div class="d-flex align-items-center p-3 text-white bg-dark">
                        <i class="bi bi-check-circle-fill me-2 fs-5 text-success"></i>
                        <div class="toast-body p-0 fw-semibold small">{{ t.message }}</div>
                        <button type="button" class="btn-close btn-close-white ms-auto" @click="removeToast(t.id)"></button>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="container py-5">
            <div class="card border-0 shadow-sm rounded-3 p-4">
                <div class="row g-4">
                    <div class="col-md-5">
                        <div class="skeleton rounded-3" style="height:380px"></div>
                    </div>
                    <div class="col-md-7">
                        <div class="skeleton mb-3" style="height:14px;width:30%;border-radius:4px"></div>
                        <div class="skeleton mb-3" style="height:32px;width:70%;border-radius:6px"></div>
                        <div class="skeleton mb-3" style="height:60px;border-radius:8px"></div>
                        <div class="skeleton mb-3" style="height:40px;border-radius:8px"></div>
                        <div class="skeleton" style="height:44px;width:50%;border-radius:50px"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Not found -->
        <div v-else-if="notFound" class="container text-center py-5">
            <i class="bi bi-cup-hot fs-1 text-muted d-block mb-3"></i>
            <h4 class="fw-bold">Không tìm thấy sản phẩm</h4>
            <RouterLink to="/product" class="btn btn-success fw-bold rounded-pill px-4 mt-3">
                Quay lại cửa hàng
            </RouterLink>
        </div>

        <!-- Chi tiết sản phẩm -->
        <div v-else-if="product" class="container">

            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb mb-0 py-1 bg-transparent small">
                    <li class="breadcrumb-item"><RouterLink to="/" class="text-success text-decoration-none">Trang chủ</RouterLink></li>
                    <li class="breadcrumb-item"><RouterLink to="/product" class="text-success text-decoration-none">Cửa hàng</RouterLink></li>
                    <li class="breadcrumb-item active">{{ product.name }}</li>
                </ol>
            </nav>

            <!-- Khối chính -->
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden bg-white p-4 mb-4">
                <div class="row g-4">

                    <!-- Ảnh -->
                    <div class="col-12 col-md-5">
                        <div class="rounded-3 border overflow-hidden bg-light shadow-sm" style="height:380px">
                            <img :src="product.image" :alt="product.name"
                                class="w-100 h-100 object-fit-cover" />
                        </div>
                    </div>

                    <!-- Thông tin + Đặt hàng -->
                    <div class="col-12 col-md-7">

                        <!-- Category -->
                        <span class="badge bg-success bg-opacity-10 text-success border border-success-subtle rounded-pill px-3 py-1 mb-2"
                            style="font-size:10px;letter-spacing:.5px">
                            {{ product.category }}
                        </span>

                        <h2 class="fw-bold text-dark mb-2">{{ product.name }}</h2>

                        <!-- Rating -->
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <span class="text-warning fs-5">{{ renderStars(product.rating || 4) }}</span>
                            <span class="text-muted small">({{ product.reviews || 0 }} đánh giá)</span>
                        </div>

                        <!-- Giá -->
                        <div class="mb-3 bg-light p-3 rounded-3 d-flex align-items-center justify-content-between">
                            <span class="text-secondary small fw-bold">TỔNG TIỀN</span>
                            <h3 class="fw-bold text-success font-monospace mb-0">{{ formatPrice(dynamicPrice) }}</h3>
                        </div>

                        <!-- Mô tả -->
                        <p class="text-secondary lh-lg small mb-4">{{ product.description }}</p>

                        <!-- Tùy chọn -->
                        <div class="p-3 border rounded-3 bg-light bg-opacity-50 mb-4">

                            <!-- Size -->
                            <div class="mb-3">
                                <label class="form-label fw-bold text-dark small">CHỌN SIZE</label>
                                <div class="d-flex gap-2 flex-wrap">
                                    <button type="button" class="btn btn-sm px-3 py-2 rounded-pill fw-semibold border"
                                        :class="selectedSize === 'M' ? 'btn-dark' : 'btn-outline-secondary bg-white'"
                                        @click="selectedSize = 'M'">
                                        Size M (tiêu chuẩn)
                                    </button>
                                    <button type="button" class="btn btn-sm px-3 py-2 rounded-pill fw-semibold border"
                                        :class="selectedSize === 'L' ? 'btn-dark' : 'btn-outline-secondary bg-white'"
                                        @click="selectedSize = 'L'">
                                        Size L (+5.000₫)
                                    </button>
                                </div>
                            </div>

                            <div class="row g-3">
                                <!-- Đường -->
                                <div class="col-12 col-sm-6">
                                    <label class="form-label fw-bold text-dark small">LƯỢNG ĐƯỜNG</label>
                                    <select v-model="selectedSugar" class="form-select form-select-sm bg-white border">
                                        <option value="100%">100% Đường (tiêu chuẩn)</option>
                                        <option value="70%">70% Đường</option>
                                        <option value="50%">50% Đường</option>
                                        <option value="Không đường">Không đường</option>
                                    </select>
                                </div>
                                <!-- Đá -->
                                <div class="col-12 col-sm-6">
                                    <label class="form-label fw-bold text-dark small">LƯỢNG ĐÁ</label>
                                    <select v-model="selectedIce" class="form-select form-select-sm bg-white border">
                                        <option value="100%">100% Đá (tiêu chuẩn)</option>
                                        <option value="70%">70% Đá</option>
                                        <option value="50%">50% Đá</option>
                                        <option value="Không đá">Không đá</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Số lượng + Đặt hàng -->
                        <div class="row g-3 align-items-center">
                            <div class="col-auto">
                                <label class="form-label fw-bold text-dark small d-block mb-1">SỐ LƯỢNG</label>
                                <div class="input-group input-group-sm border rounded-pill overflow-hidden bg-white"
                                    style="width:120px;height:38px">
                                    <button class="btn btn-link text-secondary p-0 px-3 border-0 shadow-none fs-5 fw-bold"
                                        type="button" @click="adjustQty(-1)">−</button>
                                    <input type="text" class="form-control text-center bg-transparent border-0 fw-bold"
                                        style="font-size:14px" :value="quantity" readonly />
                                    <button class="btn btn-link text-secondary p-0 px-3 border-0 shadow-none fs-5 fw-bold"
                                        type="button" @click="adjustQty(1)">+</button>
                                </div>
                            </div>
                            <div class="col">
                                <label class="form-label fw-bold small d-block mb-1">&nbsp;</label>
                                <button class="btn btn-success btn-sm w-100 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    style="height:38px" type="button" @click="openOrderModal">
                                    <i class="bi bi-bag-check fs-5"></i>
                                    <span>ĐẶT HÀNG NGAY</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Sản phẩm liên quan -->
            <div v-if="relatedProducts.length > 0" class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold mb-4 text-dark text-center">
                    <i class="bi bi-cup-hot me-2 text-warning"></i>Sản phẩm tương tự
                </h5>
                <div class="row g-4">
                    <div v-for="r in relatedProducts" :key="r.id" class="col-12 col-md-4">
                        <div class="card border border-secondary border-opacity-10 h-100 overflow-hidden shadow-sm rounded-3"
                            style="cursor:pointer;transition:transform .25s"
                            @click="router.push(`/product/${r.id}`)"
                            @mouseenter="$event.currentTarget.style.transform='translateY(-4px)'"
                            @mouseleave="$event.currentTarget.style.transform='translateY(0)'">
                            <div style="height:160px;overflow:hidden">
                                <img :src="r.image" :alt="r.name" class="w-100 h-100 object-fit-cover" />
                            </div>
                            <div class="card-body p-3">
                                <span class="text-success text-uppercase fw-bold" style="font-size:9px;letter-spacing:.5px">{{ r.category }}</span>
                                <h6 class="fw-bold text-dark my-1 text-truncate">{{ r.name }}</h6>
                                <div class="text-warning mb-1" style="font-size:11px">{{ renderStars(r.rating || 4) }}</div>
                                <span class="fw-bold text-success">{{ formatPrice(r.price) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- ===== MODAL ĐẶT HÀNG ===== -->
        <Teleport to="body">
            <div v-if="showOrderModal" class="modal-backdrop fade show" style="z-index:1040"></div>
            <div v-if="showOrderModal" class="modal fade show d-block" tabindex="-1" style="z-index:1050"
                @click.self="closeOrderModal">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-lg rounded-4">
                        <div class="modal-header border-0 pb-0 px-4 pt-4">
                            <h5 class="modal-title fw-bold">
                                <i class="bi bi-bag-check me-2 text-success"></i>Xác nhận đặt hàng
                            </h5>
                            <button type="button" class="btn-close" @click="closeOrderModal"></button>
                        </div>
                        <div class="modal-body px-4 py-3">

                            <!-- Tóm tắt đơn hàng -->
                            <div class="order-summary p-3 rounded-3 mb-4">
                                <div class="d-flex gap-3 align-items-center">
                                    <img v-if="product" :src="product.image" :alt="product.name"
                                        class="rounded-3 object-fit-cover flex-shrink-0"
                                        style="width:70px;height:70px" />
                                    <div class="flex-fill">
                                        <div class="fw-bold">{{ product?.name }}</div>
                                        <div class="text-muted small">
                                            Size: {{ selectedSize }} · Đường: {{ selectedSugar }} · Đá: {{ selectedIce }}
                                        </div>
                                        <div class="text-muted small">Số lượng: {{ quantity }}</div>
                                    </div>
                                    <div class="text-end">
                                        <div class="fw-bold text-success fs-6">{{ formatPrice(dynamicPrice) }}</div>
                                        <div class="text-muted small">+ 15.000₫ ship</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Form thông tin giao hàng -->
                            <div class="row g-3">
                                <div class="col-sm-6">
                                    <label class="form-label fw-semibold small">Họ và tên <span class="text-danger">*</span></label>
                                    <input v-model="orderForm.name" type="text" class="form-control"
                                        :class="{ 'is-invalid': orderErrors.name }"
                                        placeholder="Nguyễn Văn A" />
                                    <div v-if="orderErrors.name" class="invalid-feedback">{{ orderErrors.name }}</div>
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label fw-semibold small">Số điện thoại <span class="text-danger">*</span></label>
                                    <input v-model="orderForm.phone" type="tel" class="form-control"
                                        :class="{ 'is-invalid': orderErrors.phone }"
                                        placeholder="0901234567" maxlength="10" />
                                    <div v-if="orderErrors.phone" class="invalid-feedback">{{ orderErrors.phone }}</div>
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label fw-semibold small">Email</label>
                                    <input v-model="orderForm.email" type="email" class="form-control"
                                        placeholder="example@gmail.com" />
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label fw-semibold small">Phương thức thanh toán</label>
                                    <div class="form-control d-flex align-items-center gap-2 bg-light" style="cursor:default">
                                        <i class="bi bi-cash-coin text-success fs-5"></i>
                                        <span class="fw-semibold text-dark">COD – Thanh toán khi nhận hàng</span>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <label class="form-label fw-semibold small">Địa chỉ giao hàng <span class="text-danger">*</span></label>
                                    <input v-model="orderForm.address" type="text" class="form-control"
                                        :class="{ 'is-invalid': orderErrors.address }"
                                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
                                    <div v-if="orderErrors.address" class="invalid-feedback">{{ orderErrors.address }}</div>
                                </div>
                            </div>

                            <!-- Tổng cộng -->
                            <div class="d-flex justify-content-between align-items-center border-top mt-4 pt-3">
                                <span class="text-muted">Tổng thanh toán (bao gồm ship):</span>
                                <span class="fw-bold fs-5 text-success">{{ formatPrice(dynamicPrice + 15000) }}</span>
                            </div>
                        </div>
                        <div class="modal-footer border-0 px-4 pb-4 pt-0">
                            <button class="btn btn-outline-secondary" @click="closeOrderModal" :disabled="isOrdering">Hủy</button>
                            <button class="btn btn-success fw-bold px-4 rounded-pill" @click="confirmOrder" :disabled="isOrdering">
                                <span v-if="isOrdering" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-check-circle me-1"></i>
                                {{ isOrdering ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

    </div>
</template>

<style scoped>
.order-summary {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1px solid #bbf7d0;
}
.skeleton {
    background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
    background-size:200% 100%; animation:shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.toast-anim-enter-active { transition:all .3s cubic-bezier(.4,0,.2,1); }
.toast-anim-leave-active { transition:all .25s cubic-bezier(.4,0,1,1); }
.toast-anim-enter-from { transform:translateY(12px) scale(.9); opacity:0; }
.toast-anim-leave-to { transform:translateX(100px); opacity:0; }
</style>
