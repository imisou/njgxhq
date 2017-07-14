<template>
    <div class="wrapper-home" :class="{'is-mini':leftbartype}">
        <yz-leftbar></yz-leftbar>
        <div class="wrapper-body">
            <yz-header></yz-header>
            <div class="wrapper-container">
                <router-view></router-view>
                <yz-footer></yz-footer>
            </div>
            
        </div>
    </div>
</template>
<script>
import yzHeader from '../components/common/Header.vue';
import yzLeftbar from '../components/common/LeftBar.vue';
import yzFooter from '../components/common/Footer.vue';
import {mapGetters} from "vuex"
export default {
    components: {
        yzHeader,
        yzLeftbar,
        yzFooter
    },
    computed:{
            ...mapGetters({
                'leftbartype':"getLeftbarType"
            })
        }
}
</script>
<style lang="less" src="src/less/pages/index.less"></style>
