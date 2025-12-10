/**
 * Frontend utility để sanitize HTML content
 * Sử dụng DOMPurify nếu có, hoặc fallback về xss
 */

/**
 * Sanitize HTML content để tránh XSS khi hiển thị
 * @param {string} html - HTML content cần sanitize
 * @returns {string} - HTML đã được sanitize
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Tạo một div ẩn để parse HTML
  const div = document.createElement('div');
  div.textContent = html; // Tự động escape HTML
  return div.innerHTML;
}

/**
 * Sanitize HTML nhưng giữ lại một số tag cơ bản
 * Sử dụng DOMPurify nếu có, nếu không thì escape tất cả
 */
export function sanitizeHtmlAllowBasic(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Whitelist các tag cơ bản được phép
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'div', 'span'
  ];

  // Tạo một div ẩn để parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;

  // Xóa các tag không trong whitelist
  const walker = document.createTreeWalker(
    div,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null
  );

  const nodesToRemove = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        nodesToRemove.push(node);
      } else {
        // Xóa các attribute nguy hiểm
        Array.from(node.attributes).forEach(attr => {
          if (attr.name.startsWith('on') || 
              (attr.name === 'href' && attr.value.toLowerCase().startsWith('javascript:')) ||
              (attr.name === 'src' && attr.value.toLowerCase().startsWith('javascript:'))) {
            node.removeAttribute(attr.name);
          }
        });
      }
    }
  }

  // Xóa các node không được phép
  nodesToRemove.forEach(node => {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
  });

  return div.innerHTML;
}

