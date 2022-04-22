import { createStore } from "vuex";
import state from "./module-example/state";

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
  namespaced: true,
  state: () => ({
    swordfish: 0,
    gameEnable: false,
    Fozzy3D: false,
  }),
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    ShootSwordfish(state) {
      state.swordfish++;
    },
    ToggleGame(state) {
      state.gameEnable = !state.gameEnable;
    },
    clearResult(state) {
      state.swordfish = 0;
    },
  },
  actions: {},
  getters: {
    GameEnable: (state) => {
      return state.gameEnable;
    },
  },
};

const DiningTable = {
  namespaced: true,
  state: () => ({
    dish: "",
    lightboxEnable: false,
    akonEnable: false,
    Fozzy3D: false,
  }),
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    SelectDish(state, dish) {
      state.dish = dish;
    },
    TogglelightboxEnable() {
      state.lightboxEnable = !state.lightboxEnable;
    },
    resetDish(state) {
      state.dish = "";
    },
    toggleAkon(state, enable) {
      state.akonEnable = enable;
    },
  },
  actions: {},
  getters: {
    getDish: (state) => state.dish,
  },
};

const Pisirian = {
  namespaced: true,
  state: () => ({
    toggledPasserby: "",
    end: false,
    Fozzy3D: false,
  }),
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    setTogglePasserby(state, sequen) {
      state.toggledPasserby = sequen;
    },
    toEnd(state) {
      state.end = true;
    },
  },
  actions: {},
  getters: {},
};

export default createStore({
  state: {
    Fozzy3D: false,
    Forward:false,
    CameraDirect: { x: 0, y: 0 },
  },
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    setLookDir(state, objects) {
      state.CameraDirect.x = objects.x;
      state.CameraDirect.y = objects.y;
    },
    setForward(state,statment){
      state.Forward = statment
    }
  },
  modules: {
    Market: Market,
    Swordfish: Swordfish,
    DiningTable: DiningTable,
    Pisirian: Pisirian,
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
