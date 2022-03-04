<template>
  <div>
    <swordfishView></swordfishView>
    <swordfishNavigative></swordfishNavigative>
  </div>
</template>
<script>


import swordfishView from "../components/swordfish/swordfish.vue";
import swordfishNavigative from "src/components/swordfish/swordfishNavigative.vue";


export default {
  setup() {

  },
  components:{
    swordfishView,
    swordfishNavigative
  }
}
</script>
<style lang="scss" scoped>

</style>
