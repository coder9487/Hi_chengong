<template>
  <div id="navigator_group" v-if="1">
    <q-icon class="text-dark systemIcon" size="sm" @click="BackComicBook">
      <img src="icons/meum_icon.png" />
    </q-icon>

    <img
      src="images/a_kon.png"
      class="navigator_image"
      alt=""
      v-if="ShowNPC('startchat')"
    />

    <div class="navigator_chatbox">
      <q-card
        id="notificaionBox_1"
        class="notificaionBox"
        v-if="ShowNPC('startchat')"
      >
        <q-card-section>
          <img
            
            class="text_size"
            :src="talkContent.startchat[this.textIndex.startchat]"
          />

          <q-btn
            v-if="0"
            class="chatContentButton"
            flat
            round
            size="xl"
            icon="img:icons/nextBtn.svg"
            @click="this.textIndex.startchat++"
          />
        </q-card-section>
      </q-card>
      <img class="chatContentButton" src="icons/press_any_key.svg" v-if="ShowNPC('startchat')" />
    </div>
  </div>

  <!-- ------------------------------------------------------------------ -->

  <div id="introduce_group" v-if="1">
    <img
      src="images/npc_fishmonger.png"
      class="introductor_image"
      alt=""
      v-if="intrpducerShowFlag.showEnable"
    />

    <div class="introductor_chatbox">
      <div class="introduceBox" v-if="intrpducerShowFlag.showEnable">
        <img :src="intrpducerShowFlag.imageUrl" class="introduceChatBox" />
        <div class="btn_group">
          <img
            src="images/UI/Group_50.svg"
            @click="FishMonger.clearAndExit()"
          />
          <img
            src="images/UI/Group_51.svg"
            v-if="!intrpducerShowFlag.lastPhoto"
            @click="FishMonger.nextImage()"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-if="$q.platform.is.mobilexl">
    <div
      class="control_pannle"
      v-if="0"
      v-touch-pan.prevent.mouse="handlePan"
    ></div>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
//import { store } from '../../store'

export default {
  data() {
    return {
      ShowFishMonger: 0,
      talkContent: {
        startchat: [
          "./images/UI/hint1-(4).svg",
          "./images/UI/hint1-(1).svg",
          "./images/UI/hint1-(2).svg",
          "./images/UI/hint1-(3).svg",
          "",
          "./images/UI/hint1-(5).svg",
        ],
        grandpa: [],
        fishmonger: [],
      },

      direction: {
        forward: false,
        backword: false,
        right: false,
        left: false,
      },
    };
  },
  props: ["golbalEventRecieve"],
  setup() {
    const info = ref(null);
    const panning = ref(false);
    let textIndex = reactive({ startchat: 0, grandpa: 0, fishmonger: 0 });
    //
    let intrpducerShowFlag = reactive({
      showEnable: false,
      showIndex: 0,
      imageUrl: "",
      lastPhoto: false,
    });

    class FishMonger_class {
      indexArray = [0, 3, 4, 3, 6];
      controlObject = null;
      photoindex = 0;
      Init(passInobj) {
        this.controlObject = passInobj;
      }
      imagePath() {
        // `images/monger${fishmonger_seq}/${fishmonger_seq}-${ this.photoindex + 1}.png`;
        this.controlObject.imageUrl = `images/monger${
          this.controlObject.showIndex
        }/${this.controlObject.showIndex}-${this.photoindex + 1}.png`;
      }
      nextImage() {
        this.photoindex++;
        if (
          this.photoindex ==
          this.indexArray[this.controlObject.showIndex] - 1
        ) {
          this.controlObject.lastPhoto = true;
        }
        this.imagePath();

        // this.$forceUpdate();
      }
      clearAndExit() {
        this.photoindex = 0;
        this.controlObject.showEnable = false;
        this.controlObject.showIndex = 0;
        this.controlObject.lastPhoto = false;
      }
    }
    let FishMonger = new FishMonger_class();
    FishMonger.Init(intrpducerShowFlag);

    return {
      textIndex,
      FishMonger,
      intrpducerShowFlag,
      info,
      panning,
      handlePan({ evt, ...newInfo }) {
        info.value = newInfo;

        // native Javascript event
        // console.log("newInfo.offset.y:",newInfo.offset.y);
        if (panning.value) {
          if (newInfo.offset.x > 0) {
            //go right
            console.log(this.$ref.nav.go_forward());
            //this.right_rotate();
          } else if (newInfo.offset.x < 10) {
            //go left
            //this.left_rotate();
          }
          if (newInfo.offset.y < -10) {
          }
        }
        if (newInfo.isFinal) {
          //this.clearAll();
          console.log("STOP");
        }

        if (newInfo.isFirst) {
          console.log("Start");
          panning.value = true;
        } else if (newInfo.isFinal) {
          panning.value = false;
        }
      },
    };
  },
  computed: {
    marketChangeState() {
      return this.$store.state.marketChangeState;
    },
    PopupChat() {
      let stateObject = [];
      stateObject.push(this.$store.state.marketDisplay[0]["id"]);
      stateObject.push(this.$store.state.marketDisplay[0]["display"]);

      return stateObject;
    },

    // approachGrandpa() {
    //   return this.$store.state.questionMarketDisplay;
    // },
  },
  watch: {
    golbalEventRecieve: function () {
      this.textIndex.startchat++;
    },
    ChangeScene: function () {
      this.$router.push("DiningTable");
    },
    PopupChat: function () {
      let object = this.PopupChat;

      if (object[0].includes("_")) {
        console.log(" ");
      } else {
        let seq = object[0].split("monger")[1];
        //console.log('fishmonger seq. ',seq)
        this.ShowFishMonger = seq;
        this.intrpducerShowFlag.showEnable = true;
        this.intrpducerShowFlag.showIndex = parseInt(this.ShowFishMonger, 10);
        this.FishMonger.imagePath();
      }
    },
    approachGrandpa: function () {
      this.textIndex.startchat = 5;
    },
    marketChangeState: function () {
      console.log("Get event ", this.marketChangeState);
    },

    //textIndex: "A_Kong_Handler",
  },

  methods: {
    clickDetct() {},
    BackComicBook() {
      this.$router.push("/ComicBook");
    },

    ShowNPC(charactor) {
      if (this.textIndex.startchat == 6) {
        this.$router.push("DiningTable");
      }
      if (charactor == "startchat")
        if (this.textIndex.startchat != 4 && this.textIndex.startchat < 6)
          return true;
    },
    A_Kong_Handler() {
      alert("index change");
      // window.setTimeout(function () {
      //   this.textIndex.startchat = 1;
      //   alter("To next chat");
      // }, 6000);
    },
  },
};
</script>
<style lang="scss">
@media screen and (max-device-width: 768px) {
  .view {
    width: 400px;
  }
}
#introduce_group {
  position: center;
  display: block;
  background-color: aqua;
}

