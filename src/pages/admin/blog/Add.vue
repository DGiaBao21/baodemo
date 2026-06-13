<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  title: '',
  category: '',
  content: '',
  thumbnail: '',
  status: true,
})

const errors = ref({})
const previewUrl = ref('')

const categories = ['Hướng dẫn', 'Sức khỏe', 'Kiến thức', 'Menu', 'Tin tức', 'Khuyến mãi']

const handleThumbnailInput = (e) => {
  const url = e.target.value
  form.value.thumbnail = url
  previewUrl.value = url
}

const validate = () => {
  const errs = {}
  if (!form.value.title.trim()) errs.title = 'Vui lòng nhập tiêu đề.'
  else if (form.value.title.length < 5) errs.title = 'Tiêu đề phải ít nhất 5 ký tự.'
  if (!form.value.category) errs.category = 'Vui lòng chọn chủ đề.'
  if (!form.value.content.trim()) errs.content = 'Vui lòng nhập nội dung bài viết.'
  else if (form.value.content.length < 20) errs.content = 'Nội dung phải ít nhất 20 ký tự.'
  errors.value = errs
  return Object.keys(errs).length === 0
}

const handleSubmit = () => {
  if (!validate()) return
  // TODO: gọi API tạo bài viết
  alert('Thêm bài viết thành công!')
  router.push('/bloglist')
}
</script>

<template>
  <div class="p-4">

    <!-- Page Header -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <RouterLink to="/bloglist" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left"></i>
      </RouterLink>
      <div>
        <h4 class="fw-bold mb-0">Thêm bài viết</h4>
        <p class="text-muted small mb-0">Tạo bài viết mới cho blog</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row g-4">

        <!-- Left: Main content -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-header bg-white border-bottom py-3">
              <h6 class="fw-semibold mb-0"><i class="bi bi-file-text me-2 text-primary"></i>Nội dung bài viết</h6>
            </div>
            <div class="card-body p-4">

              <!-- Title -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Tiêu đề <span class="text-danger">*</span></label>
                <input
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.title }"
                  placeholder="Nhập tiêu đề bài viết..."
                  maxlength="200"
                />
                <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                <div class="text-muted small mt-1">{{ form.title.length }}/200 ký tự</div>
              </div>

              <!-- Content -->
              <div class="mb-1">
                <label class="form-label fw-semibold">Nội dung <span class="text-danger">*</span></label>
                <textarea
                  v-model="form.content"
                  class="form-control"
                  :class="{ 'is-invalid': errors.content }"
                  rows="12"
                  placeholder="Nhập nội dung bài viết..."
                ></textarea>
                <div v-if="errors.content" class="invalid-feedback">{{ errors.content }}</div>
              </div>

            </div>
          </div>
        </div>

        <!-- Right: Sidebar settings -->
        <div class="col-lg-4">

          <!-- Publish settings -->
          <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-header bg-white border-bottom py-3">
              <h6 class="fw-semibold mb-0"><i class="bi bi-gear me-2 text-secondary"></i>Cài đặt đăng bài</h6>
            </div>
            <div class="card-body p-4">

              <!-- Category -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Chủ đề <span class="text-danger">*</span></label>
                <select
                  v-model="form.category"
                  class="form-select"
                  :class="{ 'is-invalid': errors.category }"
                >
                  <option value="">-- Chọn chủ đề --</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <div v-if="errors.category" class="invalid-feedback">{{ errors.category }}</div>
              </div>

              <!-- Status -->
              <div class="mb-1">
                <label class="form-label fw-semibold">Trạng thái</label>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="form.status" :value="true" id="statusPublish" />
                    <label class="form-check-label" for="statusPublish">
                      <span class="badge text-bg-success">Hiển thị</span>
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="form.status" :value="false" id="statusHidden" />
                    <label class="form-check-label" for="statusHidden">
                      <span class="badge text-bg-secondary">Ẩn</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thumbnail -->
          <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-header bg-white border-bottom py-3">
              <h6 class="fw-semibold mb-0"><i class="bi bi-image me-2 text-warning"></i>Ảnh đại diện</h6>
            </div>
            <div class="card-body p-4">
              <input
                type="url"
                class="form-control mb-3"
                placeholder="Dán URL ảnh vào đây..."
                @input="handleThumbnailInput"
              />
              <div class="thumbnail-preview rounded-3 border overflow-hidden">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="Preview"
                  class="w-100"
                  style="height:160px; object-fit:cover;"
                  @error="previewUrl = ''"
                />
                <div v-else class="thumbnail-placeholder d-flex flex-column align-items-center justify-content-center" style="height:160px;">
                  <i class="bi bi-image text-muted fs-2"></i>
                  <span class="text-muted small mt-1">Chưa có ảnh</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex gap-2">
            <RouterLink to="/bloglist" class="btn btn-outline-secondary flex-fill">Hủy</RouterLink>
            <button type="submit" class="btn btn-success flex-fill fw-semibold">
              <i class="bi bi-check-lg me-1"></i> Lưu bài viết
            </button>
          </div>

        </div>
      </div>
    </form>

  </div>
</template>

<style scoped>
.thumbnail-placeholder {
  background: #f8f9fa;
}
</style>
