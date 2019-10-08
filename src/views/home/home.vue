<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <ul class="list">
          <li v-for="(item, index) in tabList" v-bind:key="index"
              v-bind:class="{checked: index === activeIndex}"
              v-on:click="changeIndex(index)">
            <a>{{item}}</a>
          </li>
        </ul>
      </el-row>
    </div>

    <el-row>
      <el-col :span="18">
        <el-row class="subject">
          <el-col :span="12">
            <!-- <svg-icon icon-class="mulu"/> -->
            <a>{{tabList[activeIndex]}}</a>
          </el-col>
          <el-col :span="12" class="askQuestion">
            <a @click="askQuestion">
            <i class="el-icon-plus"></i>
            提问题</a>
          </el-col>
        </el-row>
        <el-row class="content">
          <div class="aw-item" v-for="(item, index) in tableData" v-bind:key="index">
            <a class="aw-user-avator" rel="nofollow">
              <img :src="item.avatarUrl" alt="">
            </a>
            <div class="aw-question-content">
              <h4>
                <a @click="linkAnswer(item.id)">{{item.title}}</a>
              </h4>
              <p>
                <span>{{item.commentCount}}个评论 &nbsp;·&nbsp;{{item.viewCount}}次浏览
                  &nbsp;提问人&nbsp;·&nbsp;<a class="aw-user-name">{{item.userName}}</a>
                  &nbsp;·&nbsp;{{ item.creTm | formatTime() }}
                </span>
              </p>
            </div>
          </div>
        </el-row>
        <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          @current-change="currentPage"
          :page-size="pageSize"
          :current-page="page"
          :total="total">
        </el-pagination>
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
import {queryQuestionPage} from '@/api/question.js'
export default {
  data () {
    return {
      tabList: ['全部', 'Vue', 'Node.js', 'html5', '最新动态', '活动'],
      activeIndex: 0,
      tableData: [],
      pageSize: 10,
      page: 1,
      total: 0,
      canvassImg: require('@/images/canvass.png')
    }
  },
  methods: {
    changeIndex (index) {
      this.activeIndex = index
    },
    // 初始化表格数据
    initTableData () {
      queryQuestionPage({currentPage: this.page, pageSize: this.pageSize}).then(res => {
        if (res.rspCode === '0000') {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    currentPage (page) {
      this.page = page
      this.initTableData()
    },
    // 提问
    askQuestion () {
      this.$router.push({path: '/question/ask'})
    },
    // 答问
    linkAnswer (id) {
      this.$router.push({path: 'question/answer', query: {'id': id}})
    }
  },
  created () {
    this.initTableData()
  }
}
</script>
<style lang="scss" scoped>
.list > li {
    float: left;
    position: relative;
    height: 30px;
    line-height: 30px;
    margin: 0 10px 10px 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
}
.list > li > a {
  display: block;
  padding: 0 10px;
}
.list > li:hover > a {
  border-radius: 5px;
  background: #009a61;
  color: #fff;
}
.checked {
  background: #009a61;
  color: #fff;
}
ul, ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
.subject {
  z-index: 1;
  // min-height: 63px;
  padding: 16px 0 8px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  font-size: 18px;
  .askQuestion {
    text-align: right;
  }
  .askQuestion a {
    color: #fff;
    background-color: #009a61;
    border-color: #008151;
    // display: inline-block;
    margin-bottom: 0;
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 8px 8px;
    font-size: 14px;
    line-height: 1.42858;
    border-radius: 4px;
  }
}
.content {
  height: auto;
  background-color: white;
  padding: 0 20px;
  .aw-item {
    position: relative;
    z-index: 0;
    min-height: 77px;
    padding: 14px 0 14px 50px;
    .aw-user-avator {
      position: absolute;
      left: 0;
      top: 18px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .aw-question-content  {
      h4 {
        margin: 0 0 3px;
        padding-right: 20px;
        font-size: 16px;
        word-wrap: break-word;
        a {
          cursor: pointer;
          color: #212121;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
          color: #009a61
        }
      }
      p {
        margin: 0;
        color: #999;
        font-size: 13px;
        font-weight: normal;
        .aw-user-name {
          color: #666;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  div+div {
    border-top: 1px solid #f5f5f5;
  }
}
.side-bar {
  height: 550px;
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
</style>
