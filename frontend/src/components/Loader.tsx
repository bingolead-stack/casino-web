import ClipLoader from "react-spinners/ClipLoader";

export default function Loader() {
  return (
    <div className="flex justify-center mt-[60px]">
      <ClipLoader color="var(--primary-color)" />
    </div>
  );
}
