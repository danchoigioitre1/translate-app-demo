import { 
  getSupportedLanguages,
} from "@/js/service/api";

export const actions = {
    updateName({ commit }, name) {
      commit("setUsername", name);
    },
    
    getSupportedLanguagesList({ commit }, target){  
      getSupportedLanguages(target).then(
        res => {
          if(res.status == 200){
            commit("setSupportedLanguages", res.data.languages)
          }
        }
      )
      .catch((err) => console.log(err));
    },

    setOneSidedTranslationHistory({commit}, params){
      commit("setOneSidedTranslationHistory", params)
    },

    setCommunicationHistory({commit}, params){
      commit("setCommunicationHistory", params)
    },

    setWebsocketHistory({commit}, params){
      commit("setWebsocketHistory", params)
    },
}