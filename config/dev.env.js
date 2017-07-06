var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // 'main': '"http://183.207.180.5:8043/hospital-main"',
    // 'user': '"http://183.207.180.5:8043/hospital-user"',
    // 'consoleapi': '"http://183.207.180.5:8043/hospital-console"'
    'main': '"http://localhost:8080/hospital-main"',
    'user': '"http://localhost:8080/hospital-user"',
    'consoleapi': '"http://localhost:8080/hospital-console"'
})
