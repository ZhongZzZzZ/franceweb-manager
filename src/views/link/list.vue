<template>
   <div class="app-container">

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

      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="链接">
        <template slot-scope="scope">
          <a class="link" target="_blank" :href="scope.row.link">{{scope.row.link}}</a>
        </template>
      </el-table-column>



      <el-table-column width="200px" align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgPath" style="width:200px;height:100px" />
        </template>
      </el-table-column>



      <el-table-column align="center" label="Actions" width="180">
        <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-edit" @click="deleteSelectLink(scope.row)">
              删除
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="toggleSelection(list.concat(selectedList))">全选</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
     <el-button type="danger" @click="deleteSelectLink(false)" >删除选中连接</el-button>
  </div>
</template>

<script>
import {fetchLinkList,deleteLinkList} from '@/api/link'
export default {
  name: 'ArticleList',
  components: {  },
  data() {
    return {
      list: [],
      total: 1,
      listLoading: false,
      selectedList:[], //被选中的数组
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      fetchLinkList().then((result) => {
      this.list = result.data
    }).catch((err) => {
      this.$message.error('网络错误')
      console.log(err);
    });
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
    deleteSelectLink (row) {
      let arrayId = []
      let id = ''
      if(this.selectedList.length === 0) {
        this.$message.error('未勾选链接')
        return false 
      }
      if(row) {
        //单个删除
        if(this.selectedList.some(item => item.id == row.id)) { //判断当前被选中数组中有没有你点击删除的id
          id = `?id=${row.id}`
        } else{
          this.$message.error('未勾选链接') //没有代表没有被勾选不能删除
          return false
        }
      } else { //这里是点击批量删除按钮进入的判断
        id = '?'
        this.selectedList.forEach(item => {
          id += `id=${item.id}&`
      });
          id = id.slice(0,id.lastIndexOf('&'))
          
      }
      this.$confirm('确认删除？').then((result) => {
        deleteLinkList(id).then((result) => {
            this.$message.success('删除成功')
            this.getList()
          }).catch((err) => {
            console.log(err);
            this.$message.error('删除失败')
          });
      }).catch((err) => {
      });
      
    }
  }
}
</script>

<style scoped>
.link:hover{
  color: blue
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
