import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from '@/App.vue'
import router from '@/router/index'
import '@/index.scss'
import { definePreset } from '@primeuix/themes'

const app = createApp(App)
const pinia = createPinia()

const stylePreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{violet.50}',
          100: '{violet.100}',
          200: '{violet.200}',
          300: '{violet.300}',
          400: '{violet.400}',
          500: '{violet.500}',
          600: '{violet.600}',
          700: '{violet.700}',
          800: '{violet.800}',
          900: '{violet.900}',
          950: '{violet.950}'
      },
      colorScheme: {
          dark: {
              surface: {
                  0: '#ffffff',
                  50: '{neutral.50}',
                  100: '{neutral.100}',
                  200: '{neutral.200}',
                  300: '{neutral.300}',
                  400: '{neutral.400}',
                  500: '{neutral.500}',
                  600: '{neutral.600}',
                  700: '{neutral.700}',
                  800: '{neutral.800}',
                  900: '{neutral.900}',
                  950: '{neutral.950}'
              }
          }
      }
  }
});

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: stylePreset,
    },
  })
  .mount('#app')
