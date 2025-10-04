export function formatYupErrors(err) {
  return err.inner.reduce((acc, e) => {
    if (!acc[e.path]) {
      acc[e.path] = [];
    }
    acc[e.path].push(e.message);
    return acc;
  }, {});
}
