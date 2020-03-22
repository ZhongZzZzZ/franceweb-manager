import request from '@/utils/request'

export function getAdvice({ page, limit }) {
  return request({
    url: `/fb/g`,
    method: 'get',
    params:{currentPage:page,pageSize:limit}
  })
}
export function deleteAdvice(params) { // 删除意见
  return request({
    url: `/fb/d${params}`,
    method: 'delete'
  })
}
