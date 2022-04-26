<template>
  <div class="loadingPage" v-if="!showingFlag">
    <img class="loadingPage-mask" src="../../public/loading/loading.png" />
    <div class="loadingPage-loading-video" id="loading-video">
      <video
        src="../../public/loading/wave.mp4"
        autoplay
        muted
        playsinline
        loop
        style="display: inline"
      ></video>
    </div>
  </div>
  <div v-if="IS_MOBILE && !DEBUG" class="mobile-text">
    <div>
      手機版尚未完成系統測試，請使用電腦版以獲得最佳體驗
    </div>
    <div >
      Mobile and VR version are not supported now, please try Hi Chenggong on desktop.
    </div>
  </div>
  <div id="colorSlide">
    <Market3D
      id="market3D"
      @loadingProgress="loadingProgressPercentage"
      @scene="sceneRecieve"
      v-if="!IS_MOBILE "
      v-show="showingFlag"
    ></Market3D>
    <Market3DMobileVue
      id="market3D"
      @loadingProgress="loadingProgressPercentage"
      @scene="sceneRecieve"
      v-if="IS_MOBILE"
      v-show="showingFlag"
    ></Market3DMobileVue>
    <Market2D
      id="Market2D"
      v-if="showingFlag && 1"
      @lightBoxEffect="lightBoxEffect"
    ></Market2D>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Market3D from "src/components/Market/Market3D.vue";
import Market2D from "src/components/Market/Market2D.vue";
import Market3DMobileVue from "src/components/Market/Market3DMobile.vue";
import gsap from "gsap";

export default defineComponent({
  name: "SwordfishPage",
  components: {
    Market3D,
    Market2D,
    Market3DMobileVue,
  },
  setup() {
    let DEBUG  = true;
    let IS_MOBILE = ref(
        /Android|webOS|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        )
      );
      if(DEBUG)
      IS_MOBILE = false;
    return {
      IS_MOBILE,
    };
  },
  mounted() {
    this.IS_MOBILE = this.detectPaltform();
    let vid = document.getElementById("loading-video");
    vid.canplay = function () {
      vid.style.display = "show";
    };
    // this.fullScreen("market3D");
  },

  watch: {
    lightBoxEffectMode: function () {
      switch (this.lightBoxEffectMode) {
        case true:
          gsap.fromTo(
            "#market3D",
            { webkitFilter: "brightness(1)", filter: "brightness(1)" },
            {
              webkitFilter: "brightness(0.6)",
              filter: "brightness(0.6)",
              duration: 1,
            }
          );
          break;
        case false:
          gsap.fromTo(
            "#market3D",
            { webkitFilter: "brightness(0.6)", filter: "brightness(0.6)" },
            {
              webkitFilter: "brightness(1)",
              filter: "brightness(1)",
              duration: 1,
            }
          );
          break;
      }
    },
    loading: function () {
      // console.log("loading progress ", this.loading);
      let loadingWave = document.getElementById("loading-video");
      loadingWave.style.bottom = this.loading * 0.2 + "%";
      if (this.loading >= 50 * this.DEBUG) {
        setTimeout(() => {
          this.showingFlag = true;
        }, 5000);
      }
    },
    sceneObject: function () {},
  },
  computed: {
    lightBoxEffectMode() {
      return this.$store.state.Fozzy3D;
    },
  },
  data() {
    return {
      audio: null,
      sceneObject: null,
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
    detectPaltform() {

      if (
        /Android|webOS|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        )
      )
        return true;
      else return false;
    },
    fullScreen(id_tag) {
      let elem = document.getElementById(id_tag);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    },
    loadingProgressPercentage(val) {
      this.loading = (val * 99).toFixed(2);
    },
    sceneRecieve(val) {
      this.sceneObject = val;
    },
    lightBoxEffect(val) {
      this.lightBoxEffectMode = val;
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
  top:20vh;
  width: 100vw;
  height: 100vh;
  // background-color: cadetblue;
  &-mask {
    // opacity: 0.3;
    top:-5vh;
    position: fixed;
    width: 100%;
    z-index: 10;
    height: auto;

  }
  &-percentage {
    z-index: 20;
    position: fixed;
    font-size: 50px;
    color: darkorange;
    bottom: -10%;
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
      bottom: -1500%;
    }
    z-index: 8;
  }
}
#market3D {
  position: fixed;
  background-color: #35909c;
}

#Market2D {
  position: absolute;
  // background-color: chartreuse;
  // opacity: 0.3;
  z-index: 100;
  width: 100vw;
  height: 100vh;
}
#colorSlide {
  background-color: black;
}
.mobile-text {
  text-align: center;
  font-size: 10px;
  transform: translateX(-50%);
  top: 40vh;
  left: 50vw;
  position: absolute;
  color: #35909c;
  z-index: 200;
  margin-top: 10%;
}
</style>
