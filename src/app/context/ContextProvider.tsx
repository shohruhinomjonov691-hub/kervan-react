import React, { ReactNode, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";
import {
  beginAuthChange,
  clearStoredMember,
  getAuthGeneration,
  getMemberRevision,
  isCurrentGeneration,
  readStoredMember,
  storeMember,
} from "./authSession";

// Backend Errors.reason bilan bir xil bo'lishi kerak (kervan/src/libs/Errors.ts)
const MEMBER_INACTIVE = "MEMBER_INACTIVE";

// Faqat server "siz login emassiz" desa logout qilinadi:
// - 401 — token yo'q/yaroqsiz/muddati o'tgan;
// - 404 + reason MEMBER_INACTIVE — token yaroqli, lekin user bloklangan/o'chirilgan.
// Umumiy route/proxy 404, network xatosi yoki 5xx'da saqlangan user qoladi —
// server vaqtincha ishlamasa user bekorga logout bo'lmasin
const isAuthRejected = (err: any): boolean => {
  const status = err?.response?.status;
  if (status === 401) return true;
  return status === 404 && err?.response?.data?.reason === MEMBER_INACTIVE;
};

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Storage — birinchi render uchun optimistik qiymat; haqiqiy holat
  // pastdagi /member/detail orqali tasdiqlanadi
  const [authMember, setAuthMember] = useState<Member | null>(
    readStoredMember,
  );
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  useEffect(() => {
    const hasCookie = !!new Cookies().get("accessToken");
    if (!readStoredMember() && !hasCookie) return; // anonim mehmon

    // So'rov davomida login/signup/logout boshlansa generation o'zgaradi va
    // bu javob (hatto bir xil userga qayta login bo'lsa ham) e'tiborsiz qoladi.
    // Revision esa shu sessiya ichidagi yangiroq yozuvlarni (karta, profil)
    // eski restore ma'lumoti bosib ketishidan saqlaydi
    const gen = getAuthGeneration();
    const revision = getMemberRevision();
    let cancelled = false;
    const isStale = () =>
      cancelled ||
      !isCurrentGeneration(gen) ||
      getMemberRevision() !== revision;

    new MemberService()
      .getMemberDetail()
      .then((member) => {
        if (isStale()) return;
        storeMember(member);
        setAuthMember(member);
      })
      .catch((err) => {
        if (isStale() || !isAuthRejected(err)) return;
        // Sessiya tugadi — kutilayotgan karta/profil javoblari ham bekor bo'lsin
        beginAuthChange();
        clearStoredMember();
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
