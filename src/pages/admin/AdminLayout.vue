<script setup>
import { ref } from 'vue'
import Header from '../../components/admin/Header.vue'
import Sidebar from '../../components/admin/Sidebar.vue'
</script>

<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content area -->
    <div class="admin-main flex-grow-1 d-flex flex-column min-w-0">
      <!-- Header -->
      <Header />

      <!-- Page content -->
      <div class="p-4 flex-grow-1">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-main {
  /* Push content past the sidebar (default expanded = 260px) */
  margin-left: 220px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>