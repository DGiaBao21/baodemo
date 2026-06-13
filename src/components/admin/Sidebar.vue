<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const collapsed = ref(false)
const toggleSidebar = () => { collapsed.value = !collapsed.value }

const isActive = (path) => {
    if (path === '/admin') return route.path === '/admin'
    return route.path.startsWith(path)
}

const menuSections = [
    {
        label: '',
        items: [
            { label: 'Dashboard', icon: 'bi-speedometer2', path: '/admin' },
        ]
    },
    {
        label: 'Quản lý',
        items: [
            { label: 'Danh mục',    icon: 'bi-tags',       path: '/categorylist' },
            { label: 'Sản phẩm',   icon: 'bi-box-seam',   path: '/productlist'  },
            { label: 'Đơn hàng',   icon: 'bi-cart-check', path: '/orderlist'     },
            { label: 'Người dùng', icon: 'bi-people',      path: '/userlist'     },
        ]
    },
    {
        label: 'Nội dung',
        items: [
            { label: 'Bài viết',  icon: 'bi-newspaper', path: '/bloglist'    },
            { label: 'Bình luận', icon: 'bi-chat-dots', path: '/commentlist' },
        ]
    },
]
</script>

<template>
    <aside :class="['admin-sidebar', { collapsed }]">

        <!-- Toggle -->
        <button class="sidebar-toggle" @click="toggleSidebar" :title="collapsed ? 'Mở rộng' : 'Thu gọn'">
            <i :class="collapsed ? 'bi bi-layout-sidebar' : 'bi bi-layout-sidebar-reverse'"></i>
        </button>

        <!-- Logo -->
        <div class="sidebar-brand">
            <div class="brand-icon">
                <i class="bi bi-cup-hot-fill"></i>
            </div>
            <transition name="fade">
                <div class="brand-text" v-if="!collapsed">
                    <span class="brand-name">BrewAdmin</span>
                    <span class="brand-sub">Coffee Management</span>
                </div>
            </transition>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
            <template v-for="section in menuSections" :key="section.label">

                <!-- Section label -->
                <transition name="fade">
                    <div v-if="section.label && !collapsed" class="nav-group-label">
                        {{ section.label }}
                    </div>
                </transition>

                <!-- Items -->
                <RouterLink
                    v-for="item in section.items"
                    :key="item.path"
                    :to="item.path"
                    class="nav-item"
                    :class="{ active: isActive(item.path) }"
                >
                    <i :class="['bi', item.icon, 'nav-icon']"></i>
                    <transition name="fade">
                        <span class="nav-label" v-if="!collapsed">{{ item.label }}</span>
                    </transition>
                    <span class="nav-tooltip" v-if="collapsed">{{ item.label }}</span>
                </RouterLink>

            </template>
        </nav>

        <!-- Footer -->
        <div class="sidebar-footer">
            <div class="sidebar-divider"></div>
            <RouterLink to="/" class="nav-item footer-link">
                <i class="bi bi-shop nav-icon"></i>
                <transition name="fade">
                    <span class="nav-label" v-if="!collapsed">Xem cửa hàng</span>
                </transition>
                <span class="nav-tooltip" v-if="collapsed">Xem cửa hàng</span>
            </RouterLink>
            <RouterLink to="/login" class="nav-item footer-link logout">
                <i class="bi bi-box-arrow-left nav-icon"></i>
                <transition name="fade">
                    <span class="nav-label" v-if="!collapsed">Đăng xuất</span>
                </transition>
                <span class="nav-tooltip" v-if="collapsed">Đăng xuất</span>
            </RouterLink>
        </div>

    </aside>
</template>

<style scoped>
.admin-sidebar {
    --sb-bg: #0f1117;
    --sb-accent: #c8a96e;
    --sb-accent-glow: rgba(200, 169, 110, 0.15);
    --sb-text: #a0a8b8;
    --sb-text-active: #ffffff;
    --sb-border: rgba(255, 255, 255, 0.07);
    --sb-hover: rgba(255, 255, 255, 0.06);
    --sb-width: 220px;
    --sb-width-collapsed: 62px;
    --sb-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    width: var(--sb-width);
    background: var(--sb-bg);
    border-right: 1px solid var(--sb-border);
    display: flex;
    flex-direction: column;
    transition: width var(--sb-transition);
    overflow: hidden;
    z-index: 1000;
    box-shadow: 4px 0 24px rgba(0,0,0,0.4);
}
.admin-sidebar.collapsed { width: var(--sb-width-collapsed); }

/* Toggle */
.sidebar-toggle {
    position: absolute;
    top: 14px; right: 12px;
    width: 28px; height: 28px;
    border: none;
    background: var(--sb-hover);
    color: var(--sb-text);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 15px;
    transition: background var(--sb-transition), color var(--sb-transition);
    z-index: 10; flex-shrink: 0;
}
.sidebar-toggle:hover { background: var(--sb-accent-glow); color: var(--sb-accent); }

/* Brand */
.sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 14px 12px;
    min-height: 64px;
    flex-shrink: 0; overflow: hidden;
}
.brand-icon {
    width: 34px; height: 34px; min-width: 34px;
    background: linear-gradient(135deg, #c8a96e, #e8c98e);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: #0f1117;
    box-shadow: 0 4px 12px rgba(200,169,110,0.3);
    flex-shrink: 0;
}
.brand-text { display: flex; flex-direction: column; overflow: hidden; white-space: nowrap; }
.brand-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 0.3px; }
.brand-sub  { font-size: 10px; color: var(--sb-text); margin-top: 1px; }

/* Divider */
.sidebar-divider {
    height: 1px;
    background: var(--sb-border);
    margin: 0 12px 6px;
    flex-shrink: 0;
}

/* Nav */
.sidebar-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 2px 8px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.08) transparent;
    min-height: 0;
}
.sidebar-nav::-webkit-scrollbar { width: 3px; }
.sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

/* Group label */
.nav-group-label {
    font-size: 9.5px;
    font-weight: 600;
    color: var(--sb-text);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    padding: 10px 6px 3px;
    white-space: nowrap;
    opacity: 0.55;
}

/* Nav item */
.nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    color: var(--sb-text);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: none; background: transparent;
    width: 100%; text-align: left;
    position: relative;
    transition: background var(--sb-transition), color var(--sb-transition);
    margin-bottom: 1px;
    white-space: nowrap; overflow: hidden;
}
.nav-item:hover  { background: var(--sb-hover); color: var(--sb-text-active); }
.nav-item.active { background: var(--sb-accent-glow); color: var(--sb-accent); }
.nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 20%; height: 60%; width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--sb-accent);
}

/* Icon */
.nav-icon { font-size: 16px; min-width: 18px; text-align: center; flex-shrink: 0; }

/* Label */
.nav-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }

/* Tooltip */
.nav-tooltip {
    display: none;
    position: absolute; left: calc(100% + 10px); top: 50%;
    transform: translateY(-50%);
    background: #252836; color: #fff;
    font-size: 12px; padding: 4px 10px;
    border-radius: 6px; white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    border: 1px solid var(--sb-border); z-index: 999;
}
.admin-sidebar.collapsed .nav-item:hover .nav-tooltip { display: block; }

/* Footer */
.sidebar-footer { flex-shrink: 0; padding-bottom: 8px; }
.footer-link { margin: 0 8px 1px; width: auto; }
.logout { color: #f87171 !important; }
.logout:hover { background: rgba(248,113,113,0.1) !important; color: #f87171 !important; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
