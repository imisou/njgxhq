import Vue from "vue"
import Vuex from 'vuex'

import state from './store'
import getters from "./getters"
import mutations from "./mutations.js";
import actions from "./actions.js"

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

import header from "./modules/header.js"

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        header
    },
    strict: debug
})
