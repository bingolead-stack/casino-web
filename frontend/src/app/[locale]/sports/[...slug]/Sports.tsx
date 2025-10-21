"use client";

import Loading from "@/components/Loading";
import { accessTokenState } from "@/state/accessTokenState";
import { usePathname } from "@/i18n/routing";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { chatExpandedState } from "@/state/chatExpandedState";

const URL_PREFIX = "/sports";
const LANGUAGE = "en";

const generateIframeUrl = (token: string | undefined | null) =>
  `https://${process.env.NEXT_PUBLIC_IFRAME_ENDPOINT}/${LANGUAGE}/${
    token ? `?jwt=${token}` : ""
  }`;

export default function Sports() {
  const [accessToken] = useRecoilState(accessTokenState);
  const [src, setSrc] = useState("");
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sidebarExpanded, setSidebarExpanded] =
    useRecoilState(sidebarExpandedState);
  const [chatExpanded, setChatExpanded] = useRecoilState(chatExpandedState);

  useEffect(() => {
    if (src.includes("?jwt=")) {
      if (!accessToken || !src.includes(accessToken)) {
        const iframe = document.getElementById(
          "sports_iframe"
        ) as HTMLIFrameElement | null;
        console.log("Sending logout", iframe);
        iframe?.contentWindow?.postMessage(
          {
            type: "iframe",
            value: { logout: true },
          },
          `https://${process.env.NEXT_PUBLIC_IFRAME_ENDPOINT}`
        );
      }
    }

    if (!src || accessToken) {
      setSrc(generateIframeUrl(accessToken));
    }
  }, [accessToken, src]);

  useEffect(() => {
    const iframePath =
      pathname.substring(`${URL_PREFIX}/${LANGUAGE}`.length) || "/";
    console.log({ iframePath });

    const iframe = document.getElementById(
      "sports_iframe"
    ) as HTMLIFrameElement | null;

    // iframe?.contentWindow?.postMessage({
    //   type: "navigation",
    //   path: iframePath,
    //   query: { tab: "all" },
    // });
  }, [pathname]);

  // useEffect(() => {
  //   if (iframeRef?.current) {
  //     iframeRef.current.style.height = `${height - (isMobile ? 207 : 60)}px`;
  //   }
  // }, [height, isMobile, iframeRef?.current]);

  useEffect(() => {
    setSidebarExpanded(false);
    setChatExpanded(false);
  }, []);

  // if (!location.host.includes("Casino.com")) {
  //   return (
  //     <div className="w-full h-full flex justify-center items-center">
  //       <h1 className="text-3xl text-white">Casino Sports is coming soon</h1>
  //     </div>
  //   )
  // }

  return (
    <div className="w-full md:h-[calc(100vh-60px)] h-full relative flex justify-center items-center overflow-hidden">
      <iframe
        id="sports_iframe"
        className="w-full h-full absolute left-0 top-0"
        src={src}
        ref={iframeRef}
      />
      {!src && <Loading />}
    </div>
  );
}
