import * as types from "./mutation_type.js"
import  {$http,$fetch} from "../util/axios.js"

export default {
    setSite: function({ commit },siteId) {
        $fetch('/user/select_by_user.do').then(resp => {
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
            }else{
                commit(types.SET_HEADER_CURRENTSITE,resp.result[0]);
            }
        })
    }
}
