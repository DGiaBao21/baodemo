<template>
    <nav class="navbar navbar-expand bg-white border-bottom border-secondary border-opacity-10 py-2 px-3 align-items-center">
        <div class="container-fluid p-0">
            
            <!-- Left Side: Context / Search Bar (Clean 100% Bootstrap 5) -->
            <div class="d-flex align-items-center me-auto">
                <div class="input-group d-none d-md-flex" style="width: 280px;">
                    <span class="input-group-text bg-light border-0 text-muted pe-1">
                        <i class="bi bi-search" style="font-size: 13.5px;"></i>
                    </span>
                    <input 
                        type="text" 
                        class="form-control bg-light border-0 ps-2" 
                        placeholder="Tìm kiếm tác vụ, đơn hàng..." 
                        style="font-size: 13.5px; border-radius: 0 8px 8px 0;"
                    />
                </div>
            </div>

            <!-- Right Side: Notification Icons & User Profile -->
            <div class="d-flex align-items-center gap-3">
                
                <!-- Notification Bell Icon (Bootstrap Dropdown) -->
                <div class="dropdown">
                    <button 
                        class="btn btn-link text-secondary p-2 rounded-circle hover-bg-light position-relative border-0 shadow-none" 
                        type="button" 
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i class="bi bi-bell fs-5"></i>
                        <!-- Red Pulsing dot -->
                        <span class="position-absolute top-1 start-75 translate-middle p-1 bg-danger border border-light rounded-circle" style="width: 7px; height: 7px;"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2" style="width: 320px; font-size: 13px;">
                        <li><h6 class="dropdown-header fw-bold text-dark px-2 pb-2">Thông báo mới nhất</h6></li>
                        <li><hr class="dropdown-divider my-2"></li>
                        <li>
                            <a class="dropdown-item rounded p-2" href="#">
                                <div class="fw-semibold text-dark">🔔 Đơn hàng mới #BREW-8472</div>
                                <div class="text-muted small mt-1" style="font-size: 11px;">Khách hàng: Nguyễn Văn Nam - 10 phút trước</div>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item rounded p-2" href="#">
                                <div class="fw-semibold text-dark">💬 Bình luận mới cần duyệt</div>
                                <div class="text-muted small mt-1" style="font-size: 11px;">Bài viết: Bí quyết học JS - 1 giờ trước</div>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item rounded p-2" href="#">
                                <div class="fw-semibold text-success">💰 Đã nhận chuyển khoản 190.000đ</div>
                                <div class="text-muted small mt-1" style="font-size: 11px;">Đơn hàng: #BREW-9123 - 2 giờ trước</div>
                            </a>
                        </li>
                        <li><hr class="dropdown-divider my-2"></li>
                        <li><a class="dropdown-item text-center text-secondary small py-2" href="#">Xem tất cả thông báo</a></li>
                    </ul>
                </div>

                <!-- Messages/Comments Icon -->
                <div class="dropdown">
                    <button 
                        class="btn btn-link text-secondary p-2 rounded-circle hover-bg-light position-relative border-0 shadow-none" 
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i class="bi bi-chat-dots fs-5"></i>
                        <span class="position-absolute top-1 start-75 translate-middle p-1 bg-info border border-light rounded-circle" style="width: 7px; height: 7px;"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2" style="width: 280px; font-size: 13px;">
                        <li><h6 class="dropdown-header fw-bold text-dark px-2 pb-2">Tin nhắn & Phản hồi</h6></li>
                        <li><hr class="dropdown-divider my-1"></li>
                        <li>
                            <a class="dropdown-item rounded p-2" href="#">
                                <div class="fw-semibold text-dark">Lê Thị Thu Thảo</div>
                                <div class="text-muted small text-truncate" style="max-width: 240px; font-size: 11px;">"Shop ơi, đơn hàng của mình đã được xác nhận chưa..."</div>
                            </a>
                        </li>
                        <li><hr class="dropdown-divider my-1"></li>
                        <li><a class="dropdown-item text-center text-secondary small py-1" href="#">Chuyển đến hộp thư điện tử</a></li>
                    </ul>
                </div>

                <!-- User Profile Dropdown -->
                <div class="dropdown border-start ps-3 border-secondary border-opacity-20">
                    <a 
                        class="dropdown-toggle text-dark text-decoration-none d-flex align-items-center gap-2 cursor-pointer" 
                        href="#" 
                        role="button" 
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZ-x8vy8u3RaZ0iF_cof4U3pTMPa54T_y6w&s"
                            alt="User Avatar" 
                            class="rounded-circle border border-secondary border-opacity-20 shadow-sm" 
                            width="34" 
                            height="34"
                        >
                        <div class="d-none d-sm-block text-start">
                            <div class="fw-bold text-dark lh-1" style="font-size: 13px;">ADMIN</div>
                            <span class="text-muted font-monospace" style="font-size: 9.5px;">admin@brewadmin.com</span>
                        </div>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2" style="min-width: 200px; font-size: 13.5px;">
                        <li>
                            <div class="px-3 py-2 border-bottom mb-2">
                                <h6 class="fw-bold text-dark mb-1" style="font-size: 13px;">Quản trị viên chính</h6>
                                <span class="badge text-bg-warning-subtle text-warning border border-warning-subtle rounded-pill font-monospace" style="font-size: 9px; letter-spacing: 0.3px;">SUPER ADMIN</span>
                            </div>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item rounded py-2" to="/admin/profile">
                                <i class="bi bi-person me-2 text-secondary"></i>Thông tin cá nhân
                            </RouterLink>
                        </li>
                        <li><hr class="dropdown-divider my-2"></li>
                        <li>
                            <RouterLink class="dropdown-item rounded py-2" to="/">
                                <i class="bi bi-shop me-2 text-secondary"></i>Xem Cửa Hàng
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item text-danger rounded py-2" to="/login">
                                <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                            </RouterLink>
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    </nav>
</template>

<style scoped>
.hover-bg-light:hover {
    background-color: #f8fafc;
}
.cursor-pointer {
    cursor: pointer;
}
</style>
