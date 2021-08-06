import request from '@/utils/request'

export function pageMenuList(data) {
  return request({
    url: '/admin/roleMenu/pageMenuList',
    method: 'post',
    data
  })
}
export function updateMenu(data) {
  return request({
    url: '/admin/roleMenu/updateMenu',
    method: 'post',
    data
  })
}
export function insertMenu(data) {
  return request({
    url: '/admin/roleMenu/insertMenu',
    method: 'post',
    data
  })
}
export function menuTree(data) {
  return request({
    url: '/admin/roleMenu/menuTree',
    method: 'post',
    data
  })
}
export function menuListByLevel(data) {
  return request({
    url: '/admin/roleMenu/menuListByLevel',
    method: 'post',
    data
  })
}
