import axios from 'axios'
import { END_POINTS } from '../configs/end-point.config.js'

const BASE_URL = END_POINTS.categories

export class CategoryService {
    // Lấy toàn bộ danh mục
    list() {
        return axios.get(BASE_URL)
    }

    // Lấy 1 danh mục theo id
    getById(id) {
        return axios.get(`${BASE_URL}/${id}`)
    }

    // Thêm mới
    create(data) {
        return axios.post(BASE_URL, data)
    }

    // Cập nhật toàn bộ
    update(id, data) {
        return axios.put(`${BASE_URL}/${id}`, data)
    }

    // Cập nhật một trường (vd: status)
    patch(id, data) {
        return axios.patch(`${BASE_URL}/${id}`, data)
    }

    // Xóa
    delete(id) {
        return axios.delete(`${BASE_URL}/${id}`)
    }
}
