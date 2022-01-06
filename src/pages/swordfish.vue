<template>
  <div>
    <canvas id="three"></canvas>
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
      let objects = [];
      let animation_aiming,animation_shooting,animation_fish;
      let aim = false;
      let spear_aiming_loaded = false;
      let spear_shooting_loaded = false;
      let fish_load = false;

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
            obj.scale.set(4, 4, 4);
            obj.position.set(0, 0, 0);
            objects.push(obj);
            scene.add(obj);
            mixer_fish = new THREE.AnimationMixer(obj);
            animation_fish = mixer_fish.clipAction(obj.animations[0]).play();
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            if (xhr.loaded / 3541040 == 1) fish_load = true;
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
            animation_aiming = mixer_aiming.clipAction(obj.animations[0]).play();
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
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            if (xhr.loaded / 3609819 == 1) spear_aiming_loaded = true;
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
            animation_shooting = mixer_shooting.clipAction(obj.animations[0]);
            animation_shooting.setLoop(THREE.LoopOnce);
            animation_shooting.clampWhenFinished = true;
            animation_shooting.timeScale = 0.8;
            scene.add(obj);
            animation_shooting.fadeOut(0.5);
            document.addEventListener("click", function () {
              if ( j % 2 == 0) {
                animation_shooting.play();
                obj.visible = true;
              } else if (j % 2 == 1) {
                animation_shooting.stop();
                obj.visible = false;
              }
            });
          },
          // onProgress callback
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            if (xhr.loaded / 3581460 == 1) spear_shooting_loaded = true;
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
        let vector = new THREE.Vector3();
        let raycaster = new THREE.Raycaster(
          controls.getObject().position,
          controls.getDirection(vector).clone()
        );
        let intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0){
          console.log("aimed")
          aim = true
        }else {
          console.log("aiming");
          aim = false;
        }
        if (mixer_fish != null && mixer_aiming != null && mixer_shooting != null) {
          mixer_fish.update(0.001);
          mixer_aiming.update(0.016);
          mixer_shooting.update(0.032);
        }
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