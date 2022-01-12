<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import * as THREE from "three/build/three.module";
import { FirstPersonCameraControl } from "three/src/FirstPersonCameraControls";
import { lottie } from 'lottie-web'
import store from "../../store/index";
export default {
  name: "three",
  mounted() {
    useQuasar().loading.show({
      message: "Loading ",
    });

    this.initThree(useQuasar().loading.hide);
    // useQuasar().loading.hide();
  },
  data() {
    return {
      animation: {},
    };
  },
  watch: {},
  methods: {
    initThree(callbacks) {
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let changeSceneIndex = false;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let model_loaded = false;
      let fish_marked_wall_loaded = false;
      let end_button_loaded = false;
      let mixer1;
      let mixer2;
      let animationOBJ1;
      let animationOBJ2;
      let icon1 = false;
      let icon2 = false;
      let changeSceneIcon = false;
      let boat01,boat02;
      const objects1 = [];
      const objects2 = [];
      const objectChangeSceneIcon = [];

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

        renderer.gammaFactor = 2.2;
        renderer.gammaOutput = true;

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
        camera.position.x = -1;
        camera.position.y = 1;
        camera.position.z = 0;
        camera.lookAt(-5, 1.5, 0);

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
        sea.mesh.position.y = -4;
        sea.mesh.castShadow = false;
        sea.mesh.receiveShadow = true;
      }

      function createLowerSea() {
        Lowersea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(Lowersea.mesh);
        Lowersea.mesh.position.y = -8;
        Lowersea.mesh.castShadow = false;
        Lowersea.mesh.receiveShadow = true;
      }

      function createObject() {
        // instantiate a loader
        const loader = new THREE.ObjectLoader();
        // load a resource
        loader.load(
          // resource URL
          "../models/market2.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            obj.alphaTest = 0.7;
            obj.opacity = 0.5;
            controls.colliders = obj;
            boat01 = obj.getObjectByName("boat01")
            boat02 = obj.getObjectByName("boat02")
            objects1.push(obj);
            scene.add(obj);

          },
          // called when loading is in progresses
          function (xhr) {
            // console.log(xhr.loaded)
            console.log((xhr.loaded / 115040681) * 100 + "% loaded");
            if (xhr.loaded / 115040681 == 1) {
              fish_marked_wall_loaded = true;
            }
          }
        );
        loader.load(
          // resource URL
          "../models/round.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            // obj.alphaTest = 0.5;
            // scene.add(obj);
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            // console.log(xhr.loaded);
            if (xhr.loaded / 145454 == 1) {
              round = true;
            }
          }
        );
        loader.load(
          // resource URL
          "../models/car.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(8, 8, 8);
            obj.position.set(0, 1.5, 0);
            
            scene.add(obj);
            
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log(xhr.loaded); // 29346
            if (xhr.loaded / 819743 == 1) {
              icon1 = true;
            }
          }
        );
        loader.load(
          // resource URL
          "../models/icon_test.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(8, 8, 8);
            obj.position.set(-5, 1.5, 3);
            objects2.push(obj);
            scene.add(obj);
            mixer2 = new THREE.AnimationMixer(obj);
            animationOBJ2 = mixer2.clipAction(obj.animations[1]);
            animationOBJ2.timeScale = 10000;
            animationOBJ2.clampWhenFinished = true;
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / 456874) * 100 + "% loaded"); // 29346
            // console.log(xhr.loaded)
            if (xhr.loaded / 31750 == 1) {
              icon2 = true;
            }
          }
        );

        loader.load(
          // resource URL
          "../models/icon_test.json",
          // called when resource is loaded
          function (obj) {
            // obj.scale.set(2, 2, 2);
            obj.position.set(-5, 1.5, 0);
            objects1.push(obj);
            scene.add(obj);
            mixer1 = new THREE.AnimationMixer(obj);
            animationOBJ1 = mixer1.clipAction(obj.animations[1]);
            animationOBJ1.timeScale = 10000;
            animationOBJ1.clampWhenFinished = true;
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / 456874) * 100 + "% loaded"); // 29346
            //console.log(xhr.loaded);
            if (xhr.loaded / 31750 == 1) {
              icon1 = true;
            }
          }
        );
        loader.load(
          // resource URL
          "../models/icon_test.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(10, 10, 10);
            obj.position.set(-5, 1.5, 3);
            objects2.push(obj);
            scene.add(obj);
            mixer2 = new THREE.AnimationMixer(obj);
            animationOBJ2 = mixer2.clipAction(obj.animations[1]);
            animationOBJ2.timeScale = 10000;
            animationOBJ2.clampWhenFinished = true;
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / 456874) * 100 + "% loaded"); // 29346
            //console.log(xhr.loaded);
            if (xhr.loaded / 31750 == 1) {
              icon2 = true;
            }
          }
        );
        loader.load(
          // resource URL
          "../models/end_button.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(5, 5, 5);
            obj.position.set(-30, 5, -20);
            objectChangeSceneIcon.push(obj);
            scene.add(obj);

            document.addEventListener("click", function () {
              if (changeSceneIndex) {
                console.log("changing scene"); ////jump to marketTable
                store.commit("setChangeSceneIndexTrue"); 
                console.log(store.state.ChangeSceneIndex);
              }
            });
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            // console.log(xhr.loaded)
            // if (xhr.loaded / 1347056 == 1) end_button_loaded = true;
            console.log((xhr.loaded / 1347056) * 100 + "% loaded");
            if (xhr.loaded / 1347056 == 1) {
              end_button_loaded = true;
            }
          }
        );
      }

      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = true;
        controls.applyCollision = true;
        controls.positionEasing = true;
      }
      function animate() {
        if (fish_marked_wall_loaded && icon1 && icon2 && end_button_loaded){
        // if (fish_marked_wall_loaded && end_button_loaded) {
          model_loaded = true;
          store.commit("setMarketLoadedTrue");
          callbacks();
        }
        renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        //console.log(model_loaded)
        if (controls.enabled) controls.update();
        if (isMobile) controls.mobileMove();
        let vector = new THREE.Vector3();
        let raycaster = new THREE.Raycaster(
          controls.getObject().position,
          controls.getDirection(vector).clone()
        );

        let intersects1 = raycaster.intersectObjects(objects1);
        if (intersects1.length > 0 && model_loaded == true) {
          animationOBJ1.play();
          mixer1.update(0.016);
        } else if (intersects1.length == 0 && model_loaded == true) {
          animationOBJ1.stop();
        }

        let intersects2 = raycaster.intersectObjects(objects2);
        if (intersects2.length > 0 && model_loaded == true) {
          animationOBJ2.play();
          mixer2.update(0.016);
        } else if (intersects2.length == 0 && model_loaded == true) {
          animationOBJ2.stop();
        }

        let intersectsEndButton = raycaster.intersectObjects(
          objectChangeSceneIcon
        );
        if (intersectsEndButton.length > 0 && model_loaded == true) {
          changeSceneIndex = true;
        } else if (intersects2.length == 0 && model_loaded == true) {
          changeSceneIndex = false;
        }
        // console.log(model_loaded)
        if(model_loaded){
          // console.log(model_loaded)
          // boat01.position.y = Math.sin(Date.now()/1000)*0.1-0.2;
          // boat02.position.y = Math.sin(Date.now()/1000)*0.1-0.2;
          // console.log(boat01.position.y)

        }
      }
      createScene();
      createLight();
      createControls();
      createObject();
      createSea();
      createLowerSea();
      //callbacks()
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
