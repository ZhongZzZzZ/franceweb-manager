<<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
      v-loading="listLoading"
    >
      <el-table-column
      align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="emailAccount"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="意见标题"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="手机号"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"  
        prop="description"
        label="意见内容"
        width="700"
      >
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;margin-left:20px;">
      <el-button @click="toggleSelection(tableData.concat(multipleSelection))">全选</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button type="danger" @click="deleteSeleted()">删除已选</el-button>
    </div>
    <pagination style="text-align:center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getadvice"/>
  </div>
</template>

<script>
  import { getAdvice, deleteAdvice } from '@/api/advice'
  import Pagination from '@/components/Pagination'
  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        idList: [],
        total: 50,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        }
      }
    },
    components: { Pagination },
    methods: {
      handleDelete(index, val) {
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          let idList = '?'
          idList += 'idList=' + val.id
          deleteAdvice(idList).then(response => {
            this.tableData.splice(index, 1)
          }).catch((err) => {
            console.log(err)
            this.$message.error('网络请求出错')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          })
        })
      },
      deleteSeleted() { // 批量删除
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.idList.push(this.multipleSelection[i].id)
        }
        let idList = '?'
        for (let i = 0; i < this.idList.length; i++) {
          idList += 'idList=' + this.idList[i] + '&'
        }
        idList = idList.slice(0, idList.lastIndexOf('&'))
        const arrID = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          arrID.push(this.multipleSelection[i].id)
        }
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            deleteAdvice(idList).then(response => {
                this.getadvice()
            }).catch((err) => {
              console.log(err)
              this.$message.error('网络请求出错')
            })
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          })
        })
      },
      getadvice() {
        this.listLoading = true
        getAdvice(this.listQuery).then(response => {
          this.tableData = response.data.list
          this.total = response.data.total
          this.listLoading = false
        }).catch((err) => {
            this.$message.error('网络请求出错')
            console.log(err)
          }
        )
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
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    },
    created() {
      this.getadvice()
    }
  }
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>
