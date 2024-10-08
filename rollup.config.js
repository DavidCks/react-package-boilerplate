import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Handle .tsx files
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Babel should handle these too
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript", // Add this preset
      ],
    }),
    terser(),
  ],
  external: Object.keys(pkg.peerDependencies),
};
