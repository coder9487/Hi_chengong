<template>
  <div>
    <canvas id="three"></canvas>
    <canvas id="circle"></canvas>
  </div>
</template>

<script>
import * as THREE from "three/build/three.module.js";
import { FirstPersonCameraControl } from "../FirstPersonCameraControls.js";
import store from "../../store/index";
export default {
  name: "three",
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      store.commit("marketTableOnProgressReset")
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let coneIntro1;
      let coneIntro2;
      let coneIntro3;
      let coneIntro4;
      let coneIntro5;
      let coneIntro6;
      let marketTable_loaded = false;
      let model_loaded = false;
      let displayFood1 = false;
      let displayFood2 = false;
      let displayFood3 = false;
      let displayFood4 = false;
      let displayFood5 = false;
      let displayFood6 = false;      
      let whiteradishslice1,whiteradishslice2;

      const objects1 = [];
      const objects2 = [];
      const objects3 = [];
      const objects4 = [];
      const objects5 = [];
      const objects6 = [];
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
        camera.position.x = -48.3;
        camera.position.y = 1.25;
        camera.position.z = -0.2;
        camera.lookAt(-48.5,-9,-15);

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
        let temp = 1;
        loader.load(
          // resource URL
          "../models/market_table.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            scene.add(obj);
            whiteradishslice1 = obj.getObjectByName("Plane062");
            whiteradishslice2 = obj.getObjectByName("Plane044");

            whiteradishslice1.visible = false;
            whiteradishslice2.visible = false;
          },
          // called when loading is in progresses
          function (xhr) {
            console.log(xhr.loaded)
            let marketTableOnProgress = parseInt((xhr.loaded / 109568636)*100)
            // console.log(PremarketOnProgress)
            if( marketTableOnProgress != temp && store.state.marketTablePercentage <= 100){
              store.commit("marketTableOnProgressCount")
              temp = temp + 1;
              console.log("marketTablePercentage: ", store.state.marketTablePercentage,"%")
            }
            if (xhr.loaded / 109568636  == 1) {   
              marketTable_loaded = true;
            }
          }
        );
        var geometryIntro1 = new THREE.ConeBufferGeometry( 0.04, 0.04, 4 ); 
        var materialIntro1 = new THREE.MeshLambertMaterial( {color: 0x67DAD5} ); 
        coneIntro1 = new THREE.Mesh( geometryIntro1, materialIntro1 );   
        coneIntro1.rotation.x = Math.PI;
        coneIntro2 = coneIntro1.clone();
        coneIntro3 = coneIntro1.clone();
        coneIntro4 = coneIntro1.clone();
        coneIntro5 = coneIntro1.clone();
        coneIntro6 = coneIntro1.clone();
        coneIntro1.position.set(-4.80968475341796*10, 0.102379404008388*10-0.1, -0.0722323656082153*10)///海豬腳
        coneIntro2.position.set(-4.86205768585205*10, 0.102379404008388*10-0.1, -0.106271788477897*10)///肚臍橙
        coneIntro3.position.set(-4.83438825607299*10, 0.0999452471733093*10-0.1, -0.0740058720111846*10)///生魚片
        coneIntro4.position.set(-4.83099460601806*10, 0.111665286123752*10-0.1, -0.104491479694843*10)///柴魚味噌湯
        coneIntro5.position.set(-4.86796474456787*10+0.08, 0.0991516187787056*10-0.1, -0.0747929289937019*10)///鬼頭刀魚排
        coneIntro6.position.set(-4.80510187149047*10, 0.102379404008388*10-0.1, -0.10084480792284*10)///碗粿
        objects1.push(coneIntro1)
        objects2.push(coneIntro2)
        objects3.push(coneIntro3)
        objects4.push(coneIntro4)
        objects5.push(coneIntro5)
        objects6.push(coneIntro6)
        scene.add( coneIntro1 );
        scene.add( coneIntro2 );
        scene.add( coneIntro3 );
        scene.add( coneIntro4 );
        scene.add( coneIntro5 );
        scene.add( coneIntro6 );
      }

      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = true;
        controls.applyCollision = true;
        controls.positionEasing = true;
      }
      function animate() {
        if(marketTable_loaded) model_loaded = true;
        if(model_loaded) renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        // if (controls.enabled) controls.update();
        if (isMobile) controls.mobileMove();

        let vector = new THREE.Vector3();
        let raycaster = new THREE.Raycaster(
          controls.getObject().position,
          controls.getDirection(vector).clone()
        );
        let intersects1 = raycaster.intersectObjects(objects1);
        let intersects2 = raycaster.intersectObjects(objects2);
        let intersects3 = raycaster.intersectObjects(objects3);
        let intersects4 = raycaster.intersectObjects(objects4);
        let intersects5 = raycaster.intersectObjects(objects5);
        let intersects6 = raycaster.intersectObjects(objects6);
        if(model_loaded){
          if (intersects1.length > 0 ) {
            coneIntro1.rotation.y += 0.05;
            displayFood1 = true; // 海豬腳
            // console.log("海豬腳")
          } else if (intersects1.length == 0 ) {
            displayFood1 = false;
          }
          if (intersects2.length > 0 ) {
            displayFood2 = true; //肚臍橙
            coneIntro2.rotation.y += 0.05;
            // console.log("肚臍橙")
          } else if (intersects2.length == 0) {
            displayFood2 = false;
          }
          if (intersects3.length > 0  ) {
            coneIntro3.rotation.y += 0.05;
            displayFood3 = true; //生魚片
            // console.log("生魚片")
          } else if (intersects3.length == 0 ) {
            displayFood3 = false;
          }
          if (intersects4.length > 0  ) {
            coneIntro4.rotation.y += 0.05;
            displayFood4 = true; //味噌湯
            // console.log("味噌湯")
          } else if (intersects4.length == 0) {
            displayFood4 = false;
          }
          if (intersects5.length > 0 ) {
            coneIntro5.rotation.y += 0.05;
            displayFood5 = true; //鬼頭刀魚排
            // console.log("鬼頭刀魚排")
          } else if (intersects5.length == 0 ) {
            displayFood5 = false;
          }
          if (intersects6.length > 0 ) {
            coneIntro6.rotation.y += 0.05;
            // console.log("碗粿")
            displayFood6 = true; //碗粿
          } else if (intersects6.length == 0 ) {
            displayFood6 = false;
          }
        }
        // console.log(store.state.FoodDisplay[0]["id"],store.state.FoodDisplay[0]["display"])
        // console.log(displayFood)
      }
          document.addEventListener("dblclick", function () {
             if (displayFood1) store.commit("FoodChangeState",{id:'1',display:true})//海豬腳
             if (displayFood2) store.commit("FoodChangeState",{id:'2',display:true})//肚臍橙
             if (displayFood3) store.commit("FoodChangeState",{id:'3',display:true})//生魚片
             if (displayFood4) store.commit("FoodChangeState",{id:'4',display:true})//味噌湯
             if (displayFood5) store.commit("FoodChangeState",{id:'5',display:true})//鬼頭刀魚排
             if (displayFood6) store.commit("FoodChangeState",{id:'6',display:true})//碗粿
            });  
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
#circle {
  width: 10px;
  height: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 99em;
  background-color:white ;
}
</style>