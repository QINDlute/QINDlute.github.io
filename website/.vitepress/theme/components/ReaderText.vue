<template>
  <div class="reader-text">
    <button
      class="reader-text-button"
      @click="handleRead"
      aria-label="Read text aloud"
    >
      <svg
        class="reader-text-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    </button>
    <div ref="contentRef" class="reader-text-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';

// 全局共享状态 - 用于跟踪当前正在朗读的组件
let globalSpeechSynthesis: SpeechSynthesis | null = null;
let globalVoice: SpeechSynthesisVoice | null = null;
let globalVoicesLoaded = false;
let currentSpeakingComponentId: string | null = null;
let isGlobalInitializing = false;

// 目标语音名称
const TARGET_VOICE = 'Microsoft Libby Online (Natural) - English (United Kingdom)';
const TARGET_VOICE_LANG = 'en-GB';

// 组件实例状态
const componentId = `reader-text-${Math.random().toString(36).substr(2, 9)}`;
const isSpeaking = ref(false);
const isPaused = ref(false);
const contentRef = ref<HTMLElement | null>(null);

// 修复DOM结构，确保所有文本段落都被<p>包裹
const fixParagraphs = () => {
  if (!contentRef.value) return;
  
  const contentElement = contentRef.value;
  let firstTextNodeFound = false;
  
  // 遍历所有子节点
  for (let i = 0; i < contentElement.childNodes.length; i++) {
    const child = contentElement.childNodes[i];
    
    // 处理文本节点
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim() || '';
      if (text) {
        // 创建<p>标签包裹文本
        const p = document.createElement('p');
        p.textContent = text;
        contentElement.insertBefore(p, child);
        contentElement.removeChild(child);
        i--; // 调整索引，因为我们替换了节点
        firstTextNodeFound = true;
      } else {
        // 移除空文本节点
        contentElement.removeChild(child);
        i--;
      }
    }
    // 处理元素节点
    else if (child.nodeType === Node.ELEMENT_NODE) {
      // 跳过已经是<p>标签的元素
      if (child.nodeName === 'P') {
        firstTextNodeFound = true;
        continue;
      }
      
      // 如果是第一个元素节点且还没有找到文本节点，检查其内部是否有直接文本
      if (!firstTextNodeFound) {
        const element = child as HTMLElement;
        if (element.childNodes.length === 1 && element.firstChild?.nodeType === Node.TEXT_NODE) {
          const text = element.firstChild.textContent?.trim() || '';
          if (text) {
            // 创建新的<p>标签
            const p = document.createElement('p');
            p.textContent = text;
            contentElement.insertBefore(p, child);
            contentElement.removeChild(child);
            i--;
            firstTextNodeFound = true;
          }
        }
      }
    }
  }
};

// 语音加载超时处理
let voiceLoadTimeout: number | null = null;
let voicesLoadedAttempts = 0;
const MAX_VOICE_LOAD_ATTEMPTS = 5;

// 存储所有可用语音
let allAvailableVoices: SpeechSynthesisVoice[] = [];

