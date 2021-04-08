const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    //配置环境
    mode: "development",

    devtool: "source-map",
    //配置入口
    entry: {
        'js/app': "./src/app.js"
    },
    //配置出口
    output: {
        path: path.resolve(__dirname, "./dist"),
        //打完包后的文件名
        filename: '[name]-[hash:5].js'
        //每次构建之前清理/ dist文件夹
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
        //把html放到dist中
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
                {
                    from: path.join(__dirname, "./public/libs"),
                    to: path.join(__dirname, "./dist/libs")
                }
            ]
        }),
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