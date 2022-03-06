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
  ></div>

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
          :color="navigate_dialog_content_index < 2 ? 'cyan-6' : 'orange-9'"
          @click="A_kon_chatbox_handle"
          :size="$q.platform.is.desktop ? 'lg' : 'lg'"
        >
          {{ A_kon_dialogButton[navigate_dialog_content_index] }}
        </q-btn>
      </div>
    </q-card>
  </div>
  <!-- <q-dialog
      v-model="HitAvailable"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>
      </q-card>
    </q-dialog> -->
  <div>
    <q-img
      class="success"
      src="images/success.png"
      transition-show="slide-up"
      v-show="HitAvailable && !navigate_dialog_content_show_availbale"
    ></q-img>
  </div>
  <div class="totalmoney" v-show="!navigate_dialog_content_show_availbale">
    <b class="totalmoney-text">收穫金額：{{ swordfishMoney.toFixed(2) }}萬</b>
  </div>
  <div class="progress">
    <div class="progress__bar" id="timeBar"></div>
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
      TimeObj: { limit: 60000, id: null, counter: 0 },
      A_kon_dialogContent: [
        "當然不容易啊，但用鏢的旗魚也會特別好吃喔!今天難得遇上旗魚季體驗活動，一年一次的難得機會，你可要好好把握啊!",
        " 用滑鼠移動可以瞄準旗魚，點擊左鍵就會投出鏢竿，注意要看準接近魚鰓的區域投，傷到魚身就沒價值了!體驗時間一分鐘，把握時間，旗魚可是不等人的喔!",
        "",
        "做得好好玩吧!有沒有發現這樣就不容易捕到小魚或保育類了，鏢旗魚對環境是很友善的喔!阿如果你鏢到也不要氣餒啦，阿公是有50年經驗才這麼厲害，你還要多練練啦!",
        "好啦，鏢旗魚很辛苦對吧!經過努力收穫的漁獲會特別好吃喔!阿公帶你去漁港吃些好料吧!",
        "",
      ],
      A_kon_dialogButton: [
        "什麼?!好像很難欸",
        "好!阿公快教我!",
        "",
        "吼!很臭屁欸!",
        "好啊!我等不及了!",
      ],

      navigate_dialog_content_index: 0,
      navigate_dialog_content_show_availbale: true, //for debug set false
      HitAvailable: ref(false),
      maximizedToggle: ref(true),
      swordfishMoney: ref(0),
    };
  },
  watch: {
    detetctShootFishAvailable: function () {
      this.HitAvailable = true;
      this.swordfishMoney += Math.floor(Math.random() * 12) + 8;
      setInterval(() => {
        this.HitAvailable = false;
      }, 3000);
    },
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
    detetctShootFishAvailable() {
      return this.$store.state.swordfishShoottimes;
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
    timeBarControl() {
      let bar = document.getElementById("timeBar");
      this.TimeObj.counter++;
      if (this.TimeObj.counter > 600) this.TimeObj.counter = 600;
      if(bar)
      bar.style.width = (this.TimeObj.counter * 0.167).toFixed(1) + "%";

    },
    shoot() {
      this.$store.commit("swordfishShoot");
    },

    A_kon_chatbox_handle() {
      this.navigate_dialog_content_index++;
      console.log(this.navigate_dialog_content_index);
      switch (this.navigate_dialog_content_index) {
        case 2:
          setTimeout(() => {
            this.A_kon_chatbox_handle();
          }, this.TimeObj.limit);
          this.navigate_dialog_content_show_availbale = false;
          this.TimeObj.id = window.setInterval(() => {
            this.timeBarControl();
          }, 100);

          break;
        // case 3:
        //   window.clearInterval(this.TimeID);
        //   break;

        case 5:
          this.navigate_dialog_content_show_availbale = false;
          window.clearInterval(this.TimeID);
          this.TimeObj.counter = 0;
          this.$router.push("/");
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
    width: 50vw;
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
      position: absolute;
      border-radius: 30px;
      display: flex;
      left: 20%;
      bottom: -15%;
      width: 30vw;
      @media screen and (min-width: 1024px) {
        margin-left: 10%;
        bottom: 100px;
        width: 40%;
        bottom: -10%;
      }
    }
    &-button * {
      padding: 1%;
    }
  }
}
.success {
  width: 45vw;
  position: fixed;
  bottom: 0;
  left: 27vw;
  z-index: 300;
}

.totalmoney {
  border-radius: 50px;
  width: 25vw;
  height: 10vh;
  background-color: aliceblue;
  border: 4px solid #fea30b;
  position: absolute;
  bottom: 3vh;
  display: flex;
  justify-content: space-around;
  left: 40vw;
  @media screen and (min-width: 1024px) {
    border: 10px solid #fea30b;
  }

  &-text {
    color: #fea30b;
    padding: 4%;
    font-size: 10px;
    @media screen and (min-width: 1024px) {
      font-size: 25px;
    }
  }
}
* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently*/
}

.progress {
  position: absolute;
  top: 2vh;
  left: 10vw;

  background-color: #a8d9d7;
  border-radius: 10px;

  padding: 2px;
  width: 80vw;
  max-width: 80vw;
  border: 3px solid #fff;
  height: 20px;
  @media screen and (min-width: 1024px) {
    height: 40px;
  }

  .progress__bar {
    border-radius: 10px;
    height: 100%;
    width: 0%;
    background-color: #1ab5c1;
    // animation: fill-bar 5s infinite ;
  }
}

@keyframes fill-bar {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
