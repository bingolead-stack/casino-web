import ClipLoader from "react-spinners/ClipLoader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-[calc(100vh-200px)] flex justify-center items-center text-white relative">
      <img src="/favicon/apple-touch-icon.png" width="64px" alt="loading" />
      <ClipLoader
        color="var(--primary-color)"
        className="absolute"
        size={150}
        speedMultiplier={0.7}
      />
    </div>
  );
}
