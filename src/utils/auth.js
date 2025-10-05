export const LocalStorageEventTarget = new EventTarget();
export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem('access_token', access_token);
};
export const setRoleListToLS = (role_list) => {
  localStorage.setItem('role_list', role_list);
};
export const removeLS = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('profile');
  localStorage.removeItem('role_list');
  localStorage.removeItem('logFingerMath');
  localStorage.removeItem('logSorobanMath');

  const clearLSEvent = new Event('removeLS');
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getAccessTokenFromLS = (key) => localStorage.getItem(key) || '';

export const getRoleListFromLS = () => {
  const result = localStorage.getItem('role_list');
  return result ? JSON.parse(result) : null;
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile');
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile));
};

export const setUploadToLS = (value) => {
  localStorage.setItem('upload', JSON.stringify(value));
};

export const getUploadFromLS = () => {
  const result = localStorage.getItem('upload');
  return result ? JSON.parse(result) : false;
};
