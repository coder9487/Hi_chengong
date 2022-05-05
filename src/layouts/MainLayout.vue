<template>
  <q-layout id="root_layout" view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98" v-if="0">
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
          <div class="text-h6">嗨！成功提醒您</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          為達到最佳體驗效果，建議使用瀏覽器進行體驗，並將手機轉為橫向操作，祝您成功！
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div id="systemIcon_group">
      <!-- <img src="icons/volume.png" class="systemIcon" /> -->
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
          <img src="icons/volume.png" class="systemIcon" />
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
    {
      if (window.innerWidth > window.innerHeight) {
        this.persistent = false;
      }

      if (window.innerWidth < window.innerHeight) {
        if (this.IS_MOBILE) this.persistent = true;
      }
    }
    // window.addEventListener("orientationchange", this.ScreenOrientation);
    window.addEventListener("resize", () => {
      if (window.innerWidth > window.innerHeight) {
        this.persistent = false;
      }

      if (window.innerWidth < window.innerHeight) {
        if (this.IS_MOBILE) this.persistent = true;
      }
    });

    // this.dragElement(document.getElementById("mydiv"));
  },

  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    // dragElement(document.getElementById("mydiv"));
    return {
      IS_MOBILE,
    };
  },
  computed: {
    scene() {
      return this.$store.state.scene;
    },
    gameStart() {
      return this.$store.state.gameStart;
    },
  },
  watch: {
    screenOrientation: function () {},
    gameStart() {
      let audio = new Audio("/sound/driven_to_success.mp3");
      audio.loop = true;
      // audio.play();
    },
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
        // alert(window.screen)
        if (navigator.userAgent.indexOf("Safari") != -1) return;

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
  right: 3%;
}
.systemIcon {
  width: 10vh;
}

.systemIcon_group * {
  z-index: 20;
  padding: 50px;
}
</style>
