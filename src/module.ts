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
    const resolver = createResolver(import.meta.url);

    // From the runtime directory
    // nuxt.options.build.transpile.push("@nuxt/ui");

    // await installModule("@nuxt/ui");

    addComponent({
      name: "FeedbackWidget", // name of the component to be used in vue templates
      filePath: resolver.resolve("runtime/components/FeedbackWidget.vue"),
      global: true, // register the component globally
    });

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve("./runtime/plugin"));
  },
});
