import request from '@/utils/request'

export function getCarsousel() {
  return request({
    url:`/img/gssoai?part=carselImg`,
    method: 'get'
  })
}
export function deleteCarsousel(params) {
  return request({
    url: `/img/dss${params}`,
    method: 'delete'
  })
}
