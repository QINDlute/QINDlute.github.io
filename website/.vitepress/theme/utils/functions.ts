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
