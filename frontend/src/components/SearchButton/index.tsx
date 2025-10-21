import React from "react";
import styles from "./SearchButton.module.scss";
import IconSearch from "@/assets/icons/search.svg";

export default function SearchButton() {
  return (
    <button className={styles.searchButton}>
      <IconSearch />
    </button>
  );
}
