<template>
    <div class="header-search">
      <el-input v-model="search" @keyup.native="querySearch" placeholder="搜索问题或关键字">
        <i class="el-icon-search" slot="suffix" @click="querySearch"></i>
      </el-input>
    </div>
</template>
<script>
import transfer from '@/utils/transfer.js'
export default {
  name: 'HeaderSearch',
  data () {
    return {
      search: ''
    }
  },
  methods: {
    querySearch () {
      debugger
      transfer.$emit('globalSearch', this.search)
    }
  }
}
</script>
<style lang="scss" scoped>
  .header-search {
    margin-right: 90px;
    font-size: 0 !important;
    .search-icon {
      cursor: pointer;
      font-size: 18px;
      color: #fff;
      vertical-align: middle;
    }
  }
  .el-input__inner {
    width: 265px;
    height: 32px;
    line-height: 1.42858;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .el-icon-search {
    padding-right: 8px;
  }
</style>
