import request from '@/utils/request.js'

// 查询话题列表
export function qryTopicList (pid) {
  return request({
    url: '/qryTopicList/' + pid,
    method: 'get',
    params: {}
  })
}

// 查询star最多标签列表
export function qryMostStarTagList () {
  return request({
    url: '/qryMostStarTagList',
    method: 'get',
    params: {}
  })
}

// 查询标签列表
export function qryTagList (pid) {
  return request({
    url: '/qryTagList/' + pid,
    method: 'get',
    params: {}
  })
}
