import axios from 'axios'
import { END_POINTS } from '../configs/end-point.config.js'

const BASE_URL = END_POINTS.users

export class UserService {
    list()              { return axios.get(BASE_URL) }
    getById(id)         { return axios.get(`${BASE_URL}/${id}`) }
    create(data)        { return axios.post(BASE_URL, data) }
    update(id, data)    { return axios.put(`${BASE_URL}/${id}`, data) }
    patch(id, data)     { return axios.patch(`${BASE_URL}/${id}`, data) }
    delete(id)          { return axios.delete(`${BASE_URL}/${id}`) }
}
