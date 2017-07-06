// https://github.com/shelljs/shelljs
require('./check-versions')()
// npm run build 此时的环境为production
// npm run build xiansheng  此时 process.argv[2] = 'xiansheng'
process.env.NODE_ENV = process.argv[2] ? process.argv[2] : 'production';

console.log(process.env.NODE_ENV);

// __dirname 存储的是当前的完整路径
// C:\project\hospital\code\console\build
// 
// console.log('build __dirname',__dirname);
// __filename 存储的是当前文件的文件名
// C:\project\hospital\code\console\build\build.js
// console.log('build __filename',__filename);

//ora 模块  添加一个在命令行中的loading效果
var ora = require('ora')

//path  node中处理目录的对象模块
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

// loading效果 默认显示的信息为building for ...
var spinner = ora('building for production...');
//设置 loading效果的 显示颜色 不是 building for 字体的颜色 只是提示符ed颜色
spinner.color = "red";
//实现 loading效果的 提示内容 不写的话就是上面的 building for production...
//spinner.text = "loading";
//启动 loading效果
spinner.start()

//生成 dist路径的地址   //dist/static
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
//shelljs 代替shell脚本库  生成shell命令
//删除dist/static文件夹

shell.rm('-rf', assetsPath)
    //创建此文件夹
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.config.silent = false

webpack(webpackConfig, function(err, stats) {
    //console.log(webpackConfig);
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
})
