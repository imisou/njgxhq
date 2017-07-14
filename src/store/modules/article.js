import * as util from "../../util/common.js"

const article = {
    namespaced: true,

    state: {
        name: "article",
        columnCascader:[],
        columnList:[],
        mode:"add",
        form:{
            content:{}, 
        }

    },
    getters: {
        getUsername(state) {
            console.log('article name:', state);
            return state.name;
        },
        columnList(state){
            return state.columnList;
        },
        columnCascader(state){
            return state.columnCascader;
        },
        mode(state){
            return state.mode;
        },
        formContent(state){
            return state.form.content;
        }
    },
    mutations: {
        setColumnCascader (state, payload) {
            state.columnCascader = payload;
        },
        setColumnList (state, payload) {
            state.columnList = payload;
        },
        setMode (state, payload) {
            state.mode = payload;
        },
        setForm (state, payload) {
            state.form.content = payload;
        },
        
    },
    actions: {
        
    }
}

export default article;
