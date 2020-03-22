import request from '@/utils/request'


export function fetchMembersList({page,limit}) { //获取成员列表
  return request({
    url: `/mi/gab/`,
    method: 'get',
    params:{currentPage:page,pageSize:limit}
  })
}

export function fetchMember(id) { //获取单个成员
  return request({
    url: `/mi/gob`,
    method: 'get',
    params:{id}
  })
}

export function uploadMember(formdata) { //上传成员
  return request({
    url: `/mi/u`,
    method: 'post',
    data:formdata
  })
}

export function editMember (formdata) { //修改成员
  return request({
    url: `/mi/c`,
    method: 'put',
    data:formdata
  })
}

export function deleteMembers(params) { //删除成员
  return request({
    url: `/mi/d/${params}`,
    method: 'delete',
  })
}


export function getAssociationPic(params) { //获取协会介绍图片
  return request({
    url: `img/gssoai?part=xiehuipic${params}`,
    method: 'get',
  })
}