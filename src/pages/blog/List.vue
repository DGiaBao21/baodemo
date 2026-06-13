<script setup>
import { onMounted, ref } from 'vue';
import { BlogService } from '../../services/blog.service.js';

const blogService = new BlogService();

const blogList = ref([]);

const getData = async () => {
    const result = await blogService.list();
    if (result.status === 200) {
        blogList.value = result.data;
    }
}

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h4 class="text-success">Danh sach danh muc</h4>
                    <RouterLink to="/blog-add" class="btn btn-outline-success">Them</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <!-- copy table -->
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên bài viết</th>
                            <th scope="col">Hình ảnh</th>
                            <th scope="col">Danh mục</th>
                            <!-- <th scope="col">Nội dung</th> -->
                            <th scope="col">Tác giả</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in blogList">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ item.title }}</td>
                            <td>
                                <img :src="item.image" alt="" width="70">
                            </td>
                            <td>{{ item.category_id }}</td>
                            <!-- <td>{{ item.content }}</td> -->
                            <td>{{ item.author }}</td>
                            <td>
                                <RouterLink :to="{ name: 'edit', params: { id: item.id } }"
                                    class="btn btn-outline-warning me-2">Sua</RouterLink>
                                <button class="btn btn-outline-danger">Xoa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- dan cho nao cung duoc -->
</template>
