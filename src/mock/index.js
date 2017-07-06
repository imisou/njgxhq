// import Mock from 'mockjs';
// import {vuetable} from './vuetable.js';
// import {datasource} from './datasource.js';

// let data = [].concat(vuetable,datasource);

// data.forEach(function(res){
//     Mock.mock(res.path, res.data);
// });

// export default Mock;
// 
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';


// 设置模拟调试器实例 
var mock = new MockAdapter(axios);
// 模拟任意GET请求到 /users 
//reply的参数为 (status, data, headers) 
mock.onPost('/get_sites.do').reply(200, {
    result: [
        {
            id:1,
            siteName:"主站点",
            siteType:"1"
        },{
            id:2,
            siteName:"子站点1",
            siteType:"2"
        }
    ]
});