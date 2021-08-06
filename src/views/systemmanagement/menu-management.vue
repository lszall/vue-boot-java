<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        新增
      </el-button>
      <el-button v-waves class="search-btn" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-input v-model="listQuery.menuName" placeholder="菜单名称" clearable class="search-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.menuCode" placeholder="菜单编码" clearable class="search-input" @keyup.enter.native="handleFilter" />
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" size="mini">
      <el-table-column align="center" label="序号" width="80" type="index" />
      <el-table-column width="120px" align="center" label="菜单编码">
        <template slot-scope="{row}">
          <span>{{ row.menuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="菜单名称">
        <template slot-scope="{row}">
          <span>{{ row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="父级菜单">
        <template slot-scope="{row}">
          <span>{{ row.parentMenu }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="菜单级别">
        <template slot-scope="{row}">

          <span>{{ row.menuLevel |dictMenuLevel }} </span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="菜单路径">
        <template slot-scope="{row}">
          <span>{{ row.menuUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="菜单描述" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.menuDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="显示/隐藏">
        <template slot-scope="{row}">
          <span>{{ row.showFlag==='Y'?'显示':'隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.menuLevel<5" type="primary" size="mini" @click="handleCreateChild(row)">
            新增子菜单
          </el-button>
          <el-button v-if="row.menuLevel>0" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.menuLevel>0" size="mini" :type="row.showFlag==='Y'?'info':'success'" @click="handleModifyStatus(row)">
            {{ row.showFlag==='N'?'显示':'隐藏' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单级别" prop="menuLevel">
          <el-select v-model="temp.menuLevel" class="filter-item" placeholder="请选择。。" style="width:100%" @change="getParentMenus(temp.menuLevel-1)">
            <el-option v-for="item in menuLevels" :key="item.code" :label="item.title" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentMenu">
          <el-select v-model="temp.parentMenu" class="filter-item" placeholder="请选择。。" style="width:100%">
            <el-option v-for="item in parentMenus" :key="item.menuCode" :label="item.menuName" :value="item.menuCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单代码" prop="menuCode">
          <el-input v-model="temp.menuCode" type="datetime" placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName" placeholder="请输入。。" clearable />
        </el-form-item>
        <el-form-item label="显示/隐藏">
          <el-select v-model="temp.showFlag" class="filter-item" placeholder="请选择。。" style="width:100%">
            <el-option v-for="item in statusOptions" :key="item.code" :label="item.title" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单顺序" prop="menuOrder">
          <el-input v-model="temp.menuOrder" placeholder="请输入。。" type="nubmer" style="width:100%" clearable />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="temp.menuUrl" clearable placeholder="请输入。。" style="width:100%" />
        </el-form-item>
        <el-form-item label="菜单描述">
          <el-input v-model="temp.menuDesc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" clearable placeholder="请输入。。" style="width:100%" />
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

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { pageMenuList, updateMenu, insertMenu, menuListByLevel } from '@/api/systemmanagement'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
const menuLevels = [
  { code: 1, title: '一级菜单' },
  { code: 2, title: '二级菜单' },
  { code: 3, title: '三级菜单' },
  { code: 4, title: '四级菜单' },
  { code: 5, title: '五级菜单' }
]
export default {
  name: 'MenuMagagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    dictMenuLevel(level) {
      let title = '根菜单'
      menuLevels.forEach(item => {
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
        menuCode: '',
        menuName: '',
        pageNum: 1,
        pageSize: 10
      },
      parentMenus: [],
      menuLevels: menuLevels,
      statusOptions: [
        { code: 'Y', title: '显示' },
        { code: 'N', title: '隐藏' }
      ],
      temp: {
        menuCode: '',
        menuName: '',
        menuLevel: 1,
        parentMenu: '',
        menuUrl: '',
        menuDesc: '',
        showFlag: 'Y'
      },
      rules: {
        parentMenu: [{ required: true, message: '请选择父级菜单（一级菜单选择根菜单）', trigger: 'change' }],
        menuCode: [{ required: true, message: '请选择菜单级别', trigger: 'change' }],
        menuLevel: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        menuOrder: [{ required: true, message: '请输入菜单序号（排序使用 序号越小越靠前）', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },

      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await pageMenuList(this.listQuery)
      const items = data.list
      this.total = data.total
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },

    getParentMenus(level) {
      const data = { menuLevel: level }
      menuListByLevel(data).then((res) => {
        this.parentMenus = res.data
      })
    },
    handleModifyStatus(row) {
      if (row.showFlag === 'Y') {
        row.showFlag = 'N'
      } else {
        row.showFlag = 'Y'
      }
      const tempData = Object.assign({}, row)
      updateMenu(tempData).then(() => {
        const index = this.list.findIndex(v => v.id === this.temp.id)
        this.list.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.getParentMenus(this.temp.menuLevel - 1)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.getParentMenus(this.temp.menuLevel - 1)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild(row) {
      this.resetTemp()
      this.getParentMenus(row.menuLevel)
      this.temp.parentMenu = row.menuCode
      this.temp.menuLevel = row.menuLevel + 1
      this.temp.menuCode = row.menuCode
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMenu(tempData).then((res) => {
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
          insertMenu(this.temp).then((res) => {
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
        menuCode: '',
        menuName: '',
        menuLevel: 1,
        parentMenu: '',
        menuUrl: '',
        menuDesc: '',
        showFlag: 'Y'
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
</style>
