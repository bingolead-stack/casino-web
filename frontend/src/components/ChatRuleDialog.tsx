"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Checkbox,
  Button,
  ModalHeader,
} from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { registerOpenedState } from "@/state/registerOpenedState";
import IconInput from "./IconInput";
import axios from "axios";
import { toast } from "react-toastify";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { apiLogin } from "@/api/account/apiLogin";
import { setAxiosAuthToken } from "@/api/instance";
import IconUser from "@/assets/icons/login/user.svg";
import IconPassword from "@/assets/icons/login/password.svg";
import { forgotOpenedState } from "@/state/forgotOpenedState";

interface IChatRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatRuleDialog({
  isOpen,
  onClose,
}: IChatRuleDialogProps) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent className="md:p-[24px] p-[16px]">
        <ModalHeader className="flex justify-center text-[24px]">
          Chat Rules
        </ModalHeader>
        <ModalBody className="p-0 flex flex-col items-center gap-4">
          <ol type="1" className="list-decimal list-inside flex flex-col gap-4">
            <li>
              <b>Respectful Behavior:</b> Treat all members of the server with
              respect and kindness. Avoid harassment, hate speech, or any form
              of offensive behavior towards others. Maintain a welcoming and
              inclusive environment.
            </li>
            <li>
              <b>No Spamming or Advertising:</b> Refrain from spamming the chat
              with repeated messages, excessive emojis, or unrelated content.
              Advertising or self-promotion without prior permission from the
              server administrators is not allowed.
            </li>
            <li>
              <b>Use Appropriate Language:</b> Keep the discussions and
              interactions in the server family-friendly. Avoid using explicit,
              offensive, or inappropriate language that may make others
              uncomfortable.
            </li>
            <li>
              <b>Stay on Topic:</b> Keep the discussions and conversations
              relevant to the server&apos;s theme and purpose. Off-topic
              discussions should be taken to designated channels or private
              messages.
            </li>
            <li>
              <b>No Trolling or Disruptive Behavior:</b> Do not engage in
              trolling, deliberately provoking or harassing others, or any
              behavior that disrupts the peace and harmony of the server.
            </li>
            <li>
              <b>Respect Privacy:</b> Do not share personal information of
              others without their consent. Respect the privacy of fellow
              members and avoid sharing any sensitive information in public
              channels.
            </li>
            <li>
              <b>Follow Staff Instructions:</b> Comply with the instructions and
              guidelines provided by the server staff and moderators. If you
              have any concerns or questions, reach out to the staff members for
              assistance.
            </li>
            <li>
              <b>No NSFW Content:</b> Avoid sharing or discussing any explicit
              or NSFW (Not Safe for Work) content within the server. This
              includes images, videos, or links that are inappropriate or
              offensive.
            </li>
            <li>
              <b>No Spoilers:</b> Be considerate of others and refrain from
              posting spoilers without proper warning. Use spoiler tags when
              discussing sensitive or unreleased content to allow everyone to
              enjoy their experiences.
            </li>
            <li>
              <b>Report Concerns:</b> If you encounter any issues, harassment,
              or witness a violation of the rules, report it to the server staff
              or moderators. They will address the situation and take
              appropriate action.
            </li>
          </ol>
          <div>
            Remember, server rules are subject to change, and it&apos;s important to
            stay updated and abide by the guidelines set by the server
            administrators.
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
