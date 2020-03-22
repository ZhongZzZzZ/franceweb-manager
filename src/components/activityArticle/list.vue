<template>
  <div class="app-container">

    <div class="language">
      <span>选择语言：</span>
      <el-select v-model="listQuery.language" @change="changeLanguage" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;margin:20px 0"
    @selection-change="handleSelectionChange"
    class="list"
    ref="multipleTable"
    >

      <el-table-column
        type="selection"
        width="30"
      >
      </el-table-column>

      <el-table-column align="center" label="ID" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.articleId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="发表时间">
        <template slot-scope="scope">
          <span>{{ scope.row.displayTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="活动时间">
        <template slot-scope="scope">
          <span>{{ scope.row.activityStartTime }} --- {{scope.row.activityEndTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>



      <el-table-column width="200px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="Actions" width="180">
        <template slot-scope="scope">
          <router-link :to="`${url}${scope.row.articleId}`">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
            <el-button type="danger" size="small" icon="el-icon-edit" @click="deleteSelectArticle(scope.row)">
              删除
            </el-button>
        </template>
      </el-table-column>
    </el-table>
      <el-button @click="toggleSelection(list.concat(selectedList))">全选</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button type="danger" @click="deleteSelectArticle(false)" >删除选中文章</el-button>
    <pagination style="text-align:center" v-show="total>0" :total="total" :page.sync="listQuery.page"  @pagination="getList" />
  </div>
</template>

<script>

import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import {fetchArticleList,deleteActivityArticle} from '@/api/article'
export default {
  name: 'ArticleList',
  components: { Pagination },
  data() {
    return {
      list: [],
      url:'',//存放当前路径，控制编辑路由跳转
      total: 1,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        part:'',
        language:'all'
      },
      selectedList:[], //被选中的数组
      options: [{
          value: 'all',
          label: '全部'
        }, {
          value: 'Chinese',
          label: '中文'
        }, {
          value: 'French',
          label: '法文'
        }],
    }
  },
  created() {
    this.url = this.$route.meta.path.url
    this.listQuery.part = this.$route.meta.path.part
    this.getList()
  },
  methods: {
    changeLanguage() {//过滤
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchArticleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        console.log(error);
        this.$message.error('网络错误')
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.selectedList = val  //选中的人员加入被选中数组
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
    deleteSelectArticle (row) {
      let arrayId = []
      let articleId = ''
      if(this.selectedList.length === 0) {
        this.$message.error('未勾选人员')
        return false 
      }
      if(row) {
        //单个删除
        if(this.selectedList.some(item => item.articleId == row.articleId)) { //判断当前被选中数组中有没有你点击删除的id

          articleId = `?articleId=${row.articleId}`
        } else{
          this.$message.error('未勾选人员') //没有代表没有被勾选不能删除
          return false
        }
      } else { //这里是点击批量删除按钮进入的判断
        articleId = '?'
        this.selectedList.forEach(item => {
          articleId += `articleId=${item.articleId}&`
      });
          articleId = articleId.slice(0,articleId.lastIndexOf('&'))
          
      }
      this.$confirm('确认删除？').then((result) => {
        deleteActivityArticle(articleId).then((result) => {
            this.$message.success('删除成功')
            this.getList()
          }).catch((err) => {
            console.log(err);
            this.$message('删除失败')
          });
      }).catch((err) => {
      });
      
    }
  }
}
</script>

<style scoped>

.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
