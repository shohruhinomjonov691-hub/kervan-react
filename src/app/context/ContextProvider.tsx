import React, { ReactNode, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";

// memberData qo'lda buzilgan bo'lsa JSON.parse xato tashlab butun App'ni
// (ContextProvider daraxtning ildizida) render qilishdan to'xtatib qo'yardi
const readStoredMember = (): Member | null => {
  const raw = localStorage.getItem("memberData");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("memberData");
    return null;
  }
};

// Faqat server "siz login emassiz" desa logout qilinadi (401 — token yo'q/
// muddati o'tgan, 404 — user bloklangan/o'chirilgan). Network xatosi yoki
// 5xx'da localStorage'dagi user saqlanib qoladi — server vaqtincha ishlamasa
// user bekorga logout bo'lmasin
const isAuthRejected = (err: any): boolean => {
  const status = err?.response?.status;
  return status === 401 || status === 404;
};

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // localStorage — birinchi render uchun optimistik qiymat; haqiqiy holat
  // pastdagi /member/detail orqali tasdiqlanadi
  const [authMember, setAuthMember] = useState<Member | null>(
    readStoredMember,
  );
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  useEffect(() => {
    const storedRaw = localStorage.getItem("memberData");
    const hasCookie = !!new Cookies().get("accessToken");
    if (!storedRaw && !hasCookie) return; // anonim mehmon — tekshirish shart emas

    let cancelled = false;
    // So'rov davomida user login/logout qilgan bo'lsa, eski javob uning
    // yangi holatini bosib ketmasligi kerak
    const isStale = () =>
      cancelled || localStorage.getItem("memberData") !== storedRaw;

    new MemberService()
      .getMemberDetail()
      .then((member) => {
        if (isStale()) return;
        localStorage.setItem("memberData", JSON.stringify(member));
        setAuthMember(member);
      })
      .catch((err) => {
        if (isStale() || !isAuthRejected(err)) return;
        localStorage.removeItem("memberData");
        setAuthMember(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
