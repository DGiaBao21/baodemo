<script setup>
import { ref, computed, watch } from 'vue'

// ─── Dữ liệu giả định (Mock data) ──────────────────────────────
const users = ref([
    { id: 1, name: 'Nguyễn Văn An',   email: 'an.nguyen@gmail.com',   phone: '0901234567', role: 'admin', status: true,  createdAt: '2025-01-05' },
    { id: 2, name: 'Trần Thị Bình',   email: 'binh.tran@gmail.com',   phone: '0912345678', role: 'user',  status: true,  createdAt: '2025-01-18' },
    { id: 3, name: 'Lê Hoàng Cường',  email: 'cuong.le@gmail.com',    phone: '0923456789', role: 'user',  status: false, createdAt: '2025-02-01' },
    { id: 4, name: 'Phạm Thị Dung',   email: 'dung.pham@gmail.com',   phone: '0934567890', role: 'user',  status: true,  createdAt: '2025-02-14' },
    { id: 5, name: 'Hoàng Văn Em',    email: 'em.hoang@gmail.com',    phone: '0945678901', role: 'user',  status: true,  createdAt: '2025-03-03' },
    { id: 6, name: 'Ngô Thị Phương',  email: 'phuong.ngo@gmail.com',  phone: '0956789012', role: 'admin', status: true,  createdAt: '2025-03-20' },
    { id: 7, name: 'Đặng Minh Quân',  email: 'quan.dang@gmail.com',   phone: '0967890123', role: 'user',  status: false, createdAt: '2025-04-07' },
    { id: 8, name: 'Vũ Thị Hoa',      email: 'hoa.vu@gmail.com',      phone: '0978901234', role: 'user',  status: true,  createdAt: '2025-04-22' },
])

const roleOptions = ['Tất cả', 'admin', 'user']

// ─── Tìm kiếm & Bộ lọc ─────────────────────────────────────────
const searchQuery = ref('')
const filterRole  = ref('Tất cả')

const filtered = computed(() => {
    let list = users.value
    if (filterRole.value !== 'Tất cả')
        list = list.filter(u => u.role === filterRole.value)
    const q = searchQuery.value.trim().toLowerCase()
    if (q)
        list = list.filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q)
        )
    return list
})

const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtered.value.slice(start, end)
})

watch([searchQuery, filterRole], () => {
    currentPage.value = 1
})

// ─── Chuyển đổi trạng thái (Chặn / Mở chặn) ─────────────────────
function toggleStatus(u) { u.status = !u.status }
</script>

<template>
    <div class="p-4">

        <!-- Tiêu đề trang -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Người dùng</h4>
                <p class="text-muted small mb-0">Quản lý trạng thái khóa/chặn người dùng hệ thống</p>
            </div>
        </div>

        <!-- Thẻ chứa nội dung chính -->
        <div class="card shadow-sm border-0 rounded-3">

            <!-- Thanh công cụ (Tìm kiếm & Lọc) -->
            <div class="card-header bg-white border-bottom py-3">
                <div class="d-flex flex-wrap gap-3 align-items-center">

                    <!-- Bộ lọc Tìm kiếm -->
                    <div class="input-group" style="max-width:300px">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control bg-light border-start-0"
                            placeholder="Tìm tên, email, SĐT..."
                        />
                    </div>

                    <!-- Bộ lọc theo vai trò -->
                    <div class="d-flex gap-2">
                        <button
                            v-for="role in roleOptions"
                            :key="role"
                            class="btn btn-sm"
                            :class="filterRole === role ? 'btn-dark' : 'btn-outline-secondary'"
                            @click="filterRole = role"
                        >
                            <i v-if="role === 'admin'" class="bi bi-shield-check me-1"></i>
                            <i v-else-if="role === 'user'" class="bi bi-person me-1"></i>
                            {{ role === 'Tất cả' ? 'Tất cả' : role === 'admin' ? 'Admin' : 'Người dùng' }}
                        </button>
                    </div>

                    <span class="text-muted small ms-auto">{{ filtered.length }} tài khoản</span>
                </div>
            </div>

            <!-- Bảng hiển thị danh sách người dùng -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width:50px">#</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th style="width:130px">Số điện thoại</th>
                            <th style="width:100px">Vai trò</th>
                            <th style="width:115px">Ngày tạo</th>
                            <th style="width:130px">Trạng thái (Chặn / Mở)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Trạng thái danh sách trống -->
                        <tr v-if="filtered.length === 0">
                            <td colspan="7" class="text-center text-muted py-5">
                                <i class="bi bi-people fs-1 d-block mb-2"></i>
                                Không tìm thấy người dùng nào phù hợp
                            </td>
                        </tr>

                        <!-- Dòng thông tin người dùng -->
                        <tr v-for="(u, idx) in paginatedUsers" :key="u.id">
                            <td class="text-muted">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                                        style="width:36px; height:36px">
                                        <i class="bi bi-person text-secondary"></i>
                                    </div>
                                    <span class="fw-semibold">{{ u.name }}</span>
                                </div>
                            </td>
                            <td class="text-muted">{{ u.email }}</td>
                            <td class="text-muted">{{ u.phone }}</td>
                            <td>
                                <span
                                    class="badge"
                                    :class="u.role === 'admin' ? 'text-bg-warning' : 'text-bg-info'"
                                >
                                    <i :class="u.role === 'admin' ? 'bi bi-shield-check me-1' : 'bi bi-person me-1'"></i>
                                    {{ u.role === 'admin' ? 'Admin' : 'User' }}
                                </span>
                            </td>
                            <td class="text-muted">{{ u.createdAt }}</td>
                            <td>
                                <div class="form-check form-switch mb-0">
                                    <input
                                        class="form-check-input cursor-pointer"
                                        type="checkbox"
                                        role="switch"
                                        :id="`status-${u.id}`"
                                        :checked="u.status"
                                        @change="toggleStatus(u)"
                                    />
                                    <label class="form-check-label cursor-pointer" :for="`status-${u.id}`">
                                        <span :class="u.status ? 'badge text-bg-success' : 'badge text-bg-danger'">
                                            {{ u.status ? 'Hoạt động' : 'Bị chặn' }}
                                        </span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Footer -->
            <div v-if="totalPages > 1" class="card-footer bg-white border-top py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <span class="text-muted small">Hiển thị trang {{ currentPage }} / {{ totalPages }} (tổng {{ filtered.length }} tài khoản)</span>
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
        </div>    </div>
</template>
