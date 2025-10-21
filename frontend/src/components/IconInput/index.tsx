import styles from "./IconInput.module.scss";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export default function IconInput(props: IconInputProps) {
  return (
    <div className={styles["icon-input"]}>
      {props.icon && <span>{props.icon}</span>}
      <input {...props} />
    </div>
  );
}
