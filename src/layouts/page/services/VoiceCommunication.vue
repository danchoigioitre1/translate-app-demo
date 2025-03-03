<template>
    <div class="text-translate-container">
        <div class="language-header">
                <van-dropdown-menu>
                <van-dropdown-item 
                v-model="persons.firstPerson.language" 
                :options="current.languageList"
                class="language-dropdown"
                @change="current.isRecording = false"
                />
            </van-dropdown-menu>
            <div>⬅➡</div>
            <van-dropdown-menu>
                <van-dropdown-item 
                v-model="persons.secondPerson.language" 
                :options="current.languageList"
                class="language-dropdown" 
                @change="current.isRecording = false"
                />
            </van-dropdown-menu>
        </div>

        <div class="communication-content">
            <div v-for="(item, index) in current.history" :key="index" class="communication-item" :class="{'right-message': item.speaker.id === 2}">
                <div style="padding: 10px; font-size: 12px;">{{ item.date }}</div>
                <div class="communication-text">
                    <div style="background-color: white; padding: 10px;"><span class="text-com-source">{{ item.source}}</span></div>
                    <div style="padding: 10px;">
                        <span class="text-com-target"><van-icon name="play-circle" size="20" @click="speakText(item.target, item.targetLang)"/>{{ item.target}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="button-controller-group">
            <button class="player-button" @click="translateVoice(persons.firstPerson)" :class="{'border-effect': current.speaker?.id === 1}" >
                <span>{{persons.firstPerson.name}}</span>
            </button>
            <button class="start-com-button" @click="toggleRecording">
                <div :class="!current.isRecording ? 'start-effect' : 'stop-effect'"></div>
            </button>  
            <button class="player-button" @click="translateVoice(persons.secondPerson)" :class="{'border-effect': current.speaker?.id === 2}">
                <span>{{persons.secondPerson.name}}</span>
            </button>         
        </div>
        
    </div>
  </template>
  
<script>
import { reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { textTranslate } from "@/js/service/api";
import { showToast } from "vant";
export default {
    name: "VoiceCommunicationPage",
    setup() {
        const store = useStore();
        const { t } = useI18n()
        const persons = reactive({
            firstPerson :{id: 1, name: 'P1', language: "vi"},
            secondPerson :{id: 2, name: 'P2', language: "en"}
        })
        const current = reactive({
            languageList: store.getters.supportedLanguages.map(item => ({text: item.displayName, value: item.languageCode })),
            speaker: '',
            recording: null,
            isRecording: false,
            transcript: "",
            history: store.getters.communicationHistory
        })

        onMounted(() => {
            init()
        })
        const init = () => {
            if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
                alert("Trình duyệt không hỗ trợ Speech Recognition!");
                return;
            }
        }

        const getOtherPerson = (speaker) => {
            return Object.values(persons).find(person => person.id !== speaker.id);
        };

        const createRecording = (speaker) => {
            current.recording = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            current.recording.lang = speaker.language;
            current.recording.continuous = true;
            current.recording.interimResults = false;

            current.recording.onresult = (event) => {
                current.transcript = event.results[event.results.length - 1][0].transcript;
                let text = event.results[event.results.length - 1][0].transcript;
                let target = getOtherPerson(speaker);
                translate(speaker, text, speaker.language, target.language)
            };

            current.recording.onend = () => {
                console.log("END RECODING !!!");
                
            };

            current.recording.onStart = () => {
            };

            current.recording.start();
        }

        const decodeHTMLEntities = (text) => {
            const doc = new DOMParser().parseFromString(text, "text/html");
            return doc.documentElement.textContent;
        }
        const translate = (speaker, text, sourceLang, targetLang) => {
            textTranslate({text , sourceLang, targetLang}).then(
                    res => {
                        if(res.status == 200){
                            let transcript = {
                                speaker,
                                source: text,
                                target: decodeHTMLEntities(res.data.translations[0].translatedText),
                                sourceLang,
                                targetLang,
                                date: new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 16).replace("T", " ")
                            }
                            store.dispatch("setCommunicationHistory", transcript).then(
                                () => {
                                    current.history = store.getters.communicationHistory;
                                    console.log(current.history);
                                    
                                }
                            )
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

        const toggleRecording = () => {
            current.isRecording = !current.isRecording
                    if(!current.isRecording) {
                        if(current.recording) current.recording.stop();
                        current.speaker = null;
                }
        }

        const translateVoice = (speaker) => {
            if(!current.isRecording){
                showToast("Hãy ấn nút bắt đầu !!!")
                return
            }
            if (current.recording){ 
                current.recording.stop();
                if(!current.speaker || current.speaker?.id != speaker.id){
                    current.speaker = speaker;
                    showToast(speaker.name)
                    createRecording(speaker);
                } else {
                    current.speaker = null;
                }
            } else {
                    current.speaker = speaker;
                    showToast(speaker.name)
                    createRecording(speaker);
            }
        }
        

        return { 
            t, 
            current,
            translate,
            store,
            speakText,

            toggleRecording,
            persons,
            translateVoice
        };
    },
  };
  </script>
  
  <style scoped>
  @import url('../../../css/main.css');
  .start-com-button{
    width: 50px;
    height: 50px;
    border: 2px solid rgb(187, 183, 183);
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  </style>
  