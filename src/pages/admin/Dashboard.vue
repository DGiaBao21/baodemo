<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

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
    setTimeout(() => {
        removeToast(id)
    }, 3000)
}
function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
}

// ─── Bộ lọc Thời gian (Timeframe State) ──────────────────────
const selectedTimeframe = ref('month')

function getTimeframeLabel(tf) {
    switch (tf) {
        case 'day': return 'Hôm nay'
        case 'week': return 'Tuần này'
        case 'month': return 'Tháng này'
        case 'year': return 'Năm nay'
        default: return 'Tháng này'
    }
}

// ─── Cấu trúc dữ liệu động theo bộ lọc thời gian ──────────────
const dashboardData = {
    day: {
        chartTitle: 'Doanh thu theo Giờ',
        chartLabel: 'Biểu đồ bán hàng theo khung giờ trong ngày',
        kpis: [
            { title: 'Doanh thu hôm nay', value: 2450000, isPrice: true, trend: '+4.2%', trendText: 'so với hôm qua', trendPositive: true, icon: 'bi-currency-dollar', color: 'success', gradient: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(25, 135, 84, 0.02) 100%)', glowColor: 'rgba(25, 135, 84, 0.4)' },
            { title: 'Đơn hàng hôm nay', value: 48, isPrice: false, trend: '+8.3%', trendText: 'so với hôm qua', trendPositive: true, icon: 'bi-bag-check', color: 'primary', gradient: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.02) 100%)', glowColor: 'rgba(13, 110, 253, 0.4)' },
            { title: 'Khách hàng mới hôm nay', value: 12, isPrice: false, trend: '+20.0%', trendText: 'so với hôm qua', trendPositive: true, icon: 'bi-people', color: 'info', gradient: 'linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(13, 202, 240, 0.02) 100%)', glowColor: 'rgba(13, 202, 240, 0.4)' },
            { title: 'Tỷ lệ hủy hôm nay', value: 0.0, isPrice: false, isPercent: true, trend: '0.0%', trendText: 'mức tối thiểu', trendPositive: true, icon: 'bi-graph-down-arrow', color: 'danger', gradient: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.02) 100%)', glowColor: 'rgba(220, 53, 69, 0.4)' }
        ],
        weeklyData: [
            { day: '08:00', revenue: 350000 },
            { day: '10:00', revenue: 580000 },
            { day: '12:00', revenue: 420000 },
            { day: '14:00', revenue: 210000 },
            { day: '16:00', revenue: 390000 },
            { day: '18:00', revenue: 650000 },
            { day: '20:00', revenue: 850000 }
        ],
        categoryShares: [
            { name: 'Cà phê', share: 50, value: 1225000, color: '#3d2b1f', barClass: 'bg-coffee' },
            { name: 'Trà trái cây', share: 20, value: 490000, color: '#198754', barClass: 'bg-success' },
            { name: 'Sinh tố', share: 20, value: 490000, color: '#0dcaf0', barClass: 'bg-info' },
            { name: 'Bánh ngọt', share: 10, value: 245000, color: '#ffc107', barClass: 'bg-warning' }
        ],
        recentOrders: [
            { code: 'BREW-8472', customer: 'Nguyễn Văn Nam', items: 'Cà phê sữa + 1 món', amount: 100000, status: 'pending', time: '10 phút trước', initials: 'NN' },
            { code: 'BREW-9123', customer: 'Lê Thị Thu Thảo', items: 'Trà đào cam sả + 1 món', amount: 190000, status: 'confirmed', time: '45 phút trước', initials: 'LT' },
            { code: 'BREW-7341', customer: 'Phạm Minh Hoàng', items: 'Capuchino + 1 món', amount: 120000, status: 'shipping', time: '2 giờ trước', initials: 'PH' }
        ],
        topProducts: [
            { name: 'Cà phê sữa', sales: 18, revenue: 540000, share: 90, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop', trend: '+15%' },
            { name: 'Trà đào cam sả', sales: 12, revenue: 540000, share: 75, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop', trend: '+8%' },
            { name: 'Sinh tố xoài', sales: 8, revenue: 440000, share: 50, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=80&h=80&fit=crop', trend: '+4%' },
            { name: 'Bánh croissant', sales: 6, revenue: 210000, share: 40, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', trend: '+2%' }
        ]
    },
    week: {
        chartTitle: 'Doanh thu Tuần này',
        chartLabel: 'Biểu đồ bán hàng theo các ngày trong tuần',
        kpis: [
            { title: 'Doanh thu tuần này', value: 18250000, isPrice: true, trend: '+9.4%', trendText: 'so với tuần trước', trendPositive: true, icon: 'bi-currency-dollar', color: 'success', gradient: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(25, 135, 84, 0.02) 100%)', glowColor: 'rgba(25, 135, 84, 0.4)' },
            { title: 'Đơn hàng tuần này', value: 420, isPrice: false, trend: '+5.2%', trendText: 'so với tuần trước', trendPositive: true, icon: 'bi-bag-check', color: 'primary', gradient: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.02) 100%)', glowColor: 'rgba(13, 110, 253, 0.4)' },
            { title: 'Khách hàng mới tuần này', value: 95, isPrice: false, trend: '+14.6%', trendText: 'so với tuần trước', trendPositive: true, icon: 'bi-people', color: 'info', gradient: 'linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(13, 202, 240, 0.02) 100%)', glowColor: 'rgba(13, 202, 240, 0.4)' },
            { title: 'Tỷ lệ hủy tuần này', value: 1.5, isPrice: false, isPercent: true, trend: '-0.4%', trendText: 'cải thiện tốt', trendPositive: true, icon: 'bi-graph-down-arrow', color: 'danger', gradient: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.02) 100%)', glowColor: 'rgba(220, 53, 69, 0.4)' }
        ],
        weeklyData: [
            { day: 'Thứ 2', revenue: 1900000 },
            { day: 'Thứ 3', revenue: 2400000 },
            { day: 'Thứ 4', revenue: 2200000 },
            { day: 'Thứ 5', revenue: 2100000 },
            { day: 'Thứ 6', revenue: 2900000 },
            { day: 'Thứ 7', revenue: 3200000 },
            { day: 'Chủ Nhật', revenue: 3650000 }
        ],
        categoryShares: [
            { name: 'Cà phê', share: 46, value: 8395000, color: '#3d2b1f', barClass: 'bg-coffee' },
            { name: 'Trà trái cây', share: 24, value: 4380000, color: '#198754', barClass: 'bg-success' },
            { name: 'Sinh tố', share: 18, value: 3285000, color: '#0dcaf0', barClass: 'bg-info' },
            { name: 'Bánh ngọt', share: 12, value: 2190000, color: '#ffc107', barClass: 'bg-warning' }
        ],
        recentOrders: [
            { code: 'BREW-8472', customer: 'Nguyễn Văn Nam', items: 'Cà phê sữa + 1 món', amount: 100000, status: 'pending', time: '10 phút trước', initials: 'NN' },
            { code: 'BREW-9123', customer: 'Lê Thị Thu Thảo', items: 'Trà đào cam sả + 1 món', amount: 190000, status: 'confirmed', time: '45 phút trước', initials: 'LT' },
            { code: 'BREW-7341', customer: 'Phạm Minh Hoàng', items: 'Capuchino + 1 món', amount: 120000, status: 'shipping', time: '2 giờ trước', initials: 'PH' },
            { code: 'BREW-4821', customer: 'Trần Thanh Vy', items: 'Trà sữa trân châu x4', amount: 195000, status: 'delivered', time: '4 giờ trước', initials: 'TV' }
        ],
        topProducts: [
            { name: 'Cà phê sữa', sales: 110, revenue: 3300000, share: 88, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop', trend: '+10%' },
            { name: 'Trà đào cam sả', sales: 78, revenue: 3510000, share: 78, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop', trend: '+6%' },
            { name: 'Sinh tố xoài', sales: 55, revenue: 3025000, share: 62, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=80&h=80&fit=crop', trend: '+5%' },
            { name: 'Bánh croissant', sales: 48, revenue: 1680000, share: 50, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', trend: '+3%' }
        ]
    },
    month: {
        chartTitle: 'Doanh thu Tháng này',
        chartLabel: 'Biểu đồ bán hàng theo các tuần trong tháng',
        kpis: [
            { title: 'Doanh thu tháng này', value: 48250000, isPrice: true, trend: '+15.8%', trendText: 'so với tháng trước', trendPositive: true, icon: 'bi-currency-dollar', color: 'success', gradient: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(25, 135, 84, 0.02) 100%)', glowColor: 'rgba(25, 135, 84, 0.4)' },
            { title: 'Đơn hàng thành công', value: 1248, isPrice: false, trend: '+8.4%', trendText: 'so với tháng trước', trendPositive: true, icon: 'bi-bag-check', color: 'primary', gradient: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.02) 100%)', glowColor: 'rgba(13, 110, 253, 0.4)' },
            { title: 'Khách hàng mới', value: 384, isPrice: false, trend: '+12.3%', trendText: 'so với tuần trước', trendPositive: true, icon: 'bi-people', color: 'info', gradient: 'linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(13, 202, 240, 0.02) 100%)', glowColor: 'rgba(13, 202, 240, 0.4)' },
            { title: 'Tỷ lệ hủy đơn', value: 2.1, isPrice: false, isPercent: true, trend: '-1.2%', trendText: 'cải thiện tích cực', trendPositive: true, icon: 'bi-graph-down-arrow', color: 'danger', gradient: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.02) 100%)', glowColor: 'rgba(220, 53, 69, 0.4)' }
        ],
        weeklyData: [
            { day: 'Tuần 1', revenue: 9500000 },
            { day: 'Tuần 2', revenue: 11200000 },
            { day: 'Tuần 3', revenue: 12800000 },
            { day: 'Tuần 4', revenue: 14750000 }
        ],
        categoryShares: [
            { name: 'Cà phê', share: 45, value: 21712500, color: '#3d2b1f', barClass: 'bg-coffee' },
            { name: 'Trà trái cây', share: 25, value: 12062500, color: '#198754', barClass: 'bg-success' },
            { name: 'Sinh tố', share: 18, value: 8685000, color: '#0dcaf0', barClass: 'bg-info' },
            { name: 'Bánh ngọt', share: 12, value: 5790000, color: '#ffc107', barClass: 'bg-warning' }
        ],
        recentOrders: [
            { code: 'BREW-8472', customer: 'Nguyễn Văn Nam', items: 'Cà phê sữa + 1 món', amount: 100000, status: 'pending', time: '10 phút trước', initials: 'NN' },
            { code: 'BREW-9123', customer: 'Lê Thị Thu Thảo', items: 'Trà đào cam sả + 1 món', amount: 190000, status: 'confirmed', time: '45 phút trước', initials: 'LT' },
            { code: 'BREW-7341', customer: 'Phạm Minh Hoàng', items: 'Capuchino + 1 món', amount: 120000, status: 'shipping', time: '2 giờ trước', initials: 'PH' },
            { code: 'BREW-4821', customer: 'Trần Thanh Vy', items: 'Trà sữa trân châu x4', amount: 195000, status: 'delivered', time: '4 giờ trước', initials: 'TV' },
            { code: 'BREW-6291', customer: 'Vũ Thị Hải Yến', items: 'Bánh ngọt + 2 món', amount: 170000, status: 'delivered', time: '1 ngày trước', initials: 'HY' }
        ],
        topProducts: [
            { name: 'Cà phê sữa', sales: 320, revenue: 9600000, share: 85, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop', trend: '+12%' },
            { name: 'Trà đào cam sả', sales: 210, revenue: 9450000, share: 72, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop', trend: '+8%' },
            { name: 'Sinh tố xoài', sales: 165, revenue: 9075000, share: 60, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=80&h=80&fit=crop', trend: '+5%' },
            { name: 'Bánh croissant', sales: 140, revenue: 4900000, share: 48, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', trend: '+2%' }
        ]
    },
    year: {
        chartTitle: 'Doanh thu Năm nay',
        chartLabel: 'Biểu đồ bán hàng theo các quý trong năm',
        kpis: [
            { title: 'Doanh thu năm nay', value: 582000000, isPrice: true, trend: '+22.4%', trendText: 'so với năm trước', trendPositive: true, icon: 'bi-currency-dollar', color: 'success', gradient: 'linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(25, 135, 84, 0.02) 100%)', glowColor: 'rgba(25, 135, 84, 0.4)' },
            { title: 'Đơn hàng cả năm', value: 15600, isPrice: false, trend: '+11.8%', trendText: 'so với năm trước', trendPositive: true, icon: 'bi-bag-check', color: 'primary', gradient: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.02) 100%)', glowColor: 'rgba(13, 110, 253, 0.4)' },
            { title: 'Khách hàng năm nay', value: 4200, isPrice: false, trend: '+18.5%', trendText: 'so với năm trước', trendPositive: true, icon: 'bi-people', color: 'info', gradient: 'linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(13, 202, 240, 0.02) 100%)', glowColor: 'rgba(13, 202, 240, 0.4)' },
            { title: 'Tỷ lệ hủy năm nay', value: 1.8, isPrice: false, isPercent: true, trend: '-0.9%', trendText: 'giảm nhẹ tích cực', trendPositive: true, icon: 'bi-graph-down-arrow', color: 'danger', gradient: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.02) 100%)', glowColor: 'rgba(220, 53, 69, 0.4)' }
        ],
        weeklyData: [
            { day: 'Quý 1', revenue: 125000000 },
            { day: 'Quý 2', revenue: 148000000 },
            { day: 'Quý 3', revenue: 139000000 },
            { day: 'Quý 4', revenue: 170000000 }
        ],
        categoryShares: [
            { name: 'Cà phê', share: 43, value: 250260000, color: '#3d2b1f', barClass: 'bg-coffee' },
            { name: 'Trà trái cây', share: 27, value: 157140000, color: '#198754', barClass: 'bg-success' },
            { name: 'Sinh tố', share: 17, value: 98940000, color: '#0dcaf0', barClass: 'bg-info' },
            { name: 'Bánh ngọt', share: 13, value: 75660000, color: '#ffc107', barClass: 'bg-warning' }
        ],
        recentOrders: [
            { code: 'BREW-8472', customer: 'Nguyễn Văn Nam', items: 'Cà phê sữa + 1 món', amount: 100000, status: 'pending', time: '10 phút trước', initials: 'NN' },
            { code: 'BREW-9123', customer: 'Lê Thị Thu Thảo', items: 'Trà đào cam sả + 1 món', amount: 190000, status: 'confirmed', time: '45 phút trước', initials: 'LT' },
            { code: 'BREW-7341', customer: 'Phạm Minh Hoàng', items: 'Capuchino + 1 món', amount: 120000, status: 'shipping', time: '2 giờ trước', initials: 'PH' },
            { code: 'BREW-4821', customer: 'Trần Thanh Vy', items: 'Trà sữa trân châu x4', amount: 195000, status: 'delivered', time: '4 giờ trước', initials: 'TV' },
            { code: 'BREW-6291', customer: 'Vũ Thị Hải Yến', items: 'Bánh ngọt + 2 món', amount: 170000, status: 'delivered', time: '1 ngày trước', initials: 'HY' }
        ],
        topProducts: [
            { name: 'Cà phê sữa', sales: 3840, revenue: 115200000, share: 85, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop', trend: '+15%' },
            { name: 'Trà đào cam sả', sales: 2520, revenue: 113400000, share: 72, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop', trend: '+9%' },
            { name: 'Sinh tố xoài', sales: 1980, revenue: 108900000, share: 60, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=80&h=80&fit=crop', trend: '+4%' },
            { name: 'Bánh croissant', sales: 1680, revenue: 58800000, share: 48, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', trend: '+2%' }
        ]
    }
}

const activeData = computed(() => dashboardData[selectedTimeframe.value])

const kpis = computed(() => activeData.value.kpis)
const weeklyData = computed(() => activeData.value.weeklyData)
const categoryShares = computed(() => activeData.value.categoryShares)
const recentOrders = computed(() => activeData.value.recentOrders)
const topProducts = computed(() => activeData.value.topProducts)

const maxRevenue = computed(() => Math.max(...weeklyData.value.map(d => d.revenue)))

// ─── Nhật ký hoạt động thời gian thực ──────────────────────────
const activities = ref([
    { text: 'Nam Nguyễn đã cập nhật đơn hàng BREW-8472 sang Đang giao', time: '5 phút trước', icon: 'bi-truck', color: 'text-primary bg-primary-subtle' },
    { text: 'Vy Trần đã thêm món mới: Capuchino Latte vào thực đơn', time: '1 giờ trước', icon: 'bi-plus-circle', color: 'text-success bg-success-subtle' },
    { text: 'Khách hàng Hoàng Minh đã hủy đơn hàng BREW-1049', time: '2 giờ trước', icon: 'bi-x-circle', color: 'text-danger bg-danger-subtle' },
    { text: 'Hệ thống tự động sao lưu dữ liệu cơ sở dữ liệu an toàn', time: '03:00 sáng', icon: 'bi-cloud-check', color: 'text-secondary bg-secondary-subtle' },
    { text: 'Chiến dịch khuyến mãi mùa hè đã tự động kích hoạt', time: 'Hôm qua', icon: 'bi-lightning-charge', color: 'text-warning bg-warning-subtle' }
])

// ─── Định dạng dữ liệu hiển thị ──────────────────────────────
const formatPrice = (n) => n.toLocaleString('vi-VN') + 'đ'
const formatPriceShort = (n) => (n / 1000000).toFixed(1) + 'tr'

function getStatusBadge(status) {
    switch (status) {
        case 'pending': return 'badge-status bg-warning-subtle text-warning border-warning-subtle'
        case 'confirmed': return 'badge-status bg-info-subtle text-info border-info-subtle'
        case 'shipping': return 'badge-status bg-primary-subtle text-primary border-primary-subtle'
        case 'delivered': return 'badge-status bg-success-subtle text-success border-success-subtle'
        default: return 'badge-status bg-secondary text-secondary'
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'Chờ xử lý'
        case 'confirmed': return 'Đã xác nhận'
        case 'shipping': return 'Đang giao'
        case 'delivered': return 'Đã giao'
        default: return status
    }
}

// ─── Xuất Báo cáo Excel (CSV with UTF-8 BOM) ───────────────────
function exportToExcel() {
    let csvContent = "\uFEFF"; // Prepend UTF-8 BOM for Vietnamese character compatibility in Excel
    
    // Header & Info
    csvContent += `BÁO CÁO DOANH THU & HOẠT ĐỘNG KINH DOANH - BREW COFFEE SHOP\r\n`;
    csvContent += `Bộ lọc thời gian: ${getTimeframeLabel(selectedTimeframe.value)}\r\n`;
    csvContent += `Ngày giờ xuất bản: ${new Date().toLocaleString('vi-VN')}\r\n\r\n`;
    
    // 1. KPI
    csvContent += `I. CHỈ SỐ THỐNG KÊ CHỦ CHỐT (KPI)\r\n`;
    csvContent += `Chỉ số,Giá trị,Xu hướng,So sánh với kỳ trước\r\n`;
    kpis.value.forEach(kpi => {
        const val = kpi.isPrice ? formatPrice(kpi.value) : (kpi.isPercent ? kpi.value + '%' : kpi.value);
        csvContent += `"${kpi.title}","${val}","${kpi.trend}","${kpi.trendText}"\r\n`;
    });
    csvContent += `\r\n`;
    
    // 2. Chi tiết phân kỳ doanh thu
    csvContent += `II. CHI TIẾT DOANH THU THEO PHÂN KỲ (${activeData.value.chartTitle})\r\n`;
    csvContent += `Phân kỳ,Doanh thu (VNĐ)\r\n`;
    weeklyData.value.forEach(item => {
        csvContent += `"${item.day}","${item.revenue}"\r\n`;
    });
    csvContent += `\r\n`;
    
    // 3. Danh mục
    csvContent += `III. TỶ LỆ DOANH THU THEO DANH MỤC\r\n`;
    csvContent += `Danh mục sản phẩm,Tỷ trọng (%),Doanh thu tương đương (VNĐ)\r\n`;
    categoryShares.value.forEach(cat => {
        csvContent += `"${cat.name}","${cat.share}%","${cat.value}"\r\n`;
    });
    csvContent += `\r\n`;
    
    // 4. Bán chạy
    csvContent += `IV. CÁC MÓN UỐNG BÁN CHẠY NHẤT\r\n`;
    csvContent += `Tên món nước,Số cốc đã bán (ly),Doanh thu mang lại (VNĐ),Xu hướng bán hàng\r\n`;
    topProducts.value.forEach(prod => {
        csvContent += `"${prod.name}","${prod.sales}","${prod.revenue}","${prod.trend}"\r\n`;
    });
    csvContent += `\r\n`;
    
    // 5. Đơn hàng gần đây
    csvContent += `V. DANH SÁCH ĐƠN HÀNG GẦN ĐÂY\r\n`;
    csvContent += `Mã đơn hàng,Tên khách hàng,Món nước đã đặt,Trạng thái,Thời gian đặt,Thành tiền (VNĐ)\r\n`;
    recentOrders.value.forEach(order => {
        csvContent += `"${order.code}","${order.customer}","${order.items}","${getStatusLabel(order.status)}","${order.time}","${order.amount}"\r\n`;
    });
    
    // Download triggers
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    
    const fileName = `Bao_cao_doanh_thu_${selectedTimeframe.value}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Xuất báo cáo doanh thu (${getTimeframeLabel(selectedTimeframe.value).toLowerCase()}) ra file Excel thành công!`, 'success');
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

        <!-- Bộ lọc thời gian & Nút xuất báo cáo Excel -->
        <div class="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="text-secondary small fw-bold text-uppercase me-2"><i class="bi bi-funnel-fill me-1 text-warning"></i>Lọc thống kê:</span>
                    <div class="btn-group rounded-pill overflow-hidden border border-secondary border-opacity-10 p-1 bg-light" role="group" aria-label="Timeframe filter">
                        <button 
                            v-for="tf in ['day', 'week', 'month', 'year']" 
                            :key="tf"
                            type="button" 
                            class="btn btn-sm rounded-pill px-3 fw-bold transition-all"
                            :class="selectedTimeframe === tf ? 'btn-dark text-white shadow-sm' : 'btn-light text-secondary border-0'"
                            @click="selectedTimeframe = tf; showToast(`Đã chuyển bộ lọc sang ${getTimeframeLabel(tf).toLowerCase()}!`, 'info')"
                        >
                            {{ getTimeframeLabel(tf) }}
                        </button>
                    </div>
                </div>
                <button 
                    class="btn btn-success rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm border-0 transition-all hover-scale"
                    @click="exportToExcel"
                >
                    <i class="bi bi-file-earmark-excel-fill fs-6"></i>
                    <span>Xuất báo cáo Excel</span>
                </button>
            </div>
        </div>

        <!-- Chỉ số Thống kê KPI dạng Grid -->
        <div class="row g-3 mb-4">
            <div v-for="kpi in kpis" :key="kpi.title" class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card h-100" :style="{ background: kpi.gradient }">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small fw-bold text-uppercase" style="letter-spacing: 0.5px; font-size: 10.5px;">{{ kpi.title }}</span>
                            <h3 class="fw-extrabold mt-2 mb-2 text-dark font-monospace">
                                {{ kpi.isPrice ? formatPrice(kpi.value) : kpi.value }}{{ kpi.isPercent ? '%' : '' }}
                            </h3>
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge rounded-pill px-3 py-1 text-success bg-success bg-opacity-10 fw-bold" style="font-size: 10.5px;">
                                    {{ kpi.trend }}
                                </span>
                                <span class="text-muted small" style="font-size: 11px;">{{ kpi.trendText }}</span>
                            </div>
                        </div>
                        <div class="kpi-icon-wrap shadow-inner" :style="{ backgroundColor: kpi.glowColor, color: '#fff' }">
                            <i :class="['bi', kpi.icon]"></i>
                        </div>
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
                            <h5 class="fw-extrabold mb-0 text-dark">{{ activeData.chartTitle }}</h5>
                            <p class="text-muted small mb-0">{{ activeData.chartLabel }}</p>
                        </div>
                        <span class="badge bg-light text-dark fw-bold border border-secondary border-opacity-10 py-2 px-3 rounded-3 font-monospace text-capitalize">
                            {{ getTimeframeLabel(selectedTimeframe) }}
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
                        <table class="table table-hover align-middle mb-0" style="font-size: 13.2px;">
                            <thead class="bg-light text-muted text-uppercase" style="font-size: 10.5px; letter-spacing: 0.5px;">
                                <tr>
                                    <th class="ps-2">Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Chi tiết món</th>
                                    <th>Trạng thái</th>
                                    <th class="text-end pe-2">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in recentOrders" :key="order.code" class="border-bottom border-secondary border-opacity-10 align-middle">
                                    <td class="ps-2">
                                        <RouterLink to="/orderlist" class="fw-extrabold text-dark font-monospace text-decoration-none">
                                            {{ order.code }}
                                        </RouterLink>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="avatar-initials text-white fw-bold shadow-sm">{{ order.initials }}</div>
                                            <div>
                                                <div class="fw-bold text-dark lh-sm">{{ order.customer }}</div>
                                                <div class="text-muted small font-monospace" style="font-size: 10.5px;">{{ order.time }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-secondary text-truncate" style="max-width: 150px;">{{ order.items }}</td>
                                    <td>
                                        <span :class="getStatusBadge(order.status)" class="fw-bold">
                                            {{ getStatusLabel(order.status) }}
                                        </span>
                                    </td>
                                    <td class="text-end fw-bold font-monospace text-success pe-2">{{ formatPrice(order.amount) }}</td>
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
