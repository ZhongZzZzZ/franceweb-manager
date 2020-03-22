<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" className="sub-navbar">
        <CommentDropdown v-model="postForm.language"/>
        <el-button :loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发表
        </el-button>
      <el-button :disabled="isEdit" :loading="loading" type="warning" @click="resetForm('postForm')">
          重置
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="7">
                  <el-form-item style="margin-bottom: 40px;" prop="author" label-width="70px" label="组织者：">
                    <el-input v-model="postForm.author" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入组织者" />
                  </el-form-item>
                </el-col>

                <el-col :span="7">

                  <el-form-item label-width="120px" prop="displayTime" label="发表时间：" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.displayTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="发表时间" />
                  </el-form-item>
                </el-col>

                <el-col :span="7">
                  <el-form-item label-width="120px" prop="activityTime" label="活动时间：" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.activityTime"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>



        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce :articleId="postForm.articleId" ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item label="图片上传" prop="filePic" style="margin-bottom: 30px;width:300px;">
              <el-upload
              class="upload-demo"
              ref="uploadPic"
              action="abc"
              list-type="picture"
              :multiple="false"
              :limit="1"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" style="color:red" class="el-upload__tip">只能1个上传jpg/png文件，且不超过10M</div>
            </el-upload>
            </el-form-item>
          </el-col>


          <el-col :span="8" :offset="1">
            <el-form-item label="报名表上传" prop="fileForm" style="margin-bottom: 30px;width:300px;">
              <el-upload
              class="upload-demo"
              ref="uploadForm"
              action="abc"
              list-type="picture"
              :multiple="false"
              :limit="1"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" style="color:red" class="el-upload__tip">只能1个上传文件</div>
            </el-upload>
        </el-form-item>
          </el-col>
        </el-row>


      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import Warning from './Warning'
import { CommentDropdown } from './Dropdown'
import {upLoadActivityArticle,fetchActivityArticle,editActivityArticle} from '@/api/article'

const defaultForm = {
  title: '', // 文章题目
  author:'',//作者
  content: '', // 文章内容
  displayTime: '', // 发表时间
  activityTime:'',//活动时间
  articleId: undefined,
  language: 'Chinese',
}



export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky, Warning, CommentDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
      formdata: new FormData(),
      postForm: Object.assign({}, defaultForm),
      loading: false,
      part:'',
      rules: {
        title: [{ validator: validateRequire, trigger: 'blur' }],
        author: [{ validator: validateRequire ,trigger: 'blur'}],
        displayTime: [{ validator: validateRequire ,trigger: 'blur'}],
        activityTime: [{ validator: validateRequire ,trigger: 'blur'}],
        content: [{ validator: validateRequire }],
        filePic: [{ validator: validateRequire , required:true}],
      },
    }
  },
  computed: {
  },
  created() {
    if(!this.isEdit) {
      this.postForm.articleId = +new Date()
      this.part = this.$route.meta.path.part
    } else {
      this.postForm.articleId = +this.$route.params.id
      this.getArticle()
    }
  },
  mounted() {

  },
  methods: {
   getArticle () {
       fetchActivityArticle(this.postForm.articleId).then((result) => {
        this.postForm.content = result.data.content
         this.$refs.editor.setContent(result.data.content)
          this.postForm.articleId = +result.data.articleId
          this.postForm.title = result.data.title
          this.postForm.author = result.data.author
          this.postForm.displayTime = result.data.displayTime
          this.postForm.activityTime = [result.data.activityStartTime,result.data.activityEndTime]
          this.postForm.language = result.data.language
      }).catch((err) => {
        console.log(err);
        this.$message.error('网络错误，请稍后刷新')
      });
  },

    resetForm(formName) {
      this.$refs[formName].resetFields(); //清空表单
      this.$refs.uploadPic.uploadFiles = [] //清空上传海报
      this.$refs.uploadForm.uploadFiles = [] //清空上传文件
      this.$refs.editor.setContent('') //清空富文本
      this.postForm.articleId = +new Date() //重新生成文章id
      this.formdata = new FormData() //初始化formdata
    },
    upLoad(){
      let uploadPic = null
      let uploadForm = null
      if(this.$refs.uploadPic.uploadFiles.length !== 0) {
        uploadPic = this.$refs.uploadPic.uploadFiles[0].raw
      } else {
        this.$message.error('请上传图片')
        this.loading = false
        return
      }
      if(this.$refs.uploadForm.uploadFiles[0]) {
        uploadForm = this.$refs.uploadForm.uploadFiles[0].raw
      }
      const form = this.postForm
      for (const key in form) {
        this.formdata.append(key,form[key])
      }
      if(!this.beforeUpload(uploadPic)) { //因为海报必须上传，这里不做有没有的判断 ，只对格式大小进行判断，不通过判断会返回false，这里就会进入return结束函数执行
        return
      } else { //通过的话可以将他设置进formdata参数里面
        this.formdata.append('poster',uploadPic)
      }
      if(uploadForm) {
        this.formdata.append('entryForm',uploadForm)
      }
      //开始发请求
      if(!this.isEdit) { //新上传页面下
      this.formdata.append('part',this.part)
        upLoadActivityArticle(this.formdata).then((result) => {
          if(result.data.result == 1) {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
          this.resetForm('postForm')
          } else {
            this.$notify({
              title: '错误',
              message: '网络错误,请稍后重试',
              type: 'error',
              duration: 2000
            })
            this.loading = false
            this.formdata = new FormData()
          }
        }).catch((err) => {
          this.$notify({
              title: '错误',
              message: '网络错误，请稍后重试',
              type: 'error',
              duration: 2000
            })
            this.loading = false
            this.formdata = new FormData()
        });
      } else { //修改页面下
        editActivityArticle(this.formdata).then((result) => {
          if(result.data.result == 1) {
            this.$notify({
              title: '成功',
              message: '修改文章成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
            this.$router.go(-1)
          } else {
            this.$notify({
              title: '错误',
              message: '网络错误,请稍后重试',
              type: 'error',
              duration: 2000
            })
            this.loading = false
          }
        }).catch((err) => {
          this.$notify({
            title: '错误',
            message: '网络错误,请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.loading = false
        });
      }

    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
            this.upLoad()
        } else {
          return false
        }
      })
    },
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJpgOrPng) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!');
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
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
