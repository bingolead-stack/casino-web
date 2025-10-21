import React from "react";
import styles from "./VIPClub.module.scss";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function FAQ() {
  return (
    <div className="md:mt-[90px] mt-[40px] flex flex-col rounded-[14px] overflow-hidden border-1 border-[#FFFFFF0A]">
      <div className={styles.faqTitle}>
        Frequently Asked Questions
        <div className="absolute blur-[10px] bg-[var(--primary-color)] md:w-[500px] w-[200px] h-[18px] bottom-[-4px]" />
      </div>
      <Accordion
        selectionMode="single"
        className="bg-[#1C202A] md:px-[20px] md:py-[45px] px-[12px] py-[16px] flex flex-col gap-[9px]"
        showDivider={false}
      >
        <AccordionItem
          key="1"
          title="Membership and Privileges at Casino.bet VIP Club"
          className="bg-[#222733] px-[20px] rounded-[14px] border-0"
          classNames={{
            title:
              "font-bold md:text-[18px] md:leading-[27px] text-[16px] leading-[20px] text-[#FFF]",
            content: "text-[16px] pb-[20px]",
          }}
        >
          As a Casino.bet VIP member, you gain access to exclusive perks, special
          bonuses, and unique rewards. Some of the benefits include: • Daily and
          weekly bonus rewards
          <br />
          <br />
          • VIP-only events and early access to updates
          <br />
          • Discounts on in-game purchases and exclusive items
          <br />
          • Special cosmetics, collectibles, and in-game perks
          <br />
          • Faster progression and higher reward multipliers
          <br />
          • Customizable benefits and exclusive VIP privileges
          <br />
          <br />
          As you stay active and engage with the club, you can unlock even
          better perks, including free gifts, limited-edition items, and
          enhanced bonuses. Keep participating to maximize your VIP experience!
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Accordion 2"
          title="Why Choose Casino.bet VIP Club"
          className="bg-[#222733] px-[20px] rounded-[14px] border-0"
          classNames={{
            title:
              "font-bold md:text-[18px] md:leading-[27px] text-[16px] leading-[20px] text-[#FFF]",
            content: "text-[16px] pb-[20px]",
          }}
        >
          The{" "}
          <span className="font-semibold text-[#FFF]">Casino.bet VIP Club</span>{" "}
          isn&apos;t just another club membership—it&apos;s a{" "}
          <span className="font-semibold text-[#FFF]">premium experience</span>{" "}
          designed for dedicated players who want{" "}
          <span className="font-semibold text-[#FFF]">
            exclusive perks, faster rewards, and a unique community
          </span>
          . Here&apos;s why you should join:
          <br />
          <br />
          <span className="font-semibold text-[#FFF]">
            1. Premium Rewards & Bonuses
          </span>
          <br />
          • Earn daily and weekly bonus rewards just for being a VIP.
          <br />
          • Get higher multipliers for in-game earnings, helping you progress
          faster.
          <br />
          <br />
          <span className="font-semibold text-[#FFF]">2. Exclusive Access</span>
          <br />
          • Early entry to special events, new content, and game updates.
          <br />
          • VIP-only cosmetics, collectibles, and in-game perks unavailable to
          regular players.
          <br />
          <br />
          <span className="font-semibold text-[#FFF]">
            3. Special Discounts & Free Gifts
          </span>
          <br />
          • Enjoy discounts on in-game purchases and club-exclusive items.
          <br />
          • Receive free gifts and limited-edition items as a loyal VIP.
          <br />
          <br />
          <span className="font-semibold text-[#FFF]">
            4. A True VIP Experience
          </span>
          <br />
          • Join a community of elite players with access to private events and
          discussions.
          <br />
          • Customize your experience with special privileges and in-game
          enhancements.
          <br />
          <br />
          The more you engage, the better the rewards!{" "}
          <span className="font-semibold text-[#FFF]">
            Join Casino.bet VIP Club today and take your adventure to the next
            level!
          </span>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Accordion 3"
          title="Exclusive VIP Bonuses"
          className="bg-[#222733] px-[20px] rounded-[14px] border-0"
          classNames={{
            title:
              "font-bold md:text-[18px] md:leading-[27px] text-[16px] leading-[20px] text-[#FFF]",
            content: "text-[16px] pb-[20px]",
          }}
        >
          <span className="font-semibold text-[#FFF]">
            1. VIP Transfer for High Rollers
          </span>
          <br />• If you&apos;re a{" "}
          <span className="font-semibold text-[#FFF]">high roller</span> who has
          played in other casinos before, you may be eligible for a{" "}
          <span className="font-semibold text-[#FFF]">VIP transfer</span>.
          <br />
          • This allows you to start with VIP benefits right away, without
          having to climb the ranks.
          <br />•{" "}
          <span className="font-semibold text-[#FFF]">
            Join our official Telegram group to apply for a VIP transfer
          </span>{" "}
          and get approved quickly.
          <br />
          <br />
          <br />
          <span className="font-semibold text-[#FFF]">
            Don&apos;t miss out—apply today and enjoy the exclusive perks of
            Casino.bet VIP!
          </span>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
