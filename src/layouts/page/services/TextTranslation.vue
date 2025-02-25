<template>
    <div class="text-translate-container">
        <div class="language-header">
                <van-dropdown-menu>
                <van-dropdown-item 
                v-model="current.source" 
                :options="current.languageList"
                class="language-dropdown" 
                />
            </van-dropdown-menu>
            <van-icon name="play" />
            <van-dropdown-menu>
                <van-dropdown-item 
                v-model="current.target" 
                :options="current.languageList"
                class="language-dropdown" 
                />
            </van-dropdown-menu>
        </div>


        
        <div class="text-translate-content">
           <div class="textarea-wrapper">
            <textarea class="box" v-model='current.sourceText' placeholder="Nhập văn bản..."></textarea>
            <span class="icon" @click="speakText(current.sourceText, current.source)">🔊</span>
            </div>
            <div class="textarea-wrapper">
            <textarea class="box" v-model='current.targetText' readonly></textarea>
            <span class="icon" @click="speakText(current.targetText, current.target)">🔊</span>
            </div>
        </div>
        <van-button class="translate-button" type="success" @click="translate">Translate</van-button>
        
    </div>
  </template>
  
<script>
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { textTranslate } from "@/js/service/api";
export default {
    name: "TextTranslationPage",
    setup() {
        const store = useStore();
        const { t } = useI18n()
        
        const current = reactive({
            target: 'en',
            source: 'vi',
            languageList: store.getters.supportedLanguages.map(item => ({text: item.displayName, value: item.languageCode })),
            targetText: '',
            sourceText: ''
           
        })
        const decodeHTMLEntities = (text) => {
            const doc = new DOMParser().parseFromString(text, "text/html");
            return doc.documentElement.textContent;
        }
        const translate = () => {
            textTranslate({text: current.sourceText , sourceLang: current.source, targetLang: current.target}).then(
                    res => {
                        if(res.status == 200){
                            current.targetText = decodeHTMLEntities(res.data.translations[0].translatedText)
                            
                        }
                    }
                )
                .catch((err) => console.log(err));
        }
        const speakText = (text, targetLang) => {
            
            if (text.trim() === '') return;
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLang;

            utterance.rate = 1;      // Tốc độ bình thường
            utterance.pitch = 1;     // Cao độ bình thường
            utterance.volume = 1;    // Âm lượng đầy đủ

            speechSynthesis.speak(utterance);
        };
        

        return { 
            t, 
            current,
            translate,
            store,
            speakText
           
        };
    },
  };
  </script>
  
  <style scoped>
  @import url('../../../css/main.css');
  </style>
  