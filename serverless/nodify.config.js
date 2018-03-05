const resolve = require('rollup-plugin-node-resolve');
const minify = require('rollup-plugin-babel-minify');

module.exports = {
  rollup: (config, env) => {
    config.output.file = 'build/dist.js';
    if (env === 'production') {
      // using resolve as lambdas needs node_modules bundled up
      // and babel-minify is optional but just to reduce size as serverless has a size limit.
      config.plugins.push(resolve(), minify());
    }
    return config;
  },
};