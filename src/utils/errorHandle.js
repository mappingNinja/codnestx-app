import { toast } from "react-toastify";

const errorHandle = (err) => {
  if (err?.response?.status === 401) {
    return window.location.href = "/login"
  }

  toast.error(err?.response?.data?.error || err?.message || err || 'Something Went Wrong!', { position: 'bottom-right' });
  return err?.response?.data?.error || err?.message || err || 'Something Went Wrong!'
}

export default errorHandle;