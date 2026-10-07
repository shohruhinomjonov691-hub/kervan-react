import { Member } from "../../lib/types/member";

/** Auth sessiyasining yagona manbasi: memberData storage'i va "session
 * generation" hisoblagichi. Har bir auth o'zgarishi (login/signup/logout
 * boshlanishi, server sessiyani rad etishi) generation'ni oshiradi; undan
 * oldin boshlangan so'rovlarning kechikkan javoblari storage/state'ga
 * yozilmaydi. JSON solishtirishdan farqli o'laroq, bir xil userga qayta
 * login yoki memberData bo'lmagan holatdagi logout ham aniqlanadi. **/

const STORAGE_KEY = "memberData";
let generation = 0;
// memberData har safar yozilganda/o'chirilganda oshadi. Sessiya o'zgarmasa
// ham (masalan, restore kutilayotganda karta yaratildi) eski restore javobi
// yangiroq ma'lumotni bosib ketmasligi uchun
let memberRevision = 0;

export class StaleSessionError extends Error {
  constructor() {
    super("Stale auth session response");
    this.name = "StaleSessionError";
  }
}

export const isStaleSessionError = (err: unknown): boolean =>
  err instanceof StaleSessionError;

export const getAuthGeneration = (): number => generation;

export const isCurrentGeneration = (gen: number): boolean =>
  gen === generation;

export const getMemberRevision = (): number => memberRevision;

// login/signup/logout boshlanishida va server sessiyani rad etganda
export const beginAuthChange = (): number => ++generation;

// memberData qo'lda buzilgan bo'lsa JSON.parse xato tashlab butun App'ni
// (ContextProvider daraxtning ildizida) render qilishdan to'xtatib qo'yardi
export const readStoredMember = (): Member | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const storeMember = (member: Member): void => {
  memberRevision++;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
};

export const clearStoredMember = (): void => {
  memberRevision++;
  localStorage.removeItem(STORAGE_KEY);
};

/** Login bo'lgan user'ning o'z ma'lumotini o'zgartiradigan so'rovlar
 * (profil, karta generate/save/remove) uchun: so'rov boshida ticket olinadi,
 * javob faqat o'sha sessiya va o'sha member'ga tegishli bo'lsa saqlanadi. **/
export interface SessionTicket {
  generation: number;
  memberId: string | null;
}

export const takeSessionTicket = (): SessionTicket => ({
  generation,
  memberId: readStoredMember()?._id ?? null,
});

export const isTicketCurrent = (ticket: SessionTicket): boolean =>
  isCurrentGeneration(ticket.generation) &&
  ticket.memberId !== null &&
  readStoredMember()?._id === ticket.memberId;

// Xato javoblari uchun: so'rov eskirgan sessiyaga tegishli bo'lsa, asl xato
// o'rniga StaleSessionError — caller alert/modal/input'ga tegmasligi uchun
export const toSessionError = (isCurrent: boolean, err: unknown): unknown =>
  isCurrent && !isStaleSessionError(err) ? err : new StaleSessionError();

export const commitMemberUpdate = (
  ticket: SessionTicket,
  member: Member,
): Member => {
  if (!isTicketCurrent(ticket) || member?._id !== ticket.memberId) {
    throw new StaleSessionError();
  }
  storeMember(member);
  return member;
};
