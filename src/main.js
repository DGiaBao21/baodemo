import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes/router.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import axios from 'axios'


createApp(App).use(router).mount('#app')
