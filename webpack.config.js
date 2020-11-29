const path = require('path');
// Плагин для подключения HTML 
const HTMLWebpackPlugin = require('html-webpack-plugin');
// Плагин для очистки директории
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// Плагин для копирования файлов  { from: "source", to: "dest" }
const CopyPlugin = require("copy-webpack-plugin");
// Плагин минимизации CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// Плагин минимизация JS
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

// Настройка: Сжатие (CSS и JS) при BUILD проекта
const optimization = () => {
  const splitChunks = isProd ? {chunks: 'all'} : {};  
  return {
    splitChunks: splitChunks,
    minimize: isProd, 
    minimizer: [
      new CssMinimizerPlugin(), 
      new TerserPlugin({
        extractComments: "all",
      }),
    ],
  }
}

// Настройка: Обработчик CSS
const cssLoader = () => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // Add Options
      }
    }, 
    "css-loader"
  ]
  return loaders
}

// Натсройка: Обработчик Sass
const sassLoader = () => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
      }
    }, 
    'css-loader?url=false',
    {
      loader: 'resolve-url-loader',
      options: {
        sourceMap: true
      }
    },{
      loader: 'sass-loader',
      options: { sourceMap: true }
    },
  ]

  return loaders
}

// Настройка: оптимизация для лоадеров JS - TS - JSX
const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}

module.exports = {
  // путь к рабочей директории проекта
  context: path.resolve(__dirname, '#src'),
  mode: 'development',
  entry:
  {
    main: ['@babel/polyfill','./index.js'],
  },
  output: {
    filename: '[name].[contenthash].js', 
    path: path.resolve(__dirname, 'dist/')
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '#src'),
      '@public': path.resolve(__dirname, '#src/public'),
      '@img': path.resolve(__dirname, '#src/img'),
      '@src': path.resolve(__dirname, '#src/src'),
      '@fonts': path.resolve(__dirname, '#src/fonts'),
    }
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : false,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    open: true,
    compress: true,
    port: 4200,
    hot: isDev
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './html/index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd 
      }
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { 
          from: "./public", 
          to: "./public" 
        },
        { 
          from: "./img", 
          to: "./img" 
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [ 
      {
        test: /\.css$/i,
        use: cssLoader()
      },
      {
        test: /\.s[ac]ss$/i,
        use: sassLoader(),
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg|ttf|eot|woff|woff2|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[hash]',
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      }
    ]
  }

}