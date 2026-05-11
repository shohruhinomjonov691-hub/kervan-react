import { BranchName, BranchStatus } from "../enums/branch.enum";

export interface Branch {
  _id: string;
  branchName: BranchName;
  branchStatus: BranchStatus;
  branchAddress: string;
  branchPhone: string;
  branchDesc?: string;
  branchImage?: string;
  branchMapUrl?: string;
  branchHours?: string;
  branchRating?: number;
  branchStaffCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
