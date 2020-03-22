import request from '@/utils/request'
import qs from 'qs'


export function upLoadActivityArticle(formdata) { //上传活动文章
  return request({
    url: `/aa/u`,
    method: 'post',
    data:formdata
  })
}

export function fetchActivityArticle(id) { //获取单个活动文章
  return request({
    url: `/aa/go`,
    method: 'get',
    params:{articleId:id}
  })
}

export function editActivityArticle(formdata) { //修改活动文章
  return request({
    url: `/aa/c`,
    method: 'put',
    data:formdata
  })
}

export function fetchArticleList({page,limit,part,language}) { //获取活动文章列表
  return request({
    url: `/aa/g`,
    method: 'get',
    params:{currentPage:page,pageSize:limit,part,language}
  })
}

export function deleteActivityArticle(params) { //删除活动文章
  return request({
    url: `/aa/d/${params}`,
    method: 'delete'
  })
}



//普通文章
export function fetchNormalArticleList({page,limit,part,language}) { //获取普通文章列表
  return request({
    url: `/oa/g`,
    method: 'get',
    params:{currentPage:page,pageSize:limit,part,language}
  })
}

export function fetchNormalArticle(id) { //获取单个普通文章
  return request({
    url: `/oa/go`,
    method: 'get',
    params:{articleId:id}
  })
}

export function upLoadNormalArticle(data) { //上传普通文章
  return request({
    url: `/oa/u`,
    method: 'post',
    data:qs.stringify(data),
  })
}

export function editNormalArticle(data) { //修改普通文章
  return request({
    url: `/oa/c`,
    method: 'put',
    data:qs.stringify(data)
  })
}

export function deleteNormalActivityArticle(params) { //删除普通文章
  return request({
    url: `/oa/d/${params}`,
    method: 'delete'
  })
}