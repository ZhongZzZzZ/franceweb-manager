import request from '@/utils/request'

export function fetchLinkList() { //获取链接列表
  return request({
    url: `/fl/g`,
    method: 'get',
  })
}

export function deleteLinkList(params) { //批量删除链接
  return request({
    url:  `/fl/d/${params}`,
    method: 'delete',
  })
}