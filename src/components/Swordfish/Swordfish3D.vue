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
import { sceneSetting, collectObject } from "../../Library/LoadObject";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default {
  name: "Pisirian3D",
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
      console.log("Pass into callbacks ", (val.loaded / 3819854).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 3819854).toFixed(2));
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
        0.01,
        400
      );
      this.camera.position.set(-4, 7, 0);
      this.camera.lookAt(-5, 0.5, 0);
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

      this.createSea();
      this.loadTable();

      // this.pin = this.createPointer();w
    },
    Animation_Three() {
      this.controls.update();
      this.sea.moveWaves();
      this.composer.render();
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },
    AddEnentListener() {
      this.Window = window;
      this.Window.addEventListener("pointermove", this.onPointerMove);
      this.Window.addEventListener("resize", this.onWindowResize);
      this.Window.addEventListener("dblclick", this.onDblclick);
      this.Window.addEventListener("mousemove", this.onMouseMove);
    },

    async loadTable() {
      console.clear();
      const loader = new GLTFLoader().setPath("models/");
      this.swordfish = await loader.loadAsync(
        "swordfish.gltf",
        (xhr) => {
          this.loading_callbacks(xhr);
        }
      );
      let model = this.swordfish.scene;
      this.scene.add(this.swordfish.scene);
      this.swordfish.scene.scale.set(10, 10, 10);

      this.mixer = new THREE.AnimationMixer(model);
      for (let i = 0; i <= 2; i++)
        this.mixer.clipAction(this.swordfish.animations[i]).play();

      sceneSetting(this.swordfish.scene)
      console.log(this.swordfish)
      this.LoadModelFinish = true;
    },
    createSea() {
      let seaVertices = 100;
      let seaAmp = 0.8;
      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = 0;

    },
    updateAnimation() {
      if(!this.LoadModelFinish)return
      this.mixer.update(0.01)
      let monger

    },
  },
};
</script>
