import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
import actions from "./actions"
import {state,mutations,getters} from "./mutations"
import order from "./modules/order"
import cate from "./modules/cate"
import specs from "./modules/specs"
import banner from "./modules/banner"
import goods from "./modules/goods"
import seck from "./modules/seck"
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        order,
        cate,
        specs,
        banner,
        goods,
        seck
    }
})