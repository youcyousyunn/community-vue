import request from '@/utils/request.js'

export function queryQuestionPage (data) {
  return request({
    url: '/question/queryPage',
    method: 'post',
    data
  })
}

export function pubQuestion (data) {
  return request({
    url: '/question',
    method: 'post',
    data
  })
}

export function qryQuestion (id) {
  return request({
    url: '/question/' + id,
    method: 'get'
  })
}

export function qryComment (parentId, commentType) {
  return request({
    url: '/comment/' + parentId,
    method: 'get',
    params: {
      commentType: commentType
    }
  })
}

export function commentQuestionOrAnswer (data) {
  return request({
    url: '/comment',
    method: 'post',
    data
  })
}

export function qryAnswerByQuestionId (questionId) {
  return request({
    url: '/answer/' + questionId,
    method: 'get'
  })
}

export function answerQuestion (data) {
  return request({
    url: '/answer',
    method: 'post',
    data
  })
}
