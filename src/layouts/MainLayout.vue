<template>
  <q-layout id="root_layout" view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98" v-if="1">
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog
      v-model="persistent"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-cyan-14 text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">良心建議</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          將手機橫放以達到最佳體驗
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div id="systemIcon_group">
      <!-- <p>
        <q-icon class="text-dark systemIcon" :size="systemIconSize">
          <img src="icons/meum_icon.png" />
        </q-icon>
      </p> -->
      <!-- <p>
        <q-icon class="text-dark systemIcon" :size="systemIconSize"> -->
      <!-- <img src="icons/question_icon.png" />
        </q-icon>
      </p>
      <p>
        <q-icon class="text-dark systemIcon" :size="systemIconSize">
          <img src="icons/volume.png" />
        </q-icon>
      </p> -->
    </div>
  </q-layout>
</template>
<script>
import { ref, reactive } from "vue";
import * as tuneCard from "../components/tuneCard.vue";

export default {
  //  components: {tuneCard},
  mounted() {
    this.ScreenOrientation();
    window.addEventListener("orientationchange", this.ScreenOrientation);

    // this.dragElement(document.getElementById("mydiv"));
  },

  setup() {
    // dragElement(document.getElementById("mydiv"));
  },
  computed: {
    scene() {
      return this.$store.state.scene;
    },
    screenOrientation() {
      return window.screen.orientation.type;
    },
  },
  watch: {
    screenOrientation: function () {},
  },
  data() {
    return {
      persistent: ref(false),
      showDebugTab: false,
      showInterpreter: ref(false),
    };
  },
  methods: {
    ScreenOrientation() {
      {
        const orientation = window.screen.orientation.type;
        if (orientation === "portrait-primary") {
          this.persistent = true;
        } else if (orientation === "landscape-primary") {
          this.persistent = false;
        }
      }
    },
  },
};
</script>
<style lang="scss">
#root_layout {
  overflow: hidden;

  // position: relative;
}
#systemIcon_group {
  display: block;
  // align-items:;
  position: fixed;
  justify-content: center;
  bottom: 5%;
  left: 3%;
}

.systemIcon_group * {
  z-index: 20;
  padding: 50px;
}

.interpreterCard {
  top: 300px;
  left: 500px;
  width: 300px;
  height: 400px;
  position: absolute;
}
</style>
