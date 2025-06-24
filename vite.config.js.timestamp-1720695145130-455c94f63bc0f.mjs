// vite.config.js
import { svelte } from "file:///F:/Documentos/www/NXLabs/pos/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import routify from "file:///F:/Documentos/www/NXLabs/pos/node_modules/@roxi/routify/lib/extra/vite-plugin/vite-plugin.js";
import { defineConfig } from "file:///F:/Documentos/www/NXLabs/pos/node_modules/vite/dist/node/index.js";
import { mdsvex } from "file:///F:/Documentos/www/NXLabs/pos/node_modules/mdsvex/dist/main.cjs.js";
import { resolve } from "path";
import postCssNesting from "file:///F:/Documentos/www/NXLabs/pos/node_modules/postcss-nesting/dist/index.mjs";
var production = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  clearScreen: false,
  resolve: { alias: { "@": resolve("src") } },
  test: {
    environment: "jsdom",
    globals: true,
    server: {
      deps: { inline: ["@roxi/routify"] }
    }
  },
  plugins: [
    routify({ render: { ssr: { enable: production }, ssg: true } }),
    svelte({
      compilerOptions: {
        dev: !production,
        hydratable: !!process.env.ROUTIFY_SSR_ENABLE
      },
      extensions: [".md", ".svelte"],
      preprocess: [mdsvex({ extension: "md" })]
    })
  ],
  publicDir: "assets",
  css: { postcss: { plugins: [postCssNesting()] } },
  server: { port: 1337 }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxEb2N1bWVudG9zXFxcXHd3d1xcXFxOWExhYnNcXFxccG9zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxEb2N1bWVudG9zXFxcXHd3d1xcXFxOWExhYnNcXFxccG9zXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Eb2N1bWVudG9zL3d3dy9OWExhYnMvcG9zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcbmltcG9ydCByb3V0aWZ5IGZyb20gJ0Byb3hpL3JvdXRpZnkvdml0ZS1wbHVnaW4nXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgbWRzdmV4IH0gZnJvbSAnbWRzdmV4J1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgcG9zdENzc05lc3RpbmcgZnJvbSAncG9zdGNzcy1uZXN0aW5nJ1xuXG5jb25zdCBwcm9kdWN0aW9uID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBjbGVhclNjcmVlbjogZmFsc2UsXG4gIHJlc29sdmU6IHsgYWxpYXM6IHsgJ0AnOiByZXNvbHZlKCdzcmMnKSB9IH0sXG5cbiAgdGVzdDoge1xuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgc2VydmVyOiB7XG4gICAgICBkZXBzOiB7IGlubGluZTogWydAcm94aS9yb3V0aWZ5J10gfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcm91dGlmeSh7IHJlbmRlcjogeyBzc3I6IHsgZW5hYmxlOiBwcm9kdWN0aW9uIH0sIHNzZzogdHJ1ZSB9IH0pLFxuICAgIHN2ZWx0ZSh7XG4gICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgZGV2OiAhcHJvZHVjdGlvbixcbiAgICAgICAgaHlkcmF0YWJsZTogISFwcm9jZXNzLmVudi5ST1VUSUZZX1NTUl9FTkFCTEUsXG4gICAgICB9LFxuICAgICAgZXh0ZW5zaW9uczogWycubWQnLCAnLnN2ZWx0ZSddLFxuICAgICAgcHJlcHJvY2VzczogW21kc3ZleCh7IGV4dGVuc2lvbjogJ21kJyB9KV0sXG4gICAgfSksXG4gIF0sXG4gIHB1YmxpY0RpcjogJ2Fzc2V0cycsXG4gIGNzczogeyBwb3N0Y3NzOiB7IHBsdWdpbnM6IFtwb3N0Q3NzTmVzdGluZygpXSB9IH0sXG5cbiAgc2VydmVyOiB7IHBvcnQ6IDEzMzcgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdSLFNBQVMsY0FBYztBQUN2UyxPQUFPLGFBQWE7QUFDcEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxjQUFjO0FBQ3ZCLFNBQVMsZUFBZTtBQUN4QixPQUFPLG9CQUFvQjtBQUUzQixJQUFNLGFBQWEsUUFBUSxJQUFJLGFBQWE7QUFFNUMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsYUFBYTtBQUFBLEVBQ2IsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLFFBQVEsS0FBSyxFQUFFLEVBQUU7QUFBQSxFQUUxQyxNQUFNO0FBQUEsSUFDSixhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsTUFDTixNQUFNLEVBQUUsUUFBUSxDQUFDLGVBQWUsRUFBRTtBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxXQUFXLEdBQUcsS0FBSyxLQUFLLEVBQUUsQ0FBQztBQUFBLElBQzlELE9BQU87QUFBQSxNQUNMLGlCQUFpQjtBQUFBLFFBQ2YsS0FBSyxDQUFDO0FBQUEsUUFDTixZQUFZLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFBQSxNQUM1QjtBQUFBLE1BQ0EsWUFBWSxDQUFDLE9BQU8sU0FBUztBQUFBLE1BQzdCLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxLQUFLLENBQUMsQ0FBQztBQUFBLElBQzFDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFO0FBQUEsRUFFaEQsUUFBUSxFQUFFLE1BQU0sS0FBSztBQUN2QixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
