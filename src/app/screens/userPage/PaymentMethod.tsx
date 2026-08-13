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
  cardNumber: "",
  cardHolder: "",
  cardExpiry: "",
  cardCvv: "",
};

/** Faqat namoyish (demo/portfolio) uchun — haqiqiy to'lov provayderi yo'q.
 * Karta raqami/CVV hech qachon serverga saqlash uchun to'liq holida qaytmaydi;
 * backend faqat brand+last4'ni saqlaydi. **/
export default function PaymentMethod() {
  const { authMember, setAuthMember } = useGlobals();
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MemberPaymentInput>(emptyForm);

  const memberPayment = authMember?.memberPayment;

  const handleField = (field: keyof MemberPaymentInput) => (e: T) => {
    let value: string = e.target.value;

    if (field === "cardNumber") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 19)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (field === "cardExpiry") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(\d)/, "$1/$2");
    } else if (field === "cardCvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm({ ...form, [field]: value });
  };

  const luhnCheck = (digits: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateForm = (): string | null => {
    const cardNumber = form.cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cardNumber) || !luhnCheck(cardNumber)) {
      return "Please enter a valid card number.";
    }
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
      return "This card has expired.";
    }
    if (!/^\d{3,4}$/.test(form.cardCvv)) return "Please enter a valid CVV.";
    if (form.cardHolder.trim().length < 2)
      return "Please enter the cardholder name.";
    return null;
  };

  const handleSave = async () => {
    try {
      const validationError = validateForm();
      if (validationError) throw new Error(validationError);

      setSaving(true);
      const result = await new MemberService().savePaymentMethod(form);
      setAuthMember(result);
      setForm(emptyForm);
      setFormOpen(false);
      await sweetTopSmallSuccessAlert("Payment method saved! 💳", 1200);
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm("Remove this payment method?");
    if (!confirmed) return;
    try {
      const result = await new MemberService().removePaymentMethod();
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Payment method removed.", 1000);
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  /* ── ADD/REPLACE CARD FORM ── */
  if (formOpen || !memberPayment) {
    return (
      <Stack gap={2.5}>
        {!memberPayment && (
          <Box className="pm-empty">
            <CreditCardOutlinedIcon sx={{ fontSize: 28, color: "#dbc2b0" }} />
            <Typography className="pm-empty-text">
              No payment method saved yet. Add a demo card to enable "Pay
              Now" on your orders.
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          value={form.cardNumber}
          onChange={handleField("cardNumber")}
          sx={inputSx}
        />
        <TextField
          fullWidth
          label="Cardholder Name"
          placeholder="As shown on card"
          value={form.cardHolder}
          onChange={handleField("cardHolder")}
          sx={inputSx}
        />
        <Stack direction="row" gap={2}>
          <TextField
            fullWidth
            label="Expiry (MM/YY)"
            placeholder="12/28"
            value={form.cardExpiry}
            onChange={handleField("cardExpiry")}
            sx={inputSx}
          />
          <TextField
            fullWidth
            label="CVV"
            placeholder="123"
            value={form.cardCvv}
            onChange={handleField("cardCvv")}
            sx={inputSx}
          />
        </Stack>

        <Typography className="pm-disclaimer">
          Demo payment method for this portfolio project — no real card
          data is ever charged or stored.
        </Typography>

        <Stack direction="row" gap={1.5} sx={{ justifyContent: "flex-end" }}>
          {memberPayment && (
            <Button
              className="up-back-btn"
              onClick={() => {
                setForm(emptyForm);
                setFormOpen(false);
              }}
            >
              Cancel
            </Button>
          )}
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
          onClick={() => setFormOpen(true)}
          sx={{ flex: 1 }}
        >
          Replace Card
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
