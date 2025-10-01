import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function CustomSnackbar({
  openSnackbar,
  onClose,
  severity,
  variant,
  content,
}) {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={1000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{ width: "100%" }}
      >
        {content}
      </Alert>
    </Snackbar>
  );
}
