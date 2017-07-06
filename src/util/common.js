//let user,main,consoleapi;
console.log('process.env.NODE_ENV',process.env);

//环境变量配置数据在config/**.env.js中进行配置
const { user,main,consoleapi } = process.env;


export const userApi = user;
export const mainApi = main;
export const consoleApi = consoleapi;
