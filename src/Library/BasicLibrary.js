import * as THREE from "three/build/three.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import {
  BokehShader,
  BokehDepthShader,
} from "three/examples/jsm/shaders/BokehShader2";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

export class GlobalScene {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }
  TuneRender(post_processing) {
    // this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(0.8);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = false; // 設定需渲染陰影效果
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.gammaFactor = 3; //2.2
    this.renderer.gammaOutput = true;
    if (post_processing) {
      const composer = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(this.scene, this.camera);
      const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

      composer.addPass(gammaCorrectionPass);
      composer.addPass(renderPass);

      /** */

      const bokeh_shader = BokehShader;

      // postprocessibokeh_uniformsng. = THREE.UniformsUtils.clone( bokeh_shader.uniforms );
      return composer;
    }
  }
  AddLight() {
    let LightArray = new Array();
    // LightArray.push(new THREE.AmbientLight(0xffffff,4));

    LightArray.push(new THREE.HemisphereLight(0x00aeff, 0x080820, 3.1));
    LightArray.push(new THREE.RectAreaLight(0xff6969, 4.1, 100, 100));

    LightArray[1].position.set(0, 50, 0);

    LightArray[1].lookAt(LightArray[1].position.x, 0, LightArray[1].position.z);

    // LightArray.push(new THREE.PointLight(0x060075, 4.1, 100));
    // LightArray[2].position.set(0, 30, 0);
    // LightArray.push(new THREE.PointLight(0xb55202, 0.5, 25));
    // LightArray[3].position.set(30, 5, 0);
    // LightArray.push(new THREE.RectAreaLight(0x541500, 10, 100, 20));
    // LightArray[4].position.set(0, 0, -10);
    // LightArray[4].lookAt(
    //   LightArray[4].position.x,
    //   LightArray[4].position.y,
    //   1000
    // );
    // LightArray.push(new THREE.RectAreaLight(0x00e0e0, 7.1, 100, 20));
    // LightArray[5].position.set(0, 0, -10);
    // LightArray[5].lookAt(
    //   LightArray[5].position.x,
    //   LightArray[5].position.y,
    //   -1000
    // );

    for (let i = 0; i <= LightArray.length; i++) {
      this.scene.add(LightArray[i]);
      // console.log(LightArray[i]);
    }
  }
}

export class EventHandler {
  static onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  static onWindowResize(event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  onClick() {}
}
export class ArrowHelper {
  constructor(start,scene) {
    const dir =  new THREE.Vector3(0, 1, 0);
    this.scene = scene

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const origin = start
    const length = 5;
    const hex = 0xff0000;

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    this.scene.add(arrowHelper);
    return arrowHelper;
  }
}
