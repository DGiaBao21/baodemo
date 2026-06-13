// auth.js — Simple auth state dùng localStorage
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// ─── State (global singleton) ─────────────────────────────────
const _user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export const currentUser  = computed(() => _user.value)
export const isLoggedIn   = computed(() => !!_user.value)

// Mock accounts — thay bằng API thật
const MOCK_USERS = [
    { id: 1, name: 'Nguyễn Văn An', email: 'admin@gmail.com', password: '123456', role: 'admin' },
    { id: 2, name: 'Trần Thị Bình', email: 'user@gmail.com',  password: '123456', role: 'user'  },
]

// ─── Login ────────────────────────────────────────────────────
export function login(email, password) {
    const found = MOCK_USERS.find(
        u => u.email === email && u.password === password
    )
    if (!found) return { ok: false, message: 'Email hoặc mật khẩu không đúng.' }

    const { password: _pw, ...safe } = found
    _user.value = safe
    localStorage.setItem('auth_user', JSON.stringify(safe))
    return { ok: true, user: safe }
}

// ─── Register ─────────────────────────────────────────────────
export function register(data) {
    // TODO: gọi API POST /api/auth/register
    const newUser = { id: Date.now(), name: data.name, email: data.email, role: 'user' }
    _user.value = newUser
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    return { ok: true, user: newUser }
}

// ─── Logout ───────────────────────────────────────────────────
export function logout() {
    _user.value = null
    localStorage.removeItem('auth_user')
}
