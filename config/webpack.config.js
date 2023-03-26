'use strict';
var JavaScriptObfuscator = require('webpack-obfuscator');

// ...

// webpack plugins array

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      content: PATHS.src + '/js/content.js',
      background: PATHS.src + '/background.js',
      api: PATHS.src + '/js/api.js',
      whatsapp: PATHS.src + '/js/whatsapp.js'
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    /*plugins: [
      new JavaScriptObfuscator({
          rotateStringArray: true
      }, ['/js/wppconnectwa.js','/js/wapi.js'])
  ]*/
  });

module.exports = config;
