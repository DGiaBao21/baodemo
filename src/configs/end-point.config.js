import { environment } from '../environments/environment.js'

const BASE = environment.apiUrl

// Tập hợp tất cả endpoint của ứng dụng
export const END_POINTS = {
    categories: `${BASE}/categories`,
    products:   `${BASE}/products`,
    users:      `${BASE}/users`,
    blogs:      `${BASE}/blogs`,
    blogCategories: `${BASE}/blogCategories`,
    comments:   `${BASE}/comments`,
    orders:     `${BASE}/orders`,
    reviews:    `${BASE}/reviews`,
}
