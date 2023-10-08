import { defu } from "defu";
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponent,
  installModule,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  ghApiKey: string | undefined;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "feedback",
    configKey: "feedback",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    ghApiKey: process.env.GH_API_KEY || undefined,
  },
  async setup(options, nuxt) {
    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.feedback = defu(
      nuxt.options.runtimeConfig.public.feedback,
      options
    );
    nuxt.options.runtimeConfig.feedback = defu(
      nuxt.options.runtimeConfig.feedback,
      options
    );

    const { resolve, resolvePath } = createResolver(import.meta.url);

    // From the runtime directory
    // nuxt.options.build.transpile.push("@nuxt/ui");
    // Transpile runtime
    const runtimeDir = resolve("./runtime");
    // required to make installModule modules work
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push("zod", "octokit");

    // I think this is importing server components
    nuxt.options.alias["#feedback"] = runtimeDir;

    addComponent({
      name: "FeedbackWidget", // name of the component to be used in vue templates
      filePath: resolve("runtime/components/FeedbackWidget.vue"),
      global: true, // register the component globally
    });
    
    addComponent({
      name: "FeedbackInput", // name of the component to be used in vue templates
      filePath: resolve("runtime/components/FeedbackInput.vue"),
      global: true, // register the component globally
    });

    addComponent({
      name: "KanbanBoard", // name of the component to be used in vue templates
      filePath: resolve("runtime/components/KanbanBoard.vue"),
      global: true, // register the component globally
    });

    addComponent({
      name: "KanbanCard", // name of the component to be used in vue templates
      filePath: resolve("runtime/components/KanbanCard.vue"),
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
