<template>
  <div data-v-10119189 data-v-98ddab3d class="VPDoc has-sidebar has-aside">
    <div class="carousel">
      <div 
      v-for="(item, index) in carouselItems" 
      :key="index"
      :class="['carousel-item', `carousel-item--${index + 1}`, { active: isMounted && currentIndex === index }]"
    >
        <div class="carousel-item_info">
        <p v-if="item.subtitle" class="carousel-item_subtitle">{{ item.subtitle }}</p>
        <h2 class="carousel-item_title">{{ item.title }}</h2>
        <p v-if="item.description" class="carousel-item_description">{{ item.description }}</p>
      </div>
        <div class="carousel-item_poem">
          <div class="poem-content">
            <p v-for="(line, lineIndex) in item.poem.split('\n')" :key="lineIndex" class="poem-line" :style="{ '--line-index': lineIndex }">{{ line }}</p>
          </div>
        </div>
      </div>
      <div v-if="carouselItems.length > 1" class="carousel_nav">
        <div class="carousel_arrow" @click="prevSlide">
          <svg class="carousel_icon" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
          </svg>
        </div>
        <div class="carousel_arrow" @click="nextSlide">
          <svg class="carousel_icon" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 接收外部传入的数据
const props = defineProps({
  // 轮播数据，支持从外部传入
  items: {
    type: Array,
    default: () => []
  }
});

// 计算轮播数据，优先使用外部传入的数据，如果外部数据为空则使用默认数据
const carouselItems = computed(() => {
  // 如果外部传入了有效数据，则使用外部数据
  if (props.items && props.items.length > 0) {
    return props.items;
  }
  // 否则返回默认数据
  return [
    {
      subtitle: '唐诗',
      title: '静夜思',
      description: '李白 (唐代)',
      poem: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡'
    },
    {
      subtitle: '唐诗',
      title: '登鹳雀楼',
      description: '王之涣 (唐代)',
      poem: '白日依山尽\n黄河入海流\n欲穷千里目\n更上一层楼'
    },
    {
      subtitle: '唐诗',
      title: '春晓',
      description: '孟浩然 (唐代)',
      poem: '春眠不觉晓\n处处闻啼鸟\n夜来风雨声\n花落知多少'
    },
    {
      subtitle: '唐诗',
      title: '相思',
      description: '王维 (唐代)',
      poem: '红豆生南国\n春来发几枝\n愿君多采撷\n此物最相思'
    },
    {
      subtitle: '唐诗',
      title: '赋得古原草送别',
      description: '白居易 (唐代)',
      poem: '离离原上草\n一岁一枯荣\n野火烧不尽\n春风吹又生'
    }
  ];
});

const currentIndex = ref(0);
const isMounted = ref(false); // 标记是否已挂载

// 初始化动画：页面加载后添加active类，触发动画
onMounted(() => {
  // 延迟添加active类，确保CSS动画能够触发
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});

// 保持原来的轮播切换速度，不添加额外延迟
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselItems.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + carouselItems.value.length) % carouselItems.value.length;
};
</script>

<style scoped>
.carousel {
  width: 100%;
  height: 550px;
  display: flex;
  max-width: 900px;
  max-height: 550px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px 0 rgb(0 0 0 / 40%);
}

.carousel-item {
  visibility: hidden;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  background-color: #fff;
  flex-shrink: 0;
  z-index: 0;
  transition: 0.6s all linear;
}

.carousel-item_info { /* 轮播项的文本信息 */
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  order: 1;
  left: 0;
  margin: 0;
  padding: 0 40px;
  width: 40%;
}

.carousel-item_poem { /* 轮播项的诗词内容 */
  width: 60%;
  height: 100%;
  order: 2;
  align-self: flex-end;
  flex-basis: 60%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transform: translateX(100%);
  transition: 0.6s all ease-in-out;
  padding: 30px; /* 增加内边距以容纳诗词内容 */
}

.poem-content {
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  line-height: 2.5;
  color: #333;
  max-width: 80%;
}

.poem-line { /* 诗词行 */
  margin: 0;
  padding: 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-in-out;
}

.carousel-item.active .poem-line {
  opacity: 1;
  transform: translateY(0);
  transition-delay: calc(var(--line-index) * 0.1s);
}

