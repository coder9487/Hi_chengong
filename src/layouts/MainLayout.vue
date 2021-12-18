<template>
  <q-layout id = "root_layout" view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/market-page" label="market" />
        <q-route-tab to="/pisirian" label="pisirian" />
        <q-route-tab to="/lantern" label="lantern" />
         <q-route-tab to="/swordfish" label="swordfish" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<style lang="scss">
  #root_layout
  {
    overflow: hidden;
  }
</style>