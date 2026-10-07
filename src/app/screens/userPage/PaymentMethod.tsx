import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberPaymentInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
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

const emptyForm: MemberPaymentInput = {
  cardHolder: "",
  cardExpiry: "",
};

/** Faqat namoyish (demo/portfolio) uchun — haqiqiy to'lov provayderi yo'q,
 * real karta ma'lumoti so'ralmaydi va pul yechilmaydi. Karta raqami (last4)
 * serverda generatsiya qilinadi; user faqat holder va expiry'ni tahrirlaydi. **/
export default function PaymentMethod() {
  const { authMember, setAuthMember } = useGlobals();
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MemberPaymentInput>(emptyForm);

  const memberPayment = authMember?.memberPayment;

  const handleField = (field: keyof MemberPaymentInput) => (e: T) => {
    let value: string = e.target.value;

    if (field === "cardExpiry") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(\d)/, "$1/$2");
    }

    setForm({ ...form, [field]: value });
  };

  const validateForm = (): string | null => {
    const holder = form.cardHolder.trim();
    if (holder.length < 2 || holder.length > 40)
      return "Cardholder name must be 2–40 characters.";
    const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(form.cardExpiry);
    if (!expiryMatch) return "Please enter expiry as MM/YY.";
    const month = Number(expiryMatch[1]);
    const year = Number(expiryMatch[2]) + 2000;
    if (month < 1 || month > 12) return "Please enter a valid expiry month.";
    const now = new Date();
    if (
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
      return "Expiry date must not be in the past.";
    }
    return null;
  };

  const openEdit = () => {
    setForm({
      cardHolder: memberPayment?.cardHolder ?? "",
      cardExpiry: memberPayment?.cardExpiry ?? "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    try {
      const validationError = validateForm();
      if (validationError) throw new Error(validationError);

      setSaving(true);
      const result = await new MemberService().savePaymentMethod({
        cardHolder: form.cardHolder.trim(),
        cardExpiry: form.cardExpiry,
      });
      setAuthMember(result);
      setForm(emptyForm);
      setFormOpen(false);
      await sweetTopSmallSuccessAlert("Demo card updated! 💳", 1200);
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setSaving(true);
      const result = await new MemberService().generatePaymentMethod();
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Demo card created! 💳", 1200);
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm("Remove this demo card?");
    if (!confirmed) return;
    try {
      const result = await new MemberService().removePaymentMethod();
      setAuthMember(result);
      setFormOpen(false);
      await sweetTopSmallSuccessAlert("Demo card removed.", 1000);
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  /* ── NO CARD: GENERATE ── */
  if (!memberPayment) {
    return (
      <Stack gap={2.5}>
        <Box className="pm-empty">
          <CreditCardOutlinedIcon sx={{ fontSize: 28, color: "#dbc2b0" }} />
          <Typography className="pm-empty-text">
            No demo card yet. Generate one to enable "Pay Now" on your
            orders.
          </Typography>
        </Box>

        <Typography className="pm-disclaimer">
          Demo payment for this portfolio project — no real card details are
          needed and no real money is ever charged.
        </Typography>

        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={saving}
            className="settings-save-btn"
          >
            {saving ? "Generating..." : "Generate demo card"}
          </Button>
        </Stack>
      </Stack>
    );
  }

  /* ── EDIT CARD FORM (holder + expiry) ── */
  if (formOpen) {
    return (
      <Stack gap={2.5}>
        <TextField
          fullWidth
          label="Card Number"
          value={`•••• •••• •••• ${memberPayment.cardLast4}`}
          disabled
          helperText="Generated automatically for the demo"
          sx={inputSx}
        />
        <TextField
          fullWidth
          label="Cardholder Name"
          value={form.cardHolder}
          onChange={handleField("cardHolder")}
          inputProps={{ maxLength: 40 }}
          sx={inputSx}
        />
        <TextField
          fullWidth
          label="Expiry (MM/YY)"
          placeholder="12/28"
          value={form.cardExpiry}
          onChange={handleField("cardExpiry")}
          sx={inputSx}
        />

        <Typography className="pm-disclaimer">
          Demo payment for this portfolio project — no real money is ever
          charged.
        </Typography>

        <Stack direction="row" gap={1.5} sx={{ justifyContent: "flex-end" }}>
          <Button
            className="up-back-btn"
            onClick={() => {
              setForm(emptyForm);
              setFormOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            className="settings-save-btn"
          >
            {saving ? "Saving..." : "Save Card"}
          </Button>
        </Stack>
      </Stack>
    );
  }

  /* ── SAVED CARD DISPLAY ── */
  return (
    <Stack gap={2}>
      <Box className="up-visa-card">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box className="up-visa-chip" />
          <Typography className="up-visa-network">
            {memberPayment.cardBrand}
          </Typography>
        </Stack>
        <Typography className="up-visa-number">
          •••• •••• •••• {memberPayment.cardLast4}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography className="up-visa-label">CARD HOLDER</Typography>
            <Typography className="up-visa-value">
              {memberPayment.cardHolder}
            </Typography>
          </Box>
          <Box>
            <Typography className="up-visa-label">EXPIRES</Typography>
            <Typography className="up-visa-value">
              {memberPayment.cardExpiry}
            </Typography>
          </Box>
          <Box className="up-visa-type">DEMO CARD</Box>
        </Stack>
      </Box>

      <Stack direction="row" gap={1.5}>
        <Button
          className="up-back-btn"
          onClick={openEdit}
          sx={{ flex: 1 }}
        >
          Edit Card
        </Button>
        <Button
          className="pm-remove-btn"
          startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}
