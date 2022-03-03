<template>
  <Loading id="Loading" v-if="0"></Loading>
  <MarketView id="MarketView" v-if="1"></MarketView>
  <Navigate id="Navigate"  v-if="1"></Navigate>
  <div class="controlPan" v-if="0">

  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import MarketView from "../components/market/market.vue";
import Navigate from "../components/market/marketNavgative.vue";
import Loading from "../components/loadingView.vue";

export default defineComponent({
  name: "MarketPage",
  components: {
    MarketView,
    Navigate,
    Loading,
  },
  setup() {

  },
  watch: {},
  data() {
    return {
       MobileMoving : reactive({}),
      progressPercent: ref(0),
      showEnable: ref(true),
      DEBUG: 0,
      golbalEvent: { dblclick: false },
    };
  },
  computed: {},
  methods: {
    //111356897
  },
});
</script>
<style lang="scss">
@media screen and (max-device-width: 768px) {
  .controlPan {
    z-index: 100;
    position: absolute;
    width: 100vw;
    height: 100vh;
    &-directionPan {
      height: 100vh;
      width: 20vw;
      position: absolute;
      left: 0;
      background-color: goldenrod;
    }
    &-speedPan {
      height: 100vh;
      width: 20vw;
      position: absolute;
      background-color: goldenrod;
      right: 0;
    }
  }
}

#MarketView {
  position: fixed;
}
#Loading {
  position: absolute;
  // background-color:orange;
  z-index: 40;
  // opacity: 0.5;
  width: 100vw;
  height: 100vh;
}
#Navigate {
  position: absolute;
  // background-color: chartreuse;
  // opacity: 0.3;
  z-index: 100;
  width: 100vw;
  height: 100vh;
}
</style>
