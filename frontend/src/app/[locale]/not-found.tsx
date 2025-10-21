import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="w-full h-full flex justify-center items-center min-h-[400px] flex-col gap-2">
      <h1>Not found – 404!</h1>
      <div>
        <Link href="/" className="text-[var(--primary-color)]">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
