

  import axios from "axios";

export const API_GG_KEY = "AIzaSyBL2f2itaT8fddnFJ4ONhTER2xBfOLl0XQ"
export const PROJECI_ID = "sustained-edge-451302-b1"
export const GG_TRANSLATE_URL = "https://translate.googleapis.com/v3"
export const TOKEN = "ya29.c.c0ASRK0GY4hlzLUN1yV-SNoStoC8E780LDZ1bN9MkBJFOlIedxD06nPdA-7g0ssjiryV66NfecI5XiCFZKfCylWtXXwUsUMuIYNoJMzzVxPvWGaFsTP4Vo_bz857qy1qbYoK4mPp0n5a8q6yAxAzEw5DnollkE7fUv8ZoRghu4HpE5NCwzIVGzpZlSfnVnFVMxkCX6nX8gid_s9Qch2RLoabl05Iu6RSqHpFy_lDnEVt2TkO5We8S0krV0uqpjqBWk2na0gv5Gl-ABE0uOXj-_oGHd_DE449gTFzhIy4jTGVonxK3HDeF8B7hk029CgEloDkWo7ALZx5ZJXCSio0s3nZeqSw83iodBU9L3xqfbaUdLR1iwbvA3eE-AE385Aj1xUhZeX_S_7lwloeflJuRiZe2aZ54u5vOdkj9481dy0dvjxcsM0n3vuYZXQh-aR7ctgBpV_cgbvIa7srk64jzQl7na4_laI3hbkM77tycm4jjpM2ynyI3nWR0buXVhc5yyz66mj6yO2y0rS7_ro3ySY8-xR5fZzroageXvI7cxfwIRBpM3yM5ByIF14oir4uBpBcYnX1IXYeI7a3F1aR8b9zo4dRtsXySByzBZ4FlRjSfI3JqFulJlUwha0vg9Iga0B86WJo4Xt2r8ds5_4Fyo4tuxb1ev1Ov_-8l_XvMq13gbx2wkaWOgeYs7tZ6Y1maBSWvskX_d8rpuzUnFfqXgUe11OZ68QYs4Y0VRf5F8Yqu2JwuiVMBtmUJfjq5o3qfFXgqzc14W6ugXbZkny4z6c7UugUoUYBOVviv_07OblZvnsgyFjY73X7X_ue305dp-VkUw0nZV-hSyXjjx8YUQWdeMU8maaSa-Isd5O-_0suu_f8u2jt-lQ9puq5paFhiZXht-eqSwXtuxB0Urxjhh6e4hxfXvdkF1ca6VrgFY6o6p4Qqks6j8xezb9VXlizYZtbRyupxy-tf5cVURlygQwQZwr3uze-8h4QpJdvyes8pQfFn-B8Is5d-"
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