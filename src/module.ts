import { defu } from 'defu'
import {
  defineNuxtModule,
  // addPlugin,
  addImportsDir,
  createResolver,
  addComponent,
  installModule,
  addServerHandler
} from '@nuxt/kit'

// Module options for nuxt.config.ts
export interface ModuleOptions {
  github: {
    api_key: string | undefined
    project_id: string | undefined
    organisation_id: string | undefined
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/feedback',
    configKey: 'feedback',
    compatibility: {
      nuxt: '^3.7.0'
    }
  },
  // Default configuration options of the Nuxt module
  defaults: {
    github: {
      api_key: (process.env.GH_API_KEY as string) || undefined,
      project_id: (process.env.GH_PROJECT_ID as string) || undefined,
      organisation_id: (process.env.GH_ORG_ID as string) || undefined // Not mandatory
    }
  },
  async setup(options, nuxt) {

    // Private runtimeConfig
    nuxt.options.runtimeConfig.feedback = defu(nuxt.options.runtimeConfig.feedback, options)

    const { resolve, resolvePath } = createResolver(import.meta.url)

    // required to make installModule modules work
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('zod', 'octokit')

    // I think this is for exporting server components for use in the users application
    nuxt.options.alias['#feedback'] = runtimeDir

    // Add auto imports
    const components = ['FeedbackWidget', 'KanbanBoard', 'KanbanCard']
    for (const component of components) {
      addComponent({
        name: component, // name of the component to be used in vue templates
        filePath: resolve(runtimeDir, `components/${component}.vue`),
        global: true // register the component globally
      })
    }

    // entire composables folder is auto-imported for use in users application
    addImportsDir(resolve(runtimeDir, 'composables'))

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addServerHandler({
      route: '/api/post-feedback',
      handler: resolve(runtimeDir, 'server/api/post-feedback.post')
    })

    addServerHandler({
      route: '/api/get-feedback',
      handler: resolve(runtimeDir, 'server/api/get-feedback.get')
    })

    // We can inject our CSS file which includes Tailwind's directives
    nuxt.options.css.push(resolve(runtimeDir, 'assets/styles.css'))
    // We need to add our components directory to Tailwind's config
    nuxt.hook('tailwindcss:config', function (tailwindConfig) {
      tailwindConfig.content.files.push(resolve(runtimeDir, 'components/**/*.{vue,js,ts}'))
    })

    // !todo figure out if we can import only specific components/features
    await installModule('@nuxt/ui')

    // addPlugin(resolver.resolve("./runtime/plugin"));
  }
})
