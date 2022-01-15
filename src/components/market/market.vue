<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import * as THREE from "three/build/three.module.js";
import { FirstPersonCameraControl } from "three/src/FirstPersonCameraControls.js";
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
      ///DiningTable
      store.commit("marketOnProgressReset")
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let model_loaded = false;
      let fish_marked_wall_loaded = false;
      let car = false;
      let round = false;
      let boat01,boat02;
      const fishmonger1 = [];
      const fishmonger2 = [];
      const fishmonger3 = [];
      const fishmonger4 = [];
      let readyForOBJanimation = false;

      let coneCommut1;
      let coneCommut2;
      let coneCommut3;
      let coneCommut4;
      let OctahedronChangeScene;
      let displayFishMonger;

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
            amp: ampValue - 0.2,
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
      let temp = 1;
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
            scene.add(obj);
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log(xhr.loaded)
            // console.log((xhr.loaded / 115040681) * 100 + "% loaded");
            let marketOnProgress = parseInt((xhr.loaded / 115040681)*100)

            // console.log(PremarketOnProgress)
            if( marketOnProgress != temp ){
              store.commit("marketOnProgressCount")
              temp = temp + 1;
              console.log("marketPercentage: ", store.state.marketPercentage,"%")
            }
            if (xhr.loaded / 115040681  == 1) {
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
              car = true;
            }
          }
        );

        ///coneCommut
        var geometryCommut1 = new THREE.ConeBufferGeometry( 0.3, 0.3, 4 ); 
        var materialCommut1 = new THREE.MeshLambertMaterial( {color: 0x17B3BE} ); 
        coneCommut1 = new THREE.Mesh( geometryCommut1, materialCommut1 ); 
        coneCommut1.rotation.x = Math.PI ;
        coneCommut2 = coneCommut1.clone();
        coneCommut3 = coneCommut1.clone();
        coneCommut4 = coneCommut1.clone();
        coneCommut1.position.set(5, 1.7+0.3, 3.6)
        coneCommut2.position.set(-3, 1.7+0.3, 4.1)
        coneCommut3.position.set(-1, 1.7+0.3, 4.2)
        coneCommut4.position.set(-20, 1.7+0.3, 3.3)
        fishmonger1.push(coneCommut1)
        fishmonger2.push(coneCommut2)
        fishmonger3.push(coneCommut3)
        fishmonger4.push(coneCommut4)
        scene.add( coneCommut1 );
        scene.add( coneCommut2 );
        scene.add( coneCommut3 );
        scene.add( coneCommut4 );
        ///to calculate ans position
        var geometryChangeScene = new THREE.OctahedronGeometry(0.3);
        var materialChangeScene = new THREE.MeshLambertMaterial({color: 0x4EE4A5});
        OctahedronChangeScene = new THREE.Mesh(geometryChangeScene, materialChangeScene);
        OctahedronChangeScene.position.set( -3.2897138595581*10,0.128223806619644*10,-0.402698934078216*10);
        // scene.add(OctahedronChangeScene);
      }
      ////
      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = true;
        controls.applyCollision = true;
        controls.positionEasing = true;
      }

      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true
          }, 3000);
        }
      }

      function animate() {
        if (fish_marked_wall_loaded && car && round ){
          model_loaded = true;
          store.commit("setMarketLoadedTrue");
          callbacks();
          delayForAnimate()
        }
        if (readyForOBJanimation) renderer.render(scene, camera);
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
        let disOctahedron = Math.cbrt(Math.pow(controls.getObject().position.x
            -OctahedronChangeScene.position.x,2)+Math.pow(controls.getObject().position.y
            -OctahedronChangeScene.position.y,2)+Math.pow(controls.getObject().position.z
            -OctahedronChangeScene.position.z,2))
        if(disOctahedron < 1.5) {
          store.commit("setQuestionMarketDisplayTrue")
        }
        let intersectsFishMonger1 = raycaster.intersectObjects(fishmonger1);
        let intersectsFishMonger2 = raycaster.intersectObjects(fishmonger2);
        let intersectsFishMonger3 = raycaster.intersectObjects(fishmonger3);
        let intersectsFishMonger4 = raycaster.intersectObjects(fishmonger4);
        if (intersectsFishMonger1.length > 0 ) {
              coneCommut1.rotation.y += 0.05;
              displayFishMonger = 1;
          } else{
            }
        if (intersectsFishMonger2.length > 0 ) {
              coneCommut2.rotation.y += 0.05;
              displayFishMonger = 2;
          }else{
            }
        if (intersectsFishMonger3.length > 0 ) {
              coneCommut3.rotation.y += 0.05;
              displayFishMonger = 3;
          }else{
            }
        if (intersectsFishMonger4.length > 0 ) {
              coneCommut4.rotation.y += 0.05;
              displayFishMonger = 4;
          }else{
            }
        if (readyForOBJanimation){
          boat01.position.y = Math.sin(Date.now()/500)*0.05-0.3;
          boat02.position.y = Math.sin(Date.now()/500)*0.05-0.3;
          // console.log(store.state.FishMongerDisplay[0]["id"],store.state.FishMongerDisplay[0]["display"])
        }
      }        
          document.addEventListener("dblclick", function () {
             if (displayFishMonger == 1) store.commit("FishMongerChangeState",{id:'1',display: true})
             if (displayFishMonger == 2) store.commit("FishMongerChangeState",{id:'2',display: true})
             if (displayFishMonger == 3) store.commit("FishMongerChangeState",{id:'3',display: true})
             if (displayFishMonger == 4) store.commit("FishMongerChangeState",{id:'4',display: true})
            });  
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
