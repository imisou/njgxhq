export default{
    computed:{
        rootMenu:function(){

            var parent = this.$parent;
            // console.log(parent);
            while(parent && parent.$options.componentName !== 'yzMenu'){
                parent = parent.$parent;
            }
            return parent;
        },
        parentMenu:function(){
            var parent = this.$parent;

            // console.log(parent);
            while(parent && ['yzMenu','yzSubMenu'].indexOf(parent.$options.componentName) !== -1){
                parent = parent.$parent;
            }
            return parent;
        }
    }
}