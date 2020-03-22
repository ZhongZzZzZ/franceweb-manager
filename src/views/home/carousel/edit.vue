<template>
  <div class="uploadContainer">
    <el-upload
      action="http://www.acef-fr.com/acef/img/ussoai"
      ref="upload"
      list-type="picture-card"
      name="slideshows"
      :file-list="fileList"
      :auto-upload="false"
      :data="{ part :'carselImg' }"
      :limit="11"
      :before-remove="handleBeforeRemove"
      :on-change="handleChange"
      :on-preview="handlePictureCardPreview"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :on-success="handleSuccess"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-button size="large" type="primary" @click="Submit" style="margin: 25px 0 25px 0">点击上传</el-button>
    <div slot="tip" class="el-upload__tip" style="color: red;font-size: 25px">*最少上传7张图片，最多上传11张图片</div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { getCarsousel, deleteCarsousel } from '@/api/carsousel'
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        count: [],
        fileList: [],
        part: null
      }
    },
    methods: {
      getAllCarsousel() {
        getCarsousel().then(response => {
          this.fileList = response.data //  将得到的图片放进数组展示
        })
      },
      Submit() {
        if (this.count.length < 7 && this.fileList.length < 7) {
          this.$message({
            message: '当前图片数量小于七张',
            type: 'error'
          })
          return false
        } else { //  上传图片
          this.$refs.upload.submit()
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        }
      },
      handleBeforeRemove(file, fileList) {
        if (fileList.length > 7) {
          let id = '?' //  拼接参数
          id += 'id=' + file.id + '&url=' +file.url
          deleteCarsousel(id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        } else {
          this.$message({
            message: '删除失败，当前图片小于6张，请先上传在删除',
            type: 'error'
          })
          return false
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleChange(file, fileList) {
        this.count = fileList //  用来判断图片数量
        this.fileList = fileList
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制最多上传 11 个文件，现已有 ${fileList.length} 个文件`)
      },
      handleError() {
        this.$message({
          message: '上传失败，网络请求错误',
          type: 'error'
        })
      },
      handleSuccess() {
        this.getAllCarsousel()
      }
    },
    created() {
      this.getAllCarsousel()
    }
  }
</script>

<style scoped>

</style>
