<template>
  <div class="home-container">
    <div class="header">
      <div class="instruct">
        <van-icon name="info" size="18" />
        <span>{{ t("home.instruct") }}</span>
      </div>
      <van-icon name="manager" size="18" />
    </div>
      <van-dropdown-menu style="margin-top: 20px;">
          <van-dropdown-item
            v-model="current.language" 
            :options="current.languageList"
            @change="changeLanguage"/>
      </van-dropdown-menu>
    <div class="services">
      <div class="service-item" v-for="(service, index) in services" :key="index" @click="goToService(service)">
        {{ service.title }}
      </div>
    </div>
    <van-tabbar>
      <van-tabbar-item v-for="(item, index) in tabList"
      :name="item.name"
      :to="item.path"
      icon="search" :key=index>
        {{ item.title }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import PATH from "@/router/path";
import { optionsLangue } from "@/js/lang";
export default {
  name: "HomePage",
  setup() {
    // const store = useStore();
    const { t, locale } = useI18n();
    const router = useRouter()
    const language = localStorage.getItem("mobile-language")
    const current = reactive({
        language: language ?? 'vi',
        languageList: optionsLangue(t, computed)
    })

    onMounted(async () => {
          // try {
          //   store.dispatch('getSupportedLanguagesList', current.language);
          // } catch (error) {
          //   console.error("Lỗi lấy token:", error);
          // }
        }
      )

    const tabList = ref([
        {
          name: "home",
          title: "home",
          path: "/",
          cuIcon: "wap-home",
          ico: "wap-home",
        },
        {
          name: "home",
          title: "home",
          path: "/index",
          cuIcon: "wap-home",
          ico: "wap-home",
        },
        {
          name: "home",
          title: "home",
          path: "/index",
          cuIcon: "wap-home",
          ico: "wap-home",
        },
        ])
    const services = ref([
        { 
          title: computed(() => t('home.textService')),
          path: PATH.SERVICE.TEXT_TRANSLATION  
        },
        { 
          title: computed(() => t('home.voiceService')),
          path: PATH.SERVICE.VOICE_TRANSLATION
        },
        {
          title: computed(() => t('home.voiceCom')),
          path: PATH.SERVICE.VOICE_COMMUNICATION
        },
        {
          title: computed(() => t('home.voiceCom2divides')),
          path: PATH.SERVICE.VOICE_COMMUNICATION_TWO_DEVICES
        },
        {
          title: computed(() => "gọi video"),
          path: PATH.SERVICE.VIDEO_CALL
        },
        {
          title: computed(() => "trò chuyện bằng giọng nói"),
          path: PATH.SERVICE.VOICE_CALL
        }
      ]);

    const goToService = (service) => {
        router.push(service.path)
    }   

    const changeLanguage = (language) => {
        localStorage.setItem('mobile-language', language)
        
        locale.value  = language;
        // store.dispatch('getSupportedLanguagesList', language == 'zhCN' ? 'zh-CN' : language);
    }



    return { 
      t, 
      services,
      goToService,
      tabList,
      current,
      changeLanguage
    };
  },
  
};
</script>

<style scoped>
@import url('../../../css/main.css');
.van-tabbar{
    width: 85%;
    padding: 10px 8px;
    border-radius: 20px;
    margin: 10px auto;
    border: none;
    box-shadow: 5px 3px 17px -9px rgba(0,0,0,0.75);
    left: 50%;
    transform: translate(-50%, -50%);
}
.van-tabbar::after{
    border: none;
}
</style>
