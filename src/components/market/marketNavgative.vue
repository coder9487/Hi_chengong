<template>
  <div
    v-if="detectPaltform"
    class="controlPannel-movement"
    v-touch-pan.prevent.mouse="movement"
    v-show="
      !navigate_dialog_content_show_availbale &&
      !fishmonger_dialog_content_show_available
    "
  >
    <!-- {{ moving }} -->
  </div>
  <div
    v-if="detectPaltform"
    class="controlPannel-direction"
    v-touch-pan.prevent.mouse="direciton"
    v-show="
      !navigate_dialog_content_show_availbale &&
      !fishmonger_dialog_content_show_available
    "
  >
    <!-- {{ direc }} -->
  </div>

  <div class="navigate" v-show="navigate_dialog_content_show_availbale">
    <q-img
      class="navigate-a_kon"
      src="../../../public/images/a_kon.png"
    ></q-img>
    <q-card class="navigate-dialog">
      <div class="navigate-dialog-content">
        <div v-html="A_kon_dialogContent[navigate_dialog_content_index]"></div>
        <q-btn
          class="navigate-dialog-button"
          color="cyan-6"
          @click="A_kon_chatbox_handle"
          :size="$q.platform.is.desktop ? 'lg' : 'lg'"
        >
          我知道了
        </q-btn>
      </div>
    </q-card>
  </div>

  <div class="fishmonger" v-show="fishmonger_dialog_content_show_available">
    <img class="fishmonger-monger" :src="fishMonger_image_path.fishMonger" />
    <div class="fishmonger-dialog" v-show="fishmonger_dialog_content_show_available">
      <q-img :src="fishMonger_image_path.dialogBox"> </q-img>
      <div class="fishmonger-dialog-button-group" >
        <q-btn
          class="fishmonger-dialog-button"
          id="escapeIntroduceBox"
          color="orange"
          :size="$q.platform.is.desktop ? 'lg' : 'md'"
          @click="FishMonger_handler('next')"
          >繼續說</q-btn
        >
        <q-btn
          class="fishmonger-dialog-button"
          id="nextIntroduceBox"
          color="cyan-8"
          :size="$q.platform.is.desktop ? 'lg' : 'md'"
          @click="FishMonger_handler('end')"
          >了解，謝謝</q-btn
        >
      </div>
    </div>
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

        direc.hori = newInfo.delta.x.toFixed(0);
        direc.vert = newInfo.delta.y.toFixed(0);

        if (newInfo.isFirst) {
          // direcitonInfo.value = true;
        } else if (newInfo.isFinal) {
          // direcitonPanning.value = false;
          direc.hori = 0;
          direc.vert = 0;
        }
      },
    };
  },
  data() {
    return {
      A_kon_dialogContent: [
        "乖孫啊!你第一次來這個地方對吧，用滑鼠拉動畫面就可以轉動視角，找找看我在哪裡?",
        " <div class='navigate-dialog-content-b'> WASD按鍵 </div> 可以移動，你先試試看走過來找阿公~",
        "",
        "做得好，阿公要送一個禮物給你當做獎勵，這兩張體驗卷你選一張，我已經幫你報名好了!",
        "",
        "",
        "這張體驗卷你收著，體驗活動開始前先逛逛魚市場，等一下再來找我，保證好玩的啦!",
        "",
        "來啦!是體驗卷派上用場的時候了，鏢旗魚最需要體力、眼力、耐力，我們去體驗看看吧!",
      ],

      fishmonger_sequence: ref(0),
      fishmonger_dialog_content_index_limit: [0, 3, 4, 3, 6],
      fishmonger_dialog_content_index: ref(0),
      fishMonger_image_path: reactive({ fishMonger: "", dialogBox: "" }),
      fishmonger_dialog_content_show_available: ref(false),

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
        this.$store.commit("MobileDirection", [
          this.direc.hori,
          this.direc.vert,
        ]);
        console.log(this.$store.state.MobileDirection);
      },
      deep: true,
    },

    marketPersonDisplay: function () {
      if (this.marketPersonDisplay.includes("_")) {
        //select cupon
        this.A_kon_chatbox_handle();
      } else {
        console.log(this.marketPersonDisplay.split("monger")[1]);

        this.fishmonger_sequence = this.marketPersonDisplay.split("monger")[1];
        this.FishMonger_handler("next");
        this.fishmonger_dialog_content_show_available = 1;
      }
    },
  },
  computed: {
    marketPersonDisplay() {
      return this.$store.state.marketDisplay[0]["id"];
    },
    fishmongerPhoto() {
      return this.fishMonger_image_path.fishMonger;
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
    consoleTest() {
      console.log("Test");
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
    fishMonger_charactor_path() {
      if (this.fishmonger_sequence != 0 && this.fishmonger_sequence < 5)
        return `../../images/monger${this.fishmonger_sequence}/monger${this.fishmonger_sequence}.png`;
      else return "None";
    },
    fishMonger_dialogBox_path() {
      if (this.fishmonger_dialog_content_index != 0)
        if (
          this.fishmonger_dialog_content_index <=
          this.fishmonger_dialog_content_index_limit[this.fishmonger_sequence]
        )
          return `../../images/monger${this.fishmonger_sequence}/${this.fishmonger_sequence}-${this.fishmonger_dialog_content_index}.png`;
        else {
          this.fishmonger_dialog_content_index = 0;
          this.fishmonger_dialog_content_show_available = false;
          return " ";
        }
    },
    FishMonger_handler(condition) {
      switch (condition) {
        case "next":
          this.fishmonger_dialog_content_index++;
          break;
        case "end":
          this.fishmonger_dialog_content_index = 0;
          this.fishmonger_dialog_content_show_available = false;
          this.fishmonger_sequence = 0;
          // this.$store.commit("resetmarketChangeState");
          break;
        default:
          console.log("No condition fit");
      }
      this.fishMonger_image_path.fishMonger = this.fishMonger_charactor_path();
      this.fishMonger_image_path.dialogBox = this.fishMonger_dialogBox_path();
    },
  },
};
</script>
<style lang="scss">
.controlPannel {
  // // background-color: antiquewhite;

  &-movement {
    // background-color: orange;
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
    // background-color: orange;
    opacity: 0.3;
    width: 20vw;
    height: 100vh;
    position: fixed;
    right: 0px;
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
      margin-left: 60%;
      width: 40%;
      @media screen and (min-width: 1024px) {
        margin-left: 70%;
        width: 130px;
      }
    }
    &-button * {
      // margin: 10%;
      padding: 5%;
    }
  }
}

.fishmonger {
  * {
    float: right;
  }

  &-monger {
    position: absolute;
    bottom: 0;
    right: 5%;
    width: 25%;
  }
  &-dialog {
    width: 65vw;
    position: absolute;
    right: 30vw;
    // background-color: aquamarine;
    top: 10vh;
    @media screen and (min-width: 1024px) {
      top: 20vh;
      max-width: 60vw;
    }
    &-button-group {
      // background-color: cornflowerblue;
      display: flex;
      top: -20px;
      justify-content: space-between;
      left: -16vw;
      width: 50vw;
      position: relative;
      @media screen and (min-width: 1024px) {
        left: -3vw; //trial and error
      }
    }
    &-button {
      justify-content: space-around;

      @media screen and (min-width: 1024px) {
        margin-right: 5%;
        margin-left: 5%;
        height: 60px;
        min-width: 20vw;
        border-radius: 50px;
        left: -10%;
      }
      margin-right: 10%;
      margin-left: 10%;
      height: 50px;
      min-width: 150px;
      border-radius: 50px;
    }
  }
}
</style>
