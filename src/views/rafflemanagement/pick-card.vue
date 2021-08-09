<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        新增
      </el-button>
      <el-button v-waves class="search-btn" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-input v-model="listQuery.name" placeholder="名称" clearable class="search-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.lotNo" placeholder="批次编码" clearable class="search-input" @keyup.enter.native="handleFilter" />
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" size="mini">
      <el-table-column align="center" label="序号" width="80" type="index" />
      <el-table-column width="120px" align="center" label="批次编码">
        <template slot-scope="{row}">
          <span>{{ row.lotNo }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="总数">
        <template slot-scope="{row}">
          <span>{{ row.totalNum }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="封面">
        <template slot-scope="{row}">

          <span>{{ row.coverUrl }} </span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="状态">
        <template slot-scope="{row}">
          <span>{{ row.status | dictStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="未中奖提示语" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.noPrizesMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleDetail(row)">
            明细
          </el-button>
          <el-button v-if="row.status>0" type="warning" size="mini" @click="handleModifyStatus(row)">
            重置
          </el-button>
          <el-button v-if="row.status===0" type="success" size="mini" @click="handleModifyStatus(row)">
            发布
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button v-if="row.status>0" type="warning" size="mini" @click="handleDraw(row)">
            去抽奖
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="批次号" prop="lotNo">
          <el-input v-model="temp.lotNo" type="text" placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" type="text" placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item label="牌子总数" prop="totalNum">
          <el-input v-model="temp.totalNum" type="number" placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item prop="coverUrl">
          <el-input v-model="temp.coverUrl" type="hidden" clearable />
        </el-form-item>
        <el-form-item label="封面" prop="coverUrl">
          <el-upload
            class="upload"
            :class="{ hide: hideUp }"
            :action="uploadUrl"
            :headers="uploadHeaders"
            list-type="picture-card"
            :limit="1"
            accept="image/*"
            :data="uploadData"
            :before-upload="beforeUpload"
            :handle-dialog="handleDialog"
            :on-success="handleUpSuccess"
            :on-error="handleUpError"
            :on-change="handleUpUpload"
            :on-preview="handleUpPreview"
            :on-remove="handleUpRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="未中奖提示语">
          <el-input v-model="temp.noPrizesMsg" clearable placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item label="类型" class="hidden-input">
          <el-input v-model="temp.raffleType" clearable type="hidden" placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item label="奖品列表">
          <el-table :data="temp.awards" border fit highlight-current-row style="width: 100%" size="mini">
            <el-table-column style="width: 50%" align="center" label="奖品名称">
              <template slot-scope="{row}">
                <span>
                  <el-input v-model="row.prizesName" class="edit-input" size="small" />
                </span>
              </template>
            </el-table-column>
            <el-table-column style="width: 30%" align="center" label="总数">
              <template slot-scope="{row}">
                <span>
                  <el-input v-model="row.prizesNum" class="edit-input" type="number" size="small" />
                </span>
              </template>
            </el-table-column>
            <el-table-column style="width: 30%" align="center" label="总数">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deletePrize(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addPrize()">
            添加
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="明细" :visible.sync="dialogDetailVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%" height="250">
        <el-table-column align="center" label="序号">
          <template slot-scope="{row}">
            <span>{{ row.sortNum }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖品">
          <template slot-scope="{row}">
            <span>{{ row.prizesName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="{row}">
            <span>{{ row.pick==='Y'?'开奖':'未开奖' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageRaffleMain, insertRaffle, updateRaffle, getRaffleMainInfo, reStartRaffle, deleteRaffle, listRaffleDetail } from '@/api/rafflemanagement'

import { getHeaders, getUploadUrl } from '@/api/upload'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
const statusEnum = [
  { code: 1, title: '进行中' },
  { code: 2, title: '已结束' },
  { code: 0, title: '未开始' }
]
export default {
  name: 'PickCard',
  components: { Pagination },
  directives: { waves },
  filters: {
    dictStatus(level) {
      let title = '根菜单'
      statusEnum.forEach(item => {
        if (level === item.code) {
          title = item.title
        }
      })
      return title
    }
  },
  data() {
    return {

      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        lotNo: '',
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      pvData: [],
      temp: {
        lotNo: '',
        name: '',
        totalNum: '',
        coverUrl: '',
        noPrizesMsg: '',
        raffleType: 'A',
        awards: [{
          prizesName: '',
          prizesNum: ''
        }]
      },
      rules: {
        lotNo: [{ required: true, message: '请输入批次号）', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        totalNum: [{ required: true, message: '请输入总数', trigger: 'blur' }],
        coverUrl: [{ required: true, message: '请上传封面图', trigger: 'blur' }],
        raffleType: [{ required: true, message: '', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogDetailVisible: false,
      dialogStatus: '',
      fullscreen: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      hideUp: true,
      uploadUrl: '',
      uploadHeaders: '',
      uploadData: {
        location: 'picture'
      }
    }
  },

  created() {
    this.getList()
    this.uploadUrl = getUploadUrl()
    this.uploadHeaders = getHeaders()
  },
  methods: {
    beforeUpload(file) {
      console.log('---beforeUpload')
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleUpSuccess(response, file, fileList) {
      this.temp.coverUrl = response.data
      console.log('---handleUpSuccess')
      console.log(this.temp.coverUrl)
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    handleUpError(err, file, fileList) {
      console.log('---handleUpError')
      console.log(err)
      console.log(file)
      console.log(fileList)
    },
    handleUpUpload() {
      console.log('---handleUpUpload')
    },
    handleUpPreview(file) {
      console.log('---handleUpPreview')
      console.log(file)
      this.$refs.viewer.handleDialog(true)
    },
    handleUpRemove(file, fileList) {
      console.log('---handleUpRemove')
      console.log(file)
      console.log(fileList)
    },
    handleDialog() {

    },
    async getList() {
      this.listLoading = true
      const { data } = await pageRaffleMain(this.listQuery)
      const items = data.list
      this.total = data.total
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    addPrize() {
      this.temp.awards.push({
        prizesName: '',
        prizesNum: ''
      })
    },
    deletePrize(index) {
      this.temp.awards.splice(index, 1)
    },
    validPraize() {
      let msg = ''
      if (this.temp.awards === undefined || this.temp.awards.length <= 0) {
        msg = '请输入奖品'
        return msg
      }
      this.temp.awards.forEach(item => {
        if (item.prizesName.length === 0) {
          msg = '请输入奖品名称'
          return
        }
        if (item.prizesNum.length === 0) {
          msg = '请输入' + item.prizesName + '的数量'
          return
        }
      })
      return msg
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },

    getRaffleMainInfo(lotNo) {
      getRaffleMainInfo(lotNo).then((res) => {
        this.temp = res.data
      })
    },
    handleDraw(row) {
      this.$router.push({
        name: 'pickCardDraw',
        query: {
          lotNo: row.lotNo,
          status: 0
        }
      })
    },
    handleDetail(row) {
      const data = {
        lotNo: row.lotNo,
        status: 1
      }
      this.dialogDetailVisible = true
      listRaffleDetail(data).then((res) => {
        this.pvData = res.data
      })
    },
    handleModifyStatus(row) {
      console.log(row.status === 0)
      if (row.status === 0) {
        row.status = 1
      } else {
        row.status = 0
      }
      const tempData = Object.assign({}, row)
      reStartRaffle(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      })
    },
    handleDelete(row) {
      deleteRaffle(row.lotNo).then((res) => {
        this.dialogFormVisible = false
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    handleUpdate(row) {
      this.getRaffleMainInfo(row.lotNo)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const msg = this.validPraize()
          if (msg.length > 0) {
            this.$message({
              message: msg,
              type: 'warning'
            })
            return
          }
          const tempData = Object.assign({}, this.temp)
          updateRaffle(tempData).then((res) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$message({
              message: res.msg,
              type: 'success'
            })
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const msg = this.validPraize()
          if (msg.length > 0) {
            this.$message({
              message: msg,
              type: 'warning'
            })
            return
          }
          insertRaffle(this.temp).then((res) => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$message({
              message: res.msg,
              type: 'success'
            })
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        lotNo: '',
        name: '',
        totalNum: '',
        coverUrl: '',
        noPrizesMsg: '',
        raffleType: 'A',
        awards: [{
          prizesName: '',
          prizesNum: ''
        }]
      }
    }

  }
}
</script>

<style scoped>
.search-btn {
  float:right
}
.search-input {
  float:right;
  padding-left: 10px;
  width:200px;
}
.hidden-input{
  display: none;
}
</style>
