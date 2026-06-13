<script setup>
import { onMounted, ref } from 'vue';
import { CategoryService } from '../../services/category.service.js';

const categoryService = new CategoryService();

const categoryList = ref([]);

const getData = async () => {
    const result = await categoryService.list();
    if (result.status === 200) {
        categoryList.value = result.data;
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
                    <RouterLink to="/add" class="btn btn-outline-success">Them</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <!-- copy table -->
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ten danh muc</th>
                            <th scope="col">Ghi chu</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in categoryList">
                            <th scope="row">{{ index+1 }}</th>
                            <td>{{ item.name }}</td>
                            <td>{{ item.note }}</td>
                            <td>
                                <RouterLink :to="{ name: 'edit', params: { id: item.id } }" class="btn btn-outline-warning me-2">Sua</RouterLink>
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
