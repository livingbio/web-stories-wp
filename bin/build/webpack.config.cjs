/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = process.env.NODE_ENV === 'production';
const resolve = path.resolve.bind(path, __dirname);

function reduceEntry(entry, name) {
  entry[name] = resolve('..', name, 'main.js');
  return entry;
}

module.exports = {
  target: 'node',
  mode: isProduction ? 'production' : 'development',
  entry: ['aiconvert'].reduce(reduceEntry, {}),
  output: {
    path: resolve(),
    filename: '[name]/main.cjs',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      !isProduction && {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          require.resolve('thread-loader'),
          {
            loader: require.resolve('babel-loader'),
            options: {
              // Babel uses a directory within local node_modules
              // by default. Use the environment variable option
              // to enable more persistent caching.
              cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
            },
          },
        ],
      },
    ].filter(Boolean),
  },
  plugins: [new webpack.EnvironmentPlugin({ DISABLE_PREVENT: false })],
};
