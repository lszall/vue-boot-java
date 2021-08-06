import request from '@/utils/request'

export function pageRaffleMain(data) {
  return request({
    url: '/raffle/pageRaffleMain',
    method: 'post',
    data
  })
}

export function insertRaffle(data) {
  return request({
    url: '/raffle/insertRaffle',
    method: 'post',
    data
  })
}

export function updateRaffle(data) {
  return request({
    url: '/raffle/updateRaffle',
    method: 'post',
    data
  })
}
export function getRaffleMainInfo(data) {
  return request({
    url: '/raffle/getRaffleMainInfo/' + data,
    method: 'get',
    data
  })
}
export function deleteRaffle(data) {
  return request({
    url: '/raffle/deleteRaffle/' + data,
    method: 'get'
  })
}
export function listRaffleDetail(data) {
  return request({
    url: '/raffle/listRaffleDetail/' + data,
    method: 'get'
  })
}
export function reStartRaffle(data) {
  return request({
    url: '/raffle/reStartRaffle',
    method: 'post',
    data
  })
}

