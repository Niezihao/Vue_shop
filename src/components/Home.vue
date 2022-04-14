<template>
  <div>
    <el-button type="primary" @click="back">返回</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
  },
}
</script>

<style lang="less" scoped></style>
