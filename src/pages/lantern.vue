<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import * as THREE from "../../node_modules/three/build/three.module";
// import { PointerLockControls } from "../../node_modules/three/examples/jsm/controls/PointerLockControls";
import { FirstPersonCameraControl } from "../../node_modules/three/src/FirstPersonCameraControls.js";
import store from "../store/index";

export default {
  name: "three",
  mounted() {
    this.initThree();
  },
  data() {
    return {
      gobalObj :{},
    };
  },
  methods: {
    initThree() {
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      function createScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color("#eee");
        canvas = document.querySelector("#three");
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.shadowMap.enabled = true; // 設定需渲染陰影效果
        renderer.shadowMap.type = 2; // THREE.PCFSoftShadowMap

        window.addEventListener("resize", onWindowResize);
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
        camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          0.01,
          1000
        );
        camera.position.x = -3;
        camera.position.y = 8;
        camera.position.z = -3;
        camera.lookAt(5, 6.5, 5);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        scene.background = new THREE.CubeTextureLoader()
          .setPath("../")
          .load([
            "images/sky_pos_x.jpg",
            "images/sky_neg_x.jpg",
            "images/sky_pos_y.jpg",
            "images/sky_neg_y.jpg",
            "images/sky_neg_z.jpg",
            "images/sky_pos_z.jpg",
          ]);
        scene.fog = new THREE.Fog(0x4ca7e6, 400, 800);
      }

      function createLight() {
        const Hemilight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(Hemilight);

        const shadowLight1 = new THREE.DirectionalLight(0xa8561b, 0.1);
        scene.add(shadowLight1);
        const shadowLight2 = new THREE.DirectionalLight(0x0b3e7d, 0.7);
        scene.add(shadowLight2);
      }

      let seaVertices = 100,
        seaAmp = 0.8;

      let Sea = function (
        ampValue,
        vertX,
        vertY,
        waveOpacity,
        textOffsetX,
        textOffsetY
      ) {
        this.mesh = new THREE.Object3D();

        let geomWaves = new THREE.PlaneBufferGeometry(2000, 2000, vertX, vertY);
        let textWaves = new THREE.TextureLoader().load("../images/water4.png");
        textWaves.wrapS = THREE.RepeatWrapping;
        textWaves.wrapT = THREE.RepeatWrapping;
        textWaves.offset = new THREE.Vector2(textOffsetX, textOffsetY);
        textWaves.repeat.set(80, 80);

        let matWaves = new THREE.MeshPhongMaterial({
          //color:0x307ddd,
          transparent: true,
          opacity: waveOpacity,
          map: textWaves,
          side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geomWaves, matWaves);

        geomWaves.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        // // geomWaves.mergeVertices();
        let positionAttribute = this.mesh.geometry.getAttribute("position");
        this.waves = [];

        for (
          let vertexIndex = 0;
          vertexIndex < positionAttribute.count;
          vertexIndex += 1
        ) {
          this.waves.push({
            ang: Math.random() * Math.PI * 2,
            amp: ampValue - 0.1,
            speed: 0.016 + Math.random() * 0.048,
          });
        }
      };

      Sea.prototype.moveWaves = function () {
        const positionAttribute = this.mesh.geometry.getAttribute("position");
        const vertex = new THREE.Vector3();
        for (
          let vertexIndex = 0;
          vertexIndex < positionAttribute.count;
          vertexIndex++
        ) {
          vertex.fromBufferAttribute(positionAttribute, vertexIndex);
          let vprops = this.waves[vertexIndex];
          positionAttribute.array[vertexIndex * 3] =
            positionAttribute.array[vertexIndex * 3] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          positionAttribute.array[vertexIndex * 3 + 1] =
            positionAttribute.array[vertexIndex * 3 + 1] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          positionAttribute.array[vertexIndex * 3 + 1] =
            positionAttribute.array[vertexIndex * 3 + 1] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          positionAttribute.array[vertexIndex * 3 + 2] =
            positionAttribute.array[vertexIndex * 3 + 2] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          vprops.ang += vprops.speed;
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
      };

      function createSea() {
        sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(sea.mesh);
        sea.mesh.position.y = 0;
        sea.mesh.castShadow = false;
        sea.mesh.receiveShadow = true;
      }

      function createLowerSea() {
        Lowersea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(Lowersea.mesh);
        Lowersea.mesh.position.y = -6;
        Lowersea.mesh.castShadow = false;
        Lowersea.mesh.receiveShadow = true;
      }
      let mesh;
      function createObject() {
        // instantiate a loader
        const loader = new THREE.ObjectLoader();

        // load a resource
        loader.load(
          // resource URL
          "../models/1017.json",
          // called when resource is loaded
          function (obj) {
            var tempOBJ = obj.getObjectByName("Plane004");
            console.log(tempOBJ)
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 5, 0);
            controls.colliders = obj;
            // scene.add(obj);
          },
          // called when loading is in progresses
          function (xhr) {
            console.log(xhr.loaded)
            // console.log((xhr.loaded / 25990068) * 100 + "% loaded");
          }
        );
        let testloader = new THREE.ObjectLoader();
        // let testmodel = loader.parse("../models/1017.json")
      }

      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = true;
        controls.applyCollision = true;
        controls.positionEasing = true;
      }
      let x = 0;
      document.addEventListener("click", function () {
        if (x % 2 == 0) {
          store.commit("setLookdownTrue");
        } else {
          store.commit("setLookdownFalse");
        }
        x = x + 1;
      });
      function animate() {
        renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        if (controls.enabled) controls.update();
        if (isMobile) controls.mobileMove();
      }
      createScene();
      createLight();
      createControls();
      createObject();
      createSea();
      createLowerSea();
      animate();
    },
  },
};
</script>

<style scoped>
#three {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}


</style>
