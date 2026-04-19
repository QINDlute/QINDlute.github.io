<script setup lang="ts">
import { onMounted, watch, nextTick, inject, ref, type Ref } from 'vue'
import { useRoute, useData, onContentUpdated } from 'vitepress'
import { LoadingStateKey } from '../index'

interface Props {
  defaultAllFold?: boolean
  height?: number
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultAllFold: true,
  height: 400,
  threshold: 50
})

const route = useRoute()
const { frontmatter } = useData()

// 从 index.ts 注入加载状态
const isLoading = inject<Ref<boolean>>(LoadingStateKey, ref(false))

/**
 * 兼容代码块组
 * @param el 元素
 * @param height 限制高度
 */
const observer = (el: HTMLElement, height: number) => {
  console.log(`[CodeblocksFold] 为代码块组添加监听器:`, el)
  
  // 完全按照原始插件的实现，只添加阈值功能
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const _el = mutation.target as HTMLElement
      
      // 计算折叠阈值
      const foldThreshold = props.height + props.threshold
      
      if (mutation.attributeName === 'class' && _el.classList.contains('active') && _el.offsetHeight > foldThreshold) {
        console.log(`[CodeblocksFold] 代码块变为 active 且高度超过阈值:`, _el)
        fold(_el, height)
      }
    })
  }).observe(el, {
    attributeFilter: ['class']
  })
}

/**
 * 判断是否是代码块组中未显示的代码块
 * @param el 元素
 * @param height 高度
 */
const judge = (el: HTMLElement, height: number) => {
  const displayStatus: string = window.getComputedStyle(el, null).getPropertyValue('display')
  const isDetailBlock: boolean = el.parentElement!.classList.contains('details')
  if (displayStatus === 'none' || isDetailBlock) {
    observer(el, height)
  } else {
    fold(el, height)
  }
}

/**
 * 折叠与展开
 * @param el 代码块元素
 * @param height 限制高度
 */
const fold = (el: HTMLElement, height: number) => {
  if (el.classList.contains('fold')) {
    return
  }
  el.classList.add('fold')
  const pres = el.querySelectorAll('pre')!
  pres.forEach(pre => {
    pre.style.height = height + 'px'
    pre.style.overflow = 'hidden'
  })
  el.style.marginBottom = '48px'
  el.style.borderRadius = '8px 8px 0 0'
  const foldBtn = document.createElement('div')
  const mask = document.createElement('div')
  mask.style.backgroundImage = 'linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, var(--vp-code-block-bg) 100%)'
  mask.className = 'codeblocks-mask'
  foldBtn.style.backgroundColor = 'var(--vp-code-block-bg)'
  foldBtn.className = 'fold-btn'
  foldBtn.insertAdjacentHTML('afterbegin', `<svg t="1680893932803" class="fold-btn-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1473" width="16" height="16" style="fill: var(--vp-code-block-bg); filter: invert(100%)"><path d="M553.1392 778.88512l451.61472-451.61472c22.64576-22.64576 22.64576-59.4176 0-82.14016-22.64576-22.64576-59.4176-22.64576-82.14016 0l-410.5472 410.61888-410.61888-410.624c-22.64576-22.64576-59.4176-22.64576-82.14016 0-22.64576 22.64576-22.64576 59.4176 0 82.14016l451.69152 451.69152a58.08128 58.08128 0 0 0 82.14016-0.07168z" p-id="1474"></path></svg>`)
  el.appendChild(mask)
  el.appendChild(foldBtn)

  // 添加折叠事件
  foldBtn.onclick = () => {
    const maskElement = el.querySelector('.codeblocks-mask') as HTMLElement
    const iconElement = el.querySelector('.fold-btn-icon') as HTMLElement
    pres.forEach(pre => {
      if (pre.classList.contains('expand')) {
        // 折叠
        const oldPos = foldBtn.getBoundingClientRect().top
        pre.style.height = height + 'px'
        pre.style.overflow = 'hidden'
        pre.scrollTo(0, 0)
        pre.classList.remove('expand')
        maskElement.style.height = '48px'
        iconElement.classList.remove('turn')
        window.scrollTo(0, foldBtn.getBoundingClientRect().top + window.scrollY - oldPos)
      } else {
        // 展开
        pre.style.height = 'auto'
        pre.style.overflow = 'auto'
        pre.classList.add('expand')
        maskElement.style.height = '0'
        iconElement.classList.add('turn')
      }
    })
  }
}

