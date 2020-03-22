import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo() { //获取登陆信息
  return request({
    url: '/user/isLogin',
    method: 'get'
  })
}

export function reqEmailCaptcha(emailAccount) { //获取验证码
  return request({
    url: '/user/sc',
    method: 'post',
    params:{emailAccount}
  })
}

export function reqPassword({emailAccount,code,password}) { //修改或忘记密码获取
  return request({
    url: '/user/cp',
    method: 'put',
    data:qs.stringify({emailAccount,code,password})
  })
}
