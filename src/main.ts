import './assets/main.css'

import VueTailwindDatepicker from 'vue-tailwind-datepicker'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin , defaultConfig } from '@formkit/vue'
import config from '../formkit.config'
import { useToast } from 'vue-toast-notification'

import App from './App.vue'
import router from './router'

import "vue-toast-notification/dist/theme-sugar.css"

const app = createApp(App)

const $toast = useToast({
    duration:3000,
    position:'top-right'
})


app.provide('toast', $toast)


app.use(VueTailwindDatepicker)

app.use(createPinia())
app.use(plugin , defaultConfig(config))
app.use(router)

app.mount('#app')
