<template>
    <div class="header-search">
      <el-input v-model="search" @keyup.enter.native="querySearch" placeholder="搜索问题或关键字">
        <!-- <i class="el-icon-search" slot="suffix" @click="querySearch"></i> -->
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
      transfer.$emit('globalSearch', this.search)
    }
  }
}
</script>
<style lang="scss" scoped>
  .header-search {
    font-size: 0 !important;
    .search-icon {
      cursor: pointer;
      font-size: 18px;
      color: #fff;
      vertical-align: middle;
    }
  }
  /deep/ .el-input__inner {
    width: 100%;
    height: 38px;
    padding: .375rem .75rem;
    line-height: 1.42858;
    background-color: #fff;
    border-radius: 4px;
  }
  /deep/ .el-input__inner:focus {
    border:1px solid #a9e2cd;
  }
  .el-icon-search {
    padding-right: 8px;
  }
</style>
