<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <h1>中文网页</h1>
      <el-form-item label="成员名字" prop="chName">
        <el-input v-model="form.chName" />
      </el-form-item>
      <el-form-item label="协会职位" prop="chPos">
        <el-input v-model="form.chPos" />
      </el-form-item>
      <el-form-item label="人物介绍" prop="chDes">
        <el-input v-model="form.chDes" type="textarea" />
      </el-form-item>
      <br/><br/>
      <h1>法文网页</h1>
      <el-form-item label="成员名字" prop="frName">
        <el-input v-model="form.frName" />
      </el-form-item>
      <el-form-item label="协会职位" prop="frPos">
        <el-input v-model="form.frPos" />
      </el-form-item>
      <el-form-item label="人物介绍" prop="frDes">
        <el-input v-model="form.frDes" type="textarea" />
      </el-form-item>
      <br/><br/>
      <h1>通用设置</h1>
      <el-form-item label="展示优先级">
         <el-input-number v-model="form.showPriority" :min="1" :max="9"></el-input-number>
         <p style="color:red">数字越小，展示的时候越靠前</p>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="customize"
          :http-request="upLoad"
          :before-upload="beforeUpload"
          :on-change="picChange"
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
        <el-button :loading="loading" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchMember,uploadMember,editMember} from '@/api/about-us'
export default {
  props:{
    isEdit:Boolean
  },
  data() {
    return {
      fileList:[], //编辑页面下存放上传图片的数组
      change:false, //判断是否添加图片
      loading:false,
      form: {
        chName: '',
        chPos: '',
        chDes: '',
        showPriority:1,
        frName:'',
        frPos:'',
        frDes:'',
        id:0, //编辑页面下存放的id
        imgPath:'',//进入修改页面后原来图片的连接
      },
      rules:{
        chName:[
          {required: true, message: '请填写中文姓名', trigger: 'blur'}
        ],
        chPos:[
          {required: true, message: '请填写中文职位', trigger: 'blur'}
        ],
        chDes:[
          {required: true, message: '请填写中文介绍', trigger: 'blur'}
        ],
        frName:[
          {required: true, message: '请填写法文姓名', trigger: 'blur'}
        ],
        frPos:[
          {required: true, message: '请填写法文职位', trigger: 'blur'}
        ],
        frDes:[
          {required: true, message: '请填写法文介绍', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    picChange(){ //添加图片触发
      this.change = true
    },
    editMember(){ //修改页面下，没有重新上传图片使用的方法
      let formdata = new FormData()
      const form = this.form
      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          formdata.append(key,form[key])
        }
      }
      editMember(formdata).then((result) => {
        if(result.data.result == 1) { //修改成功，转换页面
          this.handleSuccess()
          this.loading = false
          this.$router.replace('/about/members/list')
        } else {
          this.handleError()
          this.loading = false
        }
      }).catch((err) => {
        this.loading = false
        this.handleError()
      });
    },
    upLoad(params) { //图片有添加才会进入这里

      let formdata = new FormData()
      const form = this.form
      formdata.append("picture",params.file)

      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          formdata.append(key,form[key])
        }
      }
      if(!this.isEdit) { //新建会员页面，使用添加接口
        uploadMember(formdata).then((result) => {
          this.handleSuccess()
          this.loading = false
        }).catch((err) => {
          this.handleError()
          this.loading = false
        });
      } else {//在修改页面，并且重新添加了图片
        editMember(formdata).then((result) => {
          if(result.data.result == 1) {
          this.handleSuccess()
          this.loading = false
          this.$router.replace('/about/members/list')
        } else {
          this.loading = false
          this.handleError()
        }
        }).catch((err) => {
          this.loading = false
          this.handleError()
        });
      }

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if(this.isEdit && !this.change) { //如果在修改页面并且没有修改图片
            this.editMember()
          } else{
            this.$refs.upload.submit(); //执行upload
          }

        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.showPriority = 1
      this.$refs.upload.clearFiles();
    },
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJpgOrPng) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
          this.loading = false
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
          this.loading = false
        }
        return isJpgOrPng && isLt10M;
      },
    handleSuccess(response , file) {
      this.$message.success('保存成功')
      this.resetForm('form')
    },
    handleError(error , file) {
      this.$message.error('保存失败，请稍后重试')
    }
  },
  created() {
    if(this.isEdit) { //进入了修改页面，获取要修改人员的信息
      fetchMember(this.$route.params.id).then((res) => {
        const {data} = res
        this.form = data
        this.form.id = this.$route.params.id
        this.fileList.push({url:`${data.imgPath}`})
      }).catch((err) => {
        console.log(err);
        this.$message.error('网络错误')
      });
    }
  }
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