.navigator_image {
  width: auto;
  height: 63%;
  z-index: 50;
  left: 6%;
  bottom: 0;
  position: fixed;
}
.introductor_chatbox {
  z-index: 52;
  position: fixed;
  top: 0;
}
.introductor_image {
  width: auto;
  height: 66%;
  z-index: 50;
  right: 12%;
  bottom: 0;
  position: fixed;
}
.navigator_chatbox {
  z-index: 49;
  left: 30%;
  bottom: 30%;
  width: 26%;
  height: 40%;
  size: 15px;
  position: fixed;
}
.notificaionBox {
  border-radius: 20px;
  display: inline-block;
}
.chatContentButton {
  margin-top: 35%;
  margin-left: -40%;
  position: absolute;
  height: 25px;
}
.introduceBox {
  margin-top: 10vh;
  display: grid;
  width: 100vw;
  height: 100vh;
  // background-color: darkgray;
  opacity: 1;
}
.introduceBox * {
  margin-left: 20%;
  margin-top: 8%;
  width: 50%;
  display: block;
  z-index: 60;
  // background-color: aqua;
}

.introduceBox * btn_group {
  width: 50%;
  display: inline-flex;
  margin-top: -35%;
}
.introduceBox * btn_group q-btn {
  width: 200px;
}

.text_size {
  width: 40vw;
  margin-top: 5%;
  margin-right: 10%;
  // margin-left: 10%;
}

.control_pannle {
  position: fixed;
  right: 5%;
  bottom: 5%;
  z-index: 40;
  width: 20%;
  height: 20%;
  background: fuchsia;
}

#systemIcon_group {
  display: block;
  position: fixed;
  justify-content: center;
  bottom: 5%;
  left: 3%;
}

.systemIcon {
  z-index: 50;
  position: fixed;
  bottom: 5%;
  left: 3%;
}
.btn_group {
  margin-top: -28%;
  display: flex;
  margin-left: 17%;
}
.btn_group * {
  float: left;
  margin-left: 14%;
  z-index: 51;
  width: 30%;
}
</style>
