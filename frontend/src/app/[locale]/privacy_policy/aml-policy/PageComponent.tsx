import React from "react";
import styles from "./Page.module.scss";

export default function PageComponent() {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className={styles.paragraph}>
        <h2 className={styles.heading2}>
          Casino.bet Anti-Money Laundering (AML) Policy
        </h2>
        <div>
          <b>Virtuo Ltd Cyprus</b> is fully committed to preventing money
          laundering, fraud, terrorism financing, and other financial crimes. As
          part of our dedication to regulatory compliance, Casino.bet adheres to
          EU Anti-Money Laundering (AML) Regulations and implements advanced
          security measures to protect both our users and the integrity of the
          platform.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>AML Compliance & Security Measures</h3>
        <div>
          • Strict adherence to EU Directives, Belgian AML Laws, and Sanctions
          Regulations.
          <br />
          • Know Your Customer (KYC) procedures to verify user identities.
          <br />
          • Use of AI-driven fraud detection systems to monitor and flag
          suspicious activities.
          <br />• Continuous transaction monitoring to prevent illicit financial
          activities.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Account Verification Process</h3>
        <div>
          To ensure compliance with AML regulations and maintain a secure
          environment, all users must complete certain verification steps
          depending on their activity level.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h4 className={styles.heading4}>
          Basic Verification (Required for all users)
        </h4>
        <div>
          Before users can withdraw funds or complete certain transactions, they
          must provide:
        </div>
        <div>
          • Full name
          <br />
          • Date of birth
          <br />
          • Country of residence
          <br />
          • Complete residential address
          <br />• Nationality and gender
        </div>
      </div>
      <div className={styles.paragraph}>
        <h4 className={styles.heading4}>
          Intermediate Verification (Required for larger transactions)
        </h4>
        <div>This verification step is necessary for users who:</div>
        <div>
          • Deposit or withdraw <span className="text-[#FFF]">$2,000</span> or
          more
          <br />• Transfer <span className="text-[#FFF]">$1,000</span> or more
          between users
        </div>
        <div>
          This process includes submitting a{" "}
          <span className="text-[#FFF]">high-resolution photo ID</span> and
          completing a digital verification. If this step fails, users may be
          required to submit additional proof of residence.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h4 className={styles.heading4}>
          Advanced Verification (Required for high-value transactions)
        </h4>
        <div>For users who:</div>
        <div>
          • Deposit or withdraw <span className="text-[#FFF]">$5,000</span> or
          more
          <br />• Transfer <span className="text-[#FFF]">$3,000</span> or more
          between users
        </div>
        <div>
          Users will need to provide{" "}
          <span className="text-[#FFF]">proof of Source of Wealth</span> to
          verify the legitimacy of their funds.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Risk-Based User Classification</h3>
        <div>
          Casino.bet employs a risk-based approach to assess financial crime risks
          according to user location and transaction behavior:
        </div>
        <div>
          • <span className="text-[#FFF]">Low-Risk Regions:</span> Standard
          verification process applies.
          <br />• <span className="text-[#FFF]">Medium-Risk Regions:</span>{" "}
          Lower transaction limits may trigger additional verification
          requirements.
          <br />• <span className="text-[#FFF]">High-Risk Regions:</span> Users
          from countries on restricted lists will not be allowed to register.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Ongoing Monitoring & Compliance</h3>
        <div>
          • All user transactions are{" "}
          <span className="text-[#FFF]">continuously monitored</span> for
          unusual or suspicious activity.
          <br />• Our{" "}
          <span className="text-[#FFF]">
            AI-powered fraud detection system
          </span>{" "}
          analyzes user behavior to detect irregularities.
          <br />• If fraudulent activity or money laundering is suspected,
          <span className="text-[#FFF]">
            appropriate authorities will be notified promptly
          </span>
          .
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Reporting Suspicious Activity</h3>
        <div>
          Casino.bet AML team actively reviews user transactions and reports any
          suspicious activity to the{" "}
          <span className="text-[#FFF]">Financial Intelligence Unit (FIU)</span>{" "}
          as required by law. If illegal activity is identified, user accounts
          may be <span className="text-[#FFF]">suspended or terminated</span> in
          accordance with legal obligations.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Data Security & Record Keeping</h3>
        <div>
          In compliance with AML regulations, Casino.bet ensures the following:
        </div>
        <div>
          • <span className="text-[#FFF]">Identification data</span> is securely
          stored for a minimum of <span className="text-[#FFF]">ten years</span>
          after account closure.
          <br />• <span className="text-[#FFF]">Transaction records</span> are
          securely stored for legal auditing and compliance purposes.
          <br />• All personal data is treated{" "}
          <span className="text-[#FFF]">confidentially</span> and protected in
          accordance with <span className="text-[#FFF]">data privacy laws</span>
          .
        </div>
      </div>
    </div>
  );
}
