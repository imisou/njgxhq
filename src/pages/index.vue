<template>
    <div class="wrapper-home">
        <div class="wrapper-leftbar">
            <yz-leftbar></yz-leftbar>    
        </div>
        <div class="wrapper-body">
            <yz-header></yz-header>
            <router-view></router-view>
            <yz-footer></yz-footer>   
        </div>
    </div>
</template>
<script>
    import yzHeader from '../components/common/Header.vue';
    import yzLeftbar from '../components/common/LeftBar.vue';
    import yzFooter from '../components/common/Footer.vue';
    export default {
        components:{
            yzHeader, yzLeftbar,yzFooter
        }
    }
</script>
<style lang="less" src="src/less/pages/index.less"></style>
