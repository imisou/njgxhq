import * as types from "./mutation_type.js"

export default {
    [types.SET_SITE_LIST](state,payload){
        state.siteData = payload;
    }
}