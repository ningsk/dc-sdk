/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 16:36:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-16 18:47:25
 */
import rollupGitVersion from "rollup-plugin-git-version";
import resolve from "@rollup/plugin-node-resolve"
import image from "@rollup/plugin-image"
import glsl from "rollup-plugin-glslify"
import json from "rollup-plugin-json";
import gitRev from "git-rev-sync";
import pkg from "../package.json";

let { version } = pkg;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === "release") {
  release = true;
} else {
  release = false;
  const branch = gitRev.branch();
  const rev = gitRev.short();
  version += "+" + branch + "." + rev;
}

export default {
  input: "src/index.js",
  external: ["turf", "cesium"],
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "DC",
      globals: {
        cesium: "Cesium",
      },
    },
  ],
  plugins: [release ? json() : rollupGitVersion(), resolve(), image(), glsl()],
};
