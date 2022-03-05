<template>
  <div id="background_photo"></div>
  <div class="content">
    <div id="comicbook_page">
      <!-- <q-btn flat class = "my_card" @click="showAlert(2)"> 

        <q-img class = "my_card" src="https://cdn.quasar.dev/img/parallax2.jpg">
        </q-img>

  
      </q-btn> -->
      <q-card
        tabindex="0"
        class="my_card"
        flat
        bordered

      >
        <div
          v-ripple
          @click="showAlert"
          class="cursor-pointer relative-position"
        >
          <q-img  src="https://cdn.quasar.dev/img/parallax2.jpg"></q-img>
        </div>
      </q-card>

      <!-- split line -->
    </div>
  </div>
  {{ this.count }}
</template>
<style lang="scss">
#background_photo {
  background-image: url("../images/background.jpg");
  filter: blur(8px);
  height: 98vh;
  width: 100vw;
  background-repeat: no-repeat;
   overflow: hidden;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
}
#comicbook_page {
  background-color: rgb(243, 236, 229);
  width: 1600px;
  height: 850px;
}

.my_card {
  width: 600px;
}



</style>
<script>
export default {
  setup() {},
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    doSomething() {
      count++;
    },
    showAlert() {
      alert(this.count);
      this.count++;
    },
  },
};
</script>
