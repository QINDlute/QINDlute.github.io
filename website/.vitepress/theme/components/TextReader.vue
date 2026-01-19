<template>
  <div class="text-reader">
    <button
      class="text-reader-button"
      @click="handleRead"
      aria-label="Read text aloud"
    >
      <svg
        class="text-reader-icon"
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
    <div ref="contentRef"><slot></slot></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

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
const componentId = `text-reader-${Math.random().toString(36).substr(2, 9)}`;
const isSpeaking = ref(false);
const isPaused = ref(false);
const contentRef = ref<HTMLElement | null>(null);

// 语音加载超时处理
let voiceLoadTimeout: number | null = null;
let voicesLoadedAttempts = 0;
const MAX_VOICE_LOAD_ATTEMPTS = 5;

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
  
  // 获取语音列表
  const getGlobalVoices = () => {
    voicesLoadedAttempts++;
    const availableVoices = globalSpeechSynthesis!.getVoices();
    
    if (availableVoices.length === 0) {
      // console.log(`⏳ Waiting for voices to load... Attempt ${voicesLoadedAttempts}/${MAX_VOICE_LOAD_ATTEMPTS}`);
      
      // 限制尝试次数
      if (voicesLoadedAttempts < MAX_VOICE_LOAD_ATTEMPTS) {
        // 增加延迟，避免过于频繁的尝试
        setTimeout(getGlobalVoices, 500);
      } else {
        // console.error('⚠️ Voice loading timed out after multiple attempts');
        // 尝试使用默认语音，不依赖具体语音加载
        globalVoicesLoaded = true;
        isGlobalInitializing = false;
      }
      return;
    }
    
    // 详细记录可用语音，便于调试
    // console.log('=== Available Voices on this device ===');
    availableVoices.forEach((voice, index) => {
      // console.log(`${index + 1}. ${voice.name} (${voice.lang}) - ${voice.default ? '(default)' : ''}`);
    });
    // console.log('=====================================');
    
    // 增强的语音匹配逻辑 - 更灵活，适应移动端
    let selectedVoice = null;
    
    // 检测是否为移动端
    const isMobile = navigator.userAgent.match(/Mobile|mobile|Android|iOS|iPhone|iPad/i) !== null;
    // console.log(`📱 Device type: ${isMobile ? 'Mobile' : 'Desktop'}`);
    
    // 更详细的设备信息
    // console.log(`💻 Device info: ${navigator.userAgent}`);
    
    // 1. 精确匹配完整语音名称
    selectedVoice = availableVoices.find(voice => voice.name === TARGET_VOICE);
    if (selectedVoice) {
      // console.log('✓ Exact match found:', selectedVoice.name);
    }
    
    // 2. 移动端特殊处理 - 更灵活的匹配逻辑，特别针对Microsoft Libby语音
    if (!selectedVoice && isMobile) {
      // 移动端可能有不同的语音名称格式，使用更灵活的匹配
      selectedVoice = availableVoices.find(voice => {
        const voiceLower = voice.name.toLowerCase();
        // 移动端可能只有简化的语音名称
        return (
          // 优先匹配包含"libby"的语音
          voiceLower.includes('libby') ||
          // 其次匹配包含"online"和"en-GB"的Microsoft语音
          (voiceLower.includes('microsoft') && 
           voiceLower.includes('online') && 
           (voice.lang === 'en-GB' || voiceLower.includes('uk')))
        );
      });
      if (selectedVoice) {
        // console.log('✓ Mobile Libby voice match found:', selectedVoice.name);
      }
    }
    
    // 3. 增强的模糊匹配 - 针对不同平台的语音名称变化
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => {
        const voiceLower = voice.name.toLowerCase();
        return (
          // 匹配关键特征：Microsoft + (Libby或Online) + 英语 + 英国
          voiceLower.includes('microsoft') &&
          (voiceLower.includes('libby') || voiceLower.includes('online')) &&
          (voiceLower.includes('english') || voice.lang.startsWith('en-')) &&
          (voiceLower.includes('uk') || voiceLower.includes('united kingdom') || voice.lang === 'en-GB')
        );
      });
      if (selectedVoice) {
        // console.log('✓ Enhanced fuzzy match found:', selectedVoice.name);
      }
    }
    
    // 4. 基于语音URI的匹配 - 有些浏览器使用URI标识在线语音
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => {
        // 检查voice.voiceURI属性（如果存在）
        if ('voiceURI' in voice) {
          const uri = (voice as any).voiceURI.toLowerCase();
          return uri.includes('libby') || 
                 (uri.includes('microsoft') && uri.includes('en-gb') && uri.includes('online'));
        }
        return false;
      });
      if (selectedVoice) {
        // console.log('✓ Voice URI match found:', selectedVoice.name);
      }
    }
    
    // 5. Microsoft UK英语语音 - 其他Microsoft英国英语语音
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('microsoft') &&
        (voice.lang === 'en-GB' || voice.name.toLowerCase().includes('uk')) &&
        voice.name.toLowerCase().includes('online')
      );
      if (selectedVoice) {
        // console.log('✓ Microsoft Online UK English voice found:', selectedVoice.name);
      }
    }
    
    // 6. 任何在线英国英语语音
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => 
        (voice.name.toLowerCase().includes('online') || voice.name.toLowerCase().includes('neural')) &&
        voice.lang === 'en-GB'
      );
      if (selectedVoice) {
        // console.log('✓ Online UK English voice found:', selectedVoice.name);
      }
    }
    
    // 7. 任何英国英语语音
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => voice.lang === 'en-GB');
      if (selectedVoice) {
        // console.log('✓ UK English voice found:', selectedVoice.name);
      }
    }
    
    // 8. 任何英语语音
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en-'));
      if (selectedVoice) {
        // console.log('✓ English voice found:', selectedVoice.name);
      }
    }
    
    // 9. 有默认标记的语音
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(voice => voice.default);
      if (selectedVoice) {
        // console.log('✓ Default voice found:', selectedVoice.name);
      }
    }
    
    // 10. 第一个可用语音
    if (!selectedVoice && availableVoices.length > 0) {
      selectedVoice = availableVoices[0];
      // console.log('✓ Using first available voice:', selectedVoice.name);
    }
    
    // 即使没有找到语音，也要标记为已加载，允许使用默认语音
    globalVoice = selectedVoice || null;
    globalVoicesLoaded = true;
    
    // console.log('=== Global Voice Initialized ===');
    // console.log('Selected voice:', selectedVoice?.name || 'Default voice');
    // console.log('==============================');
    
    // 清除超时
    if (voiceLoadTimeout) {
      clearTimeout(voiceLoadTimeout);
      voiceLoadTimeout = null;
    }
    
    isGlobalInitializing = false;
  };
  
  // 监听语音列表变化
  globalSpeechSynthesis.onvoiceschanged = getGlobalVoices;
  
  // 初始获取语音
  getGlobalVoices();
  
  // 设置全局超时
  voiceLoadTimeout = window.setTimeout(() => {
    // console.error('⚠️ Global voice loading timeout (5s)');
    // 超时后允许使用默认语音
    globalVoicesLoaded = true;
    isGlobalInitializing = false;
  }, 5000);
};

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    // 确保全局语音合成已初始化
    if (!globalSpeechSynthesis) {
      initGlobalSpeechSynthesis();
    }
  });
});

