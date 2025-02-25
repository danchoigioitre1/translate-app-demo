

  import axios from "axios";

export const API_GG_KEY = "AIzaSyBL2f2itaT8fddnFJ4ONhTER2xBfOLl0XQ"
export const PROJECI_ID = "sustained-edge-451302-b1"
export const GG_TRANSLATE_URL = "https://translate.googleapis.com/v3"
export const TOKEN = "ya29.c.c0ASRK0GYSTN4-tVOB78xSoGLqL5GDEhdYrHa41Ss9F5WafkAlGwxWm1eemwEwUMXEl7jy_ZCvCd1qDlzEREOyBUcvjwdZ-8f5w0N0k0PSs9EhFwpcowqMleQAcX92Rvr9lxqA8lesSVlFTrdDxRh6cPKYSMHvMEYBgcUk6XrK6BkvrBsCT67_QtaHnOXmPNl9IZq38MdipEnSFShIMdjfRJ-YHve1g9QjcquC2Xe55mHzZOkKfMzHaC6AfRlSDGsRFeNTNozSzwpt3U5bSeZTSRftDElKYm0-dpGbIX-DVg2BA3DmTOD8NDzPUvIDQ19Qe0pBGATbeSN2OkbrvlViiqQ__KO8H9exbCNHt9XrpJ48UoW5eQ9iWEkrE385AVmkRru8QgJyuSFvjhdhUXfhpVjd9y0Viwk14nSiwbVgYJkb-cMkMmuFasww5ldd9dYe7ZcbIduBVBWetljff9W94vpRkZ00FSVs6pdkUWOVnJ2W5Zug_o1acrOMB5dzrzzacW_jIFIUOM3FJgdmZMVO9mO8JXbj1dccj_lhJSgMmJ12MMxRmikW51tee605xbg8dZ5-17hjfU7Rxx7f2obiMfyqVa0jg_zvrOh6yJ7-dZ76_fmRp6sWioVScbZlakSMVRi1qtYZVS1eQioVshxVhgsfY-w4sFh4l3uS1SUpF1_8oJ92IrMktcWn9uvm2tRFbUldkowVr47yIIfjvenVu5ZzJSa3d3dV8nzaWQRyJQuic7r3_JWsqy5zInrbMF760resS5bY1tsd1ZMMqrSizk03ZSRkRFaIcSXYwo7qZy4tV_b0uagjg8JJ6Rn-whImouWosxMXz17g77Y_8yWF00rY06JacqOVWaWkztWrpY8h1Fe37Zco1oJFtXv3uO_8M4V4Uczd53evfilqQUkiM8Y1eW68Y95Som22YvByeX0wJfrYp_Rk34MWMwe4Xaph437z9Wjw3vF1_pvM9yqkefR_O0sjJel29qrj8-rjerF2_rsU96VX-B-"
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