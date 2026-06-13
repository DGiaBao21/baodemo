<script setup>
import { ref, computed, watch } from 'vue'

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

// ─── Dữ liệu giả định (Mock Data) ───────────────────────────────
const orders = ref([
    {
        id: 1,
        code: 'BREW-8472',
        customerName: 'Nguyễn Văn Nam',
        customerPhone: '0912345678',
        customerEmail: 'namnv@gmail.com',
        shippingAddress: '120 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
        items: [
            { name: 'Cà phê sữa', price: 30000, quantity: 2, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop' },
            { name: 'Bánh croissant', price: 35000, quantity: 1, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop' }
        ],
        subtotal: 95000,
        shippingFee: 15000,
        discount: 10000,
        totalAmount: 100000,
        paymentMethod: 'COD',
        paymentStatus: false,
        status: 'pending',
        createdAt: '2026-05-26 10:15',
        adminNote: 'Khách hẹn giao giờ hành chính'
    },
    {
        id: 2,
        code: 'BREW-9123',
        customerName: 'Lê Thị Thu Thảo',
        customerPhone: '0987654321',
        customerEmail: 'thao.le@gmail.com',
        shippingAddress: '45/12 Đường 3/2, Phường 11, Quận 10, TP. Hồ Chí Minh',
        items: [
            { name: 'Trà đào cam sả', price: 45000, quantity: 3, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop' },
            { name: 'Sinh tố xoài', price: 55000, quantity: 1, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=80&h=80&fit=crop' }
        ],
        subtotal: 190000,
        shippingFee: 20000,
        discount: 20000,
        totalAmount: 190000,
        paymentMethod: 'Bank',
        paymentStatus: true,
        status: 'confirmed',
        createdAt: '2026-05-26 09:30',
        adminNote: 'Đã nhận chuyển khoản Vietcombank'
    },
    {
        id: 3,
        code: 'BREW-7341',
        customerName: 'Phạm Minh Hoàng',
        customerPhone: '0903112233',
        customerEmail: 'hoangpm@yahoo.com',
        shippingAddress: 'Tòa nhà Landmark 81, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
        items: [
            { name: 'Capuchino', price: 55000, quantity: 1, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=80&h=80&fit=crop' },
            { name: 'Cà phê đen', price: 25000, quantity: 2, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop' }
        ],
        subtotal: 105000,
        shippingFee: 15000,
        discount: 0,
        totalAmount: 120000,
        paymentMethod: 'Momo',
        paymentStatus: true,
        status: 'shipping',
        createdAt: '2026-05-25 15:45',
        adminNote: 'Giao tại quầy lễ tân tầng G'
    },
    {
        id: 4,
        code: 'BREW-4821',
        customerName: 'Trần Thanh Vy',
        customerPhone: '0977889900',
        customerEmail: 'vytran@hotmail.com',
        shippingAddress: 'Chung cư Sunrise City, Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh',
        items: [
            { name: 'Trà sữa trân châu', price: 50000, quantity: 4, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=80&h=80&fit=crop' }
        ],
        subtotal: 200000,
        shippingFee: 25000,
        discount: 30000,
        totalAmount: 195000,
        paymentMethod: 'Bank',
        paymentStatus: true,
        status: 'delivered',
        createdAt: '2026-05-25 11:20',
        adminNote: 'Khách quen, giảm giá VIP 15%'
    },
    {
        id: 5,
        code: 'BREW-1049',
        customerName: 'Đỗ Quốc Bảo',
        customerPhone: '0944556677',
        customerEmail: 'baodq@gmail.com',
        shippingAddress: '88 Quang Trung, Phường 10, Quận Gò Vấp, TP. Hồ Chí Minh',
        items: [
            { name: 'Nước ép cam', price: 40000, quantity: 2, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=80&h=80&fit=crop' }
        ],
        subtotal: 80000,
        shippingFee: 15000,
        discount: 0,
        totalAmount: 95000,
        paymentMethod: 'COD',
        paymentStatus: false,
        status: 'cancelled',
        createdAt: '2026-05-24 14:05',
        adminNote: 'Khách hủy vì bận đột xuất'
    },
    {
        id: 6,
        code: 'BREW-6291',
        customerName: 'Vũ Thị Hải Yến',
        customerPhone: '0933221100',
        customerEmail: 'yenhai@gmail.com',
        shippingAddress: '250 Trường Chinh, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh',
        items: [
            { name: 'Trà đào cam sả', price: 45000, quantity: 1, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop' },
            { name: 'Capuchino', price: 55000, quantity: 1, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=80&h=80&fit=crop' },
            { name: 'Bánh croissant', price: 35000, quantity: 2, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop' }
        ],
        subtotal: 170000,
        shippingFee: 15000,
        discount: 15000,
        totalAmount: 170000,
        paymentMethod: 'COD',
        paymentStatus: true,
        status: 'delivered',
        createdAt: '2026-05-24 09:10',
        adminNote: ''
    }
])

// ─── Tính toán Số liệu thống kê ────────────────────────────────
const totalOrdersCount = computed(() => orders.value.length)
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'pending').length)
const shippingOrdersCount = computed(() => orders.value.filter(o => o.status === 'shipping').length)
const revenueTotal = computed(() => {
    return orders.value
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0)
})

// ─── Trạng thái Bộ lọc ─────────────────────────────────────────
const searchQuery = ref('')
const filterStatus = ref('all')
const filterPaymentStatus = ref('all')
const filterPaymentMethod = ref('all')
const sortBy = ref('newest')

const statusPills = [
    { key: 'all', label: 'Tất cả', count: computed(() => orders.value.length), color: 'dark' },
    { key: 'pending', label: 'Chờ xử lý', count: computed(() => orders.value.filter(o => o.status === 'pending').length), color: 'warning' },
    { key: 'confirmed', label: 'Đã xác nhận', count: computed(() => orders.value.filter(o => o.status === 'confirmed').length), color: 'info' },
    { key: 'shipping', label: 'Đang giao', count: computed(() => orders.value.filter(o => o.status === 'shipping').length), color: 'primary' },
    { key: 'delivered', label: 'Đã giao', count: computed(() => orders.value.filter(o => o.status === 'delivered').length), color: 'success' },
    { key: 'cancelled', label: 'Đã hủy', count: computed(() => orders.value.filter(o => o.status === 'cancelled').length), color: 'danger' }
]

// Logic lọc dữ liệu
const filteredOrders = computed(() => {
    let list = [...orders.value]

    // Tìm kiếm
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
        list = list.filter(o => 
            o.code.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerPhone.includes(q)
        )
    }

    // Lọc theo Trạng thái đơn hàng
    if (filterStatus.value !== 'all') {
        list = list.filter(o => o.status === filterStatus.value)
    }

    // Lọc theo Trạng thái thanh toán
    if (filterPaymentStatus.value !== 'all') {
        const isPaid = filterPaymentStatus.value === 'paid'
        list = list.filter(o => o.paymentStatus === isPaid)
    }

    // Lọc theo Phương thức thanh toán
    if (filterPaymentMethod.value !== 'all') {
        list = list.filter(o => o.paymentMethod === filterPaymentMethod.value)
    }

    // Sắp xếp
    if (sortBy.value === 'newest') {
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    } else if (sortBy.value === 'oldest') {
        list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    } else if (sortBy.value === 'amount-desc') {
        list.sort((a, b) => b.totalAmount - a.totalAmount)
    } else if (sortBy.value === 'amount-asc') {
        list.sort((a, b) => a.totalAmount - b.totalAmount)
    }

    return list
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredOrders.value.slice(start, end)
})

watch([searchQuery, filterStatus, filterPaymentStatus, filterPaymentMethod, sortBy], () => {
    currentPage.value = 1
})

// ─── Các hàm định dạng hỗ trợ (Format Helpers) ────────────────
const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ'

function getStatusBadge(status) {
    switch (status) {
        case 'pending': return 'badge text-bg-warning-subtle text-warning border border-warning-subtle'
        case 'confirmed': return 'badge text-bg-info-subtle text-info border border-info-subtle'
        case 'shipping': return 'badge text-bg-primary-subtle text-primary border border-primary-subtle'
        case 'delivered': return 'badge text-bg-success-subtle text-success border border-success-subtle'
        case 'cancelled': return 'badge text-bg-danger-subtle text-danger border border-danger-subtle'
        default: return 'badge text-bg-secondary'
    }
}

function getStatusSelectClass(status) {
    switch (status) {
        case 'pending': return 'bg-warning-subtle text-warning border-warning-subtle'
        case 'confirmed': return 'bg-info-subtle text-info border-info-subtle'
        case 'shipping': return 'bg-primary-subtle text-primary border-primary-subtle'
        case 'delivered': return 'bg-success-subtle text-success border-success-subtle'
        case 'cancelled': return 'bg-danger-subtle text-danger border-danger-subtle'
        default: return 'bg-secondary-subtle text-secondary'
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'Chờ xử lý'
        case 'confirmed': return 'Đã xác nhận'
        case 'shipping': return 'Đang giao'
        case 'delivered': return 'Đã giao'
        case 'cancelled': return 'Đã hủy'
        default: return status
    }
}

function getPaymentMethodLabel(method) {
    switch (method) {
        case 'COD': return 'Tiền mặt (COD)'
        case 'Bank': return 'Chuyển khoản'
        case 'Momo': return 'Ví Momo'
        default: return method
    }
}

// ─── Trạng thái Ngăn kéo Chi tiết (Drawer Detail State) ────────
const selectedOrder = ref(null)
const noteInput = ref('')

function openDetails(order) {
    selectedOrder.value = order
    noteInput.value = order.adminNote || ''
}

function closeDetails() {
    selectedOrder.value = null
}

// Hỗ trợ dòng thời gian (Timeline Helper)
const steps = [
    { key: 'pending', label: 'Chờ xử lý', icon: 'bi-hourglass-split' },
    { key: 'confirmed', label: 'Đã xác nhận', icon: 'bi-check-circle' },
    { key: 'shipping', label: 'Đang giao', icon: 'bi-truck' },
    { key: 'delivered', label: 'Đã giao', icon: 'bi-house-check' }
]

const progressPercent = computed(() => {
    if (!selectedOrder.value) return '0%'
    const current = selectedOrder.value.status
    if (current === 'cancelled') return '0%'
    const idx = steps.findIndex(s => s.key === current)
    if (idx === -1) return '0%'
    return `${(idx / (steps.length - 1)) * 100}%`
})

function isStepActive(stepKey) {
    if (!selectedOrder.value) return false
    const current = selectedOrder.value.status
    if (current === 'cancelled') return false
    const currentIdx = steps.findIndex(s => s.key === current)
    const stepIdx = steps.findIndex(s => s.key === stepKey)
    return stepIdx <= currentIdx
}

function getStepClass(stepKey) {
    if (!selectedOrder.value) return 'bg-light text-muted'
    if (selectedOrder.value.status === 'cancelled') {
        return 'bg-danger bg-opacity-10 text-danger border-danger'
    }
    const active = isStepActive(stepKey)
    if (active) {
        return 'bg-success text-white'
    }
    return 'bg-white text-muted border border-secondary border-opacity-20'
}

function getStepIcon(stepKey) {
    const step = steps.find(s => s.key === stepKey)
    return step ? `bi ${step.icon}` : 'bi bi-dot'
}

// Các hành động cập nhật trực tiếp trong Ngăn kéo (Drawer)
function changeStatusInDrawer(newStatus) {
    if (!selectedOrder.value) return
    selectedOrder.value.status = newStatus
    showToast(`Đã chuyển trạng thái đơn hàng sang: ${getStatusLabel(newStatus)}`, 'success')
}

function quickUpdateStatus(order, newStatus) {
    order.status = newStatus
    showToast(`Đã cập nhật trạng thái đơn ${order.code} sang: ${getStatusLabel(newStatus)}`, 'success')
}

function togglePaymentInDrawer(e) {
    if (!selectedOrder.value) return
    selectedOrder.value.paymentStatus = e.target.checked
    const msg = selectedOrder.value.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'
    showToast(`Đã cập nhật trạng thái thanh toán: ${msg}`, 'success')
}

function saveNoteInDrawer() {
    if (!selectedOrder.value) return
    selectedOrder.value.adminNote = noteInput.value
    showToast('Đã cập nhật ghi chú nội bộ thành công!', 'success')
}

// ─── Trạng thái Xóa đơn hàng ──────────────────────────────────
const deleteTarget = ref(null)
const showDeleteModal = ref(false)

function openDeleteModal(order) {
    deleteTarget.value = order
    showDeleteModal.value = true
}

function closeDeleteModal() {
    deleteTarget.value = null
    showDeleteModal.value = false
}

function confirmDelete() {
    if (!deleteTarget.value) return
    const idx = orders.value.findIndex(o => o.id === deleteTarget.value.id)
    if (idx !== -1) {
        orders.value.splice(idx, 1)
        showToast(`Đã xóa đơn hàng ${deleteTarget.value.code} khỏi hệ thống`, 'warning')
    }
    if (selectedOrder.value && selectedOrder.value.id === deleteTarget.value.id) {
        selectedOrder.value = null
    }
    closeDeleteModal()
}

// ─── Tương tác vi mô UX (Micro-interactions) ──────────────────
const isExporting = ref(false)
function exportToExcel() {
    isExporting.value = true
    setTimeout(() => {
        isExporting.value = false
        showToast('Xuất báo cáo Excel thành công! File đã được lưu vào thư mục Downloads.', 'success')
    }, 1200)
}

const activeCopyId = ref(null)
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        activeCopyId.value = code
        showToast(`Đã sao chép mã đơn hàng: ${code}`, 'success')
        setTimeout(() => {
            activeCopyId.value = null
        }, 1500)
    }).catch(() => {
        showToast('Sao chép mã đơn hàng thất bại', 'danger')
    })
}

function printInvoice() {
    showToast('Đang khởi tạo máy in hóa đơn... Vui lòng đợi trong giây lát.', 'info')
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
                    <div class="d-flex align-items-center p-3" :class="t.type === 'warning' ? 'bg-warning text-dark' : t.type === 'danger' ? 'bg-danger text-white' : t.type === 'info' ? 'bg-info text-white' : 'bg-dark text-white'">
                        <i class="bi me-2 fs-5" :class="t.type === 'warning' ? 'bi-exclamation-circle-fill' : t.type === 'danger' ? 'bi-x-circle-fill' : t.type === 'info' ? 'bi-info-circle-fill' : 'bi-check-circle-fill text-success'"></i>
                        <div class="toast-body p-0 fw-semibold text-break small">{{ t.message }}</div>
                        <button type="button" class="btn-close ms-auto" :class="t.type === 'warning' ? '' : 'btn-close-white'" @click="removeToast(t.id)"></button>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Tiêu đề trang -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold mb-0 text-dark">Quản lý Đơn hàng</h4>
                <p class="text-muted small mb-0">Theo dõi, duyệt và quản lý trạng thái giao hàng</p>
            </div>
            <button 
                class="btn btn-dark fw-semibold shadow-sm d-flex align-items-center gap-2"
                :disabled="isExporting"
                @click="exportToExcel"
            >
                <span v-if="isExporting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-file-earmark-excel"></i>
                {{ isExporting ? 'Đang xuất...' : 'Xuất file Excel' }}
            </button>
        </div>

        <!-- Lưới thống kê (Hàng chứa các thẻ) -->
        <div class="row g-3 mb-4">
            <!-- Thẻ thống kê: Tổng số đơn hàng -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-dark bg-opacity-10 p-3 text-dark d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-receipt fs-4"></i>
                        </div>
                        <div>
                            <h6 class="text-muted small fw-bold text-uppercase mb-1" style="letter-spacing: 0.5px; font-size: 10.5px;">Tổng Đơn Hàng</h6>
                            <h3 class="fw-bold mb-0 text-dark">{{ totalOrdersCount }}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Thẻ thống kê: Đơn hàng chờ xử lý -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-warning bg-opacity-10 p-3 text-warning d-flex align-items-center justify-content-center position-relative" style="width: 52px; height: 52px;">
                            <span v-if="pendingOrdersCount > 0" class="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle pulse-ring" style="width: 10px; height: 10px;"></span>
                            <i class="bi bi-clock-history fs-4"></i>
                        </div>
                        <div>
                            <h6 class="text-muted small fw-bold text-uppercase mb-1" style="letter-spacing: 0.5px; font-size: 10.5px;">Chờ Xử Lý</h6>
                            <h3 class="fw-bold mb-0 text-dark">{{ pendingOrdersCount }}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Thẻ thống kê: Đang giao hàng -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-primary bg-opacity-10 p-3 text-primary d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-truck fs-4"></i>
                        </div>
                        <div>
                            <h6 class="text-muted small fw-bold text-uppercase mb-1" style="letter-spacing: 0.5px; font-size: 10.5px;">Đang Giao</h6>
                            <h3 class="fw-bold mb-0 text-dark">{{ shippingOrdersCount }}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Thẻ thống kê: Doanh thu -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-3 bg-success bg-opacity-10 p-3 text-success d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-wallet2 fs-4"></i>
                        </div>
                        <div>
                            <h6 class="text-muted small fw-bold text-uppercase mb-1" style="letter-spacing: 0.5px; font-size: 10.5px;">Doanh thu (Đã giao)</h6>
                            <h3 class="fw-bold mb-0 text-success">{{ formatPrice(revenueTotal) }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Khung chứa thẻ chính -->
        <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
            
            <!-- Tiêu đề thẻ & Thanh công cụ -->
            <div class="card-header bg-white border-0 pt-4 px-4 pb-3">
                
                <!-- Các nút tab lọc trạng thái -->
                <div class="d-flex flex-wrap gap-2 mb-3 pb-2 border-bottom">
                    <button 
                        v-for="pill in statusPills" 
                        :key="pill.key"
                        class="btn btn-sm px-3 rounded-pill fw-semibold d-flex align-items-center gap-2 transition-all"
                        :class="filterStatus === pill.key ? 'btn-dark shadow-sm' : 'btn-outline-secondary border-0'"
                        @click="filterStatus = pill.key"
                    >
                        <span>{{ pill.label }}</span>
                        <span 
                            class="badge" 
                            :class="filterStatus === pill.key ? 'bg-white text-dark' : 'bg-secondary bg-opacity-10 text-muted'"
                            style="font-size: 10px;"
                        >
                            {{ pill.count }}
                        </span>
                    </button>
                </div>

                <!-- Hàng chứa các bộ lọc phụ -->
                <div class="row g-3 align-items-center">
                    
                    <!-- Ô nhập tìm kiếm -->
                    <div class="col-12 col-md-4 col-xl-3">
                        <div class="input-group">
                            <span class="input-group-text bg-light border-0 text-muted pe-1">
                                <i class="bi bi-search"></i>
                            </span>
                            <input 
                                v-model="searchQuery"
                                type="text" 
                                class="form-control bg-light border-0 ps-2" 
                                placeholder="Tìm mã đơn, tên, sđt..."
                                style="font-size: 13.5px;"
                            />
                        </div>
                    </div>

                    <!-- Bộ lọc Trạng thái thanh toán -->
                    <div class="col-6 col-md-3 col-xl-2">
                        <select v-model="filterPaymentStatus" class="form-select bg-light border-0 text-secondary" style="font-size: 13.5px;">
                            <option value="all">Trạng thái thanh toán</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="unpaid">Chưa thanh toán</option>
                        </select>
                    </div>

                    <!-- Bộ lọc Phương thức thanh toán -->
                    <div class="col-6 col-md-3 col-xl-2">
                        <select v-model="filterPaymentMethod" class="form-select bg-light border-0 text-secondary" style="font-size: 13.5px;">
                            <option value="all">Phương thức thanh toán</option>
                            <option value="COD">Tiền mặt (COD)</option>
                            <option value="Bank">Chuyển khoản</option>
                            <option value="Momo">Ví Momo</option>
                        </select>
                    </div>

                    <!-- Sắp xếp -->
                    <div class="col-12 col-md-2 col-xl-2">
                        <select v-model="sortBy" class="form-select bg-light border-0 text-secondary" style="font-size: 13.5px;">
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="amount-desc">Tổng tiền giảm dần</option>
                            <option value="amount-asc">Tổng tiền tăng dần</option>
                        </select>
                    </div>

                    <!-- Số lượng kết quả tìm thấy -->
                    <div class="col-12 col-md-auto ms-md-auto text-end">
                        <span class="text-muted small">Tìm thấy <strong>{{ filteredOrders.length }}</strong> đơn hàng</span>
                    </div>
                </div>

            </div>

            <!-- Khung chứa bảng cuộn tương thích (Responsive) -->
            <div class="table-responsive border-0">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted text-uppercase" style="font-size: 11px; letter-spacing: 0.5px;">
                        <tr>
                            <th class="ps-4" style="width: 140px;">Mã Đơn Hàng</th>
                            <th style="min-width: 160px;">Khách Hàng</th>
                            <th style="min-width: 180px;">Sản Phẩm</th>
                            <th style="width: 130px;">Ngày Tạo</th>
                            <th style="width: 140px;">Thanh Toán</th>
                            <th style="width: 130px;">Trạng Thái</th>
                            <th class="text-end" style="width: 130px;">Tổng Cộng</th>
                            <th class="text-center pe-4" style="width: 110px;">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Trạng thái danh sách trống -->
                        <tr v-if="paginatedOrders.length === 0">
                            <td colspan="8" class="text-center py-5 text-muted bg-white">
                                <i class="bi bi-inbox fs-1 d-block mb-3 text-secondary bg-opacity-10 text-opacity-50"></i>
                                <span class="fw-semibold">Không tìm thấy đơn hàng phù hợp</span>
                                <p class="small text-muted mb-0 mt-1">Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm</p>
                            </td>
                        </tr>

                        <!-- Các dòng dữ liệu đơn hàng -->
                        <tr 
                            v-for="order in paginatedOrders" 
                            :key="order.id" 
                            class="bg-white"
                            :class="{ 'table-active': selectedOrder?.id === order.id }"
                        >
                            <!-- Mã đơn hàng kèm sao chép nhanh -->
                            <td class="ps-4">
                                <div class="d-flex align-items-center gap-1">
                                    <span class="fw-bold text-dark font-monospace">{{ order.code }}</span>
                                    <button 
                                        class="btn btn-link p-1 text-secondary d-flex align-items-center border-0 shadow-none"
                                        type="button"
                                        title="Copy mã đơn"
                                        @click.stop="copyCode(order.code)"
                                    >
                                        <i class="bi" :class="activeCopyId === order.code ? 'bi-check-lg text-success' : 'bi-copy'"></i>
                                    </button>
                                </div>
                            </td>

                            <!-- Thông tin khách hàng -->
                            <td>
                                <div class="fw-semibold text-dark">{{ order.customerName }}</div>
                                <div class="text-muted small font-monospace d-flex align-items-center gap-1" style="font-size: 11.5px;">
                                    <i class="bi bi-telephone text-secondary"></i>
                                    {{ order.customerPhone }}
                                </div>
                            </td>

                            <!-- Tóm tắt xem trước sản phẩm -->
                            <td>
                                <div class="text-dark small fw-semibold text-truncate" style="max-width: 220px;">
                                    {{ order.items[0]?.name }} 
                                    <span v-if="order.items[0]?.quantity > 1">x{{ order.items[0]?.quantity }}</span>
                                </div>
                                <div v-if="order.items.length > 1" class="text-muted small" style="font-size: 11px;">
                                    và {{ order.items.length - 1 }} sản phẩm khác
                                </div>
                            </td>

                            <!-- Ngày tạo đơn -->
                            <td class="text-secondary small font-monospace" style="font-size: 12px;">
                                {{ order.createdAt }}
                            </td>

                            <!-- Chi tiết thanh toán -->
                            <td>
                                <div class="d-flex flex-column">
                                    <span class="small text-secondary">{{ getPaymentMethodLabel(order.paymentMethod) }}</span>
                                    <div class="mt-1">
                                        <span 
                                            class="badge px-2 py-1 text-xs rounded-pill" 
                                            :class="order.paymentStatus ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 'bg-secondary bg-opacity-10 text-muted border border-secondary-subtle'"
                                            style="font-size: 10.5px;"
                                        >
                                            {{ order.paymentStatus ? 'Đã thanh toán' : 'Chưa trả' }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <!-- Danh sách chọn Trạng thái để Cập nhật nhanh -->
                            <td>
                                <select 
                                    :value="order.status"
                                    @change="e => quickUpdateStatus(order, e.target.value)"
                                    class="form-select form-select-sm rounded-pill fw-bold text-center py-2 px-3 border"
                                    :class="getStatusSelectClass(order.status)"
                                    style="font-size: 11px; width: 130px; cursor: pointer; border: 1px solid transparent;"
                                >
                                    <option value="pending" class="bg-white text-dark">⏳ Chờ xử lý</option>
                                    <option value="confirmed" class="bg-white text-dark">📋 Đã xác nhận</option>
                                    <option value="shipping" class="bg-white text-dark">🚚 Đang giao</option>
                                    <option value="delivered" class="bg-white text-dark">✅ Đã giao</option>
                                    <option value="cancelled" class="bg-white text-dark">❌ Đã hủy</option>
                                </select>
                            </td>

                            <!-- Tổng tiền -->
                            <td class="text-end fw-bold text-dark font-monospace ps-2">
                                {{ formatPrice(order.totalAmount) }}
                            </td>

                            <!-- Các hành động trên dòng -->
                            <td class="text-center pe-4">
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <button 
                                        class="btn btn-sm btn-outline-dark fw-semibold d-flex align-items-center gap-2 px-3" 
                                        @click="openDetails(order)"
                                        title="Xem chi tiết"
                                    >
                                        <i class="bi bi-eye"></i>
                                        <span>Xem</span>
                                    </button>
                                    <button 
                                        class="btn btn-sm btn-outline-danger border-0 p-2 rounded-circle hover-bg-danger bg-opacity-10" 
                                        @click="openDeleteModal(order)"
                                        title="Xóa đơn hàng"
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Footer -->
            <div v-if="totalPages > 1" class="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages }} (tổng {{ filteredOrders.length }} đơn hàng)</span>
                <nav>
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link shadow-none" @click="currentPage = 1" style="cursor: pointer;">Đầu</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link shadow-none" @click="currentPage--" style="cursor: pointer;">Trước</button>
                        </li>
                        <li
                            v-for="page in totalPages"
                            :key="page"
                            class="page-item"
                            :class="{ active: currentPage === page }"
                        >
                            <button class="page-link shadow-none" @click="currentPage = page" style="cursor: pointer;">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link shadow-none" @click="currentPage++" style="cursor: pointer;">Sau</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link shadow-none" @click="currentPage = totalPages" style="cursor: pointer;">Cuối</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- ─── NGĂN KÉO TRƯỢT (Slide-over Offcanvas bên phải) ─────── -->
        <!-- Lớp phủ nền (Backdrop) -->
        <div v-if="selectedOrder" class="offcanvas-backdrop fade show" style="z-index: 1040;" @click="closeDetails"></div>

        <!-- Thân ngăn kéo Offcanvas -->
        <div 
            v-if="selectedOrder" 
            class="offcanvas offcanvas-end show d-flex border-0 shadow-lg" 
            tabindex="-1" 
            style="width: 580px; max-width: 100vw; z-index: 1050; visibility: visible;"
        >
            
            <!-- Tiêu đề ngăn kéo -->
            <div class="offcanvas-header border-bottom p-3 d-flex align-items-center justify-content-between bg-dark text-white">
                <div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="fs-5 fw-bold font-monospace">{{ selectedOrder.code }}</span>
                        <button 
                            class="btn btn-link text-white-50 p-1 d-flex align-items-center border-0"
                            @click="copyCode(selectedOrder.code)"
                            title="Sao chép"
                        >
                            <i class="bi" :class="activeCopyId === selectedOrder.code ? 'bi-check-circle-fill text-success' : 'bi-copy'"></i>
                        </button>
                    </div>
                    <div class="small text-white-50 font-monospace mt-1" style="font-size: 11px;">
                        Đặt lúc: {{ selectedOrder.createdAt }}
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-light btn-sm border-secondary d-flex align-items-center gap-2 px-3" @click="printInvoice">
                        <i class="bi bi-printer"></i>
                        <span>In</span>
                    </button>
                    <button type="button" class="btn-close btn-close-white" @click="closeDetails" aria-label="Close"></button>
                </div>
            </div>

            <!-- Nội dung ngăn kéo (Cho phép cuộn) -->
            <div class="offcanvas-body p-4 overflow-y-auto flex-fill">
                    
                    <!-- Phần Tiến trình dòng thời gian -->
                    <div class="mb-4">
                        <h6 class="text-uppercase text-muted fw-bold small mb-3" style="letter-spacing: 0.5px;">Tiến trình đơn hàng</h6>
                        
                        <!-- Khung theo dõi dòng thời gian -->
                        <div class="order-timeline-card p-3 rounded-3 border bg-light mb-2">
                            
                            <!-- Nếu đơn hàng bị hủy, hiển thị trạng thái đặc biệt -->
                            <div v-if="selectedOrder.status === 'cancelled'" class="text-center py-2 text-danger">
                                <i class="bi bi-x-circle-fill fs-3 d-block mb-1"></i>
                                <span class="fw-bold">ĐƠN HÀNG ĐÃ BỊ HỦY</span>
                                <p class="small text-muted mb-0 mt-1">Mọi cập nhật vận chuyển đã dừng lại.</p>
                            </div>

                            <!-- Dòng thời gian thông thường -->
                            <div v-else class="d-flex justify-content-between text-center position-relative my-2">
                                <div class="position-absolute top-50 start-0 end-0 translate-middle-y bg-secondary bg-opacity-20" style="height: 4px; z-index: 1;"></div>
                                <div class="position-absolute top-50 start-0 bg-success transition-all" :style="{ width: progressPercent, height: '4px', zIndex: 1 }"></div>
                                
                                <div v-for="step in steps" :key="step.key" class="position-relative d-flex flex-column align-items-center" style="z-index: 2; flex: 1;">
                                    <div 
                                        class="rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                                        :class="getStepClass(step.key)" 
                                        style="width: 34px; height: 34px; font-size: 13px; border: 3px solid #fff; transition: all 0.3s;"
                                    >
                                        <i :class="getStepIcon(step.key)"></i>
                                    </div>
                                    <span class="fw-bold mt-2" :class="isStepActive(step.key) ? 'text-dark' : 'text-muted'" style="font-size: 10.5px; white-space: nowrap;">
                                        {{ step.label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Phần Thông tin khách hàng -->
                    <div class="mb-4">
                        <h6 class="text-uppercase text-muted fw-bold small mb-2" style="letter-spacing: 0.5px;">Thông tin khách hàng</h6>
                        <div class="p-3 border rounded-3 bg-white">
                            <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                                <span class="text-muted small">Người nhận</span>
                                <span class="fw-bold text-dark">{{ selectedOrder.customerName }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                                <span class="text-muted small">Số điện thoại</span>
                                <span class="font-monospace fw-semibold text-dark">{{ selectedOrder.customerPhone }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                                <span class="text-muted small">Email</span>
                                <span class="text-secondary small font-monospace">{{ selectedOrder.customerEmail }}</span>
                            </div>
                            <div class="d-flex flex-column pt-1">
                                <span class="text-muted small mb-1">Địa chỉ giao hàng</span>
                                <span class="small fw-semibold text-dark lh-sm">{{ selectedOrder.shippingAddress }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Phần Danh sách sản phẩm đã đặt -->
                    <div class="mb-4">
                        <h6 class="text-uppercase text-muted fw-bold small mb-2" style="letter-spacing: 0.5px;">Chi tiết món đã đặt</h6>
                        <div class="border rounded-3 overflow-hidden bg-white">
                            <div class="table-responsive">
                                <table class="table table-borderless align-middle mb-0" style="font-size: 13px;">
                                    <thead class="table-light border-bottom text-muted">
                                        <tr>
                                            <th>Món ăn / Đồ uống</th>
                                            <th class="text-center" style="width: 60px;">SL</th>
                                            <th class="text-end" style="width: 100px;">Đơn giá</th>
                                            <th class="text-end" style="width: 100px;">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in selectedOrder.items" :key="item.name" class="border-bottom border-secondary border-opacity-10">
                                            <td>
                                                <div class="d-flex align-items-center gap-2 py-1">
                                                    <img 
                                                        :src="item.image" 
                                                        :alt="item.name" 
                                                        class="rounded object-fit-cover shadow-sm bg-light"
                                                        width="38" height="38"
                                                        @error="e => e.target.src='https://placehold.co/38x38?text=?'"
                                                    />
                                                    <div class="fw-semibold text-dark text-break lh-sm">{{ item.name }}</div>
                                                </div>
                                            </td>
                                            <td class="text-center font-monospace">{{ item.quantity }}</td>
                                            <td class="text-end font-monospace text-secondary">{{ formatPrice(item.price) }}</td>
                                            <td class="text-end font-monospace fw-semibold text-dark">{{ formatPrice(item.price * item.quantity) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Các tính toán tài chính (Hóa đơn) -->
                    <div class="mb-4">
                        <div class="p-3 border rounded-3 bg-white">
                            <div class="d-flex align-items-center justify-content-between mb-2 small text-secondary">
                                <span>Tạm tính</span>
                                <span class="font-monospace">{{ formatPrice(selectedOrder.subtotal) }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between mb-2 small text-secondary">
                                <span>Phí vận chuyển</span>
                                <span class="font-monospace">+{{ formatPrice(selectedOrder.shippingFee) }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between pb-2 mb-2 small text-danger border-bottom border-secondary border-opacity-10">
                                <span>Khuyến mãi</span>
                                <span class="font-monospace">-{{ formatPrice(selectedOrder.discount) }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between">
                                <span class="fw-bold text-dark">Tổng cộng</span>
                                <span class="font-monospace fw-bold text-success fs-5">{{ formatPrice(selectedOrder.totalAmount) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Bảng điều khiển tương tác của Admin -->
                    <div class="mb-4 p-3 border border-dark border-opacity-10 rounded-3 bg-light bg-opacity-50">
                        <h6 class="text-uppercase text-dark fw-bold small mb-3" style="letter-spacing: 0.5px;">
                            <i class="bi bi-sliders me-1"></i>
                            Bảng điều khiển Admin
                        </h6>
                        
                        <!-- Chọn trạng thái đơn hàng -->
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-semibold">Thay đổi trạng thái đơn hàng</label>
                            <div class="d-flex flex-wrap gap-2">
                                <button 
                                    v-for="st in ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']"
                                    :key="st"
                                    class="btn btn-sm py-2 px-3 rounded fw-semibold border"
                                    :class="selectedOrder.status === st ? 'btn-dark' : 'btn-outline-secondary bg-white'"
                                    style="font-size: 11.5px;"
                                    @click="changeStatusInDrawer(st)"
                                >
                                    {{ getStatusLabel(st) }}
                                </button>
                            </div>
                        </div>

                        <!-- Nút gạt trạng thái thanh toán -->
                        <div class="mb-3">
                            <div class="form-check form-switch p-0 d-flex align-items-center justify-content-between">
                                <div>
                                    <label class="form-check-label text-muted small fw-semibold cursor-pointer" for="drawer-pay-switch">
                                        Trạng thái thanh toán
                                    </label>
                                    <div class="text-muted small" style="font-size: 11px;">
                                        Hình thức: {{ getPaymentMethodLabel(selectedOrder.paymentMethod) }}
                                    </div>
                                </div>
                                <input 
                                    class="form-check-input ms-0 cursor-pointer" 
                                    type="checkbox" 
                                    role="switch" 
                                    id="drawer-pay-switch"
                                    :checked="selectedOrder.paymentStatus"
                                    @change="togglePaymentInDrawer"
                                    style="width: 44px; height: 22px;"
                                />
                            </div>
                        </div>

                        <!-- Ghi chú nội bộ của Admin -->
                        <div class="mb-0">
                            <label for="drawer-note-input" class="form-label text-muted small fw-semibold">Ghi chú nội bộ</label>
                            <div class="input-group">
                                <textarea 
                                    v-model="noteInput"
                                    class="form-control bg-white shadow-none" 
                                    id="drawer-note-input" 
                                    rows="2"
                                    placeholder="Điền ghi chú giao nhận, chuyển khoản..."
                                    style="font-size: 12.5px; border-top-right-radius: 0; border-bottom-right-radius: 0;"
                                ></textarea>
                                <button 
                                    class="btn btn-dark" 
                                    type="button"
                                    @click="saveNoteInDrawer"
                                    style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Các hành động ở chân ngăn kéo -->
                <div class="border-top p-3 d-flex gap-2 bg-light">
                    <button class="btn btn-outline-secondary flex-fill fw-semibold shadow-sm" @click="closeDetails">Đóng chi tiết</button>
                    <button class="btn btn-danger flex-fill fw-semibold shadow-sm" @click="openDeleteModal(selectedOrder)">
                        <i class="bi bi-trash me-1"></i> Xóa đơn hàng
                    </button>
                </div>

            </div>

        <!-- ─── HỘP THOẠI XÓA BOOTSTRAP 5 (Delete Modal) ───────── -->
        <Teleport to="body">
            <!-- Lớp phủ nền Modal -->
            <transition name="fade">
                <div v-if="showDeleteModal" class="modal-backdrop fade show" style="z-index: 2040;"></div>
            </transition>

            <!-- Khung hộp thoại (Modal Panel) -->
            <transition name="fade">
                <div 
                    v-if="showDeleteModal" 
                    class="modal fade show d-block" 
                    tabindex="-1" 
                    @click.self="closeDeleteModal"
                    style="z-index: 2050;"
                >
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
                            <div class="modal-header border-0 pb-0 pt-3 pe-3">
                                <button type="button" class="btn-close ms-auto" @click="closeDeleteModal"></button>
                            </div>
                            <div class="modal-body text-center pt-0 px-4 pb-3">
                                <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
                                <h5 class="fw-bold text-dark mb-1">Xác nhận xóa đơn hàng</h5>
                                <p class="text-muted small mb-1">Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng</p>
                                <p class="fw-bold font-monospace text-dark mb-1">{{ deleteTarget?.code }}</p>
                                <p class="text-muted small mb-1">thuộc về khách hàng <strong>{{ deleteTarget?.customerName }}</strong>?</p>
                                <small class="text-danger-emphasis bg-danger bg-opacity-10 px-2 py-1 rounded fw-semibold text-xs">
                                    Cảnh báo: Hành động này không thể phục hồi.
                                </small>
                            </div>
                            <div class="modal-footer border-0 pt-2 pb-3 px-3 d-flex gap-2">
                                <button class="btn btn-light flex-fill fw-semibold shadow-sm" style="border: 1px solid #ddd;" @click="closeDeleteModal">Hủy bỏ</button>
                                <button class="btn btn-danger flex-fill fw-semibold shadow-sm" @click="confirmDelete">
                                    <i class="bi bi-trash me-1"></i> Xác nhận xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>

    </div>
</template>

<style scoped>
/* Trợ giúp tiện ích nhỏ (Micro Helpers) */
.cursor-pointer { cursor: pointer; }

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
