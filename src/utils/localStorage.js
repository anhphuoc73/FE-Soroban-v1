// Lấy item từ localStorage, parse JSON, có defaultValue
export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error("Error parsing localStorage", e);
    return defaultValue;
  }
}

// Lưu item vào localStorage (tự stringify)
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error setting localStorage", e);
  }
}

// Xoá item
export function removeItem(key) {
  localStorage.removeItem(key);
}

// Nếu chưa có key thì tạo mới luôn
export function ensureItem(key, defaultValue) {
  const data = getItem(key, defaultValue);
  if (data === defaultValue) {
    setItem(key, defaultValue);
  }
  return data;
}
