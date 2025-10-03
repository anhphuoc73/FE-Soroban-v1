// Bắt sự kiện F5/đóng tab
export function onBeforeUnload(callback) {
  const handleBeforeUnload = (event) => {
    callback?.();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}
