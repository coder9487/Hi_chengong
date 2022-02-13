<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import * as THREE from "../../node_modules/three/build/three.module";
// import { PointerLockControls } from "../../node_modules/three/examples/jsm/controls/PointerLockControls";
import { FirstPersonCameraControl } from "../Library/FirstPersonCameraControls";
import store from "../store/index";
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
      let pisirian_load = false;
      let readyForOBJanimation = false;
      let fish_boat;
      let mixer;
      let animation_sword,animation_swordfish_Armature,animation_splash;
      let musician,children,adult,captain,elder,brother_1,brother_2,sea_watcher,a_kon_end;
      let degree = 0;
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
          10000
        );
        camera.position.x = 40;
        camera.position.y = 30; //8
        camera.position.z = -2;
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
        sea.mesh.position.y = 18;
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
          "../models/pisirian.json",
          // called when resource is loaded
          function (obj) {
            console.log(obj)
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            controls.colliders = obj;
            scene.add(obj)
            fish_boat = obj.getObjectByName("fish_boat")
            
            mixer = new THREE.AnimationMixer(obj)       
            animation_splash = mixer.clipAction(obj.animations[0])
            animation_sword = mixer.clipAction(obj.animations[1])
            animation_swordfish_Armature = mixer.clipAction(obj.animations[2])
            animation_swordfish_Armature.setLoop(THREE.LoopOnce)
            animation_splash.setLoop(THREE.LoopOnce)
            
            musician = obj.getObjectByName("musician")
            children = obj.getObjectByName("children")
            adult = obj.getObjectByName("adult")
            captain = obj.getObjectByName("captain")
            elder = obj.getObjectByName("elder")
            brother_1 = obj.getObjectByName("brother_1")
            brother_2 = obj.getObjectByName("brother_2")
            sea_watcher = obj.getObjectByName("sea_watcher")
            a_kon_end = obj.getObjectByName("a_kon_end")
            musician.display = false;
            children.display = false;
            adult.display = false;
            captain.display = false;
            elder.display = false;
            brother_1.display = false;
            brother_2.display = false;
            sea_watcher.display = false;
            a_kon_end.display = false;


            

          },
          // called when loading is in progresses
          function (xhr) {
            // console.log(xhr.loaded)
            // console.log((xhr.loaded / 42534400) * 100 + "% loaded");
            if (xhr.loaded / 42534400 == 1) {
              pisirian_load = true;
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
      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true
          }, 500);
        }
      }
      function flipPositive(obj){
        if (obj.rotation.y < Math.PI){
          obj.rotation.y += 0.05
        }
      }
      function flipNegative(obj){
        if (obj.rotation.y > 0){
          obj.rotation.y -= 0.05
        }
      }
      function animate() {
        if (readyForOBJanimation) renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        if (controls.enabled) controls.update();
        if (isMobile) controls.mobileMove();
        if (pisirian_load) delayForAnimate()
        if (readyForOBJanimation){
          mixer.update(0.016)
          fish_boat.position.y = Math.sin(Date.now()/500)*0.06+1.9;
          // animation_sword.play();
          let temp
          let disTo_musician = camera.position.distanceTo(musician.getWorldPosition(new THREE.Vector3()))
          let disTo_elder = camera.position.distanceTo(elder.getWorldPosition(new THREE.Vector3()))
          let disTo_children = camera.position.distanceTo(children.getWorldPosition(new THREE.Vector3()))
          let disTo_adult = camera.position.distanceTo(adult.getWorldPosition(new THREE.Vector3()))
          let disTo_captain = camera.position.distanceTo(captain.getWorldPosition(new THREE.Vector3()))
          let disTo_brother_1 = camera.position.distanceTo(brother_1.getWorldPosition(new THREE.Vector3()))
          let disTo_brother_2 = camera.position.distanceTo(brother_2.getWorldPosition(new THREE.Vector3()))
          let disTo_sea_watcher = camera.position.distanceTo(sea_watcher.getWorldPosition(new THREE.Vector3()))
          let disTo_a_kon_end = camera.position.distanceTo(a_kon_end.getWorldPosition(new THREE.Vector3()))

          let tmp1 = store.state.pisirianDisplay[0]["id"] 
          let tmp2 = store.state.pisirianDisplay[0]["display"]

          if(disTo_musician < 3 ){  
            temp = musician.display        
            flipPositive(musician)
            musician.display = true;
            if(temp != musician.display) store.commit("pisirianChangeState",{id:'musician',display: true})
          }else {
            flipNegative(musician)
            musician.display = false;
          }
          if(disTo_children < 3 ){
                
            temp = children.display   
            flipPositive(children)
            children.display = true;
            if(temp != children.display) store.commit("pisirianChangeState",{id:'children',display: true})
          }else {
            flipNegative(children)
            children.display = false;
          }
          if(disTo_adult < 3){
            temp = adult.display
            flipPositive(adult)
            adult.display = true;
            if (temp != adult.display) store.commit("pisirianChangeState",{id:'adult',display: true})
          }else {
            flipNegative(adult)
            adult.display = false
          }
          if(disTo_captain < 3){
            temp = captain.display
            flipPositive(captain);
            captain.display = true;
            if (temp != captain.display) store.commit("pisirianChangeState",{id:'captain',display: true})
          }else{
            flipNegative(captain);
            captain.display = false;
          }
          if(disTo_brother_1 < 3){
            temp = brother_1.display
            flipPositive(brother_1);
            brother_1.display = true;
            if (temp != brother_1.display) store.commit("pisirianChangeState",{id:'brother_1',display: true})
          }else{
            flipNegative(brother_1);
            brother_1.display = false;
          }
          if(disTo_brother_2 < 3){
            temp = brother_2.display
            flipPositive(brother_2);
            brother_2.display = true
            if(temp != brother_2.display) store.commit("pisirianChangeState",{id:'brother_2',display: true})
          }else{
            flipNegative(brother_2);
            brother_2.display = false;
          }
          if(disTo_sea_watcher < 3){
            temp = sea_watcher.display
            flipPositive(sea_watcher);
            sea_watcher.display = true;
            if (temp != sea_watcher.display) store.commit("pisirianChangeState",{id:'sea_watcher',display: true})
          }else{
            flipNegative(sea_watcher);
            sea_watcher.display = false;
          }
          if(disTo_a_kon_end < 3){
            temp = a_kon_end.display
            flipPositive(a_kon_end);
            a_kon_end.display = true;
            if (temp != a_kon_end.display) store.commit("pisirianChangeState",{id:'a_kon_end',display: true})
          }else{
            flipNegative(a_kon_end);
            a_kon_end.display = false;
          }
          if(disTo_elder < 3) {      
            temp = elder.display
            flipPositive(elder)
            elder.display = true;
            if (temp != elder.display) store.commit("pisirianChangeState",{id:'elder',display: true})
            animation_swordfish_Armature.play();
            animation_splash.play();
          }else{
            flipNegative(elder)
            elder.display = false;
          }
          
          if (tmp1 != store.state.pisirianDisplay[0]["id"])         
          {
            console.log(store.state.pisirianDisplay[0]["id"])
          }
        }
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