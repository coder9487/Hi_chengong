<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>
<script>
import * as THREE from "three/build/three.module.js";
import { Sea } from "../../Library/Sea";
import { GlobalScene, ArrowHelper } from "../../Library/BasicLibrary";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { marketSetting, collectObject } from "../../Library/LoadObject";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import gsap from "gsap";

export default {
  setup() {
    const Document = document;
    const Window = window;
    let EnableControl = true;
    return {
      Document,
      EnableControl,
    };
  },
  mounted() {
    this.Init_Three();
    this.AddEnentListener();
    this.Animation_Three();
  },
  onBeforeUnmount() {},
  data() {
    return {
      PostProcessingEnable: true,
      RaycasterPool: "",
      VuexDataPool: { id: "", display: "" },
      dbClickEvent: { eventName: "", eventObject: {} },
      controllerMode: "0",
      PlayerState: 0,
      /** firstperson control will be apply if controllerMode is 0,otherwise ,orbit control will be apply */
    };
  },
  watch: {},
  computed: {},
  methods: {
    loading_callbacks(val) {
      console.log("Pass into callbacks ", (val.loaded / 105909244).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 105909244).toFixed(2));
    },
    AddEnentListener() {
      this.Window = window;
      this.Window.addEventListener("mousemove", this.onPointerMove);
      this.Window.addEventListener("resize", this.onWindowResize);
      this.Window.addEventListener("dblclick", this.onDblclick);
      // this.Window.addEventListener("mousemove", this.onMouseMove);
    },
    Init_Three() {
      this.raycaster = new THREE.Raycaster();
      this.raycaster.far = 10;
      this.pointer = new THREE.Vector2();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#ffffff");
      let canvas = document.querySelector("#three");
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        precision: "lowp",
        powerPreference: "low-power",
      });

      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        400
      );
      this.camera.position.set(-48.36, 1.2, -0.3);

      this.camera.lookAt(-48.36, 1.1, -0.16);
      let globalScene = new GlobalScene(this.scene, this.camera, this.renderer);

      /**
       * Create controller
       */
      switch (this.controllerMode) {
        case "0":
          console.log(this.Document);
          this.controls = new FirstPersonCameraControl(
            this.camera,
            this.Document.body
          );
          this.controls.enabled = true;
          this.controls.applyGravity = false;
          this.controls.applyCollision = true;
          this.controls.positionEasing = true;

          break;
        case "1":
          this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
          );
          break;
      }

      this.composer = globalScene.TuneRender(this.PostProcessingEnable);
      globalScene.AddLight();
      this.scene.background = new THREE.CubeTextureLoader()
        .setPath("../")
        .load([
          "images/sky_pos_x.jpg",
          "images/sky_neg_x.jpg",
          "images/sky_pos_y.jpg",
          "images/sky_neg_y.jpg",
          "images/sky_neg_z.jpg",
          "images/sky_pos_z.jpg",
        ]);

      // load a resource
      this.loadTable();

      this.createSea();

      // this.pin = this.createPointer();w
    },
    Animation_Three() {
      this.controls.update();
      this.sea.moveWaves();
      this.composer.render();
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },

    async loadTable() {
      console.clear();
      const loader = new THREE.ObjectLoader();
      this.tableModel = await loader.loadAsync(
        "../models/market_table.json",
        (xhr) => {
          this.loading_callbacks(xhr);
        }
      );

      this.tableModel.scale.set(10, 10, 10);
      this.tableModel.position.set(0, 0, 0);

      marketSetting(this.tableModel);

      // this.casterList = collectObject(this.tableModel);
      this.scene.add(this.tableModel);
      // this.setupAinmation();
      this.initRaycaster();
      this.controls.colliders = this.tableModel;
      this.LoadMarketFinish = true;
    },
    createSea() {
      let seaVertices = 100;
      let seaAmp = 0.8;

      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = -3.5;
      // this.sea.mesh.castShadow = true;
      // this.sea.mesh.receiveShadow = true;
    },
    initRaycaster() {
      let objectNameList = [
        "hai_di_ca",
        "sashimi",
        "mahi_fish",
        "miso_soup",
        "orange",
        "wan_que",
        // "a_kon_normal",
        // "a_kon_hover",
      ];
      this.raycasterObjectList = new Array();
      objectNameList.forEach((elem) => {
        this.raycasterObjectList.push(this.tableModel.getObjectByName(elem));
      });
      console.log("Raycaster list ",this.raycasterObjectList)
    },
    updateAnimation() {},
    onPointerMove(event) {
      if (this.LoadMarketFinish != true) return;
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      // 计算物体和射线的焦点
      const intersects = this.raycaster.intersectObjects(
        this.raycasterObjectList
      );

      for (let i = 0; i < intersects.length; i++) {
        console.log(intersects);
      }
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
  },
};
</script>
