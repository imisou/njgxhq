import * as types from "./mutation_type.js"
import  {$http,$fetch} from "../util/axios.js"

export default {
    setSite: function({ commit },siteId) {
        $fetch('/get_sites.do').then(resp => {
            console.log("结果是：", resp.result);

            if(resp.respCode !== "0"){
                commit(types.SET_SITE_LIST,[]);
                return;
            }
            commit(types.SET_SITE_LIST,resp.result);

            if(siteId){
                resp.result.map(function(elem,index) {
                    console.log("elem",index);
                    if(elem.id == siteId){
                        console.log("elem",elem);
                        commit(types.SET_HEADER_CURRENTSITE,elem);
                    }
                })
            }
        })
    }
}
