<template>
    <van-popup v-model:show="current.showCenter" round class="connection-dialog">
        <div v-if="current.step == 1" class="first-step-dialog">
            <span>Nhập tên sử dụng: </span>

            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                    v-model="current.username"
                    name="Username"
                    label="Username"
                    placeholder="Username"
                    :rules="[{ required: true, message: 'Username is required' }]"
                    />
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button round block type="primary" native-type="submit">
                    Submit
                    </van-button>
                </div>
            </van-form>
        </div>

        <div v-if="current.step == 2" class="second-step-dialog">
            <span>Danh sách kết nối: </span>
            <div class="connection-list">
                <div v-for="item in current.connectionList" :key="item.uid" class="connection-item"
                @click="selectConnection(item)"
                >
                    {{item.uid}} : {{item.username}}
                </div>
            </div>
            <van-button @click="reloadConnectionList" type="primary">Reload connection list</van-button>
        </div>
    </van-popup>

    <div class="text-translate-container">
        <div class="language-header">
                <van-dropdown-menu>
                <van-dropdown-item 
                v-model="connection.source.language" 
                :options="current.languageList"
                class="language-dropdown"
                @change="current.isRecording = false"
                />
            </van-dropdown-menu>
            <div>⬅➡</div>
            <van-dropdown-menu>
                <van-dropdown-item 
                v-model="connection.target.language" 
                :options="current.languageList"
                class="language-dropdown" 
                @change="current.isRecording = false"
                />
            </van-dropdown-menu>
        </div>
        <div class="user-connection">
            <span>{{ connection.source.name }}</span>
            <span>{{ connection.target.name }}</span>
        </div>
        <div class="communication-content">
            <div v-for="(item, index) in current.history" :key="index" class="communication-item" :class="{'right-message': item.to != connection.target.name}">
                <div style="padding: 10px; font-size: 12px;">{{ item.date }}</div>
                <div class="communication-text">
                    <div style="background-color: white; padding: 10px;"><span class="text-com-source">{{item.to != connection.target.name ?  item.targetText : item.sourceText}}</span></div>
                    <div style="padding: 10px;">
                        <span class="text-com-target"><van-icon name="play-circle" size="20" @click="speakText(item, item.to != connection.target.name)"/>{{item.to != connection.target.name ?  item.sourceText : item.targetText}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="controller-group">
            <!-- <button class="player-button" @click="translateVoice(connection.firstPerson)" :class="{'border-effect': current.speaker?.id === 1}" >
                <span>{{connection.firstPerson.name}}</span>
            </button> -->
            <button class="start-com-button" @click="toggleRecording">
                <div :class="!current.isRecording ? 'start-effect' : 'stop-effect'"></div>
            </button>  
            <input
                    v-model="current.message"
                    type="textarea"
                    placeholder="Message"
                    rows="1"
                    class="message-area"
                />
            <button class="player-button" @click="sendTranslateMessage()">
                <span><van-icon name="share" size="30"/></span>
            </button>
        </div>
        
    </div>
  </template>
  
<script>
import { reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { textTranslate, getWebsocketClients, sendMessage } from "@/js/service/api";
import { showToast } from "vant";
export default {
    name: "VoiceCommunicationTwoDevices",
    setup() {
        const store = useStore();
        const { t } = useI18n()
        const connection = reactive({
            source :{id: 1, name: 'P1', language: "vi"},
            target :{id: 2, name: 'P2', language: "en"},
            // roomId: ''
        })
        const current = reactive({
            languageList: store.getters.supportedLanguages.map(item => ({text: item.displayName, value: item.languageCode })),
            speaker: '',
            recording: null,
            isRecording: false,
            transcript: "",
            history: store.getters.websocketHistory,
            showCenter:true,
            step: 1,
            username: store.getters.username,
            connectionList: [],
            message: ''
        })

        onMounted(() => {
            init()
        })
        const init = async () => {
            if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
                alert("Trình duyệt không hỗ trợ Speech Recognition!");
                return;
            }
        }

        // const getOtherPerson = (speaker) => {
        //     return Object.values(connection).find(person => person.id !== speaker.id);
        // };

        const createRecording = (speaker) => {
            
            if(current.isRecording) {
                current.recording.stop()
                return
            }

            if(!current.recording){
                current.recording = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                current.recording.lang = speaker.language;
                current.recording.continuous = true;
                current.recording.interimResults = false;

                current.recording.onresult = (event) => {
                    current.transcript = event.results[event.results.length - 1][0].transcript;
                    let text = event.results[event.results.length - 1][0].transcript;
                    translate(text)
                    
                };

                current.recording.onend = () => {
                    console.log("END RECODING !!!");
                    current.isRecording = false
                };

                current.recording.onstart = () => {
                    console.log("START RECODING !!!");
                    current.isRecording = true
                };
            }

            current.recording.start();
        }

        const decodeHTMLEntities = (text) => {
            const doc = new DOMParser().parseFromString(text, "text/html");
            return doc.documentElement.textContent;
        }

        const setWebsocketHistory = (transcript) => {
            store.dispatch("setWebsocketHistory", transcript).then(
                                () => {
                                    current.history = store.getters.websocketHistory;
                                }
                            )
        }

        const translate = (text) => {
            let lang = {
                sourceLang: connection.source.language, 
                targetLang: connection.target.language
            }
            
            textTranslate({text , ...lang}).then(
                    res => {
                        if(res.status == 200){
                            let transcript = {
                                date: new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 16).replace("T", " "),
                                from: connection.source.name,
                                to: connection.target.name,
                                sourceText: text,
                                targetText: decodeHTMLEntities(res.data.translations[0].translatedText),
                                ...lang
                            }
                            sendMessage(transcript)
                            setWebsocketHistory(transcript)
                        }
                    }
                )
                .catch((err) => console.log(err));
        }
        const speakText = (item, isSource) => {
            
            let text = isSource ? item.sourceText : item.targetText;
            if (text.trim() === '') return;
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = isSource ? item.sourceLang : item.targetLang;

            utterance.rate = 1;      // Tốc độ bình thường
            utterance.pitch = 1;     // Cao độ bình thường
            utterance.volume = 1;    // Âm lượng đầy đủ

            speechSynthesis.speak(utterance);
        };

        const toggleRecording = () => {
            createRecording(connection.source)
        }
        
        const onSubmit = async () => {
            let connectionList = await getWebsocketClients()
            current.connectionList = connectionList
            if(!connectionList.some(item => item.username == current.username)){
                store.dispatch('updateName', current.username)
                openWebsocket()
                current.step = 2;
            } else {
                showToast("Username already exists !!")
            }
           
        };

        const openWebsocket = () => {
            const wsUrl = `ws://localhost:9901/websocket/${current.username}`;
            const socket = new WebSocket(wsUrl);
            socket.onopen = function(e) {
                console.log(e);
            };

            socket.onmessage = function(event) {
                const data = JSON.parse(event.data)
                console.log(JSON.parse(event.data));
                let transcript = {
                    ...data.data,
                    from: data.uid,
                    to: data.sendto,
                }
                setWebsocketHistory(transcript)
            };

            socket.onerror = function(event) {
                console.log("Lỗi WebSocket: " + event);
            };

            socket.onclose = function() {
                console.log("Kết nối WebSocket đã đóng.");
            };
        }
        const selectConnection = (item) => {
            connection.source.name = current.username;
            connection.target.name = item.username;
            current.showCenter = false        
        }

        const reloadConnectionList = async () => {
            let list = await getWebsocketClients()
            current.connectionList = list.filter(item => item.username != current.username)
        }

        const sendTranslateMessage = () => {
            translate(current.message)
            current.message = ""
        }

        return { 
            t, 
            current,
            translate,
            store,
            speakText,

            toggleRecording,
            // translateVoice,
            onSubmit,

            selectConnection,
            reloadConnectionList,
            connection,
            sendTranslateMessage
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
.connection-dialog{
    width: 90%;
    display: flex;
    padding: 30px;
    justify-content: center;
}
.first-step-dialog{
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 20px;
}
.second-step-dialog{
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 20px;
}
.connection-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
}
.connection-item{
    padding: 10px;
    border-radius: 8px;
    border: none;
    box-shadow: 5px 3px 17px -9px rgba(0,0,0,0.75);
}
.user-connection{
    padding: 0 25px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}
.controller-group{
    display: flex;
    padding: 15px;
    justify-content: space-between;
    column-gap: 10px;
}
.message-area{
    flex: 1;
    border: 1px solid black;
    border-radius: 8px;
}
</style>
  