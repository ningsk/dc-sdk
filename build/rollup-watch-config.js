/*
 * @Descripttion:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 16:44:56
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 11:15:15
 */
// Config file for running Rollup in "watch" mode
// This adds a sanity check to help ourselves to run 'rollup -w' as needed.

import rollupGitVersion from "rollup-plugin-git-version";
import gitRev from "git-rev-sync";

const branch = gitRev.branch();
const rev = gitRev.short();
import pkg from "../package.json";
const version = require("../package.json").version + "+" + branch + "." + rev;

export default {
  input: "src/index.js",
  output: {
    file: pkg.main,
    format: "umd",
    name: "mars",
    legacy: true, // Needed to create files loadable by IE8
    freeze: false,
  },
  plugins: [rollupGitVersion()],
};
