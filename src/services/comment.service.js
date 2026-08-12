import axios from 'axios'
import { END_POINTS } from '../configs/end-point.config.js'

const BASE_URL = END_POINTS.comments

export class CommentService {
    list()              { return axios.get(BASE_URL) }
    async getByBlogId(blogId) {
        const res = await axios.get(BASE_URL)
        return {
            ...res,
            data: res.data.filter(c => String(c.blogId) === String(blogId))
        }
    }
    getById(id)         { return axios.get(`${BASE_URL}/${id}`) }
    create(data)        { return axios.post(BASE_URL, data) }
    patch(id, data)     { return axios.patch(`${BASE_URL}/${id}`, data) }
    delete(id)          { return axios.delete(`${BASE_URL}/${id}`) }
}
