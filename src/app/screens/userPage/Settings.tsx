import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.625rem",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.9375rem",
    background: "#faf7f4",
    "& fieldset": { borderColor: "#e8d9cc" },
    "&:hover fieldset": { borderColor: "#8d4b00" },
    "&.Mui-focused fieldset": { borderColor: "#8d4b00", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.875rem",
    color: "#a08070",
    "&.Mui-focused": { color: "#8d4b00" },
  },
};

export default function Settings() {
  const { authMember, setAuthMember } = useGlobals();

  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg",
  );

  const [form, setForm] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick ?? "",
    memberPhone: authMember?.memberPhone ?? "",
    memberAddress: authMember?.memberAddress ?? "",
    memberDesc: authMember?.memberDesc ?? "",
    memberImage: authMember?.memberImage ?? "",
  });

  const handleField = (field: string) => (e: T) =>
    setForm({ ...form, [field]: e.target.value });

  const handleImageChange = (e: T) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      sweetErrorHandling(new Error("Only JPG/PNG allowed!")).then();
      return;
    }
    form.memberImage = file;
    setForm({ ...form });
    setMemberImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (!form.memberNick || !form.memberPhone)
        throw new Error(Messages.error3);
      const result = await new MemberService().updateMember(form);
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Profile updated! ✓", 1000);
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Stack gap={3}>
      {/* Avatar upload */}
      <Stack direction="row" gap={3} alignItems="center">
        <Box className="settings-avatar-wrap">
          <img
            src={memberImage}
            alt="avatar"
            className="settings-avatar-img"
            onError={(e: T) => {
              e.target.src = "/icons/default-user.svg";
            }}
          />
        </Box>
        <Box>
          <Typography className="settings-upload-label">
            Profile Photo
          </Typography>
          <Typography className="settings-upload-hint">
            JPG, JPEG or PNG. Max 5MB.
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadOutlinedIcon />}
            className="settings-upload-btn"
            sx={{ mt: 1.5 }}
          >
            Upload Photo
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          fullWidth
          label="Username"
          value={form.memberNick}
          onChange={handleField("memberNick")}
          sx={inputSx}
        />
        <TextField
          fullWidth
          label="Phone Number"
          value={form.memberPhone}
          onChange={handleField("memberPhone")}
          sx={inputSx}
        />
      </Stack>

      <TextField
        fullWidth
        label="Address"
        value={form.memberAddress}
        onChange={handleField("memberAddress")}
        sx={inputSx}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="About me"
        value={form.memberDesc}
        onChange={handleField("memberDesc")}
        sx={inputSx}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          className="settings-save-btn"
        >
          Save Changes
        </Button>
      </Box>
    </Stack>
  );
}
