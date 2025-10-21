const rewardData = [
  {
    id: 1,
    name: "Level Up Bonus",
    color: "green",
    img: "/images/claim_rewards/img1.png",
    data: [
      { name: "XP To VIP 2", value: "0/1000", icon: "" },
      { name: "Next Level Bonus", value: "1.00 USD", icon: "" },
    ],
    action: {
      state: "NORMAL",
      name: "View VIP Club",
      deadline: null,
    },
  },
  {
    id: 2,
    name: "Rakeback",
    color: "blue",
    img: "/images/claim_rewards/img2.png",
    data: [
      {
        name: "Rakeback Rate",
        value: "0.1%",
        icon: "/images/claim_rewards/info.png",
      },
      { name: "Wager", value: "0.00/0.00 USD", icon: "" },
      { name: "Expected Reward", value: "-", icon: "" },
    ],
    action: {
      state: "PENDING",
      name: "Ready in",
      deadline: new Date("2025-02-14T23:59:59"),
    },
  },
  {
    id: 3,
    name: "Weekly Bonus",
    color: "purple",
    img: "/images/claim_rewards/img3.png",
    data: [
      { name: "Wager", value: "500.00 USD", icon: "" },
      { name: "Weakly Bonus", value: "5.00 USD", icon: "" },
    ],
    action: {
      state: "LOCKED",
      name: "VIP 6 Unlocked",
      deadline: null,
    },
  },
  {
    id: 4,
    name: "Cashback 25%",
    color: "red",
    img: "/images/claim_rewards/img4.png",
    data: [
      { name: "Lossback Rate", value: "1.00%", icon: "" },
      { name: "Expected Claim", value: "-", icon: "" },
    ],
    action: {
      state: "LOCKED",
      name: "Details",
      deadline: null,
    },
  },
  {
    id: 5,
    name: "Monthly Bonus",
    color: "blue_purple",
    img: "/images/claim_rewards/img5.png",
    data: [
      { name: "Wager", value: "1000.00 USD", icon: "" },
      { name: "Monthly Bonus", value: "10.00 USD", icon: "" },
    ],
    action: {
      state: "LOCKED",
      name: "VIP 6 Unlocked",
      deadline: null,
    },
  },
];

export default rewardData;
