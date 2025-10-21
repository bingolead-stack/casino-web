export interface IPromotionCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    action: string;
    link: string;
}

export const promotionCardData: IPromotionCardProps[] = [
    {
        id: "1",
        title: "Cash Out In Minutes",
        description: "Get Your Winnings Instantly.",
        imageUrl: "/images/promotions/cashout.png",
        action: "Try It Now",
        link: "#",
    },
    {
        id: "",
        title: " 100% First Deposit Bonus!",
        description: "Double Your Funds — Up to $1,000!",
        imageUrl: "/images/promotions/bonus.png",
        action: "Deposit Now",
        link: "#",
    },
    {
        id: "3",
        title: "Claim Your 10-15% Rakeback",
        description: "The More You Bet, the More You Get!",
        imageUrl: "/images/promotions/claim.png",
        action: "Learn More",
        link: "#",
    },
];