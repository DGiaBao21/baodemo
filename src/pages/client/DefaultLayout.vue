<script setup>
import Footer from '../../components/client/Footer.vue';
import Header from '../../components/client/Header.vue'

</script>

<template>
   <Header></Header> 
    <main>
        <router-view></router-view>
    </main>
   <Footer></Footer>
</template>