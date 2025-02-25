import state from "./states";
import { getters } from "./getters";
import { mutations } from "./mutation";
import { actions } from "./actions";
import { createStore } from "vuex";

const store = createStore({
  state,
  getters,
  mutations,
  actions,
});
export default store;
