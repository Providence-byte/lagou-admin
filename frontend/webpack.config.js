const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    //配置环境 开发者模式
    mode: "development",

    //source-map作用
    //代码压缩（compress/uglify 等）
    // 多文件合并（用于减少 http 请求数）
    // 语言预处理、编译等（es6、jsx 编译成 es5 版本，TypeScript 编译成 JavaScript 等）
    devtool: "source-map",
    //配置入口
    entry: {
        //官网写法，直接在dist文件夹下创建app.js
        // app: "./src/app.js"
        //在dist文件夹下先创建js文件夹，再在下面创建app.js，更有条理
        'js/app': "./src/app.js" //第一个参数是dist文件夹下的路径，第二个参数是入口文件打包前的路径
    },
    //配置出口
    output: {
        path: path.resolve(__dirname, "./dist"),
        //打完包后的文件名
        filename: '[name].js'

    },
    module: {

        rules: [
            //解析art文件
            {
                test: /\.art$/,
                use: {
                    loader: "art-template-loader"
                }
            },
            //解析css文件    
            {
                test: /\.css$/,
                loaders:["style-loader","css-loader"]
            },

        ]
    },
    //配置插件
    plugins: [
        //自动找到public里的index.html文件，新建一个html放到dist中,并会引入入口文件
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./public/index.html"),
            filename: 'index.html',
            inject: true
        }),
        
        new copyPlugin({
            patterns: [
                //复制ico到dist中
                {
                    from: path.join(__dirname, "./public/favicon.ico"),
                    to: path.join(__dirname, "./dist/")
                },
                //复制libs（外部引入的静态html，css，js文件）
                {
                    from: path.join(__dirname, "./public/libs"),
                    to: path.join(__dirname, "./dist/libs")
                }
            ]
        }),
         //每次构建之前清理/ dist文件夹
        new CleanWebpackPlugin()
    ],
    //配置server
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        compress: true,
        port: 8080,
        //代理 解决跨域
        proxy: {
            '/api': {
              target: 'http://localhost:3000'
            }
          }
    }
}