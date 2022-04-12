<template>
  <q-layout id="root_layout" view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98" v-if="1">
      <!-- <div
        v-if="1"
        class="interpreterCard text-black"
        id="mydiv"
        v-show="showInterpreter"
      >
      <tuneCard></tuneCard>
      </div> -->

      <q-tabs align="left" v-if="showDebugTab">
        <!-- <q-route-tab to="/market-page" label="market" /> -->

        <q-tab label="Jump page">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/')"
                  >Home</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/Market')"
                  >Market</q-item-section
                ></q-item
              >

              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/Swordfish')"
                  >Swordfish</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/Pisirian')"
                  >Pisirian</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/DiningTable')"
                  >DiningTable</q-item-section
                >
              </q-item>

              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/marketprevious')"
                  >market-page</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/lottie')"
                  >lottie</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/swordfish_pre')"
                  >swordfish</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="this.$router.push('/Lab01')"
                  >Lab01</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-tab>

        <q-tab label="Debug">
          <q-menu>
            <q-list style="min-width: 300px">
              <q-item clickable v-close-popup>
                <q-item-section @click="showDebugTab = false"
                  >close Tab</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="interpreter">Tune light</q-item-section>
                <q-toggle v-model="showInterpreter" color="green" />
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-tab>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
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
    // this.dragElement(document.getElementById("mydiv"));
  },

  setup() {
    // dragElement(document.getElementById("mydiv"));
  },
  computed: {
    scene() {
      return this.$store.state.scene;
    },
  },
  watch: {},
  data() {
    return {
      showDebugTab: false,
      showInterpreter: ref(false),
    };
  },
  methods: {
    dragElement(elmnt) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown =
          dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e.stopPropagation();
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e.stopPropagation();
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },
    systemIconSize() {
      if (this.$q.platform.is.mobile) return "xs";
      else return "lg";
    },

    interpreter() {
      this.showInterpreter = !this.showInterpreter;
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
