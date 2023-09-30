import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponent,
  installModule,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "feedback",
    configKey: "feedback",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url);

    // From the runtime directory
    // nuxt.options.build.transpile.push("@nuxt/ui");
    // Transpile runtime
    const runtimeDir = resolve("./runtime");
    // required to make installModule modules work
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push("zod");

    addComponent({
      name: "FeedbackWidget", // name of the component to be used in vue templates
      filePath: resolve("runtime/components/FeedbackWidget.vue"),
      global: true, // register the component globally
    });

    // We can inject our CSS file which includes Tailwind's directives
    nuxt.options.css.push(resolve(runtimeDir, "assets/styles.css"));
    // We need to add our components directory to Tailwind's config
    nuxt.hook("tailwindcss:config", function (tailwindConfig) {
      tailwindConfig.content.files.push(
        resolve(runtimeDir, "components/**/*.{vue,js,ts}")
      );
    });

    // !todo figure out if we can import only specific components/features
    await installModule("@nuxt/ui");

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve("./runtime/plugin"));
  },
});
