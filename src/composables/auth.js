// auth.js — Auth state dùng localStorage + API json-server
import { ref, computed } from 'vue'
import axios from 'axios'
import { END_POINTS } from '../configs/end-point.config.js'

// ─── State (global singleton) ─────────────────────────────────
const _user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export const currentUser = computed(() => _user.value)
export const isLoggedIn  = computed(() => !!_user.value)

// ─── Login — gọi API thật từ json-server ──────────────────────
export async function login(email, password) {
    try {
        // Tìm user theo email trong db.json
        const res = await axios.get(END_POINTS.users, {
            params: { email }
        })

        if (!res.data || res.data.length === 0) {
            return { ok: false, message: 'Email không tồn tại trong hệ thống.' }
        }

        const found = res.data[0]

        // Kiểm tra status bị chặn
        if (found.status === false) {
            return { ok: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa.' }
        }

        // Kiểm tra password
        if (found.password !== password) {
            return { ok: false, message: 'Mật khẩu không chính xác.' }
        }

        // Lưu vào state (bỏ password)
        const { password: _pw, ...safe } = found
        _user.value = safe
        localStorage.setItem('auth_user', JSON.stringify(safe))
        return { ok: true, user: safe }

    } catch (e) {
        console.error('Login error:', e)
        return { ok: false, message: 'Không thể kết nối server. Vui lòng thử lại.' }
    }
}

// ─── Register — tạo user mới trong db.json ────────────────────
export async function register(data) {
    try {
        const payload = {
            name:      data.name,
            email:     data.email,
            password:  data.password,
            phone:     data.phone || '',
            role:      'user',
            avatar:    `https://i.pravatar.cc/150?u=${data.email}`,
            address:   '',
            status:    true,
            createdAt: new Date().toISOString().split('T')[0]
        }
        const res = await axios.post(END_POINTS.users, payload)
        if (res.status === 201) {
            const { password: _pw, ...safe } = res.data
            _user.value = safe
            localStorage.setItem('auth_user', JSON.stringify(safe))
            return { ok: true, user: safe }
        }
        return { ok: false, message: 'Đăng ký thất bại. Vui lòng thử lại.' }
    } catch (e) {
        console.error('Register error:', e)
        return { ok: false, message: 'Không thể kết nối server.' }
    }
}

// ─── Logout ───────────────────────────────────────────────────
export function logout() {
    _user.value = null
    localStorage.removeItem('auth_user')
}
