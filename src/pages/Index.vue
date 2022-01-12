<template>
  <div class="start_btn">
    <q-btn label="Start" color="orange" @click="playVideo"></q-btn>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  methods: {
    playVideo() {
      this.$router.push({ path: "/startVideo" });
    },
  },
});
</script>
<style scoped>


q-btn {
  margin-top: 30%;
  margin-left: 40%;
}
</style>
