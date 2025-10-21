import { tUser } from "./tUser";

export type tChatMessage = {
  id: number;
  senderId: string;
  message: string;
  filepaths: string[];
  filenames: string[];
  replyId: number | null;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
  mentionedUserIds: string[];

  status: number; // 0: sent, 1: sending, 2: error
  User?: tUser | null;
};
