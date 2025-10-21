"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { isMyApp } from "@/helpers/isMyApp";
import { Button } from "@nextui-org/react";
import { FaBars } from "react-icons/fa";
import CasinoSwiperSwitch from "../CasinoSportSwitch";
import { loginOpenedState } from "@/state/loginOpenedState";
import { registerOpenedState } from "@/state/registerOpenedState";
import { FaChevronDown } from "react-icons/fa";
import IconCasino from "@/assets/icons/nav_casino.svg";
import IconDeposit from "@/assets/icons/deposit_white.svg";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import Navbar from "./Navbar";
import WalletBox from "./WalletBox";
import ProfileMenu from "../ProfileMenu";
import Notification from "./Notification";
import { maintenanceState } from "@/state/maintenanceState";

export default function Header() {
  const [user] = useRecoilState(userState);
  const [openProfile, setOpenProfile] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const pathname = usePathname();
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [sidebarExpanded, setSidebarExpanded] =
    useRecoilState(sidebarExpandedState);
  const [registerOpened, setRegisterOpened] =
    useRecoilState(registerOpenedState);
  const [maintenance] = useRecoilState(maintenanceState);

  return (
    <header className="header">
      <div className="header-bar">
        <Button
          className="min-w-[0px] md:w-[40px] md:h-[40px] p-0 flex items-center justify-center rounded-full bg-[#222733] md:mr-[18px] mr-[10px] w-[32px] h-[32px]"
          type="button"
          onClick={() => setSidebarExpanded((p) => !p)}
        >
          <FaBars size={isMobile ? 12 : 16} color="#FFFFFFB7" />
        </Button>
        {isMobile ? (
          <Navbar />
        ) : (
          <CasinoSwiperSwitch
            options={[
              { icon: <IconCasino />, text: "Casino", href: "/" },
              { text: "Sport", href: "/sports/en" },
            ]}
          />
        )}
        <Link
          className="md:ml-[36px]"
          href={isMyApp() && pathname.includes("/login") ? "#" : "/"}
        >
          <img
            src="/images/logo.png"
            alt="Casino"
            className={isMobile ? "h-[30px]" : "h-[44px]"}
          />
        </Link>
        <div className="toolbox">
          {!user?.id ? (
            isMyApp() ? (
              <></>
            ) : isMobile ? (
              <Button
                className="btn btn-primary h-[30px]"
                onClick={() => setLoginOpened(true)}
              >
                Join
              </Button>
            ) : (
              <>
                <Notification />
                <Button
                  className="btn h-[40px]"
                  onClick={() => setLoginOpened(true)}
                >
                  Sign In
                </Button>
                <Button
                  className="btn btn-primary gap-[8px] h-[40px]"
                  onClick={() => setRegisterOpened(true)}
                >
                  Register
                </Button>
              </>
            )
          ) : (
            <>
              <WalletBox />
              {!isMobile && (
                <Link
                  className="btn btn-primary gap-[8px] h-[40px] mr-[184px] md:flex hidden"
                  type="button"
                  href="/wallet/deposit"
                >
                  Deposit
                  <IconDeposit />
                </Link>
              )}
              <Notification />
              <button
                className="btn profile"
                type="button"
                onClick={() => setOpenProfile((prev) => !prev)}
                style={{ border: 0 }}
              >
                <img
                  src={user.avatar || "/images/default-avatar.png"}
                  width={isMobile ? 24 : 36}
                  height={isMobile ? 24 : 36}
                  className="rounded-full"
                  alt={user.userName}
                />
                {user.userName}
                <FaChevronDown size={12} color="#FFFFFFB7" />
              </button>
            </>
          )}
        </div>
      </div>

      {user?.id && (
        <ProfileMenu
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
        />
      )}

      {maintenance && (
        <div className="h-[48px] bg-[#ff333366] text-[#eee] text-[16px] flex items-center justify-center">
          {maintenance}
        </div>
      )}
    </header>
  );
}