const handleRead = () => {
  // 检查浏览器支持
  if (!globalSpeechSynthesis) {
    alert('Your browser does not support speech synthesis.');
    return;
  }
  
  // 获取当前段落内容
  const slotContent = (contentRef.value as HTMLElement).textContent?.trim();
  
  if (!slotContent) {
    alert('No text to read.');
    return;
  }
  
  // 语音状态检查 - 改进版，更适合移动端
  if (!globalVoicesLoaded) {
    // 如果还没有初始化，立即初始化
    if (!globalSpeechSynthesis && !isGlobalInitializing) {
      // console.log('⏳ Initializing speech synthesis...');
      initGlobalSpeechSynthesis();
      // 不显示alert，让用户等待并尝试再次点击
      return;
    }
    
    // 如果正在初始化，不重复提示
    if (isGlobalInitializing) {
      // console.log('⏳ Still initializing, please try again shortly...');
      return;
    }
  }
  
  // 不再严格要求globalVoice，允许浏览器使用默认语音
  // 如果没有找到特定语音，浏览器会自动使用默认语音
  if (!globalVoice) {
    // console.log('ℹ️ No specific voice found, using browser default');
    // 继续执行，不阻止朗读
  }
  
  // 1. 检查当前状态
  const isCurrentComponent = currentSpeakingComponentId === componentId;
  const isSpeakingNow = globalSpeechSynthesis.speaking;
  const isPausedNow = globalSpeechSynthesis.paused;
  
  // console.log(`📋 Current state for component ${componentId}:`);
  // console.log(`   - isCurrentComponent: ${isCurrentComponent}`);
  // console.log(`   - isSpeakingNow: ${isSpeakingNow}`);
  // console.log(`   - isPausedNow: ${isPausedNow}`);
  // console.log(`   - isPaused.value: ${isPaused.value}`);
  // console.log(`   - isSpeaking.value: ${isSpeaking.value}`);
  
  // 2. 处理不同状态
  if (isCurrentComponent) {
    if (isPaused.value || isPausedNow) {
      // 当前已暂停，从头开始
      // console.log(`🔄 Restarting speech from beginning for component ${componentId}`);
      
      // 彻底清理当前语音
      globalSpeechSynthesis.cancel();
      
      // 重置内部状态
      isPaused.value = false;
      isSpeaking.value = false;
      
      // 立即启动新语音，不使用setTimeout，避免移动端浏览器拒绝
      // 更新当前组件ID和状态
      currentSpeakingComponentId = componentId;
      isSpeaking.value = true;
      
      // console.log(`\n🎤 Starting speech after restart for component ${componentId}`);
      // console.log('Using voice:', globalVoice ? globalVoice.name : 'Browser default voice');
      
      // 创建新的utterance实例
      const newUtterance = new SpeechSynthesisUtterance(slotContent);
      // 只有当globalVoice存在时才设置，否则使用浏览器默认语音
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
        }
        currentSpeakingComponentId = null;
        isSpeaking.value = false;
        isPaused.value = false;
      };
      
      // 开始朗读
      try {
        globalSpeechSynthesis.speak(newUtterance);
      } catch (error) {
        // console.error(`❌ Failed to speak for component ${componentId}:`, error);
        currentSpeakingComponentId = null;
        isSpeaking.value = false;
        isPaused.value = false;
      }
    } else if (isSpeakingNow) {
      // 当前正在朗读，暂停
      // console.log(`⏸️ Pausing speech for component ${componentId}`);
      globalSpeechSynthesis.pause();
      isSpeaking.value = false;
      isPaused.value = true;
    }
  } else {
    // 点击的是不同组件
    // console.log(`🔇 Stopping all speech synthesis`);
    globalSpeechSynthesis.cancel();
    isPaused.value = false;
    
    // 正常启动新的语音
    // 更新当前组件ID和状态
    currentSpeakingComponentId = componentId;
    isSpeaking.value = true;
    
    // console.log(`\n🎤 Starting speech for component ${componentId}`);
    // console.log('Using voice:', globalVoice ? globalVoice.name : 'Browser default voice');
    
    // 创建新的utterance实例
    const utterance = new SpeechSynthesisUtterance(slotContent);
    // 只有当globalVoice存在时才设置，否则使用浏览器默认语音
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
      // 忽略interrupted错误，因为这是正常的取消操作
      if (event.error === 'interrupted') {
        // console.log('⚠️ Speech interrupted (expected behavior when switching components)');
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
.text-reader {
  display: block;
  position: relative;
  padding-top: 20px;
}

.text-reader-button {
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

.text-reader-button:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-primary);
}

.text-reader-button:active {
  transform: scale(0.98);
}

.text-reader-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.text-reader-button:disabled:hover {
  background-color: transparent;
  color: var(--vp-c-text-2);
}

.text-reader-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .text-reader-button {
    padding: 3px 6px;
    margin-right: 6px;
  }
  
  .text-reader-icon {
    width: 14px;
    height: 14px;
  }
}
</style>