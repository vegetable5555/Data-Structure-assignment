import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {
  Table,
  TableColumn,
  Button,
  Icon,
  Popconfirm,
  Form,
  FormItem,
  Input,
  DatePicker,
  RadioGroup,
  Radio,
  Dialog
} from 'element-ui'

Vue.config.productionTip = false
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Popconfirm)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Dialog)

new Vue({
  el:'#app',
  render: h => h(App),
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
  },
})