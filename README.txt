
前端项目为什么要使用webpack进行打包？
https://www.jianshu.com/p/d9c998911561



==================================webpack安装步骤,使用webpack1.15.0 新版本会有点问题================================

1.安装node.js和npm,一般node.js会自带npm。 node.js安装比较简单。

2.安装webpack
    npm install webpack@1.15.0 -g ##全局安装，3.8.0为指定webpakc版本
    ###npm install wepack-cli -g ##全局安装webpack-cli webpack4.0以上版本需要依赖webpack-cli
    npm install webpack-dev-server@2.9.7 -g
    npm install webpack@1.15.0 --save-dev  ##局部安装wbpack
    ##npm install webpack-cli --save-dev ###webpack4.0以上需要webpack-cli
    npm install webpack-dev-server@2.9.7 --save-dev ##局部安装

    卸载webpack:  npm uninstall webpack -g
                 npm uninstall -g webpack-dev-server

==================================webpack学习笔记==================================
(1).新建项目，在当前目录下，执行npm init 命令，用来初始化项目，初始化成功后会生成一个package.json配置文件

##第一种打包方式
(2).执行打包命令：    webpack ./src/page/index/index.js  ./dist/app.js  ##将index.js一起的关联文件打包到app.js

##第二种打包方式
(3).在项目根目录，添加配置文件webpack.config.js 。webpack.config.js的配置文件内容为
    module.exports = {
        entry: './src/page/common/index.js', ##要打包的js文件
        output: {
            path: './dist', ##打包之后文件存放的目录
            publicPath : '/dist',
            filename: 'js/[name].js' ##name的值就是要打包的js名字index ,打包后文件存放的目录为./dist/js/index.js
        }
      };

