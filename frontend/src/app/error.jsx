"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>❌ Có lỗi xảy ra!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Thử lại</button>
    </div>
  );
}
