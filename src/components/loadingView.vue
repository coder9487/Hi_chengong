<template>
  <div class="controlPannel" v-if="detectPaltform">
    <q-card class="controlPannel-movement" v-touch-pan.prevent.mouse="movement">
      {{ moving }}
    </q-card>
    <q-card
      class="controlPannel-direction"
      v-touch-pan.prevent.mouse="direciton"
    >
      {{ direcitonInfo }}
    </q-card>
  </div>
</template>
<script>
import { ref, reactive } from "vue";

export default {
  setup() {
    const movementInfo = ref(null);
    const movementPanning = ref(false);
    const direcitonInfo = ref(null);
    const direcitonPanning = ref(false);
    let moving = reactive({ x: 0, y: 0 });
    let direc = reactive({ hori: 0, vert: 0 });
    return {
      movementInfo,
      movementPanning,
      direcitonInfo,
      direcitonPanning,
      moving,
      direc,
      movement({ evt, ...newInfo }) {
        movementInfo.value = newInfo;

        // native Javascript event
        moving.x = (newInfo.offset.x / 10).toFixed(0);
        moving.y = (newInfo.offset.y / 10).toFixed(0);
        if (moving.x > 13) {
          moving.x = 13;
        } else if (moving.x < -13) {
          moving.x = -13;
        }
        if (moving.y > 13) {
          moving.y = 13;
        } else if (moving.y < -13) {
          moving.y = -13;
        }
        if (newInfo.isFirst) {
          movementInfo.value = true;
        } else if (newInfo.isFinal) {
          movementPanning.value = false;
          moving.x = 0;
          moving.y = 0;
        }
      },
      direciton({ evt, ...newInfo }) {
        direcitonInfo.value = newInfo;

        direc.hori = newInfo.delta.x.toFixed(0);
        direc.vert = newInfo.delta.y.toFixed(0);

        if (newInfo.isFirst) {
          direcitonInfo.value = true;
        } else if (newInfo.isFinal) {
          direcitonPanning.value = false;
          direc.hori = 0;
          direc.vert = 0;
        }
      },
    };
  },
  computed: {},

  watch: {
    moving: {
      handler(newVal) {
        this.$store.commit("MobileMovement", [this.moving.x, this.moving.y]);
        // console.log(this.$store.state.MobileMovement);
      },
      deep: true,
    },
    direc: {
      handler(newVal) {
        this.$store.commit("MobileDirection", [
          this.direc.hori,
          this.direc.vert,
        ]);
        console.log(this.$store.state.MobileDirection);
      },
      deep: true,
    },
  },
  methods: {
    detectPaltform() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return true;
      else return false;
    },
    consoleTest() {
      console.log("Test");
    },
  },
};
</script>
<style lang="scss" scoped>
.controlPannel {
  // width: 100vw;
  // height: 100vh;
  // position: fixed;
  // // background-color: antiquewhite;

  &-movement {
    background-color: orange;
    opacity: 0.3;
    width: 20vw;
    height: 33vh;
    position: absolute;
    left: 0px;
    bottom: 33vh;
  }
  &-direction {
    background-color: orange;
    opacity: 0.3;
    width: 40vw;
    height: 100vh;
    position: absolute;
    right: 0px;
  }
}
</style>