.carousel-item_subtitle {
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 3px;
  font-size: 10px;
  text-transform: uppercase;
  margin: 0;
  color: #7E7E7E;
  font-weight: 700;
  transform: translateY(25%);
  opacity: 0;
  visibility: hidden;
  transition: 0.4s all ease-in-out;
}

.carousel-item_title {
  margin: 15px 0 0 0;
  font-family: 'Playfair Display', serif;
  font-size: 44px;
  line-height: 45px;
  letter-spacing: 3px;
  font-weight: 700;
  text-align: center;
  color: #2C2C2C;
  transform: translateY(25%);
  opacity: 0;
  visibility: hidden;
  transition: 0.6s all ease-in-out;
}

.carousel-item_description {
  transform: translateY(25%);
  opacity: 0;
  visibility: hidden;
  transition: 0.6s all ease-in-out;
  margin-top: 35px;
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  color: #7e7e7e;
  line-height: 22px;
  margin-bottom: 35px;
}



.carousel_nav {
  position: absolute;
  right: 0;
  z-index: 2;
  background-color: transparent; /* 半透明背景 */
  bottom: 0;
  transition: background-color 0.3s ease;
}

.carousel_icon {
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  fill: #5d5d5d;
}

.carousel_arrow { /* 轮播导航箭头 */
  cursor: pointer;
  display: inline-block;
  padding: 11px 15px;
  position: relative;
  transition: all 0.3s ease;
}

/* 导航区域悬停效果 */
.carousel_nav:hover {
  background-color: rgba(255, 255, 255, 0.8); /* 悬停时背景更不透明 */
}

.carousel_arrow:hover {
  background-color: rgba(255, 255, 255, 1); /* 悬停时箭头背景变为不透明 */
}

.carousel_arrow:nth-child(1):after { /* 轮播导航箭头 - 前一个 */
  content: '';
  right: -3px;
  position: absolute;
  width: 1px;
  background-color: #b0b0b0;
  height: 14px;
  top: 50%;
  margin-top: -7px;
}

.carousel-item.active {
  z-index: 1;
  display: flex;
  visibility: visible;
}

.carousel-item.active .carousel-item_subtitle,
.carousel-item.active .carousel-item_title,
.carousel-item.active .carousel-item_description {
  transform: translateY(0);
  opacity: 1;
  transition: 0.6s all ease-in-out;
  visibility: visible;
}

.carousel-item.active .carousel-item_poem {
  transition: 0.6s all ease-in-out;
  transform: translateX(0);
}

/* 诗词区域样式 */
.carousel-item--1 .carousel-item_poem {
  background-color: #f0f4f8;
}

.carousel-item--2 .carousel-item_poem {
  background-color: #f8f0f4;
}

.carousel-item--3 .carousel-item_poem {
  background-color: #f4f8f0;
}

.carousel-item--4 .carousel-item_poem {
  background-color: #fff0f0;
}

.carousel-item--5 .carousel-item_poem {
  background-color: #f0fff0;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  /* 修改轮播容器的高度为自适应 */
  .carousel {
    height: auto;
    max-height: none;
    min-height: 550px;
  }
  
  /* 修改轮播项的布局为垂直排列 */
  .carousel-item {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    height: auto;
    min-height: 550px;
  }
  
  /* 调整标题区域的样式 */
  .carousel-item_info {
    width: 100%;
    height: auto;
    order: 1;
    padding: 30px 20px 0px 20px ; /* 增加内边距 */
    flex-direction: column;
    text-align: center;
  }
  
  /* 调整诗词区域的样式 */
  .carousel-item_poem {
    width: 100%;
    height: 400px;
    order: 2;
    padding: 4px;
    transform: translateY(100%);
    position: relative; /* 添加相对定位，用于定位导航按钮 */
  }
  
  /* 调整导航按钮的位置 */
  .carousel_nav {
    position: absolute;
    right: 20px; /* 距离右侧20px */
    bottom: 20px; /* 距离底部20px */
    left: auto; /* 重置左侧定位 */
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* 调整诗词内容的字体大小 */
  .poem-content {
    font-size: 20px;
    line-height: 2;
    max-width: 90%;
  }
  
  /* 调整标题大小 */
  .carousel-item_title {
    font-size: 32px;
    line-height: 36px;
    margin: 10px 0;
  }
  
  /* 调整激活状态的动画 */
  .carousel-item.active .carousel-item_poem {
    transform: translateY(0);
  }
}
</style>