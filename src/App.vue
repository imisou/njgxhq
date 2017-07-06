<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
export default {
    name: "app",
    data() {
        return {

        }
    },
    components: {
        NprogressContainer
    }
}
</script>
<style lang="less">

@import url("./less/index.less");

#app{
    width: 100%;
    height: 100%;
}
</style>
