<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="网站名字" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model="form.link" />
      </el-form-item>
      <el-form-item label="上传图片" prop="picture">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/acef/fl/u"
          name="picture"
          :on-success="handleSuccess"
          :on-error="handleError"
          :data="{description:form.description,link:form.link}"
          :before-upload="beforeUpload"
          list-type="picture-card"
          :file-list="fileList"
          :limit=1
          :multiple="false"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" style="color:red" class="el-upload__tip">只能1个上传jpg/png文件，且不超过10M</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value == '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      fileList:[], //编辑页面下存放上传图片的数组
      loading:false,
      form: {
        description:'',
        link:''
      },
      rules: {
        description: [{ validator: validateRequire, trigger: 'blur' }],
        link: [{ validator: validateRequire ,trigger: 'blur'}],
        picture: [{ validator: validateRequire }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$refs.upload.submit()
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.upload.clearFiles();
    },
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isJpgOrPng) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        if(!(isJpgOrPng && isLt10M)) {
          this.loading = false
        }
        return isJpgOrPng && isLt10M;
      },
    handleSuccess(response , file) {
      this.loading = false
      this.$message.success('保存成功')
      this.resetForm('form')
    },
    handleError(error , file) {
      this.loading = false
      this.$message.error('保存失败，请稍后重试')
    }
  },
  created() {
  }
}
</script>

<style scoped>
.app-container{
  width: 600px;
}
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

