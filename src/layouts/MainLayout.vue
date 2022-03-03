<template>
  <q-layout id="root_layout" view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98" v-if="1">
      <q-tabs align="left" v-if="1">
        <!-- <q-route-tab to="/market-page" label="market" /> -->

        <q-route-tab to="/swordfish-page" label="swordfish-page" />
        <q-route-tab to="/market-page" label="market-page" />
        <q-route-tab to="/" label="homepage" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <div id="systemIcon_group">
      <!-- <p>
        <q-icon class="text-dark systemIcon" :size="systemIconSize">
          <img src="icons/meum_icon.png" />
        </q-icon>
      </p> -->
      <!-- <p>
        <q-icon class="text-dark systemIcon" :size="systemIconSize"> -->
          <!-- <img src="icons/question_icon.png" />
        </q-icon>
      </p>
      <p>
        <q-icon class="text-dark systemIcon" :size="systemIconSize">
          <img src="icons/volume.png" />
        </q-icon>
      </p> -->
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
#systemIcon_group {
  display: block;
  // align-items:;
  position: fixed;
  justify-content: center;
  bottom: 5%;
  left: 3%;
}

.systemIcon_group * {
  z-index: 20;
  padding: 50px;

}


</style>
