import axios from "axios";
import {GET_WEBSOCKET_CLIENTS, SEND_MESSAGE } from './endPoint'
export const API_GG_KEY = "AIzaSyBL2f2itaT8fddnFJ4ONhTER2xBfOLl0XQ"
export const PROJECI_ID = "sustained-edge-451302-b1"
export const GG_TRANSLATE_URL = "https://translate.googleapis.com/v3"
export const LOCAL_HOST = "http://localhost:9901"
export const TOKEN = "ya29.c.c0ASRK0Ga3ojho-CsyoSsuFFOFt_dBmE9nH5Awii7QxsZ5YlbnwhE79_zVB5fZNfLFihJ7pvh36-g2a8KR7H0nimeBPy1n58gag5HEMr3C5UTVOFyoiGpPtGMjB7tq5YNbBk2xMad8LIaxE3R3gii9ra3POk7xv1D36ElPqtBJ4hcohD0qLAEj9ER0lSW8bt-ELmAq4wTRjNM3b2BQApg_YAzslNqEGT26tAkWQMIgLgmsa9IEKZ9d1F0c92YcZmm4zFjKurGzda7qug6YAnx0CBtscxUC1o9v19K_50XnDb2ZWqV5rQQLgBKw_c0Iw8dJHnml7j9rsj9yUAbYQjAhlDtkbWazq8ij3NMfbHnKjVVb_NYB1oKZZekH384AxvqbaFQBsYQq_p-qoUxaxOj8tp-3044api15g1Fpk9Ba3pzJdSmnXl1_1MthoBOblbWWqj5gFI_UFdtSMt_2muv1rUBt0nukxmxbiIVgJ4xBr5w5sYYppO8mWMs24Xnnjnp38dF8p7q6eYczXtSY-yzsmapd_FgBQcezaouQMowyiO2wsRYwu98ORp_UI3sneYdz-7yjJ7Ojrn4lqedaJ9d7lg4FWsVm6MkbjSSczFIheV46Jyxcewoe-eUt5oX6XFvOnXQW1BdIqZZYU52dwa2pv8W3QYcr9BraOR0jIeo7_BepMavWxhrxdSxhRMy44qfYe6qvxcnSS2wrxgW-gZyq6S675n9cXSuxbtm-QwOk5mIo2VeQzv8uibd0wv0ibRy-rIqRyOg0wneXM_Fn9vQp6YOVWj589Bjfhfe9BOuBF5xFxsJI6J_7jF0lYyl5g7d_v94Xzr9xwVOj4ay73XcBMqvbJejykW2ahtMjo3xeYRsW9lmVzntlpZbgY9UtMlW38ab-lqSgxZUBW61qVS53q7gwQVVm0ehgIcWrYRxBFUz46o8fwumcXS_zWB50l9-qQnRfRJ23dae3Mfiq_vq2R2XrZu5Wkqtu2IWukkU5dS9sQOpQ8OmvBs9"
export async function textTranslate(params){
    const {text, sourceLang, targetLang} = params
    const response = await axios.post(`${GG_TRANSLATE_URL}/projects/${PROJECI_ID}:translateText`, 
      {
        contents: text, 
        targetLanguageCode: targetLang, 
        sourceLanguageCode: sourceLang, 
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
      return response
}

export async function getSupportedLanguages(target){
      const response = await axios.get(`${GG_TRANSLATE_URL}/projects/${PROJECI_ID}/supportedLanguages`, 
        {
          params: {
            displayLanguageCode: target ?? "vi"
          },
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );
      return response
}

export async function detectLanguage(params) {
    const {text} = params
    const response = await axios.post(`${GG_TRANSLATE_URL}/projects/${PROJECI_ID}:detectLanguage`, 
      {
        content: text, 
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
      return response
}

export async function getWebsocketClients(){
  let connectionList = []
  const response = await axios.get(`${LOCAL_HOST}/${GET_WEBSOCKET_CLIENTS}`);
  if(response.status === 200){
      connectionList = Object.entries(response.data.data).map(([uid, user]) => ({
        uid,
        username: user.userName,
        createTime: user.createTime
    }))
  } else {
      console.log("Error fetching websocket clients")
  }
  return connectionList;
}

export async function sendMessage(params){
  // {from, to, sourceLang, sourceText, targetText, targetLang} = params
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(`${LOCAL_HOST}/${SEND_MESSAGE}?${queryString}`);
  if(response.status === 200){
      console.log(response);
      
  } else {
      console.log("Error fetching websocket clients")
  }
}