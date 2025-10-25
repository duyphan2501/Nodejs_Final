import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { borderRadius } from "@mui/system";
import DangerousIcon from "@mui/icons-material/Dangerous";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -40%)", // hơi lệch để tạo cảm giác trượt
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  transition: "transform 0.3s ease",
};

export default function TransitionsModal({
  open,
  onClose,
  type,
  content,
  Icon = DangerousIcon,
  color,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className="flex items-center gap-2">
            <Icon sx={{ color, fontSize: "40px" }} />
            <Typography
              textTransform={"capitalize"}
              id="transition-modal-title"
              variant="h6"
              component="h2"
            >
              {type}
            </Typography>
          </div>

          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {content}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
