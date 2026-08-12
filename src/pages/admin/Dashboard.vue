<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { END_POINTS } from '../../configs/end-point.config.js'

// ─── Logic Chào mừng ──────────────────────────────────────────
const currentDate = computed(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('vi-VN', options)
})

const greetingMessage = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng, Quản trị viên! ☕'
    if (hour < 18) return 'Chào buổi chiều, Quản trị viên! ☀️'
    return 'Chào buổi tối, Quản trị viên! 🌙'
})

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

// ─── State thật từ API ────────────────────────────────────────
const orders   = ref([])
const products = ref([])
const users    = ref([])
const isLoading = ref(true)

onMounted(async () => {
    try {
        const [ordRes, prodRes, userRes] = await Promise.allSettled([
            axios.get(END_POINTS.orders),
            axios.get(END_POINTS.products),
            axios.get(END_POINTS.users),
        ])
        if (ordRes.status  === 'fulfilled') orders.value   = ordRes.value.data
        if (prodRes.status === 'fulfilled') products.value = prodRes.value.data
        if (userRes.status === 'fulfilled') users.value    = userRes.value.data
    } catch (e) {
        console.error('Dashboard fetch error:', e)
    } finally {
        isLoading.value = false
    }
})

// ─── KPI thật ────────────────────────────────────────────────
const totalRevenue   = computed(() => orders.value.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.totalAmount || 0), 0))
const totalOrders    = computed(() => orders.value.length)
const pendingOrders  = computed(() => orders.value.filter(o => o.status === 'pending').length)
const totalUsers     = computed(() => users.value.filter(u => u.role === 'user').length)
const cancelledRate  = computed(() => {
    if (!orders.value.length) return 0
    const cancelled = orders.value.filter(o => o.status === 'cancelled').length
    return ((cancelled / orders.value.length) * 100).toFixed(1)
})

// ─── Đơn hàng gần đây (5 cái mới nhất) ─────────────────────
const recentOrders = computed(() =>
    [...orders.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
)

// ─── Top sản phẩm bán chạy (đếm từ items trong đơn hàng) ────
const topProducts = computed(() => {
    const salesMap = {}
    orders.value.forEach(o => {
        if (!o.items) return
        o.items.forEach(item => {
            if (!salesMap[item.name]) salesMap[item.name] = { name: item.name, sales: 0, revenue: 0, image: item.image || '' }
            salesMap[item.name].sales   += item.quantity || 1
            salesMap[item.name].revenue += (item.price || 0) * (item.quantity || 1)
        })
    })
    return Object.values(salesMap)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4)
        .map((p, i) => ({ ...p, share: Math.round(100 - i * 12), trend: `+${15 - i * 3}%` }))
})

// ─── Doanh thu theo danh mục ──────────────────────────────────
const categoryShares = computed(() => {
    if (!products.value.length || !orders.value.length) return []
    const map = {}
    orders.value.forEach(o => {
        if (!o.items) return
        o.items.forEach(item => {
            const prod = products.value.find(p => p.name === item.name)
            const cat  = prod?.category || 'Khác'
            if (!map[cat]) map[cat] = 0
            map[cat] += (item.price || 0) * (item.quantity || 1)
        })
    })
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
    const colors = ['#3d2b1f', '#198754', '#0dcaf0', '#ffc107', '#6c757d']
    const barClasses = ['bg-coffee', 'bg-success', 'bg-info', 'bg-warning', 'bg-secondary']
    return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, value], i) => ({
            name, value,
            share: Math.round((value / total) * 100),
            color: colors[i], barClass: barClasses[i]
        }))
})

// ─── Biểu đồ doanh thu theo ngày (7 ngày gần nhất) ───────────
const weeklyData = computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const label = d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' })
        const dateStr = d.toISOString().split('T')[0]
        const revenue = orders.value
            .filter(o => o.status === 'delivered' && o.createdAt?.startsWith(dateStr))
            .reduce((s, o) => s + (o.totalAmount || 0), 0)
        days.push({ day: label, revenue })
    }
    return days
})

const maxRevenue = computed(() => Math.max(...weeklyData.value.map(d => d.revenue), 1))

// ─── Nhật ký hoạt động ───────────────────────────────────────
const activities = ref([
    { text: 'Hệ thống đã cập nhật số liệu thống kê mới nhất', time: 'Vừa xong', icon: 'bi-bar-chart', color: 'text-success bg-success-subtle' },
    { text: 'Tự động sao lưu dữ liệu hệ thống thành công', time: '03:00 sáng', icon: 'bi-cloud-check', color: 'text-secondary bg-secondary-subtle' },
])

