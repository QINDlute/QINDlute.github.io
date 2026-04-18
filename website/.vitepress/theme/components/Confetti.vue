<script setup lang="ts">
import confetti from 'canvas-confetti'
import { inBrowser } from 'vitepress';
import { inject, watch, ref, onMounted, type Ref } from 'vue';
import { LoadingStateKey } from '../index';

// 注入加载状态
const isLoading = inject<Ref<boolean>>(LoadingStateKey, ref(false));
// 标记是否已经播放过纸屑动画
const hasPlayed = ref(false);

// 播放纸屑动画
const playConfetti = () => {
  if (!inBrowser || hasPlayed.value) return;
  
  hasPlayed.value = true;
  
  /* 纸屑 */
  confetti({
      particleCount: 100,
      spread: 170,
      origin: { y: 0.6 },
  });

  /* 雪花屑 */
  var duration = 8 * 1000;
  var animationEnd = Date.now() + duration;
  var skew = 1;

  function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
  }

  (function frame() {
      var timeLeft = animationEnd - Date.now();
      var ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);

      confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: ticks,
          origin: {
              x: Math.random(),
              // since particles fall down, skew start toward the top
              y: (Math.random() * skew) - 0.2
          },
          colors: [document.documentElement.classList.contains('dark') 
              ? '#ffd700'  // 金色 - 暗黑模式
              : '#ff69b4', // 热粉色 - 亮色模式
          ],
          shapes: ['circle'],
          gravity: randomInRange(0.4, 0.6),
          scalar: randomInRange(0.4, 1),
          drift: randomInRange(-0.4, 0.4),
      });

      if (timeLeft > 0) {
          requestAnimationFrame(frame);
      }
  }());
};

// 监听加载状态变化，加载动画结束后播放纸屑动画
watch(
  () => isLoading.value,
  (newValue) => {
    if (newValue === false) {
      // 加载动画结束，播放纸屑动画
      playConfetti();
    }
  }
);

// 组件挂载时，不直接播放，只等待加载状态变化
onMounted(() => {
  // 不再直接播放，只通过 watch 监听加载状态变化
});
</script>