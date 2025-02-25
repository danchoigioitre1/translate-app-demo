import { createI18n } from 'vue-i18n'
import  messages from './index'
 
 
const locale = localStorage.getItem("mobile-language")
const i18n = createI18n({
  legacy: false, 
  locale: locale ?? 'vi',
  messages
})
export default i18n