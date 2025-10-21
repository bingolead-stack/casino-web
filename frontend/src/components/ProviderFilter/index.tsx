import IconChevronUpDown from "@/assets/icons/chevron-updown.svg";
import styles from "./ProviderFilter.module.scss";
import { useState } from "react";
import SearchInput from "../SearchInput";
import { useRecoilState } from "recoil";
import { providerState } from "@/state/providerState";
import { Link } from "@/i18n/routing";

export type tProviderItem = {
  id: number;
  name: string;
  count: number;
};

export default function ProviderFilter() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [provider] = useRecoilState(providerState);

  return (
    <>
      <div className={styles.providerFilter + " " + (open ? styles.open : "")}>
        <button
          className={styles.selectButton}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className={styles.title}>
            <span className="md:inline hidden">All providers</span>
            <span className="md:hidden inline">All</span>
          </div>
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
                  // <li key={e.id} onClick={() => onClickCheckbox(e)}>
                  <li key={e.provider}>
                    <Link
                      href={`/slots/all?providerId=${e.provider}`}
                      className={styles.item}
                    >
                      {/* <Checkbox
                        radius="full"
                        color="success"
                        isSelected={!!value.find((v) => v.id === e.id)}
                      /> */}
                      <span className={styles.name}>{e.provider}</span>
                      <span className={styles.count}>{e.count}</span>
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
