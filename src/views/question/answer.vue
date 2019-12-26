<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-row class="content">
          <el-row>
            <h2 class="h2">
              <a>
                {{title}}
              </a>
            </h2>
          </el-row>
          <el-row>
            <ul class="tags">
              <li v-for="(item, index) in tagList" v-bind:key="index">
                <a>
                  <svg-icon v-if="item.icon" :icon-class="item.icon" /> {{item.name}}
                </a>
              </li>
              <span>{{viewCount}} 次浏览</span>
            </ul>
          </el-row>
          <el-row class="descript">
            <div>
              <p v-html="description">
              </p>
            </div>
            <div>
              <el-row>
                <el-col :span="16">
                  <ul class="question-deal">
                    <li v-for="(item, index) in questionDealList" v-bind:key="index">
                        <a v-if="item.code === 'comment'" @click="viewQuestionComment(item.code)">
                          <svg-icon v-if="item.icon" v-bind:icon-class=item.icon />
                          <span>{{item.name}}&nbsp;·&nbsp;{{commentCount}}</span>
                        </a>
                        <a v-else>
                          <svg-icon v-if="item.icon" v-bind:icon-class=item.icon />
                          <span>{{item.name}}</span>
                        </a>
                    </li>
                    </ul>
                </el-col>
                <el-col :span="8">
                  <a class="answer-user-avator" rel="nofollow">
                    <img :src="avatar" alt="">
                  </a>
                  <div class="user-avator-content">
                    <h4>
                      <a>{{userName}}</a>
                    </h4>
                    <p>
                      <span>
                      {{ creTm | formatTime() }}提问
                      </span>
                    </p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-row>
          <el-row class="widget-comments" v-if="questionCommentShow">
            <p v-for="(item, index) in commentList" v-bind:key="index">
              {{item.comment}}
              <a> — {{item.userName}}</a>
              <span>&nbsp;·&nbsp;{{ item.creTm | formatTime() }}</span>
              <el-divider></el-divider>
            </p>
            <el-input type="textarea" v-model="questionComment" placeholder="使用评论询问更多信息或提出修改意见，请不要在评论里回答问题"></el-input>
            <el-button @click="commentQuestion">提交评论</el-button>
          </el-row>
          <el-row class="replys-number">
            <h3 class="h3">
              <a>
                {{answerList.length}} 个回答
              </a>
            </h3>
          </el-row>
          <el-row class="replys" v-for="(item, index) in answerList" v-bind:key="index">
            <div class="reply-content">
              <p v-html="item.answer">
              </p>
            </div>
            <div class="reply-widget">
              <el-row>
                <el-col :span="16">
                  <ul class="reply-deal">
                    <li v-for="(innerItem, index) in replyDealList" v-bind:key="index">
                        <a v-if="innerItem.code === 'comment'" @click="replyAnswer(item.id)">
                          <svg-icon v-if="innerItem.icon" v-bind:icon-class=innerItem.icon />
                          <span>{{innerItem.name}}&nbsp;·&nbsp;{{item.commentCount}}</span>
                        </a>
                        <a v-else>
                          <svg-icon v-if="innerItem.icon" v-bind:icon-class=innerItem.icon />
                          <span>{{innerItem.name}}</span>
                        </a>
                    </li>
                  </ul>
                </el-col>
                <el-col :span="8">
                  <a class="answer-user-avator" rel="nofollow">
                    <img :src="item.avatar" alt="">
                  </a>
                  <div class="user-avator-content">
                    <h4>
                      <a>{{item.userName}}</a>
                    </h4>
                    <p>
                      <span>
                      {{ item.creTm | formatTime() }}回答
                      </span>
                    </p>
                  </div>
                </el-col>
              </el-row>
              <el-row class="widget-comments" v-if="commentReplyIndex === item.id">
                <p v-for="(item, index) in answerCommentList" v-bind:key="index">
                  {{item.comment}}
                  <a> — {{item.userName}}</a>
                  <span>&nbsp;·&nbsp;{{ item.creTm | formatTime() }}</span>
                  <el-divider></el-divider>
                </p>
                <el-input type="textarea" v-model="answerComment" placeholder="使用评论询问更多信息或提出修改意见，请不要在评论里回答问题"></el-input>
                <el-button @click="commentAnswer(index, item.id)">提交评论</el-button>
              </el-row>
              <el-divider v-if="index !== answerList.length-1"></el-divider>
            </div>
          </el-row>
          <el-divider></el-divider>
          <el-row class="answer-question">
            <h4>撰写答案</h4>
            <el-input type="textarea" v-if="textareaShow" @click.native="tinymceShow = true, textareaShow = false" placeholder="撰写答案..." rows="5"></el-input>
            <tinymce v-model="answer" v-if="tinymceShow"></tinymce>
          </el-row>
          <el-row class="answer">
            <el-button @click="answerQuestion">提交回答</el-button>
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
import {qryQuestion, qryComment, qryAnswerByQuestionId, answerQuestion, commentQuestionOrAnswer} from '@/api/question.js'
export default {
  components: {
    Tinymce
  },
  data () {
    return {
      id: 0, // 问题id
      answerId: 0,
      title: '',
      tagList: [],
      viewCount: 0,
      description: '',
      avatar: '',
      userName: '',
      creTm: 0,
      commentCount: 0,
      questionCommentShow: true,
      commentList: [],
      commentReplyIndex: -1,
      questionDealList: [
        {code: 'like', name: '点赞', icon: 'like'},
        {code: 'comment', name: '评论', icon: 'comment'},
        {code: 'focus', name: '关注', icon: 'focus'},
        {code: 'collect', name: '收藏', icon: 'collect'}
      ],
      questionComment: '',
      answerList: [],
      replyDealList: [
        {code: 'like', name: '点赞', icon: 'like'},
        {code: 'comment', name: '评论', icon: 'comment'}
      ],
      answerCommentList: [],
      answerComment: '',
      textareaShow: true,
      tinymceShow: false,
      canvassImg: require('@/images/canvass.png'),
      answer: ''
    }
  },
  methods: {
    // 查看问题评论
    viewQuestionComment (replyType) {
      if (!this.questionCommentShow) {
        this.getCommentList()
      }
      if (replyType === 'comment') {
        if (this.questionCommentShow) {
          this.questionCommentShow = false
        } else {
          this.questionCommentShow = true
        }
      }
    },
    // 获取问题评论列表
    getCommentList () {
      if (this.id === 0) {
        return
      }
      qryComment(this.id, 1).then(res => {
        this.commentList = res.data
      })
    },
    // 获取问题答案列表
    getAnswerList () {
      if (this.id === 0) {
        return
      }
      qryAnswerByQuestionId(this.id).then(res => {
        if (res.data !== null) {
          this.answerList = res.data
        }
      })
    },
    // 获取答案评论列表
    replyAnswer (id) {
      if (this.commentReplyIndex === id) {
        this.commentReplyIndex = -1
      } else {
        this.commentReplyIndex = id
      }
      if (this.id === 0) {
        return
      }
      qryComment(id, 2).then(res => {
        this.answerCommentList = res.data
      })
    },
    // 评论问题
    commentQuestion () {
      commentQuestionOrAnswer({parentId: this.id, commentator: 20416034, comment: this.questionComment, commentType: 1}).then(res => {
        this.getCommentList() // 刷新评论
        this.commentCount += 1 // 评论数+1
        this.questionComment = '' // 重置评论
        this.$notify({
          title: '成功',
          message: '评论问题成功',
          type: 'success'
        })
      })
    },
    // 评论答案
    commentAnswer (index, answerId) {
      this.answerId = answerId
      commentQuestionOrAnswer({parentId: answerId, commentator: 20416034, comment: this.answerComment, commentType: 2}).then(res => {
        this.replyAnswer(this.answerId) // 刷新答案评论列表
        this.answerList[index].commentCount += 1 // 评论数+1
        this.answerComment = '' // 重置评论
        this.$notify({
          title: '成功',
          message: '评论答案成功',
          type: 'success'
        })

        // 展开该答案下的评论
        if (this.commentReplyIndex === answerId) {
          this.commentReplyIndex = -1
        } else {
          this.commentReplyIndex = answerId
        }
      })
    },
    // 撰写答案
    answerQuestion () {
      if (this.answer.length < 30) {
        this.$notify({
          title: '警告',
          message: '请详细描述你的答案',
          type: 'warning'
        })
        return
      }
      answerQuestion({questionId: this.id, answer: this.answer, answerer: 20416034}).then(res => {
        this.getAnswerList() // 刷新问题答案列表
        this.answer = '' // 重置答案
        if (this.id) {
          this.$notify({
            title: '成功',
            message: '评论成功',
            type: 'success'
          })
        }
        // this.$router.push({path: '/'}) // 返回首页
      })
    },
    // 根据id获取单个提问
    getQuestion () {
      qryQuestion(this.id).then(res => {
        let data = res.data
        this.title = data.title
        this.viewCount = data.viewCount
        this.tagList = data.tagList
        this.description = data.description
        this.avatar = data.avatar
        this.userName = data.userName
        this.creTm = data.creTm
        this.commentCount = data.commentCount
      })
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getQuestion()
    this.getCommentList()
    this.getAnswerList()
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: auto;
  background-color: white;
  padding: 10px 10px;
  .h2 {
    margin: 0 0 10px 0;
    line-height: 1.2;
    font-size: 24px;
    a:active {
        color: #333;
        text-decoration: none;
    }
  }
}

.replys-number {
  .h3 {
    margin: 30px 0 0 0;
    line-height: 1.2;
    font-size: 22px;
    margin-bottom: 15px;
  }
  border-bottom: 1px solid #e6e6e6;
}

.replys {
  margin: 0 15px;
  padding: 0 0;
  // border-bottom: 1px solid #eee;
  .reply-widget {
    .el-divider {
      margin: 15px 0;
      // height: 0.5px;
    }
  }
}

.answer-question {
  margin: 0 0;
  h4 {
    margin: 0 0 10px 0;
    line-height: 1.2;
    font-size: 18px;
  }
}

// 侧边
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
  padding: 5px 0;
  display: inline-block;
  li {
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
    a {
      padding: 0 11px;
      display: block;
      background-color: rgba(1,126,102,0.08)
    }
    .tag_checked {
      background: #017E66;
      color: #fff;
    }
  }
  li:hover > a {
    background: #017E66;
    color: #fff;
  }
  span {
    color: #999;
    margin-bottom: -5px;
  }
}

.descript {
  padding-left: 15px;
  p {
    line-height: 1.8;
    word-wrap: break-word;
    img {
      width: 780px;
    }
  }
}

// 针对问题的点赞，评论处理
.question-deal {
  padding: 5px 0;
  display: inline-block;
  li {
    float: left;
    position: relative;
    height: 22px;
    line-height: 22px;
    margin-right: 12px;
    font-size: 13px;
    font-weight: normal;
    text-align: left;
    cursor: pointer;
    margin-bottom: 5px !important;
  }
  span {
    color: #999;
    margin-bottom: -5px;
  }
}

.answer-user-avator {
  text-align: right;
  position: absolute;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%
  }
}
.user-avator-content {
  h4 {
    margin: 0 0 0 45px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
    a {
      cursor: pointer;
      color: #009a61;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
      color: #009a61
    }
  }
  p {
    margin: 0 0 0 45px;
    color: #999;
    font-size: 13px;
    font-weight: normal;
  }
}

