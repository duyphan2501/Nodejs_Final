import { useState } from "react";
import { Button, TextField, MenuItem, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

const availableIcons = [
  { name: "Facebook", icon: <FacebookIcon color="primary" /> },
  { name: "Instagram", icon: <InstagramIcon sx={{ color: "#E1306C" }} /> },
  { name: "Twitter", icon: <TwitterIcon color="info" /> },
  { name: "LinkedIn", icon: <LinkedInIcon color="primary" /> },
  { name: "YouTube", icon: <YouTubeIcon sx={{ color: "red" }} /> },
];

const SocialMediaConfig = () => {
  const [socials, setSocials] = useState([]);

  const handleAdd = () => {
    if (socials.length < 5) {
      setSocials([...socials, { platform: "", url: "" }]);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = socials.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSocials(updated);
  };

  const handleRemove = (index) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  return (
    <div className="p-5 mt-7 bg-white shadow rounded-lg">
      <h4 className="w-full text-center text-2xl mb-4 font-semibold">
        Social Media
      </h4>

      <div className="flex flex-col gap-4">
        {socials.map((social, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border p-3 rounded-lg"
          >
            <TextField
              select
              label="Platform"
              value={social.platform}
              onChange={(e) => handleChange(index, "platform", e.target.value)}
              className="w-1/3"
              size="small"
            >
              {availableIcons.map((opt) => (
                <MenuItem key={opt.name} value={opt.name}>
                  <div className="flex items-center gap-2">
                    {opt.icon}
                    {opt.name}
                  </div>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Link"
              placeholder="https://..."
              value={social.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
              className="w-2/3"
              size="small"
            />

            <IconButton color="error" onClick={() => handleRemove(index)}>
              <Delete />
            </IconButton>
          </div>
        ))}

        <Button
          variant="contained"
          sx={{ background: "#00C950" }}
          onClick={handleAdd}
          disabled={socials.length >= 5}
        >
          + Add Social Media
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaConfig;
