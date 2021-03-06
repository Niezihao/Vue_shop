import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

//顶部进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

//请求拦截器
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //在request拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use(config => {
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    //在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal * 1000)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')