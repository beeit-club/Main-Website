export function formatYupErrors(err) {
  console.error('🔍 [formatYupErrors] Input error:', {
    name: err.name,
    message: err.message,
    path: err.path,
    value: err.value,
    type: err.type,
    inner: err.inner,
    innerLength: err.inner?.length || 0,
  });

  const result = err.inner.reduce((acc, e) => {
    if (!acc[e.path]) {
      acc[e.path] = [];
    }
    acc[e.path].push(e.message);
    return acc;
  }, {});

  console.error('🔍 [formatYupErrors] Formatted result:', result);

  // Nếu không có inner hoặc inner rỗng, trả về error chính
  if (!err.inner || err.inner.length === 0) {
    console.warn('⚠️ [formatYupErrors] No inner errors, using main error');
    return {
      [err.path || '_error']: [err.message || 'Validation error'],
    };
  }

  return result;
}
