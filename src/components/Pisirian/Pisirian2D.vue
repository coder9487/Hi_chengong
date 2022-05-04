<template>
  <div class="Akon" v-if="showAkon">
    <div>
      <img class="Akon-charactor" src="../../../public/images/a_kon_hi.png" />
    </div>
    <div class="dialogArea">
      <img
        class="dialogArea-photo"
        src="../../../public/images/pisirian/pastcard.png"
      />
      <div class="dialogArea-dialog">
        恭喜你離成功更近一步，記錄你的<b>成功之旅</b>或對自己的<b>成功期許</b>，讓阿公幫你<b>成功寄出</b>吧！一定很漂亮!
      </div>
      <div class="dialogArea-group">
        <div @click.stop="this.$router.push('/')" class="button color-orange">下次成功見!</div>
      </div>
    </div>
  </div>
  <div class="PasserbydialogArea" v-if="showDialog" id="PasserbydialogArea">
    <div
      class="PasserbydialogArea-dialog"
      v-html="contentList.content[contentListIndex]"
    ></div>
    <div class="PasserbydialogArea-group">
      <div @click.stop="dialogHandler(false)" class="button color-cyan">
        {{ contentList.button[contentListIndex] }}
      </div>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { ref } from "vue";
export default {
  setup() {},
  computed: {
    toggleDialog() {
      return this.$store.state.Pisirian.toggledPasserby;
    },
    endDialog() {
      return this.$store.state.Pisirian.end;
    },
  },
  watch: {
    toggleDialog: function () {
      this.contentListIndex = this.toggleDialog;
      this.dialogHandler(true);
      console.log(this.contentListIndex);
    },
    endDialog: function () {
      if (this.endDialog == true) {
        let area = document.getElementById("PasserbydialogArea")
        area.style.bottom = "-100vh"
        this.$store.commit("setFozzyFram", true);
        this.showAkon = true;
        gsap.fromTo(
          ".Akon",
          {
            opacity: 0 ,
            },
          {
            opacity: 1,
            duration: 0.5,
          }
        );
      }
    },
  },
  data() {
    return {
      showAkon:ref(false),
      showDialog: ref(false),
      umount: (true),
      contentListIndex: 0,
      contentList: {
        content: [
          "你聽，<b>海的聲音</b>好紓壓，我可以靜靜地聽一整天，每次有煩惱的時候我都會來~",
          "大家要做好保育工作，把成功獨特的<b>鏢旗魚</b>文化傳承下去，一起守護<b>成功的海</b>！",
          "有些漁法容易<b>誤捕</b>導致破壞生態，保存成功的<b>鏢旗魚</b>技法是很重要的，哇!你看，有旗魚！",
          "三仙台的<b>由來</b>是因為有呂洞賓、李鐵拐、何仙姑在此休息，島上有一個<b>許願郵筒</b>很有名喔!",
        ],
        button: ["好酷！", "好療癒~", "運氣真好", "沒錯！"],
      },
    };
  },
  methods: {
    dialogHandler(state) {
      if (state == true) {
        this.showDialog = true;
        gsap.fromTo(
          ".PasserbydialogArea",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
          }
        );
      } else {
        this.showDialog = false;
        gsap.fromTo(
          ".PasserbydialogArea",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.5,
          }
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$content-text-size-pc: 1.4vw;

.Akon {

  opacity: 0;
  &-charactor {
    // width: 40vw;
    z-index: 10;
    height: 70vh;
    position: fixed;
    right: 0;
    bottom: 0;
  }
}

.dialogArea {
  // background-color: aqua;
  position: fixed;
  width: 60vw;
  height: 60vh;
  left: 15vw;
  bottom: 20vh;
  & * {
    pointer-events: all;
  }
  &-photo {
    position: relative;
    width: 45vw;
    left: 7.5vw;
    top: -3%;
  }
  &-dialog {
    position: relative;
    width: 45vw;
    height: 20vh;
    left: 7.5vw;
    background-color: aliceblue;
    border-radius: 30px;
    padding: 2.2vw;
    font-size: 1.5vw;
    color: #276a70;
    @media screen and (min-width: 1024px) {
      font-size: $content-text-size-pc;
      line-height: $content-text-size-pc * 1.8;
      letter-spacing: $content-text-size-pc * 0.2;
    }

    & > b {
      color: #fea30b;
      font-weight: bolder;
    }
  }
  &-group {
    position: relative;
    width: 45vw;
    height: 10vh;
    // background-color: aquamarine;
    left: 7.5vw;
    top: -5%;
    display: flex;
    justify-content: space-around;
  }
}

.PasserbydialogArea {
  opacity: 0;
  position: absolute;
  width: 60vw;
  height: 20vh;
  left: 15vw;
  bottom: 10vh;
  & * {
    pointer-events: all;
  }
  &-photo {
    position: relative;
    width: 45vw;
    left: 7.5vw;
    top: -3%;
  }
  &-dialog {
    position: relative;
    width: 45vw;
    height: 20vh;
    left: 7.5vw;
    background-color: aliceblue;

    border-radius: 30px;
    padding: 2.5vw;
    font-size: 1.5vw;
    color: #276a70;
    @media screen and (min-width: 1024px) {
      font-size: $content-text-size-pc;
      line-height: $content-text-size-pc * 1.8;
      letter-spacing: $content-text-size-pc * 0.2;
    }
    ::v-deep b {
      color: #fea30b;
      font-weight: bolder;
    }
  }
  &-group {
    position: relative;
    width: 45vw;
    height: 10vh;
    // background-color: aquamarine;
    left: 7.5vw;
    top: -10%;
    display: flex;
    justify-content: space-around;
  }
}
b {
  color: #fea30b;
  font-weight: bolder;
}
.button {
  z-index: 11;
  width: 10vw;
  height: 7vh;
  // background-color: cornflowerblue;
  border-radius: 20px;
  padding: 2%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  font-size: larger;
  color: white;
  font-weight: bolder;
}

.color {
  &-orange {
    background-color: #fea30b;
    &:hover {
      background-color: #ff7a00;
    }
  }

  &-cyan {
    background-color: #1ab5c1;
    &:hover {
      background-color: #0098a4;
    }
  }
}

* {
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
