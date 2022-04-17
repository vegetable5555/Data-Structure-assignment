import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ZmTreeOrg from 'zm-tree-org';
import "zm-tree-org/lib/zm-tree-org.css";
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
  Dialog,
  Carousel,
  CarouselItem
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
Vue.use(Carousel)
Vue.use(CarouselItem)

Vue.use(ZmTreeOrg)

new Vue({
  el:'#app',
  render: h => h(App),
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
  },
})