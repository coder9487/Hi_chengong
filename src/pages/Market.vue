<template>
  <div class="loadingPage" v-if="!showingFlag">
    <img class="loadingPage-mask" src="../../public/loading/loading.png" />
    <div class="loadingPage-loading-video" id="loading-video">
      <video src="../../public/loading/wave.mp4" autoplay muted playsinline loop style="display: inline;"></video>
    </div>
  </div>

  <Market3D
    id="marketTest"
    @loadingProgress="loadingProgressPercentage"
    @scene="sceneRecieve"
    v-if="1"
    v-show="showingFlag"
  ></Market3D>
  <Market2D id="Navigate" v-if="showingFlag"></Market2D>

</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Market3D from "../components/Market/Market3D.vue";
import Market2D from "../components/Market/Market2D.vue";

export default defineComponent({
  name: "MarketPage",
  components: {
    Market3D,
    Market2D,
  },
  setup() {},
  mounted() {

    let vid = document.getElementById("loading-video");
    vid.canplay = function () {
      vid.style.display = "show";
    };

  },

  watch: {
    loading: function () {
      // console.log("loading progress ", this.loading);
      let loadingWave = document.getElementById("loading-video");
      loadingWave.style.bottom = this.loading * 0.2 + "%";
      if (this.loading >= 98 * this.DEBUG) {
        setTimeout(() => {
          this.showingFlag = true;
        }, 5000);
      }
    },
    sceneObject: function(){

    }
  },
  computed: {},
  data() {
    return {
      audio: null,
      sceneObject:null,
      loading: ref(0),
      showingFlag: false,
      MobileMoving: reactive({}),
      progressPercent: ref(0),
      showEnable: ref(true),
      DEBUG: 1,
      golbalEvent: { dblclick: false },
    };
  },
  methods: {

    loadingProgressPercentage(val) {
      this.loading = (val * 99).toFixed(2);
    },
    sceneRecieve(val) {
      this.sceneObject = val;
    },
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
    top: -5vh;
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
    display: hide;
    position: absolute;
    left: 15%;
    bottom: 0%;
    @media screen and (max-device-width: 768px) {
      bottom: -100%;
    }
    z-index: 8;
  }
}
#marketTest {
  position: fixed;
  background-color: #35909c;
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
