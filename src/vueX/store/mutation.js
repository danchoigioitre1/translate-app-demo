export const mutations = {
    setName(state, name) {
      state.name = name;
    },

    setSupportedLanguages(state, list){
      state.supportedLanguages = list
    },

    setOneSidedTranslationHistory(state, payload){
      state.oneSidedTranslationHistory = [...state.oneSidedTranslationHistory, payload]
    },

    setCommunicationHistory(state, payload){
      state.communicationHistory = [...state.communicationHistory, payload]
    }
}
  