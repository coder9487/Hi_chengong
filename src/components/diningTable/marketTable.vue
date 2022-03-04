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
import { useQuasar } from "quasar";
export default {
  name: "three",
  mounted() {
        useQuasar().loading.show({
      message: "Loading ",
    });
    this.initThree(useQuasar().loading.hide);
  },
  methods: {
    initThree(callback) {
      store.commit("marketTableOnProgressReset")
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      let readyForOBJanimation = false;
      let marketTable_loaded = false;
      let model_loaded = false;

      let displayFood1 = false;
      let displayFood2 = false;
      let displayFood3 = false;
      let displayFood4 = false;
      let displayFood5 = false;
      let displayFood6 = false;      
      
      let boat01,boat02;
      let meal = 2;  //預設顯示的吃飯桌檔案
      let a_kon_normal,a_kon_hover;
      let hai_di_ca,sashimi,mahi_fish,miso_soup,orange,wan_que;
      let hai_y,sahi_y,mahi_y,miso_y,orange_y,wan_que_y;
      let a_kon2D = false;
      const a_kon = [];
      const hai = []
      const sashi = []
      const mahi = []
      const miso = []
      const ora = []
      const wan = []
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();    
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
        switch(meal){
          case 1:
            loader.load(
            // resource URL
            "../models/meal01.json",
            // called when resource is loaded
            function (obj) {
              obj.scale.set(10, 10, 10);
              obj.position.set(0, 0, 0);
              scene.add(obj);
              boat01 = obj.getObjectByName("boat01")
              boat02 = obj.getObjectByName("boat02")
              a_kon_normal = obj.getObjectByName("a_kon_normal")
              a_kon_hover = obj.getObjectByName("a_kon_hover")
              hai_di_ca = obj.getObjectByName("hai_di_ca")
              sashimi = obj.getObjectByName("sashimi")
              mahi_fish = obj.getObjectByName("mahi_fish")
              miso_soup = obj.getObjectByName("miso_soup")
              hai_y = hai_di_ca.position.y
              sahi_y = sashimi.position.y
              mahi_y = mahi_fish.position.y
              miso_y = miso_soup.position.y
              hai.push(hai_di_ca)
              sashi.push(sashimi)
              mahi.push(mahi_fish)
              miso.push(miso_soup)
              a_kon_hover.visible = false;
              a_kon.push(a_kon_normal)
            },
            // called when loading is in progresses
            function (xhr) {
              // console.log(xhr.loaded)
              if (xhr.loaded / 94047597  == 1) {   
                marketTable_loaded = true;
                callback()
              }
            }
          );
          break
          case 2:
            loader.load(
            // resource URL
            "../models/meal02.json",
            // called when resource is loaded
            function (obj) {
              obj.scale.set(10, 10, 10);
              obj.position.set(0, 0, 0);
              scene.add(obj);
              boat01 = obj.getObjectByName("boat01")
              boat02 = obj.getObjectByName("boat02")
              a_kon_normal = obj.getObjectByName("a_kon_normal")
              a_kon_hover = obj.getObjectByName("a_kon_hover")
              hai_di_ca = obj.getObjectByName("hai_di_ca")
              sashimi = obj.getObjectByName("sashimi")
              mahi_fish = obj.getObjectByName("mahi_fish")
              miso_soup = obj.getObjectByName("miso_soup")
              orange = obj.getObjectByName("orange")
              wan_que = obj.getObjectByName("wan_que")
              hai_y = hai_di_ca.position.y
              sahi_y = sashimi.position.y
              mahi_y = mahi_fish.position.y
              miso_y = miso_soup.position.y
              orange_y = orange.position.y
              wan_que_y = wan_que.position.y
              hai.push(hai_di_ca)
              sashi.push(sashimi)
              mahi.push(mahi_fish)
              miso.push(miso_soup)
              ora.push(orange)
              wan.push(wan_que)
              a_kon_hover.visible = false;
              a_kon.push(a_kon_normal)
            },
            // called when loading is in progresses
            function (xhr) {
              console.log(xhr.loaded)
              if (xhr.loaded / 96573644  == 1) {   
                marketTable_loaded = true;
                callback()
              }
            }
          );
          break
          case 3:
            loader.load(
            // resource URL
            "../models/meal03.json",
            // called when resource is loaded
            function (obj) {
              obj.scale.set(10, 10, 10);
              obj.position.set(0, 0, 0);
              // scene.add(obj);
              boat01 = obj.getObjectByName("boat01")
              boat02 = obj.getObjectByName("boat02")
              a_kon_normal = obj.getObjectByName("a_kon_normal")
              a_kon_hover = obj.getObjectByName("a_kon_hover")
              sashimi = obj.getObjectByName("sashimi")
              miso_soup = obj.getObjectByName("miso_soup")
              sahi_y = sashimi.position.y
              miso_y = miso_soup.position.y
              sashi.push(sashimi)
              miso.push(miso_soup)
              a_kon_hover.visible = false;
              a_kon.push(a_kon_normal)
              console.log(obj)
            },
            // called when loading is in progresses
            function (xhr) {
              console.log(xhr.loaded);
              if (xhr.loaded / 86459852  == 1) {   
                marketTable_loaded = true;
                callback()
              }
            }
          );
          case 4:
            loader.load(
            // resource URL
            "../models/meal04.json",
            // called when resource is loaded
            function (obj) {
              obj.scale.set(10, 10, 10);
              obj.position.set(0, 0, 0);
              scene.add(obj);
              boat01 = obj.getObjectByName("boat01")
              boat02 = obj.getObjectByName("boat02")
              a_kon_normal = obj.getObjectByName("a_kon_normal")
              a_kon_hover = obj.getObjectByName("a_kon_hover")
              hai_di_ca = obj.getObjectByName("hai_di_ca")
              miso_soup = obj.getObjectByName("miso_soup")
              orange = obj.getObjectByName("orange")
              wan_que = obj.getObjectByName("wan_que")
              hai_y = hai_di_ca.position.y
              miso_y = miso_soup.position.y
              orange_y = orange.position.y
              wan_que_y = wan_que.position.y
              hai.push(hai_di_ca)
              miso.push(miso_soup)
              ora.push(orange)
              wan.push(wan_que)
              a_kon_hover.visible = false;
              a_kon.push(a_kon_normal)
            },
            // called when loading is in progresses
            function (xhr) {
              if (xhr.loaded / 90310211  == 1) {   
                marketTable_loaded = true;
                callback()
              }
            }
          );
        }
      }

      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = true;
        controls.applyCollision = true;
        controls.positionEasing = true;
      }
      function onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      }
      window.addEventListener( 'mousemove', onMouseMove, false );

      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true
          }, 500);
        }
      }
      
      function animate() {
        if(marketTable_loaded) model_loaded = true;
        if(model_loaded) renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        // if (controls.enabled) controls.update();
        if (isMobile) controls.mobileMove();

        raycaster.setFromCamera( mouse, camera );
        let intersects_hai = raycaster.intersectObjects(hai);
        let intersects_sashimi = raycaster.intersectObjects(sashi);
        let intersects_mahi_fish = raycaster.intersectObjects(mahi);
        let intersects_miso_soup = raycaster.intersectObjects(miso);
        let intersects_orange = raycaster.intersectObjects(ora);
        let intersects_wan_que = raycaster.intersectObjects(wan);
        let intersects_a_kon = raycaster.intersectObjects(a_kon);
        if(marketTable_loaded) delayForAnimate()
        if (readyForOBJanimation){
          boat01.position.y = Math.sin(Date.now()/500)*0.05-0.3;
          boat02.position.y = Math.sin(Date.now()/500)*0.05-0.3;
          if(intersects_a_kon.length > 0){
            a_kon_normal.visible = false;
            a_kon_hover.visible = true;
            a_kon2D = true;
          }else{
            a_kon_normal.visible = true;
            a_kon_hover.visible = false;
            a_kon2D = false;
          }
          if(intersects_hai.length > 0){          
            while(hai_di_ca.position.y <= hai_y+0.002)
            hai_di_ca.position.y += 0.000001;
          }else if (meal == 1 || meal == 2 || meal == 4){
            hai_di_ca.position.y = hai_y
          }
          if(intersects_sashimi.length > 0){          
            while(sashimi.position.y <= sahi_y+0.002)
            sashimi.position.y += 0.000001;
          }else if (meal ==1 || meal ==2 || meal ==3){
            sashimi.position.y = sahi_y
          }
          if(intersects_mahi_fish.length > 0){          
            while(mahi_fish.position.y <= mahi_y+0.002)
            mahi_fish.position.y += 0.000001;
          }else if (meal == 1 || meal == 2){
            mahi_fish.position.y = mahi_y
          }
          if(intersects_miso_soup.length > 0){          
            while(miso_soup.position.y <= miso_y+0.002)
            miso_soup.position.y += 0.000001;
          }else if (meal == 1 || meal == 2 || meal == 3 || meal == 4){
            miso_soup.position.y = miso_y
          }
          if(intersects_orange.length > 0){          
            while(orange.position.y <= orange_y+0.002)
            orange.position.y += 0.000001;
          }else if (meal == 2 || meal == 4){
            orange.position.y = orange_y
          }
          if(intersects_wan_que.length > 0){          
            while(wan_que.position.y <= wan_que_y+0.002)
            wan_que.position.y += 0.000001;
          }else if (meal ==2 || meal == 4){
            wan_que.position.y = wan_que_y
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
             if (a_kon2D) store.commit("FoodChangeState",{id:'6',display:true})//碗粿
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
/* #circle {
  width: 10px;
  height: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 99em;
  background-color:white ;
} */
</style>