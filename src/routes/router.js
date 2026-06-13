import { createWebHistory, createRouter } from 'vue-router'

// ── Giao diện & Trang khách hàng ──────────────────────────────
import DefaultLayout from '../pages/client/DefaultLayout.vue'
import Home from '../pages/client/Home.vue'
import About from '../pages/client/About.vue'
import Product from '../pages/client/Product.vue'
import Contact from '../pages/client/Contact.vue'
import Blog from '../pages/client/Blog.vue'
import BlogDetail from '../pages/client/BlogDetail.vue'
import Login from '../pages/client/Login.vue'
import Register from '../pages/client/Register.vue'
import UserProfile from '../pages/client/UserProfile.vue'
import MyComments from '../pages/client/MyComments.vue'
import ProductDetail from '../pages/client/ProductDetail.vue'

// ── Giao diện & Trang quản trị (Admin) ───────────────────────────
import AdminLayout from '../pages/admin/AdminLayout.vue'
import Dashboard from '../pages/admin/Dashboard.vue'
import AdminProfile from '../pages/admin/Profile.vue'

// Danh mục
import CatList from '../pages/admin/category/List.vue'
import CatAdd from '../pages/admin/category/Add.vue'
import CatEdit from '../pages/admin/category/Edit.vue'

// Tin tức / Blog quản trị
import BlogList from '../pages/admin/blog/List.vue'
import BlogAdd from '../pages/admin/blog/Add.vue'
import BlogEdit from '../pages/admin/blog/Edit.vue'

// Sản phẩm
import ProductList from '../pages/admin/product/List.vue'
import ProductAdd from '../pages/admin/product/Add.vue'
import ProductEdit from '../pages/admin/product/Edit.vue'

// Người dùng
import UserList from '../pages/admin/user/List.vue'
import UserAdd from '../pages/admin/user/Add.vue'
import UserEdit from '../pages/admin/user/Edit.vue'

// Bình luận
import CommentList from '../pages/admin/comment/List.vue'

// Đơn hàng
import OrderList from '../pages/admin/order/List.vue'

const routes = [
    // ── KHÁCH HÀNG ───────────────────────────────────────────────
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '/', component: Home },
            { path: 'about', component: About },
            { path: 'product', component: Product },
            { path: 'product/:id', component: ProductDetail },
            { path: 'contact', component: Contact },
            { path: 'blog', component: Blog },
            { path: 'blog/:id', component: BlogDetail },
            { path: 'profile', component: UserProfile },
            { path: 'my-comments', component: MyComments },
        ]
    },

    // ── AUTH (không có header/footer) ────────────────────────
    { path: '/login', component: Login },
    { path: '/register', component: Register },

    // ── QUẢN TRỊ ─────────────────────────────────────────────────
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'profile', component: AdminProfile },

            // Danh mục
            { path: '/categorylist', component: CatList },
            { path: '/categoryadd', component: CatAdd },
            { path: '/categoryedit/:id', component: CatEdit },

            // Sản phẩm
            { path: '/productlist', component: ProductList },
            { path: '/productadd', component: ProductAdd },
            { path: '/productedit/:id', component: ProductEdit },

            // Người dùng
            { path: '/userlist', component: UserList },
            { path: '/useradd', component: UserAdd },
            { path: '/useredit/:id', component: UserEdit },

            // Tin tức / Blog quản trị
            { path: '/bloglist', component: BlogList },
            { path: '/blogadd', component: BlogAdd },
            { path: '/blogedit/:id', component: BlogEdit },

            // Bình luận
            { path: '/commentlist', component: CommentList },

            // Đơn hàng
            { path: '/orderlist', component: OrderList },
        ]
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})