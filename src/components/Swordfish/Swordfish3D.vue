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
import gsap from "gsap";
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
      console.log("Pass into callbacks ", (val.loaded / 3246875).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 3246875).toFixed(2));
    },
    Init_Three() {
      this.raycaster = new THREE.Raycaster();
      // this.raycaster.far = 50;
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
        70,
        window.innerWidth / window.innerHeight,
        0.001,
        200
      );

      this.camera.position.set(-4, 7, 0);
      this.camera.lookAt(-10, 5, 0);
      let globalScene = new GlobalScene(this.scene, this.camera, this.renderer);

      /**
       * Create controller
       */
      switch (this.controllerMode) {
        case "0":
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
      // this.createSurface();

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
      // this.Window.addEventListener("pointermove", this.onPointerMove);
      this.Window.addEventListener("resize", this.onWindowResize);
      this.Window.addEventListener("dblclick", this.onDblclick);
      this.Window.addEventListener("mousemove", this.onMouseMove);
    },

    async loadTable() {
      console.clear();
      const loader = new GLTFLoader().setPath("models/");
      this.swordfish = await loader.loadAsync("swordfish_old.gltf", (xhr) => {
        this.loading_callbacks(xhr);
      });
      let model = this.swordfish.scene;
      this.scene.add(this.swordfish.scene);
      this.swordfish.scene.scale.set(10, 10, 10);
      this.mongerSkeleton = model.getObjectByName("monger_armature");
      this.spear = model.getObjectByName("spear");
      console.log("Monger skeleton system ", this.mongerSkeleton);
      console.log("Scene ", this.scene.children[2]);
      this.raycasterList = [];
      // this.raycasterList.push(
      //   this.swordfish.scene.getObjectByName("sailfish_Armature")
      // );
      this.raycasterList.push(this.scene.children[2]);
      console.log(this.scene);
      //
      //this.scene.children[2]

      this.mixer = new THREE.AnimationMixer(model);
      for (let i = 0; i <= 2; i++)
        this.mixer.clipAction(this.swordfish.animations[i]).play();

      sceneSetting(this.swordfish.scene);

      // gsap.to(this.mongerSkeleton.rotation, 3, {
      //   y: -Math.PI,
      //   yoyo: true,
      //   repeat: -1,

      this.hand = this.mongerSkeleton.getObjectByName("palm01R")
      const arrowHelper = new THREE.ArrowHelper(this.hand.up.clone() ,this.hand.position.clone(), 5, 0xffff00);
      this.scene.add(arrowHelper); // });

      this.LoadModelFinish = true;
    },
    createSea() {
      let seaVertices = 100;
      let seaAmp = 0.8;
      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = -20
    },
    createSurface() {
      const geometry = new THREE.PlaneGeometry(2000, 2000, 200, 200);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00066e,
        side: THREE.DoubleSide,
      });
      geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      const plane = new THREE.Mesh(geometry, material);
      plane.position.y = -20;
      this.scene.add(plane);
    },
    onMouseMove(event) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycaster.intersectObjects(this.raycasterList);
      if (intersects[0] != undefined) {
        // this.mongerSkeleton.lookAt(intersects[0].point);



    let dis = this.camera.position.clone().distanceToSquared(intersects[0].point);
    let originVector = this.camera.position
      .clone()
      .sub(intersects[0].point.clone())
      .normalize();
    let crossVector = originVector.cross(new THREE.Vector3(0, 1, 0));
    this.mongerSkeleton.lookAt(crossVector.multiplyScalar(dis));



        // this.spear.position.set (this.hand.position.x,this.hand.position.y,this.hand.position.z)
        //  this.spear.position.multiplyScalar(10)
        // this.spear.lookAt(intersects[0].point)
        //  console.log(this.spear)
      }
    },
    onDblclick() {


    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    updateAnimation() {
      if (!this.LoadModelFinish) return;
      this.mixer.update(0.016);

      // this.mongerSkeleton.rotation.y = Math.sin(-performance.now()*0.001)
    },
  },
};
</script>
