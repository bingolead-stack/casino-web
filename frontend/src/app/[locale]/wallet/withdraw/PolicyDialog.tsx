import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface IPolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyDialog({ isOpen, onClose }: IPolicyDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Withdrawal Rules and Conditions
        </ModalHeader>
        <ModalBody>
          <div>
            <br />
            1. <b>Anti-Money Laundering (AML) Requirements:</b>
            <br />- To ensure compliance with <b>
              Anti-Money Laundering (AML)
            </b>{" "}
            regulations, all users must wager at least{" "}
            <b>1x their deposit amount</b> before being eligible to make a
            withdrawal.
            <br />- This means that users must place bets and wager an amount at
            least equal to their original deposit before they can access their
            funds.
            <br />- Any withdrawal requests made before meeting this requirement
            will be declined, and the user will need to complete the necessary
            wagering.
            <br />
            <br />
            2. <b>New User Withdrawal Limits:</b>
            <br />- <b>New users</b> (those who have recently signed up and have
            not yet reached Level 6) are subject to the following withdrawal
            limits:
            <br />- <b>Maximum monthly withdrawal:</b> <b>$20,000</b> per
            calendar month.
            <br />- <b>Maximum weekly withdrawal: $5,000</b> per week (7-day
            period).
            <br />- These limits are in place to ensure that new users maintain
            a responsible and fair gaming experience, while we assess the
            legitimacy and activity of their account.
            <br />- These withdrawal limits apply to all new users until they
            reach Level 6 in the system.
            <br />
            <br />
            3. <b>Leveling Up and Removal of Limits:</b>
            <br />- Users who achieve <b>Level 6</b> or higher will have all
            withdrawal limits <b>removed</b>.
            <br />- At this point, the user will no longer be subject to the
            monthly or weekly withdrawal caps.
            <br />- Users at Level 6 and beyond can withdraw any amount up to
            the total balance in their account, subject only to available funds
            and the overall financial health of the platform.
            <br />- Reaching Level 6 signifies a history of consistent and fair
            play, rewarding users with greater flexibility regarding
            withdrawals.
            <br />
            <br />
            4. <b>Withdrawal Processing Time:</b>
            <br />- All withdrawal requests will be processed as quickly as
            possible. In most cases, withdrawals will be completed **within a
            maximum of 30 minutes**.
            <br />- Please note that processing times may vary depending on the
            chosen withdrawal method (e.g., bank transfer, e-wallet, etc.).
            However, the platform is committed to ensuring that users receive
            their funds in a timely manner.
            <br />- In cases of high-volume withdrawal requests or during peak
            times, processing may take slightly longer, but the platform will
            notify users of any delays.
            <br />
            <br />
            5. <b>Fair Play and Account Integrity:</b>
            <br />-{" "}
            <b>
              Cheating, fraudulent activities, or manipulation of the system
            </b>{" "}
            in any form will not be tolerated. This includes, but is not limited
            to, attempting to abuse bonuses, creating multiple accounts, or
            engaging in any deceptive behavior.
            <br />- Users who engage in any fraudulent or dishonest activity
            will have their withdrawals blocked, their accounts suspended, and
            any funds may be forfeited.
            <br />- The platform has sophisticated monitoring systems in place
            to detect unusual or suspicious behavior, and we take these matters
            very seriously to protect both the integrity of the platform and the
            security of our players.
            <br />
            <br />
            6. <b>General Withdrawal Conditions:</b>
            <br />- All withdrawals are subject to the availability of funds in
            the user&apos;s account.
            <br />- The user&apos;s withdrawal request may be subject to
            verification procedures, and additional documentation may be
            required for large withdrawals or if there are concerns regarding
            the legitimacy of the transaction.
            <br />- Withdrawals can only be processed to accounts or payment
            methods that belong to the user. Any attempts to withdraw to
            third-party accounts will be denied.
            <br />
            <br />
            7. <b>Right to Modify or Suspend Withdrawals:</b>
            <br />- The website reserves the right to modify, suspend, or impose
            additional withdrawal limits if there is suspicion of fraud, money
            laundering, or other irregular activities.
            <br />- In such cases, users will be notified, and their withdrawal
            requests may be put on hold until further investigation is
            completed.
            <br />- The platform retains the right to take necessary actions to
            protect itself and other users from any forms of abuse.
            <br />
            <br />
            8. <b>Responsibility and Fair Play:</b>
            <br />- By using the platform, users agree to abide by these
            withdrawal rules, which are designed to promote **responsible
            gambling** and ensure a fair, secure environment for all players.
            <br />- The platform is committed to offering transparent and fair
            withdrawal processes and encourages users to play responsibly.
            <br />- Users must refrain from any actions that may be seen as
            attempting to manipulate the system. Violations may result in
            penalties, account suspension, or forfeiture of funds.
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
