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
    scene:null,
    marketPercentage: 1,
    marketTablePercentage: 1,
    marketLoaded: false,
    questionMarketDisplay: false,
    questionMarketTableDisplay: false,
    poleDirection: { x: 0, y: 0 },
    marketDisplay: [{ id: "None", display: false }],
    FoodDisplay: [{ id: "0", display: false }],
    pisirianDisplay: [{ id: "None", display: false }],
    ThreeInterpreter:[{command:"",result:""}],
    swordfishShoottimes: 0,
    tutorialIndex:0,
    animateEnable:false,
    Fozzy3D:false,
  },
  mutations: {

    setScene(state,sceneVal)
    {
        state.scene = sceneVal
    },

    setCommand(state,commandArr)
    {
      state.ThreeInterpreter.command = commandArr[0]
    },
    ///
    setFozzyFram(state,available){
        state.Fozzy3D = available
    },
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
    IncreaseTutorialDialog(state) {
      state.tutorialIndex++;
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
    swordfishShootTimes(state) {
      state.swordfishShoottimes ++;
    },
    controlAnimateTrue(state)
    {
      state.animateEnable = true;
    },
    controlAnimateFalse(state)
    {
      state.animateEnable = false;
    }
  },
  actions: {},
  modules: {},
});
