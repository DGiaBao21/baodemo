<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { BlogService } from '../../services/blog.service.js';

import { CategoryService } from '../../services/category.service.js';
import Image from '../../components/Image.vue';
import Editor from '../../components/Editor.vue';

const categoryService = new CategoryService();

const categoryList = ref([]);

const getData = async () => {
    const result = await categoryService.list();
    if (result.status === 200) {
        categoryList.value = result.data;
    }
}

function getContent(payload) {
    content.value = payload;
}

function getUrlImg(payload) {
    image.value = payload.url;
}

const { errors, defineField, meta } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            title: yup.string().required('Vui long nhap ten danh muc'),
            content: yup.string().required('Vui long nhap ghi chu').min(6, 'It nhat 6 ky tu'),
            image: yup.string().required('Vui long nhap hình ảnh'),
            category: yup.string().required('Vui long chọn danh mục'),
            author: yup.string().required('Vui long chọn tác giả'),
        }),
    ),
});

const [title] = defineField('title');
const [content] = defineField('content');
const [image] = defineField('image');
const [category] = defineField('category');
const [author] = defineField('author');

const router = useRouter();
const blogService = new BlogService();

const create = async () => {
    let data = {
        title: title.value,
        content: content.value,
        image: image.value,
        category: category.value,
        author: author.value,
    }
    if (!meta.valid) {
        const result = await blogService.create(data);
        if (result.status === 201) {
            router.push('/');
        }
    }
}

onMounted(() => {
    getData();
});
</script>
<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-body">
                <form>
                    <h3 class="text-success text-center">Them moi bài viết</h3>
                    <div class="mb-3">
                        <label for="name" class="form-label">Tiêu đề</label>
                        <input type="text" v-model="title" class="form-control" id="note"
                            placeholder="Vui long nhap danh muc">
                        <small class="text-danger">{{ errors.title }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="note" class="form-label">Nội dung</label>
                        <Editor  @submitData="getContent"></Editor>
                        <small class="text-danger">{{ errors.content }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Hình ảnh</label>
                        <Image @submitData="getUrlImg"></Image>
                        <small class="text-danger">{{ errors.image }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Danh mục</label>
                        <!--  -->
                        <select class="form-select" aria-label="Default select example" v-model="category">
                            <option v-for="item in categoryList" :value="item.id">{{ item.name }}</option>
                        </select>
                        <small class="text-danger">{{ errors.category }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Tác giả</label>
                        <select class="form-select" aria-label="Default select example" v-model="author">
                            <option selected>Chọn tác giả</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                        <small class="text-danger">{{ errors.author }}</small>
                    </div>
                    <div class="mb-3">
                        <button type="button" :disabled="!meta.valid" class="btn btn-outline-success me-2"
                            @click="create()">Them</button>
                        <RouterLink to="/" class="btn btn-outline-success">Quay Lai</RouterLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>