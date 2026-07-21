import { Button, CircularProgress } from "@mui/material";

export default function LoadingButton({
  loading,
  children,
  ...props
}) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? <CircularProgress size={20} /> : children}
    </Button>
  );
}