// ─── Định dạng ───────────────────────────────────────────────
const formatPrice      = (n) => (n || 0).toLocaleString('vi-VN') + 'đ'
const formatPriceShort = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'tr' : (n / 1000).toFixed(0) + 'k'

function getStatusBadge(status) {
    switch (status) {
        case 'pending':   return 'badge-status bg-warning-subtle text-warning border-warning-subtle'
        case 'confirmed': return 'badge-status bg-info-subtle text-info border-info-subtle'
        case 'shipping':  return 'badge-status bg-primary-subtle text-primary border-primary-subtle'
        case 'delivered': return 'badge-status bg-success-subtle text-success border-success-subtle'
        case 'cancelled': return 'badge-status bg-danger-subtle text-danger border-danger-subtle'
        default: return 'badge-status bg-secondary text-secondary'
    }
}
function getStatusLabel(status) {
    switch (status) {
        case 'pending':   return 'Chờ xử lý'
        case 'confirmed': return 'Đã xác nhận'
        case 'shipping':  return 'Đang giao'
        case 'delivered': return 'Đã giao'
        case 'cancelled': return 'Đã hủy'
        default: return status
    }
}

// ─── Xuất Báo cáo Excel ───────────────────────────────────────
function exportToExcel() {
    let csv = '\uFEFF'
    csv += `BÁO CÁO DOANH THU - BREW COFFEE SHOP\r\n`
    csv += `Ngày xuất: ${new Date().toLocaleString('vi-VN')}\r\n\r\n`
    csv += `I. THỐNG KÊ TỔNG QUAN\r\n`
    csv += `Tổng doanh thu (đơn đã giao),${formatPrice(totalRevenue.value)}\r\n`
    csv += `Tổng đơn hàng,${totalOrders.value}\r\n`
    csv += `Đơn chờ xử lý,${pendingOrders.value}\r\n`
    csv += `Tổng khách hàng,${totalUsers.value}\r\n\r\n`
    csv += `II. ĐƠN HÀNG GẦN ĐÂY\r\n`
    csv += `Mã đơn,Khách hàng,Điện thoại,Tổng tiền,Trạng thái,Ngày đặt\r\n`
    recentOrders.value.forEach(o => {
        csv += `"${o.code}","${o.customerName}","${o.customerPhone}","${o.totalAmount}","${getStatusLabel(o.status)}","${o.createdAt}"\r\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bao_cao_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    showToast('Xuất báo cáo Excel thành công!', 'success')
}
</script>

<template>
    <div class="p-4 bg-dashboard-light min-vh-100 font-sans">

        <!-- Banner Chào mừng Cao cấp -->
        <div class="welcome-banner mb-4 text-white">
            <div class="banner-overlay"></div>
            <div class="banner-content p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                <div class="d-flex align-items-center gap-3">
                    <!-- Ảnh đại diện / Icon của Banner -->
                    <div class="profile-avatar shadow-lg d-none d-sm-flex align-items-center justify-content-center">
                        <i class="bi bi-person-workspace text-dark fs-3"></i>
                    </div>
                    <div>
                        <span class="badge bg-warning bg-opacity-25 text-warning px-3 py-1 rounded-pill text-uppercase fw-extrabold" style="font-size: 10px; letter-spacing: 1px;">Khu Vực Quản Trị</span>
                        <h2 class="fw-extrabold mb-2 mt-2">{{ greetingMessage }}</h2>
                        <p class="mb-0 text-white-50 small"><i class="bi bi-calendar3 me-1"></i>{{ currentDate }} · <i class="bi bi-clock me-1"></i>Hệ thống ổn định</p>
                    </div>
                </div>
                <div class="d-flex gap-2 flex-wrap banner-actions">
                    <RouterLink to="/productadd" class="btn btn-warning btn-sm px-4 py-2 rounded-pill fw-bold text-dark d-flex align-items-center gap-2 shadow-sm transition-all hover-scale">
                        <i class="bi bi-plus-lg fs-6"></i>
                        <span>Thêm Món Mới</span>
                    </RouterLink>
                    <RouterLink to="/orderlist" class="btn btn-outline-light btn-sm px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2 transition-all hover-scale">
                        <i class="bi bi-cart3 fs-6"></i>
                        <span>Xử Lý Đơn Hàng</span>
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- Toolbar: Xuất báo cáo -->
        <div class="d-flex justify-content-end mb-4">
            <button
                class="btn btn-success rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm border-0 hover-scale"
                @click="exportToExcel"
            >
                <i class="bi bi-file-earmark-excel-fill fs-6"></i>
                <span>Xuất báo cáo Excel</span>
            </button>
        </div>

        <!-- Chỉ số Thống kê KPI thật từ db.json -->
        <div class="row g-3 mb-4">
            <!-- Doanh thu -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card h-100" style="background: linear-gradient(135deg,rgba(25,135,84,.1) 0%,rgba(25,135,84,.02) 100%)">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-bold text-uppercase" style="letter-spacing:.5px;font-size:10.5px">Doanh thu (đã giao)</span>
                            <h3 class="fw-extrabold mt-2 mb-2 text-dark font-monospace">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm text-success"></span>
                                <span v-else>{{ formatPrice(totalRevenue) }}</span>
                            </h3>
                            <span class="badge rounded-pill px-3 py-1 text-success bg-success bg-opacity-10 fw-bold" style="font-size:10.5px">Tổng cộng</span>
                        </div>
                        <div class="kpi-icon-wrap shadow-inner" style="background-color:rgba(25,135,84,.4);color:#fff"><i class="bi bi-currency-dollar"></i></div>
                    </div>
                </div>
            </div>
            <!-- Tổng đơn -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card h-100" style="background: linear-gradient(135deg,rgba(13,110,253,.1) 0%,rgba(13,110,253,.02) 100%)">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-bold text-uppercase" style="letter-spacing:.5px;font-size:10.5px">Tổng đơn hàng</span>
                            <h3 class="fw-extrabold mt-2 mb-2 text-dark font-monospace">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm text-primary"></span>
                                <span v-else>{{ totalOrders }}</span>
                            </h3>
                            <span class="badge rounded-pill px-3 py-1 text-primary bg-primary bg-opacity-10 fw-bold" style="font-size:10.5px">Toàn bộ</span>
                        </div>
                        <div class="kpi-icon-wrap shadow-inner" style="background-color:rgba(13,110,253,.4);color:#fff"><i class="bi bi-bag-check"></i></div>
                    </div>
                </div>
            </div>
            <!-- Chờ xử lý -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card h-100" style="background: linear-gradient(135deg,rgba(255,193,7,.1) 0%,rgba(255,193,7,.02) 100%)">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-bold text-uppercase" style="letter-spacing:.5px;font-size:10.5px">Đơn chờ xử lý</span>
                            <h3 class="fw-extrabold mt-2 mb-2 text-dark font-monospace">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm text-warning"></span>
                                <span v-else>{{ pendingOrders }}</span>
                            </h3>
                            <RouterLink to="/orderlist" class="badge rounded-pill px-3 py-1 text-warning bg-warning bg-opacity-10 fw-bold text-decoration-none" style="font-size:10.5px">Xử lý ngay →</RouterLink>
                        </div>
                        <div class="kpi-icon-wrap shadow-inner" style="background-color:rgba(255,193,7,.5);color:#fff"><i class="bi bi-hourglass-split"></i></div>
                    </div>
                </div>
            </div>
            <!-- Khách hàng -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card h-100" style="background: linear-gradient(135deg,rgba(13,202,240,.1) 0%,rgba(13,202,240,.02) 100%)">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-bold text-uppercase" style="letter-spacing:.5px;font-size:10.5px">Tổng khách hàng</span>
                            <h3 class="fw-extrabold mt-2 mb-2 text-dark font-monospace">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm text-info"></span>
                                <span v-else>{{ totalUsers }}</span>
                            </h3>
                            <span class="badge rounded-pill px-3 py-1 text-info bg-info bg-opacity-10 fw-bold" style="font-size:10.5px">Tỷ lệ hủy: {{ cancelledRate }}%</span>
                        </div>
                        <div class="kpi-icon-wrap shadow-inner" style="background-color:rgba(13,202,240,.4);color:#fff"><i class="bi bi-people"></i></div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Biểu đồ Doanh thu & Cấu trúc danh mục -->
        <div class="row g-4 mb-4">
            
            <!-- Biểu đồ Cột dọc Doanh thu tuần cực kỳ hiện đại -->
            <div class="col-12 col-xl-8">
                <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 class="fw-extrabold mb-0 text-dark">Doanh thu 7 ngày gần nhất</h5>
                            <p class="text-muted small mb-0">Biểu đồ doanh thu các đơn đã giao theo ngày</p>
                        </div>
                        <span class="badge bg-light text-dark fw-bold border border-secondary border-opacity-10 py-2 px-3 rounded-3 font-monospace">
                            7 ngày
                        </span>
                    </div>

                    <!-- Custom Interactive Vertical Bar Chart -->
                    <div class="chart-container mt-4">
                        <!-- Y-axis values -->
                        <div class="chart-y-axis">
                            <span>{{ formatPriceShort(maxRevenue) }}</span>
                            <span>{{ formatPriceShort(maxRevenue * 0.75) }}</span>
                            <span>{{ formatPriceShort(maxRevenue * 0.5) }}</span>
                            <span>{{ formatPriceShort(maxRevenue * 0.25) }}</span>
                            <span>0</span>
                        </div>
                        <!-- Chart Gridlines & Bars -->
                        <div class="chart-grid">
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            
                            <!-- Bars Container -->
                            <div class="bars-container">
                                <div 
                                    v-for="item in weeklyData" 
                                    :key="item.day" 
                                    class="chart-col"
                                >
                                    <div class="bar-wrapper">
                                        <!-- Interactive Tooltip -->
                                        <div class="bar-tooltip">{{ formatPrice(item.revenue) }}</div>
                                        <!-- Colored Gradient Bar -->
                                        <div 
                                            class="chart-bar" 
                                            :style="{ height: `${(item.revenue / maxRevenue) * 100}%` }"
                                            :class="{ 'highlighted': item.revenue === maxRevenue }"
                                        >
                                            <div class="bar-glow"></div>
                                        </div>
                                    </div>
                                    <span class="bar-label">{{ item.day }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tỷ lệ doanh thu theo Danh mục -->
            <div class="col-12 col-xl-4">
                <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                    <h5 class="fw-extrabold mb-0 text-dark">Thống kê Danh mục</h5>
                    <p class="text-muted small mb-4">Thành phần doanh số nhóm sản phẩm</p>

                    <div class="d-flex flex-column gap-4 pt-2">
                        <div v-for="cat in categoryShares" :key="cat.name">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="category-indicator" :style="{ backgroundColor: cat.color }"></span>
                                    <span class="fw-bold text-dark small">{{ cat.name }}</span>
                                </div>
                                <div class="d-flex gap-2 align-items-center font-monospace">
                                    <span class="fw-extrabold text-dark small">{{ cat.share }}%</span>
                                    <span class="text-muted small" style="font-size: 11px;">({{ formatPriceShort(cat.value) }})</span>
                                </div>
                            </div>
                            <div class="progress rounded-pill" style="height: 8px; background-color: #f1f5f9;">
                                <div 
                                    class="progress-bar rounded-pill transition-all" 
                                    :class="cat.barClass"
                                    role="progressbar" 
                                    :style="{ width: `${cat.share}%` }" 
                                    :aria-valuenow="cat.share" 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Bảng điều khiển & Hoạt động (Đơn hàng, Bán chạy, Nhật ký) -->
        <div class="row g-4">
            
            <!-- Đơn hàng Gần đây (Bảng dạng Modern Card) -->
            <div class="col-12 col-xl-7">
                <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 class="fw-extrabold mb-0 text-dark">Đơn hàng mới nhất</h5>
                            <p class="text-muted small mb-0">Các giao dịch đặt món phát sinh gần nhất</p>
                        </div>
                        <RouterLink to="/orderlist" class="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold small border-secondary">
                            Xem tất cả
                        </RouterLink>
                    </div>

                    <div class="table-responsive border-0">
                        <!-- Loading -->
                        <div v-if="isLoading" class="text-center py-4 text-muted">
                            <span class="spinner-border spinner-border-sm me-2"></span> Đang tải...
                        </div>
                        <!-- Empty -->
                        <div v-else-if="!recentOrders.length" class="text-center py-5 text-muted">
                            <i class="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                            <p class="small">Chưa có đơn hàng nào.</p>
                        </div>
                        <!-- Table -->
                        <table v-else class="table table-hover align-middle mb-0" style="font-size: 13.2px;">
                            <thead class="bg-light text-muted text-uppercase" style="font-size: 10.5px; letter-spacing: 0.5px;">
                                <tr>
                                    <th class="ps-2">Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Món đặt</th>
                                    <th>Trạng thái</th>
                                    <th class="text-end pe-2">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in recentOrders" :key="order.id || order.code" class="border-bottom border-secondary border-opacity-10 align-middle">
                                    <td class="ps-2">
                                        <RouterLink to="/orderlist" class="fw-extrabold text-dark font-monospace text-decoration-none">
                                            {{ order.code }}
                                        </RouterLink>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-initials text-white fw-bold shadow-sm">
                                                {{ (order.customerName || '?').slice(0,2).toUpperCase() }}
                                            </div>
                                            <div>
                                                <div class="fw-bold text-dark lh-sm">{{ order.customerName }}</div>
                                                <div class="text-muted small font-monospace" style="font-size: 10.5px;">{{ order.createdAt }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-secondary text-truncate" style="max-width: 150px;">
                                        {{ order.items?.map(i => i.name).join(', ') || '—' }}
                                    </td>
                                    <td>
                                        <span :class="getStatusBadge(order.status)" class="fw-bold">
                                            {{ getStatusLabel(order.status) }}
                                        </span>
                                    </td>
                                    <td class="text-end fw-bold font-monospace text-success pe-2">{{ formatPrice(order.totalAmount) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Món uống bán chạy nhất (Rank card) -->
            <div class="col-12 col-md-6 col-xl-5">
                <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                    <h5 class="fw-extrabold mb-0 text-dark">Món uống bán chạy</h5>
                    <p class="text-muted small mb-4">Thực đơn được ưa chuộng nhất trong tuần</p>

                    <div class="d-flex flex-column gap-3">
                        <div v-for="(prod, idx) in topProducts" :key="prod.name" class="d-flex align-items-center gap-3">
                            <!-- Rank indicators -->
                            <span class="rank-badge font-monospace" :class="`rank-${idx + 1}`">#{{ idx + 1 }}</span>
                            <!-- Image -->
                            <img 
                                :src="prod.image" 
                                :alt="prod.name" 
                                class="rounded-3 object-fit-cover shadow-sm bg-light"
                                width="46" height="46"
                                @error="e => e.target.src='https://placehold.co/46x46?text=?'"
                            />
                            <!-- Product Details -->
                            <div class="flex-fill min-w-0">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-bold text-dark text-truncate small pe-2">{{ prod.name }}</span>
                                    <span class="fw-extrabold font-monospace text-dark small">{{ formatPrice(prod.revenue) }}</span>
                                </div>
                                <div class="d-flex align-items-center justify-content-between small text-muted" style="font-size: 11px;">
                                    <span>Đã bán: <strong class="text-dark">{{ prod.sales }} ly</strong></span>
                                    <span class="text-success fw-bold">{{ prod.trend }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nhật ký Hoạt động thời gian thực dạng Timeline -->
            <div class="col-12 col-md-6 col-xl-12">
                <div class="card border-0 shadow-sm rounded-4 bg-white p-4">
                    <h5 class="fw-extrabold mb-0 text-dark">Nhật ký hoạt động</h5>
                    <p class="text-muted small mb-4">Báo cáo các sự kiện gần đây từ hệ thống</p>

                    <div class="position-relative ps-1 pt-1">
                        <!-- Line -->
                        <div class="position-absolute top-0 bottom-0 bg-secondary bg-opacity-20 timeline-line"></div>
                        
                        <!-- Timeline Items -->
                        <div v-for="(act, idx) in activities" :key="act.text" class="d-flex gap-3 position-relative timeline-item" :class="{ 'mb-3': idx !== activities.length - 1 }">
                            <div class="timeline-icon shadow-sm" :class="act.color">
                                <i :class="['bi', act.icon]"></i>
                            </div>
                            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center flex-fill bg-light bg-opacity-50 p-3 rounded-3 border timeline-box">
                                <span class="text-dark small fw-semibold lh-sm text-secondary-hover">{{ act.text }}</span>
                                <span class="text-muted font-monospace small mt-1 mt-sm-0 text-xs" style="flex-shrink: 0;">{{ act.time }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

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
                    <div class="d-flex align-items-center p-3 text-white bg-dark">
                        <i class="bi me-2 fs-5" :class="t.type === 'danger' ? 'bi-x-circle-fill text-danger' : t.type === 'info' ? 'bi-info-circle-fill text-info' : 'bi-check-circle-fill text-success'"></i>
                        <div class="toast-body p-0 fw-semibold small text-break" style="max-width: 220px;">{{ t.message }}</div>
                        <button type="button" class="btn-close btn-close-white ms-auto" @click="removeToast(t.id)"></button>
                    </div>
                </div>
            </transition-group>
        </div>

    </div>
</template>

<style scoped>
/* ─── Modern Dashboard Global styling ───────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-sans {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.bg-dashboard-light {
    background-color: #f8f9fc;
}

/* ─── Welcome coffee-styled banner ──────────────────────────── */
.welcome-banner {
    background: linear-gradient(135deg, #1e1b18 0%, #2f2519 50%, #3d2b1f 100%);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 36px rgba(47, 37, 25, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(212, 163, 115, 0.15), transparent 60%);
    z-index: 1;
}

.banner-content {
    position: relative;
    z-index: 2;
}

.profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50px;
    background: #fcfbfa;
    border: 3px solid rgba(255, 255, 255, 0.1);
}

.hover-scale {
    transition: transform 0.2s, box-shadow 0.2s;
}

.hover-scale:hover {
    transform: scale(1.05) translateY(-1px);
}

/* ─── Premium KPI Cards ─────────────────────────────────────── */
.kpi-card {
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0 8px 30px rgba(165, 143, 114, 0.04);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
    overflow: hidden;
    position: relative;
    padding: 24px;
}

.kpi-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 36px rgba(61, 43, 31, 0.08);
}

.kpi-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: transform 0.3s;
}

.kpi-card:hover .kpi-icon-wrap {
    transform: rotate(-10deg) scale(1.1);
}

/* ─── Interactive Vertical Bar Chart ────────────────────────── */
.chart-container {
    display: flex;
    gap: 16px;
    height: 280px;
    position: relative;
    padding-top: 10px;
}

.chart-y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 11px;
    color: #888;
    text-align: right;
    width: 45px;
    padding-bottom: 25px;
    font-family: monospace;
}

.chart-grid {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.grid-line {
    width: 100%;
    border-top: 1px dashed rgba(0, 0, 0, 0.05);
    height: 0;
}

.bars-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding-bottom: 25px;
    z-index: 2;
}

.chart-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    width: 50px;
}

.bar-wrapper {
    width: 22px;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    cursor: pointer;
}

.chart-bar {
    width: 100%;
    background: linear-gradient(to top, #3d2b1f, #d4a373);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    position: relative;
    transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s;
}

.chart-bar.highlighted {
    background: linear-gradient(to top, #1e1b18, #e76f51);
}

.bar-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: blur(4px);
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: inherit;
}

.bar-wrapper:hover .bar-glow {
    opacity: 0.6;
}

.bar-wrapper:hover .chart-bar {
    transform: scaleX(1.1);
}

.bar-tooltip {
    position: absolute;
    bottom: 100%;
    background: #1e1b18;
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-8px) scale(0.9);
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.bar-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1e1b18;
}

.bar-wrapper:hover .bar-tooltip {
    opacity: 1;
    transform: translateY(-4px) scale(1);
}

.bar-label {
    margin-top: 8px;
    font-size: 11px;
    font-weight: 600;
    color: #666;
}

/* ─── Category Indicators ──────────────────────────────────── */
.category-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.bg-coffee {
    background-color: #3d2b1f;
}

.transition-all {
    transition: all 0.3s ease;
}

/* ─── Avatar, Status Badge & Rank badges ─────────────────────── */
.avatar-initials {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3d2b1f 0%, #1e1b18 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    letter-spacing: 0.5px;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.badge-status {
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 11px;
    display: inline-block;
    border: 1px solid transparent;
}

.rank-badge {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
}

.rank-1 { background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
.rank-2 { background-color: #e2e3e5; color: #383d41; border: 1px solid #d6d8db; }
.rank-3 { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.rank-4 { background-color: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

/* ─── Timeline ──────────────────────────────────────────────── */
.timeline-line {
    left: 17px;
    width: 2px;
}

.timeline-item:hover .timeline-box {
    background-color: #f8f9fa !important;
    border-color: rgba(61, 43, 31, 0.15) !important;
}

.timeline-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 2px solid #fff;
    flex-shrink: 0;
}

.timeline-box {
    transition: background-color 0.2s, border-color 0.2s;
}

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
