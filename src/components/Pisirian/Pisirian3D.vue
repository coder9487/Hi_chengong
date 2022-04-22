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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import {
  PasserBy,
  FishMonger,
  AnimateObject,
  HoverCharacter,
  Akon,
} from "../../Library/AnimationLibrary";
import { reactive } from "vue";
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
      DO_ONCE_DONE: false,
      PostProcessingEnable: true,
      RaycasterPool: "",
      VuexDataPool: { id: "", display: "" },
      dbClickEvent: { eventName: "", eventObject: {} },
      controllerMode: "0",
      togglePasserby: 0,
      direc: reactive({ hori: 0, vert: 0 }),
      /** firstperson control will be apply if controllerMode is 0,otherwise ,orbit control will be apply */
    };
  },
  watch: {
     direc: {
      handler(newVal) {
        this.$store.commit("setLookDir", {
          x: this.direc.hori,
          y: this.direc.vert,
        });
        console.log(this.$store.state.CameraDirect);
      },
      deep: true,
    },},
  computed: {
    detectSowrdfish() {
      return this.$store.state.Pisirian.toggledPasserby;
    },
  },
  methods: {
    direciton({ evt, ...newInfo }) {
      this.direc.hori = newInfo.delta.x.toFixed(0);
      this.direc.vert = newInfo.delta.y.toFixed(0);
      console.log(this.direc);
      if (newInfo.isFirst) {
      } else if (newInfo.isFinal) {
        this.direc.hori = 0;
        this.direc.vert = 0;
      }
    },
    loading_callbacks(val) {
      console.log("Pass into callbacks ", (val.loaded / 65211482).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 65211482).toFixed(2));
    },
    Init_Three() {
      this.raycaster = new THREE.Raycaster();
      this.raycaster.far = 10;
      this.pointer = new THREE.Vector2();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x3cc4d0);
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
        800
      );
      this.camera.position.set(54.87, 31.5, -1.5);
      //this.camera.position.set(54.78, 30, 2.02);

      this.camera.lookAt(-54.87, 31.5, 0.3);
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
          this.controls.applyGravity = true;
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
      // this.scene.background = new THREE.CubeTextureLoader()
      //   .setPath("../")
      //   .load([
      //     "images/sky_pos_x.jpg",
      //     "images/sky_neg_x.jpg",
      //     "images/sky_pos_y.jpg",
      //     "images/sky_neg_y.jpg",
      //     "images/sky_neg_z.jpg",
      //     "images/sky_pos_z.jpg",
      //   ]);
      this.scene.background.mapping = THREE.CubeRefractionMapping;
      this.scene.background.minFilter = THREE.LinearFilter;

      // load a resource
      this.pin = this.createPointer();
      this.createSea();
      this.loadTable();

      console.log(this.scene);
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
      this.Window.addEventListener("dblclick", this.onClick);
      this.Window.addEventListener("mousemove", this.onMouseMove);
    },

    async loadTable() {
      console.clear();
      const loader = new GLTFLoader().setPath("models/");
      this.islandModel = new Object();
      this.gltf_islandModel = await loader.loadAsync("pisirian.gltf", (xhr) => {
        this.loading_callbacks(xhr);
      });

      this.islandModel = this.gltf_islandModel.scene;

      this.islandModel.scale.set(10, 10, 10);
      this.islandModel.position.set(0, 0, 0);

      marketSetting(this.islandModel);

      // this.casterList = collectObject(this.islandModel);
      this.scene.add(this.islandModel);
      // this.setupAinmation();
      this.controls.colliders = this.islandModel;

      this.passerbyList = new Array();
      for (let i = 1; i <= 4; i++) {
        let objTemp = this.islandModel.getObjectByName(`par_passerby0${i}`);
        if (i == 3)
          this.passerbyList.push(new PasserBy(this.camera, objTemp, 4));
        else this.passerbyList.push(new PasserBy(this.camera, objTemp, 4));
      }
      this.AkonObject = new PasserBy(
        this.camera,
        this.islandModel.getObjectByName(`a_kon_body`),
        3
      );

      this.raycasterList = new Array();
      this.raycasterList.push(this.islandModel.getObjectByName("ground"));
      this.raycasterList.push(this.islandModel.getObjectByName("end_wall"));

      console.log("raycasterList", this.raycasterList);

      this.mixer = new THREE.AnimationMixer(this.islandModel);
      for (let i = 0; i < 2; i++) {
        let a = this.mixer.clipAction(this.gltf_islandModel.animations[i]);
        a.play();
      }

      this.swordfishJump = null;

      this.swordfishJump = new AnimateObject(
        this.islandModel.getObjectByName("par_passerby03"),
        3,
        this.camera
      );
      const clip = THREE.AnimationClip.findByName(
        this.gltf_islandModel.animations,
        "act_swordfish"
      );
      this.swordfishJump.AppendAnimation(this.mixer.clipAction(clip));

      console.log(this.swordfishJump);

      this.LoadMarketFinish = true;
    },
    createSea() {
      let seaVertices = 1000;
      let seaAmp = 0.8;

      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = 20;
      // this.sea.mesh.castShadow = true;
      // this.sea.mesh.receiveShadow = true;
    },
    onPointerMove(event) {
      if (this.LoadMarketFinish != true) return;
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // console.log(this.passerbyList);
      this.RaycasterHandler();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    updateAnimation() {
      if (this.LoadMarketFinish != true) return;
      this.mixer.update(0.02);
      for (let i = 0; i < this.passerbyList.length; i++) {
        this.passerbyList[i].Filp();
        this.passerbyList[i].watchMe();
      }
    },
    RaycasterHandler() {
      this.raycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycaster.intersectObjects(this.raycasterList);

      if (intersects.length > 0) {
        if (intersects[0].object.name == "ground") {
          this.pin.position.x = intersects[0].point.x;
          this.pin.position.z = intersects[0].point.z;
          this.pin.position.y = intersects[0].point.y + 0.3;
          this.pin.lookAt(this.camera.position);
        }
      }
    },
    createPointer() {
      const texture = new THREE.TextureLoader().load("../images/pin.png");

      // immediately use the texture for material creation
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.1,
      });
      const geometry = new THREE.PlaneGeometry(0.7, 0.7);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.y += 0.35;
      this.scene.add(plane);
      plane.name = "pin_pointer";
      return plane;
    },
    onClick() {
      gsap.to(this.camera.position, {
        duration: 1.5,
        repeat: 0,
        x: this.pin.position.x,
        z: this.pin.position.z,
        onComplete: () => {
          console.log(this.camera.position, this.camera.quaternion);

          if (this.AkonObject.isApproach()) {
            gsap.to(this.camera.position, {
              duration: 0.5,
              x: 26.960382,
              z: -1.871433,
              onComplete: () => {
                gsap.to(this.camera.quaternion, {
                  duration: 0.9,
                  w: 0.7067715186504848,
                  x: 0.07662949140912478,
                  y: 0.6991818787607907,
                  z: -0.07580660844146339,
                  onComplete: () => {
                    this.$store.commit("Pisirian/toEnd");
                  },
                });
              },
            });
          }

          for (let i = 0; i < 4; i++)
            if (this.passerbyList[i].isApproach()) {
              this.$store.commit("Pisirian/setTogglePasserby", i);

              if (i == 3 - 1 && this.swordfishJump.DoOnce) {
                if (this.DO_ONCE_DONE == false) {
                  gsap.to(this.camera.position, {
                    x: 37.7748,
                    z: -1.264,
                    duration: 0.2,
                    onComplete: () => {
                      this.$store.commit("Pisirian/setTogglePasserby", 2);
                      i = 2;
                      gsap.to(this.camera.quaternion, {
                        x: 0.0041123,
                        y: 0.994159,
                        z: 0.099748,
                        w: -0.04098,
                        duration: 0.8,
                      });
                    },
                  });
                  this.passerbyList[2].toggleDistance = 2;
                }
                if (this.DO_ONCE_DONE == false) {
                  this.DO_ONCE_DONE = true;
                  this.timeout = setTimeout(() => {
                    this.swordfishJump.PlayAnimationReset();
                    clearTimeout(this.timeout);
                  }, 1300);
                } else {
                  this.swordfishJump.PlayAnimationReset();
                }

                this.swordfishJump.DoOnce = false;
              } else if (!this.swordfishJump.DoOnce) {
                this.swordfishJump.DoOnce = true;
                this.swordfishJump.ResetAnimation();
              }
            }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#three #touch{
  /* background-color: #65e9fa; */
  width: 100vw;
  height: 100h;
  position: fixed;
  z-index: 6;
  left: 0;
  top: 0;
}
#touch{
  z-index:10
}
</style>
