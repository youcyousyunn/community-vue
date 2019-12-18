<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <!-- <el-row class="subject">
          <svg-icon icon-class="mulu"/>
          提问
        </el-row> -->
        <el-row class="content">
          <el-row>
            <el-input v-model="title" placeholder="标题: 请简要描述下问题"></el-input>
          </el-row>
          <el-row class="tinymce">
            <tinymce v-model="description"></tinymce>
          </el-row>
          <el-row>
            <el-input v-model="tag" @click.native="tagShow = true" placeholder="标签，如：Vue（用逗号,分隔）"></el-input>
          </el-row>
          <el-row v-if="tagShow">
            <ul class="tabs">
              <li v-for="(item, index) in tabList" v-bind:key="index"
                  v-bind:class="{tab_checked: index === activeTabIndex}"
                  v-on:click="changeTabIndex(index)">
                <a @click="switchTab">{{item}}</a>
              </li>
            </ul>
          </el-row>
          <el-row v-if="tagShow">
            <ul class="tags">
              <li v-for="(item, index) in tagList" v-bind:key="index"
                  v-bind:class="{tag_checked: index === activeTagIndex}"
                  v-on:click="changeTagIndex(index)">
                <a @click="switchTag(item)">
                  <svg-icon icon-class="discover" /> {{item}}
                </a>
              </li>
            </ul>
          </el-row>
          <el-row class="publish">
            <el-button @click="publish">发布问题</el-button>
          </el-row>
        </el-row>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :span="6">
        <el-row class="side-bar">
          <!-- <a target="_blank">&nbsp;CodePorter社区资源搜索！</a> -->
          <img :src="canvassImg" alt="canvass"/>
          <el-row class="aw-mod">
            <div class="mod-head">
              <a class="pull-more">更多 &gt;</a>
              <h3>热门话题</h3>
            </div>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import {pubQuestion} from '@/api/question.js'
export default {
  components: {
    Tinymce
  },
  data () {
    return {
      title: '',
      description: '',
      tag: '',
      tabList: ['开发语言', '平台框架', '服务器', '数据库和缓存', '开发工具', '系统设备', '其他'],
      activeTabIndex: 0,
      tagList: ['javascript', 'java', 'node.js', 'Vue', 'php', 'html5', 'python', 'c++', 'c', 'c#', 'swift', 'bash', 'shell', 'asp.net', 'erlang', 'perl', '其他'],
      activeTagIndex: -1,
      tagShow: false,
      canvassImg: require('@/images/canvass.png')
    }
  },
  methods: {
    changeTabIndex (index) {
      this.activeTabIndex = index
    },
    // 切换标签tab
    switchTab () {

    },
    changeTagIndex (index) {
      this.activeTagIndex = index
    },
    // 切换标签
    switchTag (tag) {
      if (this.tag && this.tag.length > 0) {
        if (this.tag.indexOf(tag) === -1) {
          this.tag = this.tag + ',' + tag
        }
      } else {
        this.tag = tag
      }
    },
    // 发布问题
    publish () {
      pubQuestion({title: this.title, description: this.description, tag: this.tag}).then(res => {
        this.$message({
          message: '提问成功',
          type: 'success'
        })
        this.$router.push({path: '/'})
      })
    },
    // 初始化列表
    initTableListData () {
    }
  },
  created () {
    // this.initTableListData()
  }
}
</script>
<style lang="scss" scoped>
.subject {
  z-index: 1;
  min-height: 63px;
  padding: 25px 20px 0;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  font-size: 20px;
}
.content {
  height: auto;
  background-color: white;
  padding: 10px 10px;
}
.tinymce {
  margin: 10px 0
}

.side-bar {
  // border-left: 1px solid #e6e6e6;
  height: auto;
  background-color: white;
  padding-top: 10px;
  padding-right: 15px;
  padding-left: 15px;
  a {
    cursor: pointer;
    color: #155faa;
  }
  img {
    width:255px;
    height:136px
  }
}
.aw-mod {
  text-align: justify;
  .mod-head {
    padding-bottom: 5px;
    .pull-more {
      float: right;
    }
    h3 {
      margin-bottom: 0;
    }
  }
}

.tabs {
  padding-top: 10px;
}
.tabs > li {
    float: left;
    position: relative;
    height: 30px;
    line-height: 30px;
    margin-right: 5px;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
}
ul, li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tabs > li > a {
  display: block;
  padding: 0 10px;
}
.tabs > li:hover > a {
  border-radius: 5px;
  background: #009A61;
  color: #fff;
}
.tab_checked {
  background: #009A61;
  color: #fff;
}

// 标签样式
.tags {
  padding: 10px 0;
}
.tags > li {
    float: left;
    position: relative;
    height: 22px;
    line-height: 22px;
    margin-right: 5px;
    font-size: 13px;
    font-weight: normal;
    text-align: center;
    cursor: pointer;
    margin-bottom: 5px !important;
}
.tags > li > a {
  padding: 0 11px;
  border-radius: 11px;
  display: block;
  background-color: rgba(1,126,102,0.08)
}
.tags > li:hover > a {
  border-radius: 11px;
  background: #017E66;
  color: #fff;
}
.tag_checked {
  border-radius: 11px;
  background: #017E66;
  color: #fff;
}
.publish {
  margin: 20px 0
}
.publish button {
  float: right;
  border-radius: 5px;
  background: #017E66;
  color: #fff;
}
.mce-panel {
  border: 0 solid #f3f3f3;
}
</style>
