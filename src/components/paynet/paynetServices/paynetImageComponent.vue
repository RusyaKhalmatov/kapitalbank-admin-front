<template>
    <div>
        <div class="upload-box">
            <el-upload
                class="upload-demo"
                action="#"
                color="#e08e4b"
                drag
                :on-change="handleChangeFile"
                :on-remove="handleRemoveFile"
                :auto-upload="false"
                :multiple="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Перетащите файл сюда или <em>нажмите, чтобы загрузить</em></div>
                <!-- <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div> -->
        </el-upload>
        <v-img v-if="imagePreview" class="image-preview" :contain="true" max-width="300px" max-height="300px" :src="imagePreview" alt=""></v-img>
        </div>

    </div>
</template>
<script>
export default {
    name: 'paynetImageComponent',
    props:{
        logoUrl: String
    },
    data(){
        return{
            fileList:[],
            imagePreview: '',
        }
    },
    methods:{
        handleChangeFile(file){
            this.imagePreview = URL.createObjectURL(file.raw);  
            this.$emit('update:file', file.raw)
        },
        handleRemoveFile(){
            this.imagePreview = '';
            this.$emit('update:file', this.file)
        }
    },
    mounted(){
        this.imagePreview = this.logoUrl
    }
}
</script>
<style scoped>
    >>>.el-upload-dragger:hover{
        border-color: #e08e4b !important;
    }
    >>>em{
        color:  #e08e4b !important;
    }
    >>>.el-upload:focus {
        border-color: #e08e4b !important;
        color: #e08e4b !important;
    }
    >>>.el-upload:focus .el-upload-dragger {
        border-color: #e08e4b !important;
    }
    .upload-box{
        max-width: 400px;
        display: flex;
        flex-direction: column;
    }
    .image-preview{
        margin: 10px 0px;
        border-radius: 10px;
    }
</style>