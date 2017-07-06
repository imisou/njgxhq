<template>
    <div class="xs-upload-img">
    <vue-core-image-upload
        :class="['btn', 'btn-primary']"
        :crop="false"
        @imagechanged="imagechanged"
        @imageuploading="imageuploading"
        @imageuploaded="imageuploaded"
        :max-file-size="5242880"
        url="http://101.198.151.190/api/upload.php" >
    </vue-core-image-upload>
    </div>
</template>
<script>
import VueCoreImageUpload  from 'vue-core-image-upload';
export default {
    name: "uploadPic",
    data() {
        return {

        }
    },
    methods: {
        imagechanged: function(res) {
            console.log('imagechanged');
            console.log(this.res);
            console.log(this.arguments);
        },

        imageuploading: function() {
            
        },

        imageuploaded: function(res) {
           
        }
    },
    components:{
        VueCoreImageUpload
    }
}
</script>
