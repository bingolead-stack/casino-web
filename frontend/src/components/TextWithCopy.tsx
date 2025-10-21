import { abbr } from "@/helpers/abbr";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

interface ITextWithCopyProps {
  text: string;
}

export default function TextWithCopy({ text }: ITextWithCopyProps) {
  return (
    <div className="flex items-center gap-1">
      {abbr(text, 5)}
      <button
        onClick={(e) => {
          navigator.clipboard.writeText(text);
          toast.info("Copied " + text);
          e.stopPropagation();
        }}
      >
        <FaCopy />
      </button>
    </div>
  );
}
