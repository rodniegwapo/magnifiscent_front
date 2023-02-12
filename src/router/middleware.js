import store from '../vuex/index.js'

const app = function (text) {
  document.title = text ? 'Magnifiscent500 Premium — ' + text : 'Magnifiscent500 Premium'
}

export const admin = (to, from, next) => {
  if (store.getters.login) {
    if (store.getters.role === 'Admin') {
      app(to.meta.title)
      next()
    } else {
      next(false)
    }
  } else {
    next('/login')
  }
}

export const auth = (to, from, next) => {
  if (store.getters.login) {
    app(to.meta.title)
    console.log(app);
    next()
  } else {
    next('/login')
  }
}

export const gate = (to, from, next) => {
  // if (store.getters.login) {
  //   switch (store.getters.role) {
  //     case 'Admin':
  //       next('/admin/dashboard')
  //       break
  //     case 'Seller':
  //       next('/seller/dashboard')
  //       break
  //     default:
  //       next('/user/dashboard')
  //       break
  //   }
  // } else {
  //   next('/login')
  // }
  next('/user/dashboard')
}

export const guest = (to, from, next) => {
  if (!store.getters.login) {
    app(to.meta.title)
    next()
  } else {
    next(false)
  }
}

export const seller = (to, from, next) => {
  // if (store.getters.login) {
  //   if (store.getters.role === 'Seller') {
  //     app(to.meta.title)
  //     next()
  //   } else {
  //     next(false)
  //   }
  // } else {
  //   next('/login')
  // }
  next()
}

export const user = (to, from, next) => {
  // if (store.getters.login) {
  //   if (store.getters.role === 'User') {
  //     app(to.meta.title)
  //     next()
  //   } else {
  //     next(false)
  //   }
  // } else {
  //   next('/login')
  // }
  next()
}

export const userWithAccount = (to, from, next) => {
  if (store.getters.login) {
    if (store.getters.role === 'User' && store.getters.selectedAccount !== null) {
      app(to.meta.title)
      next()
    } else {
      next('/')
    }
  } else {
    next('/login')
  }
}
