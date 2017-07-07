<template>
    <li class="m-submenu" :class="{'is-open':isOpen}" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
        <transition>
            <a class="m-submenu__a m-menuitem__a" :class="{'is-over':isOver}" @click.stop="handleOpenSub" >
                <slot name="title"></slot>
                <i class="icon iconfont icon-xiala" v-if="!isMini"></i>
            </a>
        </transition>
        <collapse-transition>
            <ul class="m-submenu__ul" v-show="isOpen">
                <slot></slot>
            </ul>
        </collapse-transition>
    </li>
</template>
<script>
import mixins from "./mixins.js"
import Emmiter from "../../../mixins/emitter.js"
import collapseTransition from '../../../transition/collapse-transition.js'
export default {
    name: "yzSubMenu",
    componentName: "yzSubMenu",
    mixins: [mixins],
    components: {
        collapseTransition
    },
    props: {
        name: {
            type: [String, Number]
        },
        disabled: {
            type: Boolean,
            default: false
        },
        mode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            childrenMenus: [],
            isOpen: false,
            isOver: false
        }
    },
    computed: {

        /*
            是否是手风琴模式
         */
        accordion: function() {
            return this.rootMenu.accordion;
        },

        isMini: function() {
            return this.rootMenu.mini
        }
    },
    methods: {
        handleOpenSub: function() {
            if (this.disabled || this.isMini) return;

            var open = this.isOpen;
            console.log(this.accordion)
            if (this.accordion) {
                this.$parent.$children.forEach(item => {
                    console.log(item.$options.componentName);
                    if (item.$options.componentName === 'yzSubMenu') item.isOpen = false;
                })
            }
            this.isOpen = !open;
        },
        handleMouseover: function() {
            if (this.disabled || !this.isMini) return;
            var open = this.isOpen;
            console.log(this.accordion)

            this.$parent.$children.forEach(item => {
                console.log(item.$options.componentName);
                if (item.$options.componentName === 'yzSubMenu') item.isOpen = false;
            })

            this.isOpen = true;
        },
        handleMouseleave: function() {
            if (this.disabled || !this.isMini) return;
            var open = this.isOpen;
            this.$parent.$children.forEach(item => {
                console.log(item.$options.componentName);
                if (item.$options.componentName === 'yzSubMenu') item.isOpen = false;
            })

            this.isOpen = false;
        }
    },
    watch:{
        isMini:function(){
            this.isOpen = false;
        }
    }
}
</script>
<style lang="less" src="../../../styles/menu.less"></style>
