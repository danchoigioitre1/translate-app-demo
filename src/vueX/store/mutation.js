export const mutations = {
    setUsername(state, username) {
      state.username = username;
    },

    setSupportedLanguages(state, list){
      state.supportedLanguages = list
    },

    setOneSidedTranslationHistory(state, payload){
      state.oneSidedTranslationHistory = [...state.oneSidedTranslationHistory, payload]
    },

    setCommunicationHistory(state, payload){
      state.communicationHistory = [...state.communicationHistory, payload]
    },

    setWebsocketHistory(state, payload){
      state.websocketHistory = [...state.websocketHistory, payload]
    },
}
  