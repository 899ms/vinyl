import { defineConfig } from "vite";

// "three" is intentionally NOT installed in node_modules — it's loaded at
// runtime from a CDN via the <script type="importmap"> in index.html. The
// build handles this with rollupOptions.external below, but the dev server
// uses its own import-analysis that would still try to resolve the bare
// `import ... from "three"` from node_modules and fail. This plugin makes the
// dev server resolve "three" straight to the same CDN module (as a native URL
// import the browser fetches directly), so `npm run dev` works too.
const THREE_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export default defineConfig({
  plugins: [
    {
      name: "externalize-three-dev",
      apply: "serve",
      enforce: "pre",
      resolveId(id) {
        if (id === "three") return { id: THREE_CDN, external: true };
      },
    },
  ],
  build: {
    rollupOptions: {
      // Mark "three" external so the bundler leaves the bare
      // `import ... from "three"` untouched (the importmap resolves it at
      // runtime) instead of trying to resolve it from node_modules at build.
      external: ["three"],
    },
  },
});
