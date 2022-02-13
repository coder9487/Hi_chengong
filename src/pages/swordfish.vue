<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import * as THREE from "../../node_modules/three/build/three.module";
// import { PointerLockControls } from "../../node_modules/three/examples/jsm/controls/PointerLockControls";
import { FirstPersonCameraControl } from "../Library/FirstPersonCameraControls";
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
      const objects = [];
      const objects2 = [];
      let mixer
      let animation_fish;
      let sword_fish_loaded = false;
      // let sworfish_loaded = false;
      // let spear_loaded = false;
      let model_loaded = false;
      let pole,pole_head,plane,origin,posit,direct,man;
      let readyForOBJanimation = false;
      let fish;
      let animation0,animation1,animation2,animation3,animation4
      let animation5,animation6,animation7,animation8,animation9;
      let animation10,animation11,animation12,animation13,animation14;
      let animation15,animation16,animation17,animation18,animation19;
      let animation20,animation21,animation22,animation23,animation24;
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
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
          75,
          window.innerWidth / window.innerHeight,
          0.01,
          1000
        );
        camera.position.x = 5;
        camera.position.y = 6;
        camera.position.z = 0;
        camera.lookAt(-5,0.5,0);

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
        textWaves.repeat.set(160, 160);

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
            amp: ampValue + 0.1,
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
        objects.push(sea.mesh)

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

        loader.load(
          // resource URL
          "models/swordfish.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            scene.add(obj);
            // console.log(obj)
            fish = obj.children[0];
            console.log(fish.getWorldPosition(new THREE.Vector3()))
            mixer = new THREE.AnimationMixer(obj);
            
            pole = obj.getObjectByName("spear");
            man = obj.getObjectByName("Armature001")
            pole_head = pole.children[0];
            animation0 = mixer.clipAction(obj.animations[0]).play()
            animation1 = mixer.clipAction(obj.animations[1]).play()
            animation2 = mixer.clipAction(obj.animations[2]).play()
            animation3 = mixer.clipAction(obj.animations[3]).play()
            animation4 = mixer.clipAction(obj.animations[4]).play()

            animation5 = mixer.clipAction(obj.animations[5]).play()
            animation6 = mixer.clipAction(obj.animations[6]).play()
            animation7 = mixer.clipAction(obj.animations[7]).play()
            animation8 = mixer.clipAction(obj.animations[8]).play()
            animation9 = mixer.clipAction(obj.animations[9]).play()

            // animation10 = mixer.clipAction(obj.animations[10]).play() // shooter
            animation11 = mixer.clipAction(obj.animations[11]).play()
            animation12 = mixer.clipAction(obj.animations[12]).play()
            animation13 = mixer.clipAction(obj.animations[13]).play()
            animation14 = mixer.clipAction(obj.animations[14]).play()

            animation15 = mixer.clipAction(obj.animations[15]).play()
            animation16 = mixer.clipAction(obj.animations[16]).play()
            animation17 = mixer.clipAction(obj.animations[17]).play()
            animation18 = mixer.clipAction(obj.animations[18]).play()
            animation19 = mixer.clipAction(obj.animations[19]).play()

            animation20 = mixer.clipAction(obj.animations[20]).play()
            animation21 = mixer.clipAction(obj.animations[21]).play()
            animation22 = mixer.clipAction(obj.animations[22]).play()
            animation23 = mixer.clipAction(obj.animations[23]).play()
            animation24 = mixer.clipAction(obj.animations[24]).play()


          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            // console.log(xhr.loaded)
            if (xhr.loaded / 4732415 == 1) sword_fish_loaded = true;
            // console.log(xhr.loaded / 4732415) *100
          }
        );
        let geo = new THREE.PlaneBufferGeometry(8000, 8000, 1, 1);
        let mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide,opacity:0.1 });
        plane = new THREE.Mesh(geo, mat);
        plane.position.set(0,10,0)
        plane.rotation.x = Math.PI/2;
        plane.visible = false;
        objects2.push(plane);
        scene.add(plane);
      }

      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true
          }, 300);
        }
      }
      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = false;
        controls.applyCollision = false;
        controls.positionEasing = true;
      }
      let poleGo = false;
      document.addEventListener("click", function () {
        poleGo = true;
      })
      function onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      }
      window.addEventListener( 'mousemove', onMouseMove, false );
      function animate() {
        // const time = performance.now();
        if(sword_fish_loaded) {
          model_loaded = true;
         delayForAnimate();
        }

        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        raycaster.setFromCamera(mouse,camera)
        if(readyForOBJanimation){
          renderer.render(scene, camera);
          mixer.update(0.016);

          let intersects = raycaster.intersectObjects(objects);
          if(intersects.length > 0){
            origin = intersects[0].point;
            posit = new THREE.Vector3(1.7277862131595612,5.302516222000122,-0.40740348398685455)
            direct = posit.sub(origin).normalize();
            let raycasterToSky = new THREE.Raycaster(origin,direct);
            let intersectSky = raycasterToSky.intersectObjects(objects2);
            let skyPosition = intersectSky[0].point;
            if (!poleGo) {
              pole.lookAt(skyPosition.x,skyPosition.y,skyPosition.z);
              man.lookAt(intersects[0].point.y*0.05,4.3,intersects[0].point.z*0.05);
            }
            if (poleGo) {
              pole.translateY(-0.00098*2);
              pole.translateZ(-0.01);
              pole.translateZ(-0.01);
            }



            let pohe = pole_head.getWorldPosition(new THREE.Vector3())
            let fish_position = fish.getWorldPosition(new THREE.Vector3())
            
            let dis = pohe.distanceTo(fish_position)
            if(dis < 0.4 ){
              alert("You hit!")
            }else if(pohe.y < -2){
              pole.position.set(0.17277,0.53,-0.04074)
              poleGo = false;
            }
          }
        }
        if (controls.enabled) controls.update();
        // if (isMobile) controls.mobileMove();
        sea.mesh.position.x += 0.13;
        // sea.mesh.position.z -= 0.02;
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