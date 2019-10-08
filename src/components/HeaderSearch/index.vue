<template>
    <div class="header-search">
        <el-select
          ref="headerSearchSelect"
          v-model="search"
          :remote-method="querySearch"
          filterable
          default-first-option
          remote
          placeholder="搜索问题"
          @change="change"
        >
          <el-option v-for="(item, index) in options" :key="index" :value="item" :label="item.title.join('>')"></el-option>
        </el-select>
    </div>
</template>
<script>
export default {
  name: 'HeaderSearch',
  data () {
    return {
      search: '',
      options: []
    }
  },
  methods: {
    change (val) {
      this.search = ''
      this.options = []
    },
    querySearch (query) {
      // if (query !== '') {
      //   this.options = this.fuse.search(query)
      // } else {
      //   this.options = []
      // }
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
.el-input__inner {
    width: 230px;
    height: 32px;
    padding-right: 30px;
    border: none;
}
</style>
