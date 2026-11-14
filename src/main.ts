import './assets/main.css'
import '@vuepic/vue-datepicker/dist/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { toast } from '@/lib/notifications'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$toast = toast

app.mount('#app')
