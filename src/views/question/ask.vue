<template>
  <div class="app-container">
    <el-row>
      <el-col :span="19">
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
            <el-input v-model="tag" v-if="inputTag" @click.native="getTabTag()" placeholder="标签，如：Vue（用逗号,分隔）"></el-input>
            <el-tag
              v-for="(item, index) in tags"
              :key="index"
              size="medium"
              type="info"
              effect="plain"
              closable
              :disable-transitions="false"
              @close="closeTag(item)"> {{item.name}}
            </el-tag>
            <el-button type="info" plain v-if="newTag" class="button-new-tag" size="small">+ 添加标签</el-button>
          </el-row>
          <el-row v-if="tagShow">
            <ul class="tabs">
              <li v-for="(item, index) in tabList" v-bind:key="index"
                  v-bind:class="{tab_checked: index === activeTabIndex}"
                  v-on:click="changeTabIndex(index)">
                <a @click="switchTab(item.id)">{{item.name}}</a>
              </li>
            </ul>
          </el-row>
          <el-row v-if="tagShow">
            <ul class="tags">
              <li v-for="(item, index) in tagList" v-bind:key="index"
                  v-bind:class="{tag_checked: index === activeTagIndex}"
                  v-on:click="changeTagIndex(index)">
                <a @click="selectTag(item)">
                  <svg-icon v-if="item.icon" :icon-class="item.icon" /> {{item.name}}
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
      <el-col :span="5">
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
import {qryTopicList, qryTagList} from '@/api/tag.js'
import {add, edit} from '@/api/question.js'
export default {
  components: {
    Tinymce
  },
  data () {
    return {
      id: '',
      type: '',
      title: '',
      description: '',
      inputTag: true,
      newTag: false,
      tag: '',
      tags: [],
      tabId: '', // 默认显示第一个tab标签
      tabList: [],
      activeTabIndex: 0,
      tagList: [],
      activeTagIndex: -1,
      tagShow: false,
      canvassImg: require('@/images/canvass.png')
    }
  },
  created () {
    this.type = this.$route.query.pid
    const questionInfo = JSON.parse(sessionStorage.getItem('question'))
    if (questionInfo) {
      this.id = questionInfo.id
      this.title = questionInfo.title
      this.description = questionInfo.description
      this.tags = questionInfo.tags
      this.tag = questionInfo.tag
    }
    this.getTopicList()
  },
  destroyed () {
    // 销毁问题信息
    sessionStorage.removeItem('question')
  },
  methods: {
    // 获取话题列表
    getTopicList () {
      const pid = 0 // 话题的父节点
      qryTopicList(pid).then(res => {
        const data = res.data
        this.tabId = data[1].id
        for (let i = 1; i < data.length; i++) {
          this.tabList.push(data[i])
        }
        if (this.id) {
          this.inputTag = false
          this.newTag = true
          this.tagShow = true
        }
        this.getTagList()
      })
    },
    changeTabIndex (index) {
      this.activeTabIndex = index
    },
    // 切换标签tab
    switchTab (pid) {
      this.tabId = pid
      this.getTagList()
    },
    // 获取tab对应标签
    getTagList () {
      qryTagList(this.tabId).then(res => {
        this.tagList = res.data
      })
    },
    changeTagIndex (index) {
      this.activeTagIndex = index
    },
    // 选取标签
    selectTag (tag) {
      if (this.tag) {
        // 长度判断
        if (this.tags.length < 5) {
          // 重复性判断
          if (this.tag.indexOf(tag.id.toString()) === -1) {
            this.tag = this.tag + ',' + tag.id.toString()
            this.tags.push(tag)
          } else {
            this.$notify({
              title: '警告',
              message: '标签已存在',
              type: 'warning'
            })
          }
        } else {
          this.$notify({
            title: '警告',
            message: '不能超过5个标签哦',
            type: 'warning'
          })
        }
      } else {
        this.tag = tag.id.toString()
        this.tags.push(tag)
      }
    },
    // 删除标签
    closeTag (tag) {
      let tagArray = this.tag.split(',')
      tagArray.splice(tagArray.indexOf(tag.id.toString()), 1)
      console.log(tagArray)
      this.tag = tagArray.join(',')
      console.log(this.tag)
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    // 获取tab标签
    getTabTag () {
      this.getTagList()
      this.inputTag = false
      this.newTag = true
      this.tagShow = true
    },
    // 发布问题
    publish () {
      let data = {
        id: this.id,
        title: this.title,
        description: this.description,
        type: this.type,
        tag: this.tag,
        creator: 53936355
      }
      if (this.id) {
        this.edit(data)
      } else this.add(data)
    },
    add (data) {
      add(data).then(res => {
        this.$notify({
          title: '成功',
          message: '提问成功',
          type: 'success'
        })
        this.$router.push({path: '/'})
      })
    },
    edit (data) {
      edit(data).then(res => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        })
        this.$router.push({path: '/'})
      })
    }
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

// 添加&删除标签
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  // margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
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
  height: 60px;
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
