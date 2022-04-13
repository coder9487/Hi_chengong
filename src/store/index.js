import { createStore } from "vuex";

const Market = {
  namespaced: true,

  state: () => ({
    marketDisplay: [{ id: "None", display: false }],
    tutorialIndex: 0,
    Fozzy3D: false,
  }),
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    resetmarketChangeState(state) {
      state.marketDisplay = [{ id: "None", display: false }];
    },
    IncreaseTutorialDialog(state) {
      state.tutorialIndex++;
    },
    marketChangeState(state, person) {
      state.marketDisplay.splice(0, 1, person);
    },
  },
  actions: {},
  getters: {},
};

const Swordfish = {
  namespaced:true,
  state: () => ({
    swordfish:0,
    gameEnable:false,

  }),
  mutations: {
    ShootSwordfish(state){
      state.swordfish++;
    },
    ToggleGame(state)
    {
      state.gameEnable = !state.gameEnable;
    }
  },
  actions: {},
  getters:{
    GameEnable: (state) => {
      return state.gameEnable
    }

  }
};

export default createStore({
  modules: {
    Market: Market,
    Swordfish:Swordfish
  },
});

// export default createStore({
//   state: {
//     MobileMovement: { x: 0, y: 0 },
//     MobileDirection: { hori: 0, vert: 0 },
//     ///
//     scene: null,
//     marketPercentage: 1,
//     marketTablePercentage: 1,
//     marketLoaded: false,
//     questionMarketDisplay: false,
//     questionMarketTableDisplay: false,

//     marketDisplay: [{ id: "None", display: false }],
//     tutorialIndex: 0,
//     pisirianDisplay: [{ id: "None", display: false }],

//     swordfishShoottimes: 0,
//     poleDirection: { x: 0, y: 0 },
//     animateEnable: false,
//     Fozzy3D: false,
//   },
//   mutations: {
//     ///
//     setFozzyFram(state, available) {
//       state.Fozzy3D = available;
//     },
//     resetmarketChangeState(state) {
//       state.marketDisplay = [{ id: "None", display: false }];
//     },
//     marketChangeState(state, person) {
//       state.marketDisplay.splice(0, 1, person);
//     },

//     FoodChangeState(state, cate) {
//       state.FoodDisplay.splice(0, 1, cate);
//     },
//     pisirianChangeState(state, person) {
//       state.pisirianDisplay.splice(0, 1, person);
//     },

//     ///
//     IncreaseTutorialDialog(state) {
//       state.tutorialIndex++;
//     },

//     ////////////////////////////////////////  mobile movement

//     MobileMovement(state, arr) {
//       state.MobileMovement.x = parseInt(arr[0], 10);
//       state.MobileMovement.y = parseInt(arr[1], 10);
//     },
//     MobileDirection(state, arr) {
//       state.MobileDirection.hori = parseInt(arr[0], 10);
//       state.MobileDirection.vert = parseInt(arr[1], 10);
//     },

//     //////////////////////////////////
//     PoleDirection(state, arr) {
//       state.poleDirection.x = parseInt(arr[0], 10) / 150;
//       state.poleDirection.y = -parseInt(arr[1], 10) / 200;
//     },
//     /////////////////////////////////////////
//     setMarketLoadedTrue(state) {
//       state.marketLoaded = true;
//     },
//     /////////////////////////////////////////
//     swordfishShootTimes(state) {
//       state.swordfishShoottimes++;
//     },
//   },
//   actions: {},
//   modules: {},
// });
