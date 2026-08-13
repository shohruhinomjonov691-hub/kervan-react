import { MemberStatus, MemberType } from "../enums/member.enum";

export interface MemberPayment {
  cardBrand: string;
  cardLast4: string;
  cardHolder: string;
  cardExpiry: string;
}

// Raw form input — validated server-side, never persisted or logged as-is
export interface MemberPaymentInput {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  memberPayment?: MemberPayment;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}
