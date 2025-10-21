"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import SidebarAccordionItem, {
  ISidebarAccordionItemProps,
} from "./SidebarAccordionItem";
import styles from "./SidebarAccordion.module.scss";
import IconAnchor from "@/assets/icons/circle-chevron-up.svg";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import React from "react";
import { useRecoilState } from "recoil";
import { Link, usePathname } from "@/i18n/routing";

interface ISidebarAccordionProps {
  title: string;
  color: string;
  options: ISidebarAccordionItemProps[];
}

export default function SidebarAccordion({
  title,
  color,
  options,
}: ISidebarAccordionProps) {
  const [sidebarExpanded] = useRecoilState(sidebarExpandedState);
  const pathname = usePathname();

  return (
    <div className={styles.container + " " + styles[color]}>
      {sidebarExpanded ? (
        <Accordion defaultExpandedKeys={["anchor"]}>
          <AccordionItem
            key="anchor"
            aria-label="Anchor"
            indicator={
              <div style={{ transform: "rotate(90deg)" }}>
                <IconAnchor />
              </div>
            }
            title={title}
            classNames={{
              content: "flex flex-col",
              title:
                "uppercase text-[12px] font-bold ml-[21px] " +
                styles["text_" + color],
            }}
          >
            {options.map((e) => (
              <SidebarAccordionItem key={e.text} {...e} />
            ))}
          </AccordionItem>
        </Accordion>
      ) : (
        <div>
          {options.map((e) => (
            <Link
              key={e.text}
              href={e.href}
              className={
                "w-[45px] h-[45px] flex items-center justify-center " +
                (pathname === e.href ? styles.selectedItem : "")
              }
            >
              {e.icon}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