// 获取语音列表 - 独立函数，可在用户交互时调用
const getGlobalVoices = () => {
  if (!globalSpeechSynthesis) return;
  
  voicesLoadedAttempts++;
  const availableVoices = globalSpeechSynthesis!.getVoices();
  
  // 更新全局可用语音列表
  allAvailableVoices = availableVoices;
  
  // console.log(`🔍 Voice check attempt ${voicesLoadedAttempts}: ${availableVoices.length} voices available`);
  
  // 即使没有找到语音，也要继续执行
  if (availableVoices.length === 0) {
    // console.log('ℹ️ No voices available yet, will use browser default');
    // 允许继续执行，浏览器会使用默认语音
    globalVoicesLoaded = true;
    isGlobalInitializing = false;
    return;
  }
  
  // 增强的语音匹配逻辑 - 优化移动端匹配
  let selectedVoice = null;
  
  // 1. 先按语言精确匹配（优先考虑语言，这对移动端更可靠）
  selectedVoice = availableVoices.find(voice => 
    voice.lang === TARGET_VOICE_LANG
  );
  if (selectedVoice) {
    // console.log('✓ Exact lang match found:', selectedVoice.name);
  }
  
  // 2. 精确匹配完整语音名称
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => voice.name === TARGET_VOICE);
    if (selectedVoice) {
      // console.log('✓ Exact name match found:', selectedVoice.name);
    }
  }
  
  // 3. 如果精确匹配失败，尝试更宽松的模糊匹配
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => {
      const voiceLower = voice.name.toLowerCase();
      return (
        (voiceLower.includes('libby') || voiceLower.includes('online')) &&
        voice.lang.startsWith('en-')
      );
    });
    if (selectedVoice) {
      // console.log('✓ Fuzzy match found:', selectedVoice.name);
    }
  }
  
  // 4. 如果模糊匹配失败，尝试匹配任何Microsoft语音
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => 
      voice.name.toLowerCase().includes('microsoft') &&
      voice.lang.startsWith('en-')
    );
    if (selectedVoice) {
      // console.log('✓ Microsoft English voice found:', selectedVoice.name);
    }
  }
  
  // 5. 如果仍然失败，尝试选择任何英语语音
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => 
      voice.lang.startsWith('en-')
    );
    if (selectedVoice) {
      // console.log('✓ English voice found:', selectedVoice.name);
    }
  }
  
  // 6. 如果没有英语语音，选择第一个可用语音
  if (!selectedVoice && availableVoices.length > 0) {
    selectedVoice = availableVoices[0];
    // console.log('✓ Using first available voice:', selectedVoice.name);
  }
  
  // 更新全局语音
  if (selectedVoice) {
    globalVoice = selectedVoice;
    // console.log('=== Voice Updated ===');
    // console.log('Selected voice:', selectedVoice.name);
    // console.log('====================');
  }
  
  // 无论是否找到语音，都允许继续执行
  globalVoicesLoaded = true;
  
  // 清除超时
  if (voiceLoadTimeout) {
    clearTimeout(voiceLoadTimeout);
    voiceLoadTimeout = null;
  }
  
  isGlobalInitializing = false;
};

// 页面卸载时停止所有朗读
const handlePageUnload = () => {
  if (globalSpeechSynthesis) {
    globalSpeechSynthesis.cancel();
    // 重置全局状态
    currentSpeakingComponentId = null;
  }
};

// 初始化全局语音合成
const initGlobalSpeechSynthesis = () => {
  if (!('speechSynthesis' in window)) {
    // console.error('❌ Browser does not support speech synthesis');
    return;
  }
  
  if (isGlobalInitializing) return;
  isGlobalInitializing = true;
  
  globalSpeechSynthesis = window.speechSynthesis;
  
  // 重置尝试次数
  voicesLoadedAttempts = 0;
  
  // 监听语音列表变化
  globalSpeechSynthesis.onvoiceschanged = () => {
    // console.log('🔔 onvoiceschanged event fired!');
    getGlobalVoices();
  };
  
  // 初始获取语音
  const initialVoices = globalSpeechSynthesis.getVoices();
  // console.log(`🚀 Initial voices count: ${initialVoices.length}`);
  
  // 手动触发一次getGlobalVoices
  getGlobalVoices();
  
  // 修复：某些浏览器需要手动触发onvoiceschanged事件
  // 特别是在移动设备上，语音列表可能需要时间加载
  setTimeout(() => {
    const voicesAfterTimeout = globalSpeechSynthesis!.getVoices();
    if (voicesAfterTimeout.length > 0 && voicesAfterTimeout.length > initialVoices.length) {
      // console.log('🔄 Manual voice check after timeout found more voices:', voicesAfterTimeout.length);
      getGlobalVoices();
    }
  }, 1000);
  
  // 设置全局超时
  voiceLoadTimeout = window.setTimeout(() => {
    // console.error('⚠️ Global voice loading timeout (5s)');
    // 超时后允许使用默认语音
    globalVoicesLoaded = true;
    isGlobalInitializing = false;
  }, 5000);
  
  // 监听页面卸载事件，确保关闭页面时停止所有朗读
  window.addEventListener('beforeunload', handlePageUnload);
};

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    // 确保全局语音合成已初始化
    if (!globalSpeechSynthesis) {
      initGlobalSpeechSynthesis();
    }
    
    // 修复段落结构，确保所有文本都被<p>包裹
    fixParagraphs();
  });
});

