<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :className="'sub-navbar '+postForm.status">
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
                <el-col :span="8">
                  <el-form-item style="margin-bottom: 40px;" prop="author" label-width="70px" label="作者：">
                    <el-input v-model="postForm.author" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入作者" />
                  </el-form-item>
                </el-col> 

                <el-col :span="10">
                  <el-form-item label-width="120px" prop="displayTime" label="发表时间：" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.displayTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="发表时间" />
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce :articleId="postForm.articleId" ref="editor" v-model="postForm.content" :height="400"/>
        </el-form-item>


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
import {fetchNormalArticle,upLoadNormalArticle,editNormalArticle} from '@/api/article'


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
      postForm: {
        title: '', // 文章题目
        author:'',//作者
        content: '', // 文章内容
        displayTime: '', // 发表时间
        articleId: undefined,
        language: 'Chinese',
      },
      loading: false,
      part:'',
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        displayTime: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
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
  resetForm(formName) { 
      this.$refs[formName].resetFields(); //清空表单
      this.$refs.editor.setContent('') //清空富文本
      this.postForm.articleId = +new Date() //重新生成文章id
    },
  methods: {
    getArticle () {
       fetchNormalArticle(this.postForm.articleId).then((result) => {
         for (const key in result.data) {
           if ( key === 'content') {
             this.$refs.editor.setContent(result.data.content) 
           } else if (key === 'articleId') {
             this.postForm.articleId = +result.data.articleId
             continue
           }
           this.postForm[key] = result.data[key]
         }
      }).catch((err) => {
        console.log(err);
        this.$message.error('网络错误，请稍后刷新')
      });
  },

    resetForm(formName) { 
      this.$refs[formName].resetFields(); //清空表单
      this.$refs.editor.setContent('') //清空富文本
      this.postForm.articleId = +new Date() //重新生成文章id
    },
    upLoad(){
      //开始发请求
      if(!this.isEdit) { //新上传页面下
      this.$set(this.postForm,'part',this.part)
      console.log(this.postForm);
        upLoadNormalArticle(this.postForm).then((result) => {
          if(result.data.result == 1) {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
          this.resetForm('postForm')
          } else {
            this.$notify({
              title: '错误',
              message: '网络错误,请稍后重试',
              type: 'error',
              duration: 2000
            })
          }
          this.loading = false
        }).catch((err) => {
          this.$notify({
              title: '错误',
              message: '网络错误，请稍后重试',
              type: 'error',
              duration: 2000
            })
            this.loading = false
        });
      } else { //修改页面下
        editNormalArticle(this.postForm).then((result) => {
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
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

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
