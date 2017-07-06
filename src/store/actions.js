import * as types from "./mutation_type.js"


export default {
    setSite: function({ commit }) {
        this.$http.post('/get_sites.do').then(resp => {
            console.log("结果是：", resp);
        })
    }
}
