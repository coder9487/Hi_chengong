<template>
  <div id="navigator_group" v-if="1">
    <q-icon class="text-dark systemIcon" size="sm" @click="BackComicBook">
      <img src="icons/meum_icon.png" />
    </q-icon>

    <img
      src="images/npc.png"
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
            class="chatContentButton"
            flat
            round
            size="xl"
            icon="img:icons/nextBtn.svg"
            @click="this.textIndex.startchat++"
          />
        </q-card-section>
      </q-card>
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
  setup() {
    const info = ref(null);
    const panning = ref(false);
    let intrpducerShowFlag = reactive({
      showEnable: false,
      showIndex: 0,
      imageUrl: "",
      lastPhoto: false,
    });

    class FishMonger_class {
      indexArray = [0, 3, 4, 3, 6];
      // constructor(indexArray, controlObject) {
      //   this.indexArray = indexArray;
      //   this.controlObject = controlObject;
      //   this.photoindex = 0;
      // }
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
    ChangeScene() {
      return this.$store.state.toMarketTableSceneIndex;
    },
    PopupChat() {
      let stateObject = [];
      stateObject.push(this.$store.state.FishMongerDisplay[0]["id"]);
      stateObject.push(this.$store.state.FishMongerDisplay[0]["display"]);

      return stateObject;
    },
  },
  watch: {
    ChangeScene: function () {
      this.$router.push("DiningTable");
    },
    PopupChat: function () {
      //alert("detect fishMonger");
      let object = this.PopupChat;

      this.ShowFishMonger = object[0];

      this.intrpducerShowFlag.showEnable = true;
      this.intrpducerShowFlag.showIndex = parseInt(this.ShowFishMonger, 10);
      this.FishMonger.imagePath();
      console.log(this.intrpducerShowFlag);
    },
  },
  data() {
    return {
      ShowFishMonger: 0,
      talkContent: {
        startchat: ["./images/UI/text_1.svg", "./images/UI/text_2.svg"],
        grandpa: [],
        fishmonger: [],
      },
      textIndex: { startchat: 0, grandpa: 0, fishmonger: 0 },
      direction: {
        forward: false,
        backword: false,
        right: false,
        left: false,
      },
    };
  },
  methods: {
    BackComicBook() {
      this.$router.push("/ComicBook");
    },

    ShowNPC(charactor) {
      if (charactor == "startchat")
        if (this.textIndex.startchat < 2) return true;
    },
    fishMongerHandler() {
      this.ShowFishMonger = 0;
    },

    debug_message(msg) {
      console.log("message:", msg);
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
  height: 38%;
  z-index: 50;
  right: 6%;
  bottom: 0;
  position: fixed;
}
.introductor_image {
  width: auto;
  height: 66%;
  z-index: 50;
  right: 6%;
  bottom: 0;
  position: fixed;
}
.navigator_chatbox {
  z-index: 49;
  right: 20%;
  bottom: 0%;
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
  margin-top: -50px;
  margin-left: 80%;
}
.introduceBox {
  margin-top: 0%;
  display: grid;
  width: 100vw;
  height: 100vh;
  // background-color: darkgray;
  opacity: 1;
}
.introduceBox * {
  margin-left: 20%;
  margin-top: 10%;
  width: 50%;
  display: fixed;
  z-index: 60;
  // background-color: aqua;
}

.introduceBox * btn_group {
  width: 50%;
  display: inline-flex;
  margin-top: -10%;
}
.introduceBox * btn_group q-btn {
  width: 200px;
}

.text_size {
  width: 80%;
  margin-top: 5%;
  margin-left: 10%;
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
  margin-top: -15%;
  display: flex;
  margin-left: 17%;
}
.btn_group * {
  float: left;
  // border-radius: 50px;
  margin-left: 15%;
  // background-color:orange;
  z-index: 51;
  // height:50px;
  width: 30%;
  // text-align: center
}
</style>
