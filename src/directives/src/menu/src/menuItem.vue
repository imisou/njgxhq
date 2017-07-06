<template>
    <li class="m-menuitem">
        <a class="m-menuitem__a" :class="{'is-active':active}" @click.stop="handleClick">
            <slot></slot>
        </a>
    </li>
</template>
<script>
import mixins from "./mixins.js"
export default {
    name: "yzMenuItem",
    componentName: "yzMenuItem",
    mixins: [mixins],
    props: {
        name: {
            type: [String, Number],
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        route:{
            type:[String],
            default:""
        }
    },
    data() {
        return {
            // active: false
        }
    },
    computed:{
        active:function(){
            if(this.disabled) return false;

            if(this.rootMenu.currentActiveName === this.name){
                return true;
            }
            return false;
        }
    },
    created: function() {
        console.log(this.rootMenu);
    },
    methods: {
        handleClick: function() {
            console.log(this.route)
            if (this.disabled) return;
            this.active = true;
            this.rootMenu.subMenuItemClick(this);
            if(this.route){
                this.$router.push(this.route)
            }
        }
    }
}
</script>
<style lang="less" src="../../../styles/menu.less" scoped></style>
