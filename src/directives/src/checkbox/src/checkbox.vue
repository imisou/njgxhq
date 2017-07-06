<template>
    <div class="m-checkbox" :class="{'mouseHover':mouseHover}">
        <span  :class="{'is-checked':model,'is-hover':mouseHover}">
            <span class="m-checkbox__inner" @mouseover="handleMouseover">
                <input type="checkbox" name="" ref="input" v-model="model"> 
            </span>
            <div>
                {{model}}
            </div>
        </span>
        
    </div>
</template>
<script>
    export default {
        name:"yzCheckbox",
        componentName:"yzCheckbox",
        props:{

        },
        data(){
            return{
                model:false,
                mouseHover:false
            }
        },
        created:function(){
            console.log(".......");
        },
        methods:{
            handleMouseover:function(){
                this.mouseHover = true;
            }
        }
    }
</script>
<style scoped src="../../../styles/checkbox.less" lang="less">
    
</style>