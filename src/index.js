import _ from 'lodash'
import './style/reset.css'
import './style/base.scss'

import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App)
})
window._ = _
