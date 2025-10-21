"use client";

import React, { useState } from "react";
import styles from "./Page.module.scss";
import HeaderBox from "./HeaderBox";
import Content from "./Data";

export default function PageComponent() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className={styles.container}>
      <HeaderBox />
      <div className={styles.vertical_tabs}>
        <div className={styles.tabs}>
          {Content.map((tab, index) => (
            <div
              key={index}
              className={`${activeTab === index ? styles.active : styles.tab}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div className={styles.content}>
          <h2 className={styles.content_header}>{Content[activeTab].title}</h2>
          <div className={styles.content_data}>
            {Content[activeTab].content}
          </div>
        </div>
      </div>
    </div>
  );
}
