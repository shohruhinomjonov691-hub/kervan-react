import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberPaymentInput,
  MemberUpdateInput,
} from "../../lib/types/member";
import {
  StaleSessionError,
  beginAuthChange,
  clearStoredMember,
  commitMemberUpdate,
  isCurrentGeneration,
  isTicketCurrent,
  storeMember,
  takeSessionTicket,
  toSessionError,
} from "../context/authSession";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = this.path + "/member/top-users";
      const result = await axios.get(url);
      console.log("getTopUsers:", result);

      return result.data;
    } catch (err) {
      console.log("Error, getTopUsers:", err);
      throw err;
    }
  }

  public async getRestaurant(): Promise<Member> {
    try {
      const url = this.path + "/member/restaurant";
      const result = await axios.get(url);
      console.log("getRestaurant:", result);

      const restaurant: Member = result.data;
      return result.data;
    } catch (err) {
      console.log("Error, getRestaurant:", err);
      throw err;
    }
  }

  // Sahifa yangilanganda auth'ni cookie orqali serverdan tiklash uchun.
  // Storage'ga yozish ContextProvider'da — u generation va 401/5xx'ni hal qiladi
  public async getMemberDetail(): Promise<Member> {
    const url = this.path + "/member/detail";
    const result = await axios.get(url, { withCredentials: true });
    return result.data;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const gen = beginAuthChange();
    try {
      const url = this.path + "/member/signup";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("signup:", result);

      const member: Member = result.data.member;
      console.log("member:", member);
      // Kutish davomida boshqa auth o'zgarishi boshlangan bo'lsa — bu javob eskirgan
      if (!isCurrentGeneration(gen)) throw new StaleSessionError();
      storeMember(member);

      return member;
    } catch (err) {
      console.log("Error signup:", err);
      throw toSessionError(isCurrentGeneration(gen), err);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const gen = beginAuthChange();
    try {
      const url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("login:", result);

      const member: Member = result.data.member;
      console.log("member:", member);
      if (!isCurrentGeneration(gen)) throw new StaleSessionError();
      storeMember(member);

      return member;
    } catch (err) {
      console.log("Error login:", err);
      throw toSessionError(isCurrentGeneration(gen), err);
    }
  }

  public async logout(): Promise<void> {
    // Boshlanishidayoq: kutilayotgan restore/karta javoblari endi qo'llanmaydi
    beginAuthChange();
    try {
      const url = this.path + "/member/logout";
      const result = await axios.post(url, {}, { withCredentials: true });
      console.log("logout:", result);

      clearStoredMember();

      return result.data.logout;
    } catch (err) {
      console.log("Error logout:", err);
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    const ticket = takeSessionTicket();
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      formData.append("memberImage", input.memberImage || "");

      const result = await axios(`${serverApi}/member/update`, {
        method: "POST",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("updateMember:", result);

      return commitMemberUpdate(ticket, result.data);
    } catch (err) {
      console.log("Error updateMember:", err);
      throw toSessionError(isTicketCurrent(ticket), err);
    }
  }

  public async savePaymentMethod(input: MemberPaymentInput): Promise<Member> {
    const ticket = takeSessionTicket();
    try {
      const url = `${serverApi}/member/payment`;
      const result = await axios.post(url, input, { withCredentials: true });

      return commitMemberUpdate(ticket, result.data);
    } catch (err) {
      console.log("Error savePaymentMethod:", err);
      throw toSessionError(isTicketCurrent(ticket), err);
    }
  }

  public async generatePaymentMethod(): Promise<Member> {
    const ticket = takeSessionTicket();
    try {
      const url = `${serverApi}/member/payment/generate`;
      const result = await axios.post(url, {}, { withCredentials: true });

      return commitMemberUpdate(ticket, result.data);
    } catch (err) {
      console.log("Error generatePaymentMethod:", err);
      throw toSessionError(isTicketCurrent(ticket), err);
    }
  }

  public async removePaymentMethod(): Promise<Member> {
    const ticket = takeSessionTicket();
    try {
      const url = `${serverApi}/member/payment/remove`;
      const result = await axios.post(url, {}, { withCredentials: true });
      console.log("removePaymentMethod:", result);

      return commitMemberUpdate(ticket, result.data);
    } catch (err) {
      console.log("Error removePaymentMethod:", err);
      throw toSessionError(isTicketCurrent(ticket), err);
    }
  }
}

export default MemberService;
