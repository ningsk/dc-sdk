/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 16:36:35
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 13:12:14
 */
import rollupGitVersion from "rollup-plugin-git-version";
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
  external: ["jquery", "turf", "cesium"],
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "mars3d",
      globals: {
        jquery: "$",
        cesium: "Cesium",
        leaflet: "L",
        "esri-leaflet": "L.esri",
      },
    },
  ],
  plugins: [release ? json() : rollupGitVersion()],
};
