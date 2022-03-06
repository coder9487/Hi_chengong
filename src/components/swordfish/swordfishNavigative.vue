<template>
  <div
    v-if="0"
    class="controlPannel-movement"
    v-touch-pan.prevent.mouse="movement"
    v-show="!navigate_dialog_content_show_availbale"
  >
    {{ moving }}
  </div>
  <div
    v-if="detectPaltform"
    class="controlPannel-direction"
    v-touch-pan.prevent.mouse="direciton"
    v-show="!navigate_dialog_content_show_availbale"
  >
    {{ direc }}
  </div>


  <div class="navigate" v-show="navigate_dialog_content_show_availbale">
    <q-img
      class="navigate-a_kon"
      src="../../../public/images/a_kon.png"
    ></q-img>
    <q-card class="navigate-dialog">
      <div class="navigate-dialog-content">
        <div v-html="A_kon_dialogContent[navigate_dialog_content_index]"></div>

      </div>
              <q-btn
          class="navigate-dialog-button"
          color="cyan-6"
          @click="A_kon_chatbox_handle"
          :size="$q.platform.is.desktop ? 'lg' : 'lg'"
        >
          {{A_kon_dialogButton[navigate_dialog_content_index]}}
        </q-btn>
    </q-card>

  </div>
</template>
<script>
import { ref, reactive } from "vue";

export default {
  setup() {
    let moving = reactive({ x: 0, y: 0 });
    let direc = reactive({ hori: 0, vert: 0 });
    return {
      moving,
      direc,
      movement({ evt, ...newInfo }) {
        // movementInfo.value = newInfo;

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
          // movementInfo.value = true;
        } else if (newInfo.isFinal) {
          // movementPanning.value = false;
          moving.x = 0;
          moving.y = 0;
        }
      },
      direciton({ evt, ...newInfo }) {
        // direcitonInfo.value = newInfo;

        direc.hori = newInfo.offset.x.toFixed(0);
        direc.vert = newInfo.offset.y.toFixed(0);

        if (newInfo.isFirst) {
          // direcitonInfo.value = true;
        } else if (newInfo.isFinal) {
          // direcitonPanning.value = false;
        }
      },
    };
  },
  data() {
    return {
      A_kon_dialogContent: [
        "當然不容易啊，但用鏢的旗魚也會特別好吃喔!今天難得遇上旗魚季體驗活動，一年一次的難得機會，你可要好好把握啊!",
        " 用滑鼠移動可以瞄準旗魚，點擊左鍵就會投出鏢竿，注意要看準接近魚鰓的區域投，傷到魚身就沒價值了!體驗時間一分鐘，把握時間，旗魚可是不等人的喔!",
        "",
        "做得好，阿公要送一個禮物給你當做獎勵，這兩張體驗卷你選一張，我已經幫你報名好了!",
        "",
        "",
        "這張體驗卷你收著，體驗活動開始前先逛逛魚市場，等一下再來找我，保證好玩的啦!",
        "",
        "來啦!是體驗卷派上用場的時候了，鏢旗魚最需要體力、眼力、耐力，我們去體驗看看吧!",
      ],
      A_kon_dialogButton:[
        "什麼?!好像很難欸","好!阿公快教我!","",
      ],

      navigate_dialog_content_index: 0,
      navigate_dialog_content_show_availbale: true, //for debug set false
    };
  },
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
        this.$store.commit("PoleDirection", [this.direc.hori, this.direc.vert]);
        // console.log(this.$store.state.poleDirection);
      },
      deep: true,
    },
  },
  computed: {
    marketPersonDisplay() {
      return this.$store.state.marketDisplay[0]["id"];
    },

    detectPaltform() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return true;
      else return false;
    },
  },
  methods: {
    shoot() {
      this.$store.commit("swordfishShoot");
    },

    A_kon_chatbox_handle() {
      this.navigate_dialog_content_index++;
      console.log(this.navigate_dialog_content_index);
      switch (this.navigate_dialog_content_index) {
        case 2:
        case 4:
        case 7:
          this.navigate_dialog_content_show_availbale = false;

          break;
        case 9:
          this.navigate_dialog_content_show_availbale = false;
          this.$router.push("swordfish-page");
          break;

        default:
          this.navigate_dialog_content_show_availbale = true;
      }
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // some code..
      } else {
      }
    },
  },
};
</script>
<style lang="scss">
.controlPannel {
  // // background-color: antiquewhite;

  &-movement {
    background-color: orange;
    opacity: 0.3;
    width: 20vw;
    height: 33vh;
    position: fixed;
    left: 0px;
    z-index: 200;
    bottom: 33vh;
  }
  &-direction {
    z-index: 101;
    background-color: orange;
    opacity: 0.3;
    width: 40vw;
    height: 100vh;
    position: fixed;
    right: 0px;
  }
  &-shoot {
    position: fixed;
    bottom: 5%;
    left: 5%;
    height: 100px;
    width: 100px;
  }
}

.navigate {
  * {
    display: inline;
    float: left;
  }
  &-a_kon {
    //height: 30%;
    width: 25%;
    position: absolute;
    bottom: 0;
   left: 10%;
  }
  &-dialog {
    max-width: 50vw;
    left: 35%;
    top: 20vh;
    border-radius: 40px;
    // background-color: chocolate;

    &-content {
      font-size: 5vh;
      @media screen and (min-width: 1024px) {
        font-size: 3vh;
        line-height: 50px;
      }
      $content-border-gap: 20px;
      margin-left: 7%;
      margin-right: 7%;
      margin-top: 6%;
      margin-bottom: 7%;

      color: rgb(18, 89, 74);
      &-b {
        color: orange;
      }
    }
    &-button {

      position: relative;
      border-radius: 30px;
      display: flex;
      left: 5%;
      bottom: 30%;
      width: 40vw;
      @media screen and (min-width: 1024px) {
        margin-left: 25%;
        width: 40%;
        bottom: -20px;
      }
    }
    &-button * {
      padding: 5%;
    }
  }
}
</style>
