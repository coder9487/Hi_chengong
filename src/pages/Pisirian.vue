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
  <div id="colorSlide">
    <Pisirian3D
      id="swordfish3D"
      @loadingProgress="loadingProgressPercentage"
      @scene="sceneRecieve"
      v-if="1"
      v-show="showingFlag"
    ></Pisirian3D>
    <Pisirian2D
      id="Navigate"
      v-if="showingFlag && 1"
      @lightBoxEffect="lightBoxEffect"
    ></Pisirian2D>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Pisirian3D from "../components/Pisirian/Pisirian3D.vue";
import Pisirian2D from "../components/Pisirian/Pisirian2D.vue";
import gsap from "gsap";

export default defineComponent({
  name: "SwordfishPage",
  components: {
    Pisirian3D,
    Pisirian2D,
  },
  setup() {},
  mounted() {
    let vid = document.getElementById("loading-video");
    vid.canplay = function () {
      vid.style.display = "show";
    };
  },

  watch: {
    lightBoxEffectMode: function () {
      switch (this.lightBoxEffectMode) {

        case true:
          gsap.fromTo(
            "#swordfish3D",
            { webkitFilter: "brightness(1)", filter: "brightness(1)" },
            {
              webkitFilter: "brightness(0.5)",
              filter: "brightness(0.5)",
              duration: 1,
            }
          );
          break;

        case false:
          gsap.fromTo(
            "#swordfish3D",
            { webkitFilter: "brightness(0.5)", filter: "brightness(0.5)" },
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
      if (this.loading >= 70 * this.DEBUG) {
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
    };
  },
  methods: {
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
      bottom: -1500%;
    }
    z-index: 8;
  }
}
#swordfish3D {
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
#colorSlide {
  background-color: black;
}
</style>
