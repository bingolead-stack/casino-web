import IconChevronUpDown from "@/assets/icons/chevron-updown.svg";
import styles from "./ProviderFilter.module.scss";
import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import { useRecoilState } from "recoil";
import { providerState } from "@/state/providerState";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";

export type tProviderItem = {
  id: number;
  name: string;
  count: number;
};

interface IProviderFilterProps {
  buttonText: string;
}

export default function ProviderFilter({ buttonText }: IProviderFilterProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [provider] = useRecoilState(providerState);
  const pathname = usePathname();

  return (
    <>
      <div className={styles.providerFilter + " " + (open ? styles.open : "")}>
        <button
          className={styles.selectButton}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className={styles.title}>{buttonText || "All Providers"}</div>
          <IconChevronUpDown />
        </button>
        {open && (
          <div className={styles.dropdown}>
            <SearchInput
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus={true}
            />
            <ul className={styles.list}>
              {provider.array
                .filter((e) =>
                  e.provider
                    .toLowerCase()
                    .includes(keyword.trim().toLowerCase())
                )
                .map((e) => (
                  <li key={e.provider}>
                    <Link
                      href={pathname + `?providerId=${e.provider}&type=slots`}
                      className={styles.item}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.name}>{e.provider}</span>
                      {/* <span className={styles.count}>{e.count}</span> */}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
    </>
  );
}
