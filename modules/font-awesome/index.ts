import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'font-awesome'
  },
  setup () {
    const { resolve } = createResolver(import.meta.url)

    // Add an API route
    addServerHandler({
      route: '/api/hello',
      handler: resolve('./runtime/api-route')
    })
  }
})