####一般都采用第二种打包方式
(4).webpack打包脚本js处理方法
    ####============js打包相关========================
    1.Js用什么loader加载？ JSLoader是动态加载js文件，也就是该页面只加载需要的js文件。
         var config = {
                entry: './src/page/common/index.js', ##要打包的js文件
                output: {
                    path: './dist', ##打包之后文件存放的目录
                    publicPath : '/dist',
                    filename: 'js/[name].js' ##name的值就是要打包的js名字index ,打包后文件存放的目录为./dist/js/index.js
                }
              };
          module.exports = config;

       选用webpack自带的加载器，保证兼用型

    2.官方文档中的例子中entry只有一个js,我们有多个怎么办?

      ###解决多js进行打包配置
      var config = {
          entry: {
              'common'            : ['./src/page/common/index.js'],
              'index'             : ['./src/page/index/index.js'],
          },
          output: {
              path: './dist',
              publicPath : '/dist',
              filename: 'js/[name].js'
          }

          module.exports = config;


    3.output里面要分文件夹存放目标文件，怎么设置?
          output: {
                        path: './dist',
                        publicPath : '/dist',
                        filename: 'js/[name].js'
                    }
    4.jquery引入方法?
        ###第一种方案
        1.npm install jquery --save-dev  ###安装jquery

          npm uninstall jquery --save-dev ###卸载jquery

        2.####js这样引入jquery
        var $ = require('jquery');

        $('body').html("HELLO INDEX");

        ##第二种在html里面使用https:jquery模式引入，不用安装jquery模块，需要使用
        var $$ = require("query"); 引入模块时，需要在webpack.config.js中加入下面的代码即可

        3.使用配置文件加载jquery模块
             externals : {
                    'jquery' : 'window.jQuery'
                },
    5.怎样提取公共模块?
        https://blog.csdn.net/connie_0217/article/details/79760054
        使用组件CommonsChunkPlugin
        1.配置文件webpack.config.js里面加入下面代码：
            var webpack = require('webpack');
             plugins: [
                    // 独立通用模块到js/base.js
                    new webpack.optimize.CommonsChunkPlugin({
                        name : 'common',
                        filename : 'js/base.js'
                    }),
                   ]

         2.定义一个全局js,将其打包为公共模块的方法处理
             var config = {
                 entry: {
                     'common'            : ['./src/page/common/index.js'],

                 },
                 output: {
                     path: './dist',
                     publicPath : '/dist',
                     filename: 'js/[name].js'
                 }
                }
             plugins: [
                    // 独立通用模块到js/base.js
                    new webpack.optimize.CommonsChunkPlugin({
                        name : 'common', ### 引入的entry中common的公共js
                        filename : 'js/base.js'  ###打包为base.js
                    }),
                   ]



    ####==============css模块化相关===========================
    6.样式使用怎样的loader?

       1.安装loader: npm install css-loader style-loader --save-dev

    7.webpack打包的css独立成单独文件?
           1.安装插件： npm install extract-webpack-plugin@1.0.1 --save-dev
           2. webpack.config.js文件里面加入下面代码：
            var ExtractTextPlugin   = require('extract-text-webpack-plugin');
             module: {
                    loaders: [
                        { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
                    ]
                },

             plugins: [
                     // 独立通用模块到js/base.js
                     new webpack.optimize.CommonsChunkPlugin({
                         name : 'common',
                         filename : 'js/base.js'
                     }),
                     // 把css单独打包到文件里
                     new ExtractTextPlugin("css/[name].css"),
                    ]

(5).webpack 打包html
    1.安装插件：npm install html-webpack-plugin --save-dev
    2.引入插件，在webpack.config.js加入：
    var HtmlWebpackPlugin   = require('html-webpack-plugin');
    // 获取html-webpack-plugin参数的方法
    var getHtmlConfig = function(name, title){
        return {
            template    : './src/view/' + name + '.html',
            filename    : 'view/' + name + '.html',
            title       : title,
            inject      : true,
            hash        : true,
            chunks      : ['common', name] ##要引入的js
        };
    };
         plugins: [
                // 独立通用模块到js/base.js
                new webpack.optimize.CommonsChunkPlugin({
                    name : 'common',
                    filename : 'js/base.js'
                }),
                // 把css单独打包到文件里
                new ExtractTextPlugin("css/[name].css"),
                // html模板的处理
                new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
                new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表页')),
                new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情页')),
                new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
                new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
                new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
                new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密码')),
                new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
                new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
                new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
                new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
            ]
        };


    3.使用require打包通用的html

        安装html的loader. 命令为：npm install html-loader --save-dev
        在html里面引入公共html
        <%=require('html-head.html')%>



(6) webpack处理图片和字体


(7) webpack-dev-server
    1.安装：npm install webpack-dev-server --save-dev

    2.全局安装：sudo npm install webpack-dev-server@1.16.5 -g

    3.启动webpack-dev-server:  webpack-dev-server

    4.指定webpack-dev-server启动端口号命令： webpack-dev-server --inline --port 8088

    ###linux系统下启动
    5.指定配置文件变量启动：WEBPACK_ENV =dev  webpack-dev-server --inline --port 8088
            // 环境变量配置，dev / online
           var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
           if('dev' === WEBPACK_ENV){
               config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
           }
    6.npm来执行一些脚本
        package.json里面配置 脚本
          "scripts": {
              "dev": "WEBPACK_ENV=dev webpack-dev-server --inline --port 8088",
              "dev_win": "set WEBPACK_ENV=dev && webpack-dev-server --inline --port 8088",
              "dist": "WEBPACK_ENV=online webpack -p",
              "dist_win": "set WEBPACK_ENV=online && webpack -p"
            }

        然后执行 npm run dev 命令  等同于执行命令：WEBPACK_ENV=dev webpack-dev-server --inline --port 8088

================================================================项目开发======================================================================




=====================前端项目开发20190524=======================


第一，通用工具类(js)



第二，做网页最低要求
    1.对齐 2.页面要简单即扁平化 3.保持一定的距离 4.配色是一门学问，但是灰色比较百搭
    4.也可以使用bootstrap




























