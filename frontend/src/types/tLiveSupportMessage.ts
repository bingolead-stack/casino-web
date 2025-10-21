import { tUser } from "./tUser";

export type tLiveSupportMessage = {
  id: number;
  userId: string;
  supporterId?: string;
  message: string;
  filepaths: string[];
  filenames: string[];
  replyId: number | null;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;

  status: number; // 0: sent, 1: sending, 2: error
  User?: tUser | null;
};