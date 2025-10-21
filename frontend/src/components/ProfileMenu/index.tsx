import React, { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { Link } from "@/i18n/routing";
import { setAxiosAuthToken } from "@/api/instance";
import { accessTokenState } from "@/state/accessTokenState";
import axios from "axios";
import { data } from "./data";
import styles from "./ProfileMenu.module.scss";
import ClaimRewardDialog from "@/components/ClaimRewardDialog";

interface ProfileProps {
  isOpen: boolean;
  onClose(): void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileProps) {
  const [user, setUser] = useRecoilState(userState);
  const [accessToken, setAccessTokenState] = useRecoilState(accessTokenState);
  const [showClaim, setShowClaim] = useState(false);

  const onLogout = useCallback(async () => {
    try {
      await axios.post("/api/remove-token");
      setUser(null);
      setAxiosAuthToken("");
      setAccessTokenState(null);
      onClose();

      location.href = "/";
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        console.error(ex.message);
      }
    }
  }, [user]);

  const onClickItem = (e?: string) => {
    onClose();

    if (e === "logout") {
      onLogout();
    } else if (e === "bonus") {
      setShowClaim(true);
    }
  };

  return (
    <>
      {isOpen && <div className={styles.profileOverlay} onClick={onClose} />}
      <div
        className={
          styles.profile +
          " " +
          (isOpen ? "translate-y-0" : "translate-y-[2048px]")
        }
      >
        <div className="flex flex-col">
          {data.map((e) =>
            e.href ? (
              <Link
                key={e.title}
                className="flex gap-[18px] py-[11px] px-[13px] hover:bg-[#0003]"
                href={e.href}
                onClick={onClose}
              >
                <div className="w-[23px] h-[23px] flex items-center justify-center">
                  {e.icon}
                </div>
                <span className="text-[#FFFFFFB7] text-[14px] leading-[24px]">
                  {e.title}
                </span>
              </Link>
            ) : (
              <div
                key={e.title}
                className="flex gap-[18px] py-[11px] px-[13px] hover:bg-[#0003]"
                onClick={() => onClickItem(e.key)}
              >
                <div className="w-[23px] h-[23px] flex items-center justify-center">
                  {e.icon}
                </div>
                <span className="text-[#FFFFFFB7] text-[14px] leading-[24px]">
                  {e.title}
                </span>
              </div>
            )
          )}
        </div>
      </div>
      <ClaimRewardDialog
        isOpen={showClaim}
        onClose={() => setShowClaim(false)}
      />
    </>
  );
}
