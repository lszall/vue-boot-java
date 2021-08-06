import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.code) {
    let flag = false
    menus.forEach(menu => {
      if (menu.menuCode === route.code) {
        route.order = menu.order
        flag = true
        return
      }
    })
    return flag
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param menus
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menus, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  menus: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