// 针对回复的点赞，评论处理
.reply-deal {
  padding: 5px 0;
  display: inline-block;
  li {
    float: left;
    position: relative;
    height: 22px;
    line-height: 22px;
    margin-right: 12px;
    font-size: 13px;
    font-weight: normal;
    text-align: left;
    cursor: pointer;
    margin-bottom: 5px !important;
  }
  span {
    color: #999;
    margin-bottom: -5px;
  }
}

// 问题评论
.widget-comments {
  list-style: none;
  margin: 15px 15px;
  font-size: 13px;
  color: #666;
  padding: 10px;
  background-color: #F6F6F6;
  border-radius: 2px;
  p {
    padding: 0 15px;
    a {
      color: #009a61;
    }
    a:hover {
      text-decoration: underline;
    }
    .el-divider {
      margin: 15px 0;
      // height: 0.5px;
    }
  }
  .el-textarea {
    width: calc(100% - 130px);
    float:left;
  }
  .el-button {
    margin: 0 15px;
    color: #333;
    background-color: #fff;
    border-color: #ccc;
  }
  .el-button:hover, .el-button:focus {
    background-color: #e6e6e6;
    border-color: #adadad;
  }
}

.answer {
  margin: 20px 0
}
.answer button {
  float: right;
  border-radius: 5px;
  background: #017E66;
  color: #fff;
}
.mce-panel {
  border: 0 solid #f3f3f3;
}
</style>
