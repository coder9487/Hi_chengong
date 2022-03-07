<template>
  <div class="loadingPage" v-if="!showingFlag">
    <img class="loadingPage-mask" src="../../public/loading/loading.png" />
    <div class="loadingPage-percentage">
      <b>{{ loading }}</b
      >%
    </div>
    <div class="loadingPage-loading-video">
      <video src="../../public/loading/wave.mp4" autoplay loop></video>
    </div>
  </div>
  <MarketView
    id="MarketView"
    @loadingProgress="loadingProgressPercentage"
    v-if="1"
    v-show="showingFlag"
  ></MarketView>
  <Navigate id="Navigate" v-if="showingFlag"></Navigate>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import MarketView from "../components/market/market.vue";
import Navigate from "../components/market/marketNavgative.vue";

export default defineComponent({
  name: "MarketPage",
  components: {
    MarketView,
    Navigate,
  },
  setup() {




  },
  watch: {
    loading: function () {
      // console.log("loading progress ", this.loading);
      if (this.loading >= 98) {
        setTimeout(() => {
          this.showingFlag = true;



        }, 5000);
      }
    },
  },
  computed: {},
  data() {
    return {
      audio:null,
      loading: ref(0),
      showingFlag: false,
      MobileMoving: reactive({}),
      progressPercent: ref(0),
      showEnable: ref(true),
      DEBUG: 0,
      golbalEvent: { dblclick: false },
    };
  },
  methods: {
    loadingProgressPercentage(val) {
      this.loading = (val * 99).toFixed(2);
    },
    finishLoading() {},
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
.loadingPage {
  width: 100vw;
  height: 100vh;
  // background-color: cadetblue;
  &-mask {
    // opacity: 0.3;
    position: fixed;
    width: 100%;
    z-index: 10;
    height: auto;
    top: -10%;
  }
  &-percentage {
    z-index: 20;
    position: fixed;
    font-size: 50px;
    color: darkorange;
    bottom: 10%;
    left: 40%;
    @media screen and (max-device-width: 768px) {
      bottom: 10%;
      left: 40%;
    }
  }
  &-loading-video {
    position: absolute;
    left: 20%;
    z-index: 8;
  }
}
#MarketView {
  position: fixed;
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
