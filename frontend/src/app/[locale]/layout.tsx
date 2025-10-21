import type { Metadata } from "next";
import { ApplicationLayout } from "./AppLayout";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  colorScheme: "dark",
  title: "Casino.bet - Online Slots & Premium Crypto Casino",
  applicationName: "Casino.bet - Online Slots & Premium Crypto Casino",
  description:
    "Experience elite gaming like never before at Casino.bet — your premier destination for luxury casino entertainment. Indulge in your favorite games, place winning sports bets, and unlock exclusive bonuses fit for high-rollers. Join today and elevate your play to first-class status.",
  generator: "Casino Team",
  manifest: "/manifest.json",
  keywords: ["Casino", "Casino", "Crypto"],
  themeColor: "#000000",
  authors: [{ name: "Casino" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/favicon/apple-touch-icon.png" },
    { rel: "icon", url: "/favicon/apple-touch-icon.png" },
  ],
  openGraph: {
    siteName: "Casino.bet",
    locale: "en",
    url: "https://Casino.bet",
    title: "Online Slots & Premium Crypto Casino Games at Casino.bet",
    description:
      "Experience elite gaming like never before at Casino.bet — your premier destination for luxury casino entertainment. Indulge in your favorite games, place winning sports bets, and unlock exclusive bonuses fit for high-rollers. Join today and elevate your play to first-class status.",
    type: "website",
    images: [
      {
        url: "https://www.Casino.bet/en/opengraph.png",
        width: 1443,
        height: 837,
        alt: "Online Slots & Premium Crypto Casino Games at Casino.bet",
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.cdnfonts.com/css/nunito-sans"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dark text-foreground bg-background">
        <NextIntlClientProvider messages={messages}>
          <ApplicationLayout>{children}</ApplicationLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
