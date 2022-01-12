import { createStore } from 'vuex'

export default createStore({
  state: {

    Forward: false,
    Right: false,
    Left: false,
    Lookup: false,
    Lookdown: false,
    display1: false,
    display2: false,
    display3: false,
    toMarketTableSceneIndex: false,
    markedtOnProgress: false,
  },
  mutations: {
////////////////////////////////////////  mobile movement
    setForwardTrue(state){  // Go
      state.Forward = true
    },
    setForwardFalse(state){ // stop Go
      state.Forward = false
    },
    setRotationRightTrue(state){ // turn right
      state.Right = true
    },
    setRotationRightFalse(state){ // stop turn right
      state.Right = false
    },
    setRotationLeftTrue(state){ // turn left
      state.Left = true
    },
    setRotationLeftFalse(state){ // stop turn left
      state.Left = false
    },
    setLookupTrue(state){ // look up 
      state.Lookup = true
    },
    setLookupFalse(state){ // stop look up
      state.Lookup = false
    },
    setLookdownTrue(state){ // look down 
      state.Lookdown = true
    },
    setLookdownFalse(state){ // stop look down
      state.Lookdown = false
    },
///////////////////////////////////////////
    setFalse1(state) {
      state.display1 = false
    },
    setTrue1(state){
      state.display1 = true
    },
    setFalse2(state){
      state.display2 = false
    },
    setTrue2(state){
      state.display2 = false
    },
/////////////////////////////////////////
    settoMarketTableSceneIndexTrue(state){
      state.toMarketTableSceneIndex = true
    },
/////////////////////////////////////////
    setMarketLoadedTrue(state){
      state.markedtOnProgress = true
    },
  },
  actions: {
  },
  modules: {
  }
})
