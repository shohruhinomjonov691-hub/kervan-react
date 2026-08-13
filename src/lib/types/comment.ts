// Sharh muallifi haqida faqat ochiq ma'lumot (backend faqat shu fieldlarni qaytaradi)
export interface CommentAuthor {
  _id: string;
  memberNick: string;
  memberImage?: string;
}

export interface Comment {
  _id: string;
  commentText: string;
  commentRating: number;
  memberId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  memberData?: CommentAuthor[];
}

export interface CommentInput {
  commentText: string;
  commentRating: number;
  productId: string;
}
