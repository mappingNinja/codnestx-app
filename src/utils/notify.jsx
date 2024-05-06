const showToast = (message, toastFunction, options = {}) => {
  toastFunction(message, {
    position: options?.position || "top-right",
    autoClose: options?.autoClose || 2000,
    hideProgressBar: options?.hideProgressBar || true,
    closeOnClick: options?.closeOnClick || true,
    pauseOnHover: options?.pauseOnHover || true,
    draggable: options?.draggable || true,
    progress: options?.progress || undefined,
    theme: options?.theme || "dark",
  });
};

export default showToast;
