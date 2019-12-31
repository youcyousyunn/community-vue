import request from '@/utils/request.js'

export function queryQuestionPage (params) {
  return request({
    url: '/question/queryPage',
    method: 'get',
    params
  })
}

export function add (data) {
  return request({
    url: '/question',
    method: 'post',
    data
  })
}

export function edit (data) {
  return request({
    url: '/question',
    method: 'put',
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
