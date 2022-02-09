import { createStore } from 'vuex'

export default createStore({
  state: {

    Forward: false,
    Right: false,
    Left: false,
    Lookup: false,
    Lookdown: false,
    ///
    marketPercentage: 1,
    marketTablePercentage: 1,
    marketLoaded: false,
    questionMarketDisplay: false,
    questionMarketTableDisplay: false,
    marketDisplay: [
      { id: 'None', display: false,}
    ],
    FoodDisplay: [
      { id: '0', display: false,}
    ]
  },
  mutations: {
    ///
    marketChangeState(state, person ) {
      state.marketDisplay.splice(0,1,person)
    },
    FoodChangeState(state, cate ) {
      state.FoodDisplay.splice(0,1,cate)
    },
    ///
    setQuestionMarketDisplayTrue(state){
      state.questionMarketDisplay = true
    },
    setQuestionMarketDisplayFalse(state){
      state.questionMarketDisplay = false
    },
    setQuestionMarketTableDisplayTrue(state){
      state.questionMarketTableDisplay = true
    },
    setQuestionMarketTableDisplayFalse(state){
      state.questionMarketTableDisplay = false
    },
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
    //////////////////////////////////
    setDisplayFishMonger1False(state) {
      state.displayfishmonger1 = false
    },
    setDisplayFishMonger2False(state){
      state.displayfishmonger2 = false
    },
    setDisplayFishMonger3False(state){
      state.displayfishmonger3 = false
    },
    setDisplayFishMonger4False(state){
      state.displayfishmonger4 = false
    },
/////////////////////////////////////////
    setMarketLoadedTrue(state){
      state.marketLoaded = true
    },
/////////////////////////////////////////
    marketOnProgressCount(state){
      state.marketPercentage ++ 
    },
    marketOnProgressReset(state){
      state.marketPercentage = 1
    },
    marketTableOnProgressCount(state){
      state.marketTablePercentage ++ 
    },
    marketTableOnProgressReset(state){
      state.marketTablePercentage = 1   
    },
  },
  actions: {
  },
  modules: {
  }
})
