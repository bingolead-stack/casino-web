"use client";

import { userState } from "@/state/userState";
import React, { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSocketEvent from "@/hooks/useSocketEvent";
import { useSocket, useSocketStatus } from "@/context/SocketContext";
import { tUser } from "@/types/tUser";
import { accessTokenState } from "@/state/accessTokenState";
import { apiPushSubscribe } from "@/api/account/apiPushSubscribe";
import { tBalance } from "@/types/tBalance";
import { setAxiosAuthToken } from "@/api/instance";
import { apiGetProviders } from "@/api/common/apiGetProviders";
import { providerState } from "@/state/providerState";
import { tGR8Provider } from "@/types/tGR8Provider";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import {
  mobileLandscapeMediaQuery,
  mobileMediaQuery,
  mobilePortraitMediaQuery,
} from "@/config/constants";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { apiGetCustomGames } from "@/api/common/apiGetCustomGames";
import { customGamesState } from "@/state/customGamesState";
import { apiGetFavoritesGame } from "@/api/favorites/apiGetFavoritesGame";
import { favoritesGameState } from "@/state/favoritesGameState";
import { favoritesGameFlagState } from "@/state/favoritesGameFlagState";
import { isMyApp } from "@/helpers/isMyApp";
import Sidebar from "@/components/Sidebar";
import { loginOpenedState } from "@/state/loginOpenedState";
import LoginDialog from "@/components/LoginDialog";
import RegisterDialog from "@/components/RegisterDialog";
import { registerOpenedState } from "@/state/registerOpenedState";
import { forgotOpenedState } from "@/state/forgotOpenedState";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { usePathname, useRouter } from "@/i18n/routing";
import { chatExpandedState } from "@/state/chatExpandedState";
import { tChatMessage } from "@/types/tChatMessage";
import { chatMessagesState } from "@/state/chatMessagesState";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";
import { tokenListState } from "@/state/tokenListState";
import { useParams } from "next/navigation";
import { apiGetSetting } from "@/api/setting/apiGetSetting";
import { maintenanceState } from "@/state/maintenanceState";
import useVhProperty from "@/hooks/useVhProperty";
import LiveSupport from "@/components/LiveSupport";
import { supportMessagesUnseenState } from "@/state/supportMessagesUnseenState";
import { apiSetSmUserCursor } from "@/api/live_support/apiSetSmUserCursor";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { toast } from "react-toastify";

interface ClientProviderProps {
  children: ReactNode;
  initialUser: tUser | null;
  initialToken: string | null | undefined;
}

export default function ClientProvider({
  children,
  initialUser,
  initialToken,
}: ClientProviderProps) {
  const [user, setUser] = useRecoilState(userState);
  const [_, setAccessToken] = useRecoilState(accessTokenState);
  const [providers, setProviders] = useRecoilState(providerState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [registerOpened, setRegisterOpened] =
    useRecoilState(registerOpenedState);
  const [forgotOpened, setForgotOpened] = useRecoilState(forgotOpenedState);
  const [customGames, setCustomGames] = useRecoilState(customGamesState);
  const [favoritesGames, setFavoritesGames] =
    useRecoilState(favoritesGameState);
  const [favoritesGameFlag, setFavoritesGameFlag] = useRecoilState(
    favoritesGameFlagState
  );
  const [sidebarExpanded] = useRecoilState(sidebarExpandedState);
  const [chatExpanded] = useRecoilState(chatExpandedState);
  const socket = useSocket();
  const socketConnected = useSocketStatus();
  const router = useRouter();
  const { height = 0 } = useWindowSize();
  const isMobile = useMediaQuery(mobileMediaQuery);
  const isMobileLandscape = useMediaQuery(mobileLandscapeMediaQuery);
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const pathname = usePathname();
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
  const [tokenList, setTokenList] = useRecoilState(tokenListState);
  const { locale }: { locale: string } = useParams();
  const [maintenance, setMaintenance] = useRecoilState(maintenanceState);
  const [liveSupportMessages, setLiveSupportMessages] = useRecoilState(
    liveSupportMessagesState
  );
  const [smUnseenCount, setSmUnseenCount] = useRecoilState(
    supportMessagesUnseenState
  );
  const [liveSupportExpanded] = useRecoilState(liveSupportExpandedState);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    setAccessToken(initialToken);
    setAxiosAuthToken(initialToken);

    if (!initialToken) {
      try {
        fetch(`/api/remove-token`, {
          method: "POST",
        });
      } catch (ex1) {
        console.error("remove-token error");
        console.error(ex1);
      }
    }
  }, [initialToken]);

  useVhProperty();

  useEffect(() => {
    const container = document.querySelector(
      ".content-wrapper"
    ) as HTMLDivElement;
    if (container) {
      let height1 = height;
      if (!isMobileLandscape && !isMobilePortrait) {
        height1 -= 60;
      } else {
        if (pathname.startsWith("/sport") || pathname.startsWith("/game")) {
          height1 -= 107;
        }
      }
      container.style.minHeight = `${height1}px`;
    }
  }, [isMobilePortrait, isMobileLandscape, height, pathname]);

  // registers service worker for push notification
  useEffect(() => {
    if ("serviceWorker" in navigator && user?.email) {
      const handleServiceWorker = async () => {
        const register = await navigator.serviceWorker.register("/sw.js");

        if (register?.pushManager?.subscribe) {
          const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          try {
            const res = await apiPushSubscribe(subscription);
          } catch (ex) {
            console.error("Something went wrong in push subscription");
          }
        }
      };

      handleServiceWorker();
    }

    if (user?.email) {
      apiGetFavoritesGame({ offset: 0, limit: 400 })
        .then((res) => {
          setFavoritesGames(res.data);

          const flag: { [gameId: string]: boolean } = {};
          res.data.forEach((g) => (flag[g.id] = true));
          setFavoritesGameFlag(flag);
        })
        .catch((ex) => {
          console.error(ex);
        });

      apiGetTokenList(0)
        .then((res) => {
          setTokenList(res);
        })
        .catch((ex) => {
          console.error(ex);
        });
    }
  }, [user?.email]);

  useEffect(() => {
    let lastEvent: any;

    const iFrameEventHandler = (evt: MessageEvent) => {
      if (!evt.origin.includes(process.env.NEXT_PUBLIC_IFRAME_ENDPOINT || "")) {
        return;
      }

      const { data } = evt;
      console.log(data);
      if (data.type === "login.click") {
        router.push("/login");
      } else if (data.type === "auth.fail") {
      } else if (data.type === "user.balance") {
      } else if (data.type === "navigation") {
        if (lastEvent?.type !== "login.click") {
          window.history.replaceState(
            null,
            "",
            `/${locale}/sports/en${data.path === "/" ? "" : data.path}`
          );
        }
      }

      lastEvent = data;
    };

    const getProviders = async () => {
      try {
        const providers1 = await apiGetProviders();
        const providerMap: { [id: string]: tGR8Provider } = {};
        providers1.forEach((p) => (providerMap[p.provider] = p));
        setProviders({
          array: providers1,
          map: providerMap,
        });
      } catch (ex) {
        console.error(ex);
      }
    };

    const getCustomGames = async () => {
      try {
        const games = await apiGetCustomGames({
          category: "",
          offset: 0,
          limit: 1000,
        });
        setCustomGames(games.data);
      } catch (ex) {
        console.error(ex);
      }
    };

    const getMaintenance = async () => {
      try {
        const res = await apiGetSetting("maintenance");
        setMaintenance(res);
      } catch (ex) {
        console.error(ex);
      }
    };

    (async () => {
      await Promise.all([getProviders(), getCustomGames(), getMaintenance()]);
    })();

    window.addEventListener("message", iFrameEventHandler);

    return () => {
      window.removeEventListener("message", iFrameEventHandler);
    };
  }, [locale]);

  useEffect(() => {
    if (user?.email && socket && socketConnected) {
      socket.emit("user.id", user.id);
    }
  }, [user, socket, socketConnected]);

  useEffect(() => {
    const isInIframe = window.location !== window.parent.location;
    if (isInIframe) {
      console.log("isInIframe", document.referrer);
      try {
        if (window.location.host === window.parent.location.host) {
          window.parent.location.href = window.location.href;
        }
      } catch (error) {
        console.error("is-in-iframe.global", error);
      }
    }
  }, []);

  useSocketEvent("balance.updated", (data: tBalance) => {
    console.log("balance.updated", data);

    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            ...data,
          }
        : null
    );
  });

  useSocketEvent(
    "received.chat",
    (data: { tempId: number; message: tChatMessage }) => {
      // console.log("received.chat", data);

      setChatMessages((p) => {
        const i = p.findIndex((e) => e.id === data.tempId);
        const p1 = [...p];
        if (i !== -1) {
          p1[i] = data.message;
        } else {
          p1.push(data.message);
        }

        return p1;
      });
    }
  );

  useSocketEvent(
    "received.support",
    (data: { tempId: number; supportMessage: tLiveSupportMessage }) => {
      // console.log("received.support", data);
      let isNewMessage = false;

      setLiveSupportMessages((p) => {
        const i = p.findIndex((e) => e.id === data.tempId);
        const p1 = [...p];
        if (i !== -1) {
          p1[i] = data.supportMessage;
        } else {
          p1.push(data.supportMessage);
          isNewMessage = true;
        }
        return p1;
      });
      if (isNewMessage) {
        toast.info("New message has arrived from Admin");
      }
      if (!liveSupportExpanded) {
        setSmUnseenCount((prev) => prev + 1);
      } else {
        apiSetSmUserCursor({
          userId: data.supportMessage.userId,
          cursor: data.supportMessage.id,
        });
      }
    }
  );

  if (isMyApp()) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="app-layout">
        <div className="bg-[var(--background)] flex app-wrapper">
          <Sidebar />
          <div
            className="content-wrapper"
            style={{
              width: isMobile
                ? "100vw"
                : `calc(100vw - ${
                    (sidebarExpanded ? 280 : 80) + (chatExpanded ? 300 : 0) + 8
                  }px)`,
              ...(pathname.startsWith("/sports") ? { padding: "0" } : {}),
            }}
          >
            {children}
            <Footer />
            {user?.supportingUser && <LiveSupport />}
          </div>
          {/* <Chat /> */}
        </div>
      </div>

      <LoginDialog isOpen={loginOpened} onClose={() => setLoginOpened(false)} />
      <RegisterDialog
        isOpen={registerOpened}
        onClose={() => setRegisterOpened(false)}
      />
      <ForgotPasswordDialog
        isOpen={forgotOpened}
        onClose={() => setForgotOpened(false)}
      />
    </>
  );
}
