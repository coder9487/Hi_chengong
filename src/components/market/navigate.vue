<template>
  <div id="navigator_group">
    <q-icon class="text-dark systemIcon" size="sm" @click="BackComicBook">
      <img src="icons/meum_icon.png" />
    </q-icon>
    <img
      src="images/npc.png"
      class="navigator_image"
      alt=""
      v-if="ShowNPC()"
    />

    <div class="navigator_chatbox">
      <q-card id="chat_card_1" class="chat_card" v-if="this.textIndex == 0">
        <q-card-section>
          <img class="text_size" :src="textContentAccess(0)" />
          <q-btn
            class="chatContentButton"
            flat
            round
            size="lg"
            icon="play_circle"
            @click="changeText()"
          />
        </q-card-section>
      </q-card>

      <q-card id="chat_card_2" class="chat_card" v-if="this.textIndex == 1">
        <q-card-section>
          <!-- <img
            class="chat_icon"
            id="chat_icon_2"
            src="images/UI/text_2_icon.svg"
            alt=""
          /> -->
          <img :src="textContentAccess(1)" class="text_size" id="chat_text_2" />
          <q-btn
            class="chatContentButton"
            flat
            round
            size="lg"
            icon="clear"
            @click="changeText()"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div v-if="$q.platform.is.mobilexl">
    <div
      class="control_pannle"
      v-if="this.textIndex > 1"
      v-touch-pan.prevent.mouse="handlePan"
    ></div>
  </div>
</template>
<script>
import { ref } from "vue";
import { store } from '../../store'





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
            //go forward
            //this.go_forward();
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
    ChangeScene(){
      return store.state.ChangeSceneIndex 
    },
    // grandpa(){
    //   return store.state.display2
    // }

  },
  watch:{
    ChangeScene:function(){
      alert("In fishman")
    }
  },
  data() {
    return {
      talkContent: ["./images/UI/text_1.svg", "./images/UI/text_2.svg","","/images/UI/text_2.svg"],
      textIndex: 0,
      direction: {
        forward: false,
        backword: false,
        right: false,
        left: false,
      },
    };
  },
  methods: {
    BackComicBook()
    {
      this.$router.push("/ComicBook")
    },
    changeText() {
      this.textIndex++;
      //if (this.textIndex + 1 > this.talkContent.length) this.textIndex = 0;
      console.log("return " + this.talkContent[this.textIndex]);

      // return talkContent[textIndex]
    },
    textContentAccess(index) {
      return this.talkContent[index];
    },
    ShowNPC(){
      if(this.textIndex != 2)
        return true
    },

    // right_rotate() {
    //   this.$store.commit("setRotationRightTrue");
    //   this.$store.commit("setRotationLeftFalse");
    // },
    // left_rotate() {
    //   this.$store.commit("setRotationLeftTrue");
    //   this.$store.commit("setRotationRightFalse");
    // },
    // go_forward() {
    //   this.$store.commit("setForwardTrue");
    // },
    // go_stop() {
    //   this.$store.commit("setForwardFalse");
    // },
    // clearAll() {
    //   this.$store.commit("setRotationRightFalse");
    //   this.$store.commit("setRotationLeftFalse");
    //   this.$store.commit("setForwardFalse");
    // },

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

.navigator_image {
  width: auto;
  height: 38%;
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
.chat_card {
  border-radius: 20px;
  display: inline-block;
}
.chatContentButton {
  margin-top: -50px;
  margin-left: 80%;
}

#chat_card_2 {
  float: left;
  margin-left: 20px;
  margin-top: 10%;
}

#chat_text_2 {
  width: 65%;
  height: auto;
}
.text_size {
  width: 80%;
  margin-top: 5%;
}
.chat_icon {
  width: 15%;
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
</style>
