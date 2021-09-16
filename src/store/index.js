import { store } from "quasar/wrappers";
import { createStore } from "vuex";

export default store(function () {
  const localHistoryData = JSON.parse(localStorage.getItem("statistics"));
  const Store = createStore({
    state: {
      initialState: [],
      userHistory: localHistoryData || [],
    },
    actions: {
      async getDataFromDataBase({ commit }) {
        let idxs = [765, 6610, 654, 667, 876];
        idxs.forEach((id) => {
          fetch(`http://jservice.io/api/category?id=${id}`)
            .then((res) => res.json())
            .then((result) => {
              commit("changeState", result);
            });
        });
      },
      addStatistics({ commit }, obj) {
        commit("addNewGameResult", obj);
      },
      clearStatistics({ commit }) {
        commit("clearMyStatistic");
      },
      clearLocalData({ commit }) {
        commit("clearData");
      },
      findWrongElem({ commit }, argList) {
        commit("newState", argList);
      },
    },
    
    getters: {
      getState(state) {
        return state.initialState;
      },
      getUserHistory(state) {
        return state.userHistory;
      },
    },
    mutations: {
      changeState(state, categories) {
        state.initialState.push(categories);
      },
      addNewGameResult(state, el) {
        state.userHistory.unshift(el);
      },
      clearData(state) {
        state.initialState = [];
      },
      clearMyStatistic(state) {
        state.userHistory = [];
      },
      newState(state, argList) {
        state.initialState[argList[0]].clues[argList[1]].success = true
      },
    },
    strict: process.env.DEBUGGING,
  });

  return Store;
});
