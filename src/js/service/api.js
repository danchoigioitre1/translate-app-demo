import axios from "axios";
import {GET_WEBSOCKET_CLIENTS, SEND_MESSAGE } from './endPoint'
export const API_GG_KEY = "AIzaSyBL2f2itaT8fddnFJ4ONhTER2xBfOLl0XQ"
export const PROJECI_ID = "sustained-edge-451302-b1"
export const GG_TRANSLATE_URL = "https://translate.googleapis.com/v3"
export const LOCAL_HOST = "http://localhost:9901"
export const TOKEN = "ya29.c.c0ASRK0Gbw8DOLRkOikSikH859JLJPCtw2eg6bukvUSI3eZB3GTbMxPOj6nlRYZn_eipnT1j-SiTu4ej8Ii4r70Y5ndf9hTEBhh0-3TNwE_yW_M3n3O5shhdJue-dfhWhY5N4TyQhmJI23IOSu3YElyKKjisW1Kdtub9vBCuy1LTA2wPDBpx3saLSLz-gsiyHGtIec-Z89nZtzOOysn4yFxZ1UWNsEhjcCCTvqMFqw2YIBTcoMzHNhhrUeYdinQvqAxAcI6SLy9pbrJttsP1R5uOEVB_uxqITwproomAGEE1xEoPnYjkbZrh9xvbelnCwGjoz2ASiyr5uBHsRs3aJFvlmYFduafFJeEmzFQJYsSonhietFdPT3Z0gP_wT387DQdMj8Z2flFmiF00ndjRvtu2OyFXgWJ3I3--of4Z1Q2b0mBzxpU3euSibjIXpodSeJFR-sWlmq8wd31evOweZFickm8u16ZyYfSVccXowo7p18Vshqk8aUr4p2brFb9nkc5iSF7h0Sk1WI5ZVSpnRyu6R-rzfl2MBc7q0Q7pkO2fRsYafnI3MOMgw_nUBog14g7_zgl9IY6UryjlWVp9rS-nUOBowfftXYqWfxi-2k1gS9zxy7bXlJZXFm3nzz3JJoUcmgB7vix3B_pI3agpwB5fRqXWdjg5mWz_19pQnz0iy8g2oRgj3falZvRkjS6s7Fj5QzkvXgxWjUz7hIXY_6Yo4fr1UsV20QXZ5WdarZvd44vJte6Je7ytl6dt9VY8ZvQtUx-spub16k4uWwRzwwJJ9yM6knS7ilYedFdfgn61X69-YFmBqjdI-m-Wn78cJ0mYnf0zxcS6O2hOS8I3qsjOxO8e5MQ48Rx7sUg0c3g-_iOY0Os25seYuiQkpYO2XguJa26J_eavJF1qVaYkf72kuo4RVo8f101eloJvaJtgZgwMRrchcyYFv-Mt4fwf_oeY2aYlt09s2py_ba68JeQq3bvJoIU6M0eBgyOk8tbBqFbQXmp8mfvrW"
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