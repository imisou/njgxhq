<template>
    <div class="m-menu" :class="{'is-mini':mini}">
        <!-- <div class="menu-extend">
            <slot name="extend"></slot>
        </div> -->
        <div class="wrapper-menu">
            <ul>
                <slot></slot>
            </ul>
            
        </div>
        
    </div>
</template>
<script>
    import Emmiter from "../../../mixins/emitter.js"
    export default{
        name:"yzMenu",
        componentName:"yzMenu",
        props:{
            activeName:{
                type:[String,Number]
            },
            mini:{
                type:Boolean,
                default:false
            },
            accordion:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return{
                currentActiveName:""
            }
        },
        methods:{
            subMenuItemClick:function(item){
                this.currentActiveName = item.name;
            }
        }
    }
</script>
<style lang="less" src="../../../styles/menu.less" scoped></style>