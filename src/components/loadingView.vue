<template>
  <div class="controlPannel">
    <q-card
      class="controlPannel-movement"
      v-touch-pan.prevent.mouse="handlePan"
    >
    </q-card>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    const info = ref(null);
    const panning = ref(false);

    return {
      info,
      panning,

      handlePan({ evt, ...newInfo }) {
        info.value = newInfo;

        // native Javascript event
        // console.log(evt)

        if (newInfo.isFirst) {
          panning.value = true;
        } else if (newInfo.isFinal) {
          panning.value = false;
        }
      },
    };
  },
};
</script>
<style scoped>
.controlPannel {
  width: 100vw;
  height: 100vh;
  position: fixed;
  &-movement {
    background-color: orange;
    opacity: 0.3;
    position: abs;
  }
}
</style>
