import { defu } from 'defu'
import {
  defineNuxtModule,
  // addPlugin,
  addImportsDir,
  createResolver,
  addComponent,
  installModule
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
    name: 'feedback',
    configKey: 'feedback'
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
    // Public runtimeConfig
    // !TODO: remove api key from public
    nuxt.options.runtimeConfig.public.feedback = defu(
      nuxt.options.runtimeConfig.public.feedback,
      options
    )

    // Private runtimeConfig
    nuxt.options.runtimeConfig.feedback = defu(nuxt.options.runtimeConfig.feedback, {
      api_key: options.github.api_key
    })

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

    // We can inject our CSS file which includes Tailwind's directives
    nuxt.options.css.push(resolve(runtimeDir, 'assets/styles.css'))
    // We need to add our components directory to Tailwind's config
    nuxt.hook('tailwindcss:config', function (tailwindConfig) {
      tailwindConfig.content.files.push(resolve(runtimeDir, 'components/**/*.{vue,js,ts}'))
    })

    // !todo figure out if we can import only specific components/features
    await installModule('@nuxt/ui')

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve("./runtime/plugin"));
  }
})
