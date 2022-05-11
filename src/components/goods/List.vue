<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="params.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodList" border stripe>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          min-width="500px"
        ></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template v-slot="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handledelete(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>

      <!-- 编辑 -->
      <el-dialog
        title="商品列表编辑"
        :visible.sync="editdialogVisible"
        width="50%"
        @close="editdialogclosed"
      >
        <!-- 添加参数 -->
        <el-form
          ref="editFormRef"
          :model="editForm"
          label-width="100px"
          :rules="editFormRules"
        >
          <el-form-item label="商品名称" prop="goods_name"
            ><el-input v-model="editForm.goods_name"></el-input
          ></el-form-item>
          <el-form-item label="商品价格" prop="goods_price"
            ><el-input v-model="editForm.goods_price"></el-input
          ></el-form-item>
          <el-form-item label="商品数量" prop="goods_number"
            ><el-input v-model="editForm.goods_number"></el-input
          ></el-form-item>
          <el-form-item label="商品重量" prop="goods_weight"
            ><el-input v-model="editForm.goods_weight"></el-input
          ></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      params: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },

      total: null,
      goodList: [],
      editdialogVisible: false,
      editForm: {
        goods_name: '',
        goods_price: null,
        goods_number: null,
        goods_weight: null,
      },
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //pageSize 改变时会触发
    handleSizeChange(newSize) {
      this.params.pagesize = newSize
      this.getGoodsList()
    },
    //currentPage 改变时会触发
    handleCurrentChange(newNum) {
      this.params.pagenum = newNum
      this.getGoodsList()
    },
    //获得数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.params,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('数据请求失败！')
      }
      console.log(res.data)
      this.goodList = res.data.goods
      // this.params.pagenum = parseInt(res.data.pagenum)
      this.total = res.data.total
    },
    editdialogclosed() {
      this.$refs.editFormRef.resetFields()
    },
    async handleEdit(row) {
      this.editdialogVisible = true
      // console.log(row)
      const { data: res } = await this.$http.get(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取该行数据失败！')
      }
      this.editForm = res.data
      console.log(res.data)
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `goods/${this.editForm.goods_id}`,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败！')
        }
        this.$message.success('编辑成功！')
        this.getGoodsList()
      })
      this.editdialogVisible = false
    },

    //是删除
    async handledelete(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除！')
      }

      const { data: res } = await this.$http.delete(`goods/${row}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
  },
}
</script>

<style lang="less" scoped>
</style>