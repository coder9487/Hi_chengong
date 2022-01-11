<template>
  <q-layout id="root_layout" view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98" v-if="1">

      <q-tabs align="left" v-if='0'>
        <!-- <q-route-tab to="/market-page" label="market" /> -->
        <q-route-tab to="/startVideo" label="startVideo" />
         <q-route-tab to="/ComicBook" label="ComicBook" />
        <q-route-tab to="/pisirian" label="pisirian" />
        <q-route-tab to="/lantern" label="lantern" />
        <q-route-tab to="/swordfish" label="swordfish" />
        <q-route-tab to="/market-page" label="market-page" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <div class="systemIcon_group">
      <q-icon class="text-dark systemIcon" :size="systemIconSize">
        <img src="icons/meum_icon.png" />
      </q-icon>
      <q-icon class="text-dark systemIcon" :size="systemIconSize">
        <img src="icons/question_icon.png" />
      </q-icon>
      <q-icon class="text-dark systemIcon" :size="systemIconSize">
        <img src="icons/volume.png" />
      </q-icon>
    </div>
  </q-layout>
</template>
<script>
export default {
  methods: {
    systemIconSize() {
      if (this.$q.platform.is.mobile) return "xs";
      else return "lg";
    },
  },
};
</script>
<style lang="scss">
#root_layout {
  overflow: hidden;
  // position: relative;
}
.systemIcon_group {
  position: clear;
  float: left;
  bottom: 50px;
  margin-bottom: 50px;
}

.systemIcon_group * {
  z-index: 20;
}

.systemIcon_group .systemIcon {
  margin-bottom: 20px;
}
</style>
