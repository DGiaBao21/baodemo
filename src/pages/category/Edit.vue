<script setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { useRouter, useRoute } from 'vue-router';

import { CategoryService } from '../../services/category.service'
import { onMounted } from 'vue';

const { errors, defineField, meta } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            name: yup.string().required('Vui long nhap ten danh muc'),
            note: yup.string().required('Vui long nhap ghi chu').min(6, 'It nhat 6 ky tu'),
        }),
    ),
});

const [name] = defineField('name');
const [note] = defineField('note');
const router = useRouter();
const route = useRoute();
const categoryId = route.params.id;
const categoryService = new CategoryService();

const getDetail = async () => {
    const result = await categoryService.getById(categoryId);
    if (result.status === 200) {
        name.value = result.data.name;
        note.value = result.data.note;
    }
}

const update = async () => {
    let category = {
        name: name.value,
        note: note.value
    }
    if (!meta.valid) {
        const result = await categoryService.update(categoryId, category);
        if (result.status === 200) {
            router.push('/');
        }
    }
}

onMounted(() => {
    getDetail();
})
</script>
<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-body">
                <form>
                    <h3 class="text-success text-center">Cap nhat danh muc</h3>
                    <div class="mb-3">
                        <label for="name" class="form-label">Ten danh muc</label>
                        <input type="text" v-model="name" class="form-control" id="note"
                            placeholder="Vui long nhap danh muc">
                        <small class="text-danger">{{ errors.name }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="note" class="form-label">Ghi chu</label>
                        <textarea class="form-control" v-model="note" id="note" rows="3"></textarea>
                        <small class="text-danger">{{ errors.note }}</small>
                    </div>
                    <div class="mb-3">
                        <button type="button" :disabled="!name || !note || !meta.valid"
                            class="btn btn-outline-warning me-2" @click="update()">Cap nhat</button>
                        <RouterLink to="/" class="btn btn-outline-success">Quay Lai</RouterLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>