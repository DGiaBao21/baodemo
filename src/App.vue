
<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.matched[0]?.path" />
  </router-view>
</template>

<style>
body {
  font-family: 'Times New Roman', Times, serif !important;
}
</style>
