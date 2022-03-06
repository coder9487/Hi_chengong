import { createStore } from "vuex";
import state from "./module-example/state";

export default createStore({
  state: {
    Forward: false,
    Right: false,
    Left: false,
    Lookup: false,
    Lookdown: false,

    MobileMovement: { x: 0, y: 0 },
    MobileDirection: { hori: 0, vert: 0 },
    ///
    marketPercentage: 1,
    marketTablePercentage: 1,
    marketLoaded: false,
    questionMarketDisplay: false,
    questionMarketTableDisplay: false,
    poleDirection: { x: 0, y: 0 },
    marketDisplay: [{ id: "None", display: false }],
    FoodDisplay: [{ id: "0", display: false }],
    pisirianDisplay: [{ id: "None", display: false }],
    swordfishShootToggle: false,
  },
  mutations: {
    ///
    resetmarketChangeState(state) {
      state.marketDisplay = [{ id: "None", display: false }];
    },
    marketChangeState(state, person) {
      state.marketDisplay.splice(0, 1, person);
    },
    FoodChangeState(state, cate) {
      state.FoodDisplay.splice(0, 1, cate);
    },
    pisirianChangeState(state, person) {
      state.pisirianDisplay.splice(0, 1, person);
    },

    ///
    setQuestionMarketDisplayTrue(state) {
      state.questionMarketDisplay = true;
    },
    setQuestionMarketDisplayFalse(state) {
      state.questionMarketDisplay = false;
    },
    setQuestionMarketTableDisplayTrue(state) {
      state.questionMarketTableDisplay = true;
    },
    setQuestionMarketTableDisplayFalse(state) {
      state.questionMarketTableDisplay = false;
    },
    ////////////////////////////////////////  mobile movement

    MobileMovement(state, arr) {
      state.MobileMovement.x = parseInt(arr[0], 10);
      state.MobileMovement.y = parseInt(arr[1], 10);
    },
    MobileDirection(state, arr) {
      state.MobileDirection.hori = parseInt(arr[0], 10);
      state.MobileDirection.vert = parseInt(arr[1], 10);
    },

    //////////////////////////////////
    PoleDirection(state, arr) {
      state.poleDirection.x = parseInt(arr[0], 10) / 150;
      state.poleDirection.y = -parseInt(arr[1], 10) / 200;
    },
    /////////////////////////////////////////
    setMarketLoadedTrue(state) {
      state.marketLoaded = true;
    },
    /////////////////////////////////////////
    swordfishShoot(state) {
      state.swordfishShootToggle = !state.swordfishShootToggle;
    },
  },
  actions: {},
  modules: {},
});
