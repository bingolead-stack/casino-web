import { FaSearch } from "react-icons/fa";
import styles from "./SearchInput.module.scss";

export default function SearchInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className={styles["search-input"]}>
      <span>
        <FaSearch />
      </span>
      <input {...props} />
    </div>
  );
}
