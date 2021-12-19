<template>
  <div>
    <canvas id="three"></canvas>
  </div>
  <div id="blocker">
    <div id="instructions">
      <p style="font-size: 36px">點擊畫面開始體驗</p>
      <p>
        Move: WASD<br />
        Up: SPACE<br />
        Down: SHIFT<br />
        Look: MOUSE MOVE
      </p>
    </div>
  </div>
</template>

<script>
import * as THREE from "../../node_modules/three/build/three.module";
// import { PointerLockControls } from "../../node_modules/three/examples/jsm/controls/PointerLockControls";
import { FirstPersonCameraControl } from "../../node_modules/three/src/FirstPersonCameraControls.js";
export default {
  name: "three",
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let mixer_fish,mixer_aiming,mixer_shooting;
      let animationOBJ;
      let clips;
      // let prevTime;
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
        camera.position.x = 5;
        camera.position.y = 5;
        camera.position.z = 0;
        camera.lookAt(0,0,0);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        scene.background = new THREE.CubeTextureLoader()
          .setPath("")
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
        let textWaves = new THREE.TextureLoader().load("images/water4.png");
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

      function createObject() {
        // instantiate a loader
        const loader = new THREE.ObjectLoader();

        // load a resource
        loader.load(
          // resource URL
          "models/sailfish_swim_test.json",
          // called when resource is loaded
          function (obj) {
            // obj.scale.set(100, 100, 100);
            obj.position.set(0, 0, 0);
            // controls.colliders = obj;
            scene.add(obj);
            mixer_fish = new THREE.AnimationMixer(obj);
            clips = obj.animations[0];
            mixer_fish.clipAction(clips).play();
          },
          // called when loading is in progresses
          function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          }
        );

        let j = 0;
        loader.load(
          // resource URL
          "models/spear_aiming.json",

          // onLoad callback
          // Here the loaded data is assumed to be an object
          function (obj) {
            // Add the loaded object to the scene
            obj.scale.multiplyScalar(6);
            mixer_aiming = new THREE.AnimationMixer(obj);
            mixer_aiming.clipAction(obj.animations[0]).play();
            scene.add(obj);
            document.addEventListener("click", function () {
              j++;
              if (j % 2 == 1) {
                obj.visible = true;
              } else {
                obj.visible = false;
              }
            });
          },
          // onProgress callback
          function (xhr) {
            // document.getElementById('loading').innerHTML = (xhr.loaded / xhr.total * 100).toFixed(1) + '% loading';
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          function ( err ) {
		        console.error( 'An error happened' );
	}
        );
        loader.load(
          // resource URL
          "models/spear_shoot.json",

          // onLoad callback
          // Here the loaded data is assumed to be an object
          function (obj) {
            // Add the loaded object to the scene
            obj.scale.multiplyScalar(5);
            obj.visible = false;
            mixer_shooting = new THREE.AnimationMixer(obj);
            animationOBJ = mixer_shooting.clipAction(obj.animations[0]);
            animationOBJ.setLoop(THREE.LoopOnce);
            animationOBJ.clampWhenFinished = true;
            animationOBJ.timeScale = 0.8;
            scene.add(obj);
            animationOBJ.fadeOut(0.5);
            document.addEventListener("click", function () {
              if ( j % 2 == 0) {
                animationOBJ.play();
                obj.visible = true;
              } else if (j % 2 == 1) {
                animationOBJ.stop();
                obj.visible = false;
              }
            });
          },
          // onProgress callback
          function (xhr) {
            // document.getElementById('loading').innerHTML = (xhr.loaded / xhr.total * 100).toFixed(1) + '% loading';
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          function ( err ) {
		        console.error( 'An error happened' );
	}
        );
      }

      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = false;
        controls.applyCollision = false;
        controls.positionEasing = true;
      }

      function animate() {
        // const time = performance.now();
        renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        mixer_fish.update(0.016);
        mixer_aiming.update(0.016);
        mixer_shooting.update(0.016);
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
/* #blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

#instructions {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-image: url(../../public/images/trans_scene.png); */
/* background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
} */
</style>