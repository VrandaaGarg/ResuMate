import toast from "react-hot-toast";

const toastStyles = {
  success: {
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "12px 16px",
    fontWeight: "500",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 16px",
    fontWeight: "500",
  },
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    style: toastStyles.success,
    icon: "✓",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    style: toastStyles.error,
    icon: "✗",
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: {
      background: "#f0f9ff",
      color: "#0369a1",
      border: "1px solid #bae6fd",
      borderRadius: "8px",
      padding: "12px 16px",
      fontWeight: "500",
    },
  });
};