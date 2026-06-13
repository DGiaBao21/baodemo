import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_END_POINT } from "../configs/end-point.config";

export class BlogService {
    list() {
        return axios.get(API_URL + API_END_POINT.BLOGS);
    }

    create(data) {
        return axios.post(API_URL + API_END_POINT.BLOGS, data);
    }

    getById(id) {
        return axios.get(API_URL + API_END_POINT.BLOGS + '/' + id);
    }

    update(id, data) {
        return axios.put(API_URL + API_END_POINT.BLOGS + '/' + id, data);
    }

    delete(id) {
        return axios.delete(API_URL + API_END_POINT.BLOGS + '/' + id);
    }
}