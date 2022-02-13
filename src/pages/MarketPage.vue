<template id="body">
  <div id="loadingGroup">
    <img src="../../public/loading/loadingPhoto_1.png" alt="" />
    <div id="loadingProgressText">
      <h3>
        <b> {{progressPercent}}% </b>
      </h3>
    </div>
    <div id="waveVideo">
      <video autoplay loop>
        <source src="../../public/loading/wave.mp4" type="video/mp4" />
      </video>
    </div>
  </div>

  <div class="fullViewPage">
    <MarketView
      id="MarketView"
      @loadingProgress="getLoadingProgress"
      v-if="showEnable"
    ></MarketView>
    <Navigate id="Navigate" v-if="showEnable"></Navigate>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import "../components/market/loading";
import MarketView from "../components/market/market.vue";
import Navigate from "../components/market/navigate.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MarketPage",
  components: {
    MarketView: MarketView,
    Navigate: Navigate,
  },
  setup() {},
  watch: {},
  data() {
    return {
      progressPercent: ref(0),
      showEnable: ref(true),
      DEBUG: 0,
    };
  },
  computed: {},
  methods: {
    getLoadingProgress(val) {
      let loadedProgress = ((val / 111356897) * 100).toFixed(2);
      this.progressPercent = loadedProgress;
      let loadingWave = document.getElementById("waveVideo");
      loadingWave.style.top = `${-800 - loadedProgress * 2}px`;
      // console.log(`Loading px ${-800 - loadedProgress * 2}px`);
      // alert(document.getElementById("waveVideo").style.top);

      if (val == 111356897 * (this.DEBUG+1)) {
        let element = document.getElementsByClassName("fullViewPage");
        element[0].style.opacity = 1;
        let MarketView_element = document.getElementById("MarketView");
        MarketView_element.style.opacity = 1;
        let loading = document.getElementById("loadingGroup");
        loading.style.opacity = 0;
      }
    },
  },
});
</script>
<style lang="scss">
#MarketView {
  z-index: 2;
  position: relative;
  opacity: 0.1;
}
#Navigate {
}
.fullViewPage {
  position: relative;
  opacity: 0;
}
#loadingGroup {
  position: flex;
  display: blocks;
}
#loadingGroup #waveVideo {
  position: relative;
  margin-left: 30%;
  top: -800px;
  width: 10vw;
  z-index: 9;
}
#loadingGroup img {
  position: relative;
  width: 100vw;
  z-index: 10;
  opacity: 1;
}
#loadingGroup #loadingProgressText {
  position: relative;
  z-index: 11;
  top: -500px;
  margin-left: 45.5vw;
  color:skyblue;
  opacity: 1;
}
#body {
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
