"use client";

import { useState } from "react";
import styles from "./CopyInput.module.scss";

interface CopyInputProps {
  value: string;
  onCopy?: () => void;
}

export default function CopyInput(props: CopyInputProps) {
  const [buttonText, setButtonText] = useState("Copy");

  const onCopy = () => {
    props.onCopy?.();
    navigator.clipboard.writeText(props.value);
    setButtonText("Copied");
    setTimeout(() => setButtonText("Copy"), 1000);
  };

  return (
    <div className={styles["copy-input"]}>
      <div>{props.value}</div>
      <button type="button" className="btn btn-primary-black" onClick={onCopy}>
        {buttonText}
      </button>
    </div>
  );
}
