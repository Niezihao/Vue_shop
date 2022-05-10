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
    handleEdit(row) {},
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