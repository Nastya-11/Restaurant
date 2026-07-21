import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

export default function useToast() {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const ToastComponent = () => (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast({ ...toast, open: false })}
    >
      <Alert severity={toast.severity}>
        {toast.message}
      </Alert>
    </Snackbar>
  );

  return { showToast, ToastComponent };
}