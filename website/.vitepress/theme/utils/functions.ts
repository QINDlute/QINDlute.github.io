const pattern =
  /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g;

export function countWord(data: string) {
  const m = data.match(pattern);
  let count = 0;
  if (!m) {
    return 0;
  }
  for (let i = 0; i < m.length; i += 1) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}

/**
 * 递归处理列表项，确保列表项之间有空格分隔
 * 只有像："
 *          - 列表
 *          - 列表
 *        "时，才会起作用
 */
export function getAllText(element: Element): string {
  let text = "";
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 对于列表项，添加空格分隔
      if (node.tagName === "LI") {
        text += " " + getAllText(node as Element) + " ";
      } else {
        text += getAllText(node as Element);
      }
    }
  }
  return text;
}

/**
 * 通过 User Agent 检测是否为移动设备
 * @returns 布尔值，表示是否为移动设备
 */
export function isMobileUA(): boolean {
  if (typeof window === 'undefined') return false
  return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
}

/**
 * 通过 User Agent 检测是否为 Apple 设备（Mac、iPhone、iPad、iPod）
 * @returns 布尔值，表示是否为 Apple 设备
 */
export function isAppleDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * 通过视口宽度检测是否为移动设备（<= 768px）
 * @returns 布尔值，表示是否为移动设备
 */
export function isMobileWidth(width = 768): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= width;
}
