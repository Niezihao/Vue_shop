<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template v-slot:control="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handledelete(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addCateformRef"
        :model="addCateform"
        label-width="100px"
        :rules="addCateformRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: 'true',
            }"
            @change="parentCateChanged"
            clearable
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editCateformRef"
        :model="editCateform"
        label-width="100px"
        :rules="editCateformRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateform.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品列表
      cateList: [],
      total: 0,
      columns: [
        { label: '名称分类', prop: 'cat_name' },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'control',
        },
      ],
      parentCateList: [],
      selectedKeys: [],
      addDialogVisible: false,
      addCateform: {
        cat_name: '',
        cat_pid: 0,
        //默认添加一级
        cat_level: 0,
      },
      addCateformRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      editDialogVisible: false,
      editCateform: {},
      editCateformRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      console.log(res.data)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //监听 pagesize 变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听 pagenum 变化
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList()
    },

    //添加
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    //添加分类选项变化
    parentCateChanged() {
      console.log(this.selectedKeys)
      //如果 selectedkeys 数组大于0 选择 否则没有选择
      if (this.selectedKeys.length > 0) {
        this.addCateform.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateform.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateform.cat_pid = 0
        this.addCateform.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateformRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateform
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    addDialogClosed() {
      this.$refs.addCateformRef.resetFields()
      this.selectedKeys = []
      this.addCateform.cat_level = 0
      this.addCateform.cat_pid = 0
    },
    //编辑
    async handleEdit(row) {
      console.log(row)
      const { data: res } = await this.$http.get(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取编辑分类失败！')
      }
      this.editCateform = res.data
      this.editDialogVisible = true
    },
    editCate() {
      this.$refs.editCateformRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateform.cat_id}`,
          { cat_name: this.editCateform.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.$message.success('更新成功！')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    editDialogClosed() {
      this.$refs.editCateformRef.resetFields()
    },
    async handledelete(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getCateList()
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>