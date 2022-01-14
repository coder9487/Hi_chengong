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
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let model_loaded = false;
      let fish_marked_wall_loaded = false;

      let car = false;
      let round = false;
      let toMarketSceneIndex = false;
      let boat01,boat02;
      const objects1 = [];
      const objects2 = [];
      const objects3 = [];
      const objects4 = [];
      const toMarket = [];
      let readyForOBJanimation = false;

      var coneCommut1;
      var coneCommut2;
      var coneCommut3;
      var coneCommut4;
      var materialAns1;
      var OctahedronChangeScene;
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
            if (store.state.marketPercentage  == 100) {
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


        ///coneComuut
        var geometryCommut1 = new THREE.ConeBufferGeometry( 0.3, 0.3, 4 ); 
        var materialCommut1 = new THREE.MeshLambertMaterial( {color: 0x17B3BE} ); 
        var coneCommut1 = new THREE.Mesh( geometryCommut1, materialCommut1 ); 
        coneCommut1.rotation.x = Math.PI ;
        coneCommut2 = coneCommut1.clone();
        coneCommut3 = coneCommut1.clone();
        coneCommut4 = coneCommut1.clone();
        coneCommut1.position.set(5, 1.7+0.3, 3.6)
        coneCommut2.position.set(-1.8, 1.7+0.3, 4.1)
        coneCommut3.position.set(-1, 1.7+0.3, 4.2)
        coneCommut4.position.set(-20, 1.7+0.3, 3.3)
        scene.add( coneCommut1 );
        scene.add( coneCommut2 );
        scene.add( coneCommut3 );
        scene.add( coneCommut4 );
        ///
        ///coneAns
        var geometryAns1 = new THREE.ConeBufferGeometry( 0.3, 0.3, 4 ); 
        var materialAns1 = new THREE.MeshLambertMaterial( {color: 0xFEA30B} ); 
        materialAns1 = new THREE.Mesh( geometryAns1, materialAns1 ); 
        materialAns1.position.set(-4.07197666168212*10,0.169902980327606*10+0.3,-0.622704148292541*10)
        materialAns1.rotation.x = Math.PI ;
        scene.add(materialAns1)
        ///
        ///octahedron
        let count = 0;
        var geometryChangeScene = new THREE.OctahedronGeometry(0.3);
        var materialChangeScene = new THREE.MeshLambertMaterial({color: 0x4EE4A5});
        OctahedronChangeScene = new THREE.Mesh(geometryChangeScene, materialChangeScene);
        OctahedronChangeScene.position.set( -48.36,1.7,-1.01);
        toMarket.push(OctahedronChangeScene);
        scene.add(OctahedronChangeScene);
        document.addEventListener("click", function () {
             if(toMarketSceneIndex) count++;
             if(toMarketSceneIndex && count > 1) store.commit("settoMarketTableSceneIndexTrue")
            });
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
          // do the stuff
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
        // console.log(controls.getObject().position)
        // console.log(OctahedronChangeScene.position)
        let disOctahedron = Math.cbrt(Math.pow(controls.getObject().position.x-OctahedronChangeScene.position.x,2)+Math.pow(controls.getObject().position.y-OctahedronChangeScene.position.y,2)+Math.pow(controls.getObject().position.z-OctahedronChangeScene.position.z,2))
        let dis = false;
        if(disOctahedron < 2) {
          OctahedronChangeScene.rotation.y += 0.05;
          dis = true;
        }
        // let intersects1 = raycaster.intersectObjects(objects1);
        // if (intersects1.length > 0 && model_loaded == true) {
        //   animationOBJ1.play();
        //   mixer1.update(0.016);
        // } else if (intersects1.length == 0 && model_loaded == true) {
        //   animationOBJ1.stop();
        // }

        // let intersects2 = raycaster.intersectObjects(objects2);
        // if (intersects2.length > 0 && model_loaded == true) {
        //   animationOBJ2.play();
        //   mixer2.update(0.016);
        // } else if (intersects2.length == 0 && model_loaded == true) {
        //   animationOBJ2.stop();
        // }
        let intersectstoMarketTable = raycaster.intersectObjects(
          toMarket
        );
        if (intersectstoMarketTable.length > 0 && dis && model_loaded == true) {
          toMarketSceneIndex = true;
          OctahedronChangeScene.material.color.set(0xffffff)
        } else if (intersectstoMarketTable.length == 0 && dis && model_loaded == true) {
          toMarketSceneIndex = false;
          OctahedronChangeScene.material.color.set(0x4EE4A5)
        }
            
        if (readyForOBJanimation){
          boat01.position.y = Math.sin(Date.now()/500)*0.05-0.3;
          boat02.position.y = Math.sin(Date.now()/500)*0.05-0.3;
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
