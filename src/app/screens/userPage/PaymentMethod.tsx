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
import { Member } from "../../../lib/types/member";
import {
  getAuthGeneration,
  isCurrentGeneration,
  isStaleSessionError,
} from "../../context/authSession";

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
  // Qaysi sessiya (generation) uchun so'rov kutilyapti. Akkaunt almashsa,
  // eski so'rov yangi sessiyada "Saving..." holatini ko'rsatmaydi va tugaganda
  // yangi sessiyaning o'z so'rovini ham bo'shatib yubormaydi
  const [pendingGen, setPendingGen] = useState<number | null>(null);
  const saving = pendingGen !== null && isCurrentGeneration(pendingGen);
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

  // Karta so'rovlari uchun umumiy oqim: javob eskirgan sessiyaga tegishli
  // bo'lsa (logout/login/boshqa akkaunt) — auth state, alert va loading'ga
  // tegmaydi. Storage'ni MemberService session ticket orqali himoyalaydi
  const runCardAction = async (
    action: () => Promise<Member>,
    successMessage: string,
    onSuccess?: () => void,
  ) => {
    const gen = getAuthGeneration();
    setPendingGen(gen);
    try {
      const result = await action();
      if (!isCurrentGeneration(gen)) return;
      setAuthMember(result);
      onSuccess?.();
      await sweetTopSmallSuccessAlert(successMessage, 1200);
    } catch (err) {
      if (isStaleSessionError(err) || !isCurrentGeneration(gen)) return;
      sweetErrorHandling(err).then();
    } finally {
      setPendingGen((current) => (current === gen ? null : current));
    }
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      sweetErrorHandling(new Error(validationError)).then();
      return;
    }

    await runCardAction(
      () =>
        new MemberService().savePaymentMethod({
          cardHolder: form.cardHolder.trim(),
          cardExpiry: form.cardExpiry,
        }),
      "Demo card updated! 💳",
      () => {
        setForm(emptyForm);
        setFormOpen(false);
      },
    );
  };

  const handleGenerate = () =>
    runCardAction(
      () => new MemberService().generatePaymentMethod(),
      "Demo card created! 💳",
    );

  const handleRemove = async () => {
    const confirmed = window.confirm("Remove this demo card?");
    if (!confirmed) return;
    await runCardAction(
      () => new MemberService().removePaymentMethod(),
      "Demo card removed.",
      () => setFormOpen(false),
    );
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
          disabled={saving}
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}
