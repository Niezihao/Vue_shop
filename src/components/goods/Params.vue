<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="true"
      >
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtnDisable"
            type="primary"
            @click="adddialogVisible = true"
            size="mini"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
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
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtnDisable"
            @click="adddialogVisible = true"
            type="primary"
            size="mini"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
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
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/添加属性  对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="adddialogclosed"
    >
      <!-- 添加参数 -->
      <el-form
        ref="addFormRef"
        :model="addform"
        label-width="100px"
        :rules="addformRules"
      >
        <el-form-item :label="titleText + ':'" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editdialogclosed"
    >
      <!-- 添加参数 -->
      <el-form
        ref="editFormRef"
        :model="editform"
        label-width="100px"
        :rules="editformRules"
      >
        <el-form-item :label="titleText + ':'" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      manyTableData: [],
      onlyTableData: [],
      //被激活的tab
      activeName: 'many',
      adddialogVisible: false,
      editdialogVisible: false,
      //控制tag按钮

      addform: {
        attr_name: '',
      },
      editform: {},
      addformRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      editformRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getParamsList()
  },
  computed: {
    isBtnDisable() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级分类id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态属性'
      }
      return '静态属性'
    },
  },

  methods: {
    async getParamsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      console.log(res.data)
      this.cateList = res.data
      console.log(this.cateList)
    },

    //级联选择器改变
    handleChange() {
      this.getParamData()
    },

    //tab点击
    handleTabClick() {
      this.getParamData()
      console.log(this.activeName)
    },

    //单独定义获取数据
    async getParamData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }

      console.log(this.selectedKeys)

      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      console.log(res.data)

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    adddialogclosed() {
      this.$refs.addFormRef.resetFields()
    },
    editdialogclosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addform.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.adddialogVisible = false
        this.getParamData()
      })
    },
    // 编辑
    async showEditDialog(row) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }
      this.$message.success('获取成功！')
      this.editform = res.data
      this.editdialogVisible = true
    },
    editParams() {
      console.log(this.editform.attr_sel)
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editform.attr_id}`,
          {
            attr_name: this.editform.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败！')
        }
        this.$message.success('编辑成功！')
        this.getParamData()
      })
      this.editdialogVisible = false
    },
    async handledelete(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
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

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getParamData()
    },
    // 文本框失去焦点
    async handleInputConfirm(row) {
      //空格 不合法去除
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        }
      )
      if (res.meta.status !== 200) {
        return thjis.$message.error('添加失败！')
      }
      this.$message.success('添加成功！')
    },
    showInput(row) {
      row.inputVisible = true

      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
        // console.log(this.$refs)
      })
    },
    //删除对应参数
    async handleClose(i, row) {
      console.log(i)
      row.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        }
      )
      if (res.meta.status !== 200) {
        return thjis.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
    },
    // async saveAttrVal() {
    //   const { data: res } = await this.$http.put(
    //     `categories/${this.cateId}/attributes/${row.attr_id}`,
    //     {
    //       attr_name: row.attr_name,
    //       attr_sel: row.attr_sel,
    //       attr_vals: row.attr_vals.join(','),
    //     }
    //   )
    //   if (res.meta.status !== 200) {
    //     return thjis.$message.error('添加失败！')
    //   }
    //   this.$message.success('添加成功！')
    // },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 16px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
.el-button {
  margin: 10px;
}
</style>