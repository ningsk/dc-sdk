/*
 * @Descripttion:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 16:44:56
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-10 16:45:40
 */
// Config file for running Rollup in "watch" mode
// This adds a sanity check to help ourselves to run 'rollup -w' as needed.

import rollupGitVersion from "rollup-plugin-git-version";
import gitRev from "git-rev-sync";

const branch = gitRev.branch();
const rev = gitRev.short();
const version = require("../package.json").version + "+" + branch + "." + rev;

export default {
  input: "src/Earth3D.js",
  output: {
    file: "dist/earth3d-src.js",
    format: "umd",
    name: "Earth3D",
    legacy: true, // Needed to create files loadable by IE8
    freeze: false,
  },
  plugins: [rollupGitVersion()],
};
