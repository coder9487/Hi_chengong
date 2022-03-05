<template>
  <div id="vedioContainer">
    <video id="startUpVedio" autoplay @ended="videoEnd">
      <source src="../video/open.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  methods: {
    videoEnd() {
      this.$router.push("/ComicBook");
    },
  },
};
</script>

<style scoped>
#startUpVedio {
  width: 100%;
  height: 100%;
  z-index: 30;
}

</style>
