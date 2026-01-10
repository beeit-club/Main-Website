/**
 * Utility functions để sanitize HTML content
 * Sử dụng xss library để làm sạch HTML
 */
import xss from 'xss';

// Cấu hình xss cho phép một số tag HTML cơ bản (cho rich text editor)
const xssOptions = {
  whiteList: {
    // Cho phép các tag HTML cơ bản
    p: [],
    br: [],
    strong: [],
    b: [],
    em: [],
    i: [],
    u: [],
    s: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    ul: [],
    ol: [],
    li: [],
    blockquote: [],
    code: [],
    pre: [],
    a: ['href', 'title', 'target'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    table: [],
    thead: [],
    tbody: [],
    tr: [],
    td: [],
    th: [],
    div: ['class'],
    span: ['class'],
    // Cho phép style inline (cẩn thận với XSS)
    // style: [],
  },
  stripIgnoreTag: true, // Xóa các tag không trong whitelist
  stripIgnoreTagBody: ['script'], // Xóa nội dung trong script tag
  onTagAttr: function (tag, name, value) {
    // Kiểm tra và sanitize các attribute nguy hiểm
    if (tag === 'a' && name === 'href') {
      // Chỉ cho phép http, https, mailto, tel
      if (!/^(https?:\/\/|mailto:|tel:|\/)/.test(value)) {
        return '';
      }
    }
    if (tag === 'img' && name === 'src') {
      // Chỉ cho phép http, https, data:image
      if (!/^(https?:\/\/|data:image|\/)/.test(value)) {
        return '';
      }
    }
    // Chặn các event handler
    if (name.startsWith('on')) {
      return '';
    }
    // Chặn javascript: protocol
    if (value && value.toLowerCase().startsWith('javascript:')) {
      return '';
    }
  },
};

/**
 * Sanitize HTML content để tránh XSS
 * @param {string} html - HTML content cần sanitize
 * @returns {string} - HTML đã được sanitize
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  return xss(html, xssOptions);
}

/**
 * Sanitize text content (loại bỏ tất cả HTML)
 * @param {string} text - Text content cần sanitize
 * @returns {string} - Text đã được sanitize
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  // Loại bỏ tất cả HTML tags
  return xss(text, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: true,
  });
}

