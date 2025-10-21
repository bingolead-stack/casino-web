import styles from "./Loading.module.scss";
import ClipLoader from "react-spinners/ClipLoader";

export default function Loading() {
  return (
    <div className={styles.page_loading_overlay}>
      <img src="/favicon/apple-touch-icon.png" alt="loading" />
      <ClipLoader
        color="var(--primary-color)"
        className="absolute"
        size={150}
        speedMultiplier={0.7}
      />
    </div>
  );
}
