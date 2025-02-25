import { 
  getSupportedLanguages,
} from "@/js/service/api";

export const actions = {
    updateName({ commit }) {
      commit("setName", "Nguyen viet anh");
    },
    
    getSupportedLanguagesList({ commit }, target){  
      getSupportedLanguages(target).then(
        res => {
          if(res.status == 200){
            console.log(res);
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
}