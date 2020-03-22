<template>
  <div>
    <h1>协会介绍法文图片上传</h1>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/acef/img/ussoai"
        name="slideshows"
        :data="{
          ...picture
        }"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        list-type="picture-card"
        :limit=1
        :multiple="false"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" style="color:red" class="el-upload__tip">只能1个上传<strong>jpg/png</strong>文件，且不超过10M</div>
      </el-upload>

      <el-button type="primary" @click="$refs.upload.submit();">保存</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
  </div>
</template>

<script>
import {getAssociationPic} from '@/api/about-us'
export default {
  data() {
    return {
      fileList:[],
      picture:{
        part:'xiehuipic2'
      } //如果是修改情况下存放请求回来的图片信息，默认只有part，此时是首次上传状态
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs.upload.clearFiles();
    },
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJpgOrPng) {
          this.$message.error('上传协会图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传协会图片大小不能超过 10MB!');
        }
        return isJpgOrPng && isLt10M;
      },
    handleSuccess(response , file) {
      console.log(response);
      this.$message.success('保存成功')
    },
    handleError(error , file) {
      console.log(error);
      this.$message.error('保存失败，请稍后重试')
    },

    
  },
   created() {
    getAssociationPic(2).then((result) => {
       if(result && result.data[0].url) { //请求有内容，证明是修改图片
        this.$set(this.picture,'id',result.data[0].id)
        this.$set(this.picture,'url',result.data[0].url)
        this.fileList.push({url:result.data[0].url})
       }
     }).catch((err) => {
       this.$message.error('网络错误，请稍后再试')
     });
  
  },
  mounted() {
  },
}
</script>

<style scoped>
h1{
  color: #304156;
}
.line{
  text-align: center;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>