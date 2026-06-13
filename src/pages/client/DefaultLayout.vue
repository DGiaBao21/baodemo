<script setup>
import Footer from '../../components/client/Footer.vue';
import Header from '../../components/client/Header.vue'

</script>

<template>
   <Header></Header> 
   <div class="container">
    <router-view></router-view>
   </div>
   <Footer></Footer>
</template>