import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function qryUserInfo () {
  return request({
    url: '/user/qryUserInfo',
    method: 'get'
  })
}