// 组件销毁前停止朗读（页面离开时触发）
onBeforeUnmount(() => {
  // 如果当前组件正在朗读，停止所有语音
  if (currentSpeakingComponentId === componentId && globalSpeechSynthesis) {
    globalSpeechSynthesis.cancel();
    // 重置全局状态
    currentSpeakingComponentId = null;
    isSpeaking.value = false;
    isPaused.value = false;
  }
});

const handleRead = () => {
  // 确保全局语音合成已初始化
  if (!globalSpeechSynthesis) {
    // console.log('🔄 Initializing speech synthesis...');
    initGlobalSpeechSynthesis();
    // 重新检查浏览器支持
    if (!globalSpeechSynthesis) {
      alert('Your browser does not support speech synthesis.');
      return;
    }
  }
  
  // 获取当前段落内容
  const slotContent = (contentRef.value as HTMLElement).textContent?.trim();
  
  if (!slotContent) {
    alert('No text to read.');
    return;
  }
  
  // 移动端优化：在用户交互时重新检查语音列表
  // 因为移动端浏览器可能只在用户交互时才加载完整的语音列表
  if (voicesLoadedAttempts < MAX_VOICE_LOAD_ATTEMPTS) {
    // console.log('🔄 Rechecking voices on user interaction...');
    getGlobalVoices();
  }
  
  // 检查当前状态
  const isCurrentComponent = currentSpeakingComponentId === componentId;
  const isSpeakingNow = globalSpeechSynthesis.speaking;
  const isPausedNow = globalSpeechSynthesis.paused;
  
  // 状态控制逻辑
  if (isCurrentComponent) {
    // 点击的是当前组件
    if (isPaused.value || isPausedNow) {
      // 当前已暂停，从头开始
      // console.log(`🔄 Restarting speech from beginning for component ${componentId}`);
      
      // 彻底清理当前语音
      globalSpeechSynthesis.cancel();
      
      // 重置内部状态
      isPaused.value = false;
      isSpeaking.value = false;
      
      // 保存当前上下文以便在setTimeout中使用
      const currentSpeechSynthesis = globalSpeechSynthesis;
      const currentSlotContent = slotContent;
      
      // 使用更长的延迟来避免interrupted错误
      // 移动设备需要更多时间来处理cancel()操作
      setTimeout(() => {
        // 更新当前组件ID和状态
        currentSpeakingComponentId = componentId;
        isSpeaking.value = true;
        
        // console.log(`
        // 🎤 Starting speech after restart for component ${componentId}`);
        // console.log('Using voice:', globalVoice ? globalVoice.name : 'Browser default voice');
        
        // 创建新的utterance实例
        const newUtterance = new SpeechSynthesisUtterance(currentSlotContent);
        // 设置语言，浏览器会自动使用匹配的默认语音
        newUtterance.lang = TARGET_VOICE_LANG;
        // 只在globalVoice存在时设置，否则使用浏览器默认语音
        if (globalVoice) {
          newUtterance.voice = globalVoice;
        }
        
        // 改进的事件处理
        newUtterance.onend = () => {
          // console.log(`✅ Speech ended for component ${componentId}`);
          currentSpeakingComponentId = null;
          isSpeaking.value = false;
          isPaused.value = false;
        };
        
        newUtterance.onerror = (event) => {
          // console.error(`❌ Speech error for component ${componentId}:`, event.error);
          // 忽略interrupted错误，因为这是正常的取消操作
          if (event.error === 'interrupted') {
            // console.log('⚠️ Speech interrupted (expected behavior for restart)');
          } else {
            // 其他错误才显示
            // console.error('❌ Unexpected speech error:', event.error);
          }
          currentSpeakingComponentId = null;
          isSpeaking.value = false;
          isPaused.value = false;
        };
        
        // 开始朗读
        try {
          currentSpeechSynthesis.speak(newUtterance);
        } catch (error) {
          // console.error(`❌ Failed to speak for component ${componentId}:`, error);
          currentSpeakingComponentId = null;
          isSpeaking.value = false;
          isPaused.value = false;
        }
      }, 100); // 增加延迟到100ms，给浏览器足够时间处理
      
      return; // 提前返回，避免后续代码执行
    } else if (isSpeakingNow) {
      // 当前正在朗读，暂停
      // console.log(`⏸️ Pausing speech for component ${componentId}`);
      globalSpeechSynthesis.pause();
      isSpeaking.value = false;
      isPaused.value = true;
      return;
    }
  } else {
    // 点击的是不同组件
    // console.log(`🔇 Stopping all speech synthesis`);
    globalSpeechSynthesis.cancel();
    isPaused.value = false;
    // 给浏览器一点时间来处理cancel()操作
    setTimeout(() => {
      // 在新的组件中开始朗读
      startNewSpeech();
    }, 50);
    return;
  }
  
  // 正常启动新的语音（非重启场景）
  startNewSpeech();
  
  // 辅助函数：开始新的语音合成
  function startNewSpeech() {
    // 更新当前组件ID和状态
    currentSpeakingComponentId = componentId;
    isSpeaking.value = true;
    
    // console.log(`
    // 🎤 Starting speech for component ${componentId}`);
    // console.log('Available voices count:', allAvailableVoices.length);
    // console.log('Using voice:', globalVoice ? globalVoice.name : 'Browser default voice');
    
    // 创建新的utterance实例
    const utterance = new SpeechSynthesisUtterance(slotContent);
    // 设置语言，这会让浏览器使用最合适的默认语音
    utterance.lang = TARGET_VOICE_LANG;
    // 只在globalVoice存在时设置，否则使用浏览器默认语音
    if (globalVoice) {
      utterance.voice = globalVoice;
    }
    
    // 改进的事件处理
    utterance.onend = () => {
      // console.log(`✅ Speech ended for component ${componentId}`);
      currentSpeakingComponentId = null;
      isSpeaking.value = false;
      isPaused.value = false;
    };
    
    utterance.onerror = (event) => {
      // console.error(`❌ Speech error for component ${componentId}:`, event.error);
      // 忽略interrupted错误，因为这是正常的切换组件操作
      if (event.error === 'interrupted') {
        // console.log('⚠️ Speech interrupted (expected behavior when switching components)');
      } else {
        // 其他错误才显示
        // console.error('❌ Unexpected speech error:', event.error);
      }
      currentSpeakingComponentId = null;
      isSpeaking.value = false;
      isPaused.value = false;
    };
    
    // 开始朗读
    try {
      globalSpeechSynthesis.speak(utterance);
    } catch (error) {
      // console.error(`❌ Failed to speak for component ${componentId}:`, error);
      currentSpeakingComponentId = null;
      isSpeaking.value = false;
      isPaused.value = false;
      alert('Failed to start speech. Please try again.');
    }
  }
};
</script>

<style scoped>
.reader-text {
  display: block;
  position: relative;
  padding-top: 20px;
}

.reader-text-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.reader-text-button:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-primary);
}

.reader-text-button:active {
  transform: scale(0.98);
}

.reader-text-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.reader-text-button:disabled:hover {
  background-color: transparent;
  color: var(--vp-c-text-2);
}

.reader-text-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .reader-text-button {
    padding: 3px 6px;
    margin-right: 6px;
  }
  
  .reader-text-icon {
    width: 14px;
    height: 14px;
  }
}
</style>