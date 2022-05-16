import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () =>
    import ( /* webpackChunkName:"login_home_welcome"*/ '../components/Login.vue')
    // import Home from '../components/Home.vue'
const Home = () =>
    import ( /* webpackChunkName:"login_home_welcome"*/ '../components/Home.vue')
    // import Welcome from '../components/Welcome.vue'
const Welcome = () =>
    import ( /* webpackChunkName:"login_home_welcome"*/ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () =>
    import ( /* webpackChunkName:"Users_Rights_Roles"*/ '../components/user/Users.vue')
    // import Rights from '../components/power/Rights.vue'
const Rights = () =>
    import ( /* webpackChunkName:"Users_Rights_Roles"*/ '../components/power/Rights.vue')
    // import Roles from '../components/power/Roles.vue'
const Roles = () =>
    import ( /* webpackChunkName:"Users_Rights_Roles"*/ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () =>
    import ( /* webpackChunkName:"Cate_List_Params_Add"*/ '../components/goods/Cate.vue')
    // import List from '../components/goods/List.vue'
const List = () =>
    import ( /* webpackChunkName:"Cate_List_Params_Add"*/ '../components/goods/List.vue')
    // import Params from '../components/goods/Params.vue'
const Params = () =>
    import ( /* webpackChunkName:"Cate_List_Params_Add"*/ '../components/goods/Params.vue')
    // import Add from '../components/goods/Add.vue'
const Add = () =>
    import ( /* webpackChunkName:"Cate_List_Params_Add"*/ '../components/goods/Add.vue')

// import Order from '../components/order/Order.vue'
const Order = () =>
    import ( /* webpackChunkName:"Order_Reports"*/ '../components/order/Order.vue')
    // import Reports from '../components/report/Reports.vue'
const Reports = () =>
    import ( /* webpackChunkName:"Order_Reports"*/ '../components/report/Reports.vue')


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    component: Login

}, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
    }, {
        path: '/users',
        component: Users
    }, {
        path: '/rights',
        component: Rights
    }, {
        path: '/roles',
        component: Roles
    }, {
        path: '/categories',
        component: Cate
    }, {
        path: '/params',
        component: Params
    }, {
        path: '/goods',
        component: List
    }, {
        path: '/goods/add',
        component: Add
    }, {
        path: '/orders',
        component: Order
    }, {
        path: '/reports',
        component: Reports
    }, ]
}, ]

const router = new VueRouter({
    routes
})

//路由守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router