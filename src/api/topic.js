import request from '@/utils/request.js'

export function qryTopicList () {
  return request({
    url: '/qryTopicList',
    method: 'get',
    params: {}
  })
}
