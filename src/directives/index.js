// es6 polyfill
// import 'core-js/fn/array/find-index';

//单选按钮
// var yzCheckbox = require("./checkbox");
import yzCheckbox from "./src/checkbox"
import {yzMenu,yzSubmenu} from "./src/menu"
import yzMenuItem from "./src/menuItem"

var components = { yzCheckbox, yzMenu, yzMenuItem,yzSubmenu };

var install = function(Vue, options = {}) {
    Object.keys(components).forEach((key) => {
        console.log(components[key]);
        Vue.component(key, components[key])
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(components, { install });
