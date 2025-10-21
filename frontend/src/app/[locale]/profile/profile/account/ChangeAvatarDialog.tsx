"use client";

import { apiChangeAvatar } from "@/api/account/apiChangeAvatar";
import { apiDeleteAvatar } from "@/api/account/apiDeleteAvatar";
import { userState } from "@/state/userState";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { ChangeEvent, useCallback, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

interface IChangeAvatarDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeAvatarDialog({
  isOpen,
  onClose,
}: IChangeAvatarDialogProps) {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };
  const [user, setUser] = useRecoilState(userState);

  const submitFile = useCallback(async () => {
    if (!file || !user?.id) {
      return;
    }
    try {
      setLoading(true);
      const path = await apiChangeAvatar(file);
      setUser((p) => (p ? { ...p, avatar: path } : p));
      toast.success("Successfully uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Uploading failed");
    }
    setLoading(false);
  }, [file, user?.id]);

  const removeFile = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      await apiDeleteAvatar();

      setUser((p) => (p ? { ...p, avatar: null } : p));
      toast.success("Successfully removed");
    } catch (err) {
      console.log(err);
      toast.error("Removing failed");
    }
    setLoading(false);
  }, [!user?.id]);

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent className="p-[24px]">
        <ModalBody className="flex flex-col">
          <h2 className="my-dialog-title">Change Avatar</h2>
          <div className="flex items-center gap-4 flex-col">
            <input
              type="file"
              name="myImage"
              accept="image/*"
              className="w-[160px]"
              onChange={onFileChange}
            />
            <div className="flex gap-4">
              <Button
                type="button"
                className="flex"
                color="primary"
                onClick={submitFile}
                isDisabled={!file}
                isLoading={loading}
              >
                Save <FaUpload size={12} />
              </Button>
              <Button
                type="button"
                color="danger"
                className="flex"
                onClick={removeFile}
                isDisabled={!user?.avatar}
                isLoading={loading}
              >
                Remove <FaTrash size={12} />
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
