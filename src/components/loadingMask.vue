<script setup>
import {useCounterStore} from "../store/counter";
import {onMounted, reactive, watch} from "vue";

const store = useCounterStore();

let data = reactive({
  isLoading: false,
});

let timer = null;

watch(() => store.isLoading, (newStatus) => {
  // 没有加载 => 开始加载
  if (data.isLoading === false && newStatus === true) data.isLoading = newStatus;

  // 正在加载 => 加载完毕
  else if (data.isLoading === true && newStatus === false) {
    //防抖
    setTimeout(
        () => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            data.isLoading = newStatus;
          }, 500);
        },
        500,
    );
  }
}, {immediate: true});

function addCanvas() {
  let canvasObj = {};

  canvasObj.Particle = function (opt) {
    this.radius = 15;
    this.x = opt.x;
    this.y = opt.y;
    this.angle = opt.angle;
    this.speed = opt.speed;
    this.accel = opt.accel;
    this.decay = 0.007;
    this.life = 0.7;
  };

  canvasObj.Particle.prototype.step = function (i) {
    this.speed += this.accel;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += canvasObj.PI / 64;
    this.accel *= 1.04;
    this.life -= this.decay;

    if (this.life <= 0) {
      canvasObj.particles.splice(i, 1);
    }
  };

  canvasObj.Particle.prototype.draw = function (i) {
    canvasObj.ctx.fillStyle = canvasObj.ctx.strokeStyle = "hsla(" + (canvasObj.tick + (this.life * 1200)) + ", 100%, 50%, " + this.life + ")";
    canvasObj.ctx.beginPath();
    if (canvasObj.particles[i - 1]) {
      canvasObj.ctx.moveTo(this.x, this.y);
      canvasObj.ctx.lineTo(canvasObj.particles[i - 1].x, canvasObj.particles[i - 1].y);
    }
    canvasObj.ctx.stroke();

    canvasObj.ctx.beginPath();
    canvasObj.ctx.arc(this.x, this.y, Math.max(0.001, this.life * this.radius), 0, canvasObj.TWO_PI);
    canvasObj.ctx.fill();

    let size = Math.random() * 1.25;
    canvasObj.ctx.fillRect(~~(this.x + ((Math.random() - 0.5) * 35) * this.life), ~~(this.y + ((Math.random() - 0.5) * 35) * this.life), size, size);
  };

  canvasObj.step = function () {
    let rotateSpeed = 0.17;
    canvasObj.particles.push(new canvasObj.Particle({
      x: canvasObj.width / 2 + Math.cos(canvasObj.tick * rotateSpeed) * canvasObj.min / 2,
      y: canvasObj.height / 2 + Math.sin(canvasObj.tick * rotateSpeed) * canvasObj.min / 2,
      angle: canvasObj.globalRotation + canvasObj.globalAngle,
      speed: 0,
      accel: 0.005,
    }));

    canvasObj.particles.forEach(function (elem, index) {
      elem.step(index);
    });

    canvasObj.globalRotation += canvasObj.PI / 3;
    canvasObj.globalAngle += canvasObj.PI / 3;
  };

  canvasObj.draw = function () {
    canvasObj.ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);

    canvasObj.particles.forEach(function (elem, index) {
      elem.draw(index);
    });
  };

  canvasObj.init = function () {
    canvasObj.canvas = document.createElement("canvas");
    canvasObj.ctx = canvasObj.canvas.getContext("2d");
    canvasObj.width = 200;
    canvasObj.height = 200;
    canvasObj.canvas.width = canvasObj.width * window.devicePixelRatio;
    canvasObj.canvas.height = canvasObj.height * window.devicePixelRatio;
    canvasObj.canvas.style.width = canvasObj.width + "px";
    canvasObj.canvas.style.height = canvasObj.height + "px";
    canvasObj.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvasObj.min = canvasObj.width * 0.5;
    canvasObj.particles = [];
    canvasObj.globalAngle = 0;
    canvasObj.globalRotation = 0;
    canvasObj.tick = 0;
    canvasObj.PI = Math.PI;
    canvasObj.TWO_PI = canvasObj.PI * 2;
    canvasObj.ctx.globalCompositeOperation = "lighter";

    canvasObj.loop();
    document.querySelector("#canvasContainer").appendChild(canvasObj.canvas);
  };

  canvasObj.loop = function () {
    requestAnimationFrame(canvasObj.loop);
    canvasObj.step();
    canvasObj.draw();
    canvasObj.tick++;
  };

  canvasObj.init();
}

onMounted(() => {
  addCanvas();
});
</script>


<template>
  <div v-show="data.isLoading">
    <div class="Mask"></div>
    <div id="canvasContainer"></div>
  </div>
</template>


<style scoped>
.Mask {
  background-color: #111;
  opacity: 25%;
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999
}

#canvasContainer {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
}

</style>