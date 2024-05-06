import { toast } from "react-toastify";

const successHandle = (message) => {
  toast.success(message, { position: 'bottom-right' });
  return message
}

export default successHandle;