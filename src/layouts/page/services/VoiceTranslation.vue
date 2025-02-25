<template>
    <div class="home-container">
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
        <div ref="translateContainer" class="translate-content translate-textarea">
            <div class="item-content" v-for="item in store.getters.oneSidedTranslationHistory" :key="item.id">
                <div class="source-content">{{ item.source }}</div>
                <div class="target-content"><van-icon name="play-circle" size="20" @click="speakText(item.target, item.targetLang)"/> {{ "   " + item.target }}</div>
            </div>
        </div>
        <div class="footer-controller">
                <button class="start-button" @click="translate">
                    <div :class="!current.isListening ? 'start-effect' : 'stop-effect'"></div>
                </button>
                <van-icon :name="current.isSpeakAfterTranslate ? 'volume' : 'volume-o'" class='icon-volume' @click="current.isSpeakAfterTranslate = !current.isSpeakAfterTranslate" size="30"/>
            
        </div>
    </div>

  </template>
  
<script>
import { reactive, onMounted, ref, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { textTranslate } from "@/js/service/api";
export default {
    name: "VoiceTranslationPage",
    setup() {
        const store = useStore();
        const { t } = useI18n()
        
        const current = reactive({
            target: 'en',
            source: 'vi',
            languageList: store.getters.supportedLanguages.map(item => ({text: item.displayName, value: item.languageCode })),

            isListening: false,
            recognition: null,
            isSpeakAfterTranslate: true
        })

        const translateContainer = ref(null);
        watch(
            () => store.getters.oneSidedTranslationHistory,
            async () => {
                await nextTick(); // Đợi DOM cập nhật xong
                if (translateContainer.value) {
                translateContainer.value.scrollTop = translateContainer.value.scrollHeight;
                }
            },
            { deep: true }
        );


        onMounted(() => {
        })
        const decodeHTMLEntities = (text) => {
            const doc = new DOMParser().parseFromString(text, "text/html");
            return doc.documentElement.textContent;
        }

        const translate = () => {
            !current.isListening ? startRecognition() : stopRecognition()
        }       
        
        const startRecognition = () => {
            console.log(current.source, current.target);
            
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            alert("Trình duyệt không hỗ trợ Speech Recognition!");
            return;
        }

        // eslint-disable-next-line no-undef
        current.recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        current.recognition.lang = current.source;
        current.recognition.continuous = true;
        current.recognition.interimResults = true;

        current.recognition.onstart = () => {
            current.isListening = true;
        };

        current.recognition.onresult = (event) => {
            let isFinal = event.results[event.results.length - 1].isFinal;
            if(event.results[event.results.length - 1].isFinal) current.transcript = event.results[event.results.length - 1][0].transcript
            
            if(isFinal){
                textTranslate({text: current.transcript , sourceLang: current.source, targetLang: current.target}).then(
                    res => {
                        if(res.status == 200){
                            let text = decodeHTMLEntities(res.data.translations[0].translatedText)
                            store.dispatch("setOneSidedTranslationHistory", {
                                id: crypto.randomUUID(),
                                source: current.transcript,
                                target: text,
                                sourceLang: current.source,
                                targetLang: current.target
                            });
                            setTimeout(() => {
                                if (!window.speechSynthesis.speaking) { // Kiểm tra nếu chưa đọc thì mới đọc
                                    if(current.isSpeakAfterTranslate){speakText(text);}
                                }
                            }, 1500); 
                            
                        }
                    }
                )
                .catch((err) => console.log(err));
            }
            
        };

            current.recognition.onend = () => {
                current.isListening = false;
            };

            current.recognition.start();
        };

        const stopRecognition = () => {
        if (current.recognition) {
            current.recognition.stop();
        }
        };

        const speakText = (text, targetLang) => {
            
            if (text.trim() === '') return;

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLang ?? current.target; 

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
            translateContainer,
            speakText
        };
    },
  };
  </script>
  
  <style scoped>
  @import url('../../../css/main.css');
  </style>
  