const rebindListener = (height: number) => {
  const codeblocks = document.querySelectorAll('.vp-doc [class*="language-"]')
  codeblocks.forEach(el => {
    const foldBtn = el.querySelector('.fold-btn') as HTMLElement
    if (foldBtn && !foldBtn.onclick) {
      foldBtn.onclick = () => {
        const pre = el.querySelector('pre') as HTMLElement
        const maskElement = el.querySelector('.codeblocks-mask') as HTMLElement
        const iconElement = el.querySelector('.fold-btn-icon') as HTMLElement
        if (pre && maskElement && iconElement) {
          if (pre.classList.contains('expand')) {
            // 折叠
            const oldPos = foldBtn.getBoundingClientRect().top
            pre.style.height = height + 'px'
            pre.style.overflow = 'hidden'
            pre.scrollTo(0, 0)
            pre.classList.remove('expand')
            maskElement.style.height = '48px'
            iconElement.classList.remove('turn')
            window.scrollTo(0, foldBtn.getBoundingClientRect().top + window.scrollY - oldPos)
          } else {
            // 展开
            pre.style.height = 'auto'
            pre.style.overflow = 'auto'
            pre.classList.add('expand')
            maskElement.style.height = '0'
            iconElement.classList.add('turn')
          }
        }
      }
    }
  })
}

/**
 * 初始化代码块折叠功能
 */
const initCodeblocksFold = () => {
  if (typeof window === 'undefined') return
  
  console.log('[CodeblocksFold] 初始化代码块折叠功能')
  
  nextTick(() => {
    // 获取前言值
    let fm: number[] | boolean = true
    if (frontmatter.value && frontmatter.value.cbf !== undefined) {
      fm = frontmatter.value.cbf
    }
    
    // 获取文章里的所有代码块
    const codeblocks = document.querySelectorAll('.vp-doc [class*="language-"]')
    console.log(`[CodeblocksFold] 找到 ${codeblocks.length} 个代码块`)
    
    // 遍历给代码块添加折叠
    codeblocks.forEach((el: Element, index: number) => {
      const element = el as HTMLElement
      
      // 获取代码块内部的 pre 元素高度
      const preElement = element.querySelector('pre') as HTMLElement
      let actualHeight = element.offsetHeight
      
      // 如果 pre 元素存在且有高度，优先使用 pre 元素的高度
      if (preElement && preElement.scrollHeight > 0) {
        actualHeight = preElement.scrollHeight
      }
      
      // 计算折叠阈值
      const foldThreshold = props.height + props.threshold
      
      // 调试信息
      console.log(`[CodeblocksFold] 代码块 ${index + 1}:`, {
        elementHeight: element.offsetHeight,
        preScrollHeight: preElement?.scrollHeight,
        actualHeight: actualHeight,
        foldThreshold: foldThreshold,
        shouldFold: actualHeight > foldThreshold
      })
      
      // 检查代码块是否被隐藏（代码块组中的代码块）
      const displayStatus: string = window.getComputedStyle(element, null).getPropertyValue('display')
      const isDetailBlock: boolean = element.parentElement!.classList.contains('details')
      const isHidden = displayStatus === 'none' || isDetailBlock
      
      // 如果代码块被隐藏（代码块组中的代码块），即使高度为 0 也要继续处理
      if (!isHidden && actualHeight <= foldThreshold) {
        console.log(`[CodeblocksFold] 代码块 ${index + 1} 高度不足，不折叠`)
        return
      }
      
      console.log(`[CodeblocksFold] 代码块 ${index + 1} 高度超过阈值，需要折叠`)
      
      // 处理代码块
      if (Array.isArray(fm)) {
        if (props.defaultAllFold) {
          if (fm.indexOf(index + 1) === -1) {
            judge(element, props.height)
          }
        } else {
          if (fm.indexOf(index + 1) !== -1) {
            judge(element, props.height)
          }
        }
      } else {
        if (props.defaultAllFold && fm) {
          judge(element, props.height)
        }
      }
    })
    
    // 重新绑定监听
    rebindListener(props.height)
  })
}

// 初始化代码块折叠功能的函数
const initializeCodeblocks = () => {
  // 延迟一小段时间，确保页面完全渲染
  setTimeout(() => {
    console.log('[CodeblocksFold] 初始化代码块折叠功能（加载动画已结束）')
    initCodeblocksFold()
  }, 100)
}

// 监听加载状态变化，在加载动画结束后初始化
watch(
  () => isLoading.value,
  (newValue) => {
    if (newValue === false) {
      // 加载动画结束，初始化代码块折叠功能
      nextTick(() => {
        initializeCodeblocks()
      })
    }
  }
)

// 内容更新时初始化
onContentUpdated(() => {
  // 只有在加载完成后才初始化
  if (!isLoading.value) {
    initializeCodeblocks()
  }
})

// 组件挂载时初始化
onMounted(() => {
  // 只有在加载完成后才初始化
  if (!isLoading.value) {
    initializeCodeblocks()
  }
})

// 路由变化时重新初始化
watch(
  () => route.path,
  () => {
    // 只有在加载完成后才初始化
    if (!isLoading.value) {
      nextTick(() => {
        initializeCodeblocks()
      })
    }
  }
)
</script>