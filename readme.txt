###FirstPersonCameraControls.js我放在node_module/three/src/

##images和models我放在public/

##store/index.js 是我寫的vuex，裡面有Forward、Right、Left、Lookup、Lookdown
是給手機板控制的
store.commit("setRotationRightTrue");//就會鏡頭向右轉
store.commit("setRotationRightFalse");//鏡頭停下來

剩下的display1、display2...是之後要用來點擊icon讓你呼叫2D圖像用的。

store.commit("setFalse1");
store.commit("setTrue1");

照他們的設定場景順序是market=>pisirian=>lantern=>swordfish。