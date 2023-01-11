import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '../node_modules/semantic-ui-css/semantic.min.css'
import VueMeta from 'vue-meta'
import VuePwaInstallPlugin from "vue-pwa-install"
import 'semantic-ui-css/semantic.min.css'
import jQuery from 'jquery'
import axios from 'axios'
import VueAxios from 'vue-axios'
import SuiVue from 'semantic-ui-vue'

Vue.use(VueAxios, axios)
Vue.use(VuePwaInstallPlugin)
Vue.use(VueMeta)
Vue.use(SuiVue)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
