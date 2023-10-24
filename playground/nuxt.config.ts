export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  feedback: {},
  nitro: {
    // Production
    storage: {
      feedback: {
        driver: 'fs',
        base: './data'
      }
    },
    // Development
    devStorage: {
      feedback: {
        driver: 'fs',
        base: './playground/data'
      }
    }
  }
})
