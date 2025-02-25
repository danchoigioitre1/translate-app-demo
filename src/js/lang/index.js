import vi from './vi'
import en from './en'
import zhCN from './zh-CN'

export const optionsLangue = (t, computed) => {
    return [
        { text: computed(() => t('home.chinese')), value: 'zhCN' },
        { text: computed(() => t('home.vietnam')), value: "vi" },
        { text: computed(() => t('home.english')), value: "en" },
    ]
} 

export default {
    vi, en, zhCN
}