import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Load primary style tokens
import './assets/styles/main.css'

// Initialize app instance
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
