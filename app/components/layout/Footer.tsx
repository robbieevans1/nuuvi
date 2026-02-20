import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
            <Link className="hover:text-white" href="/privacy">Privacy</Link>
            <Link className="hover:text-white" href="/terms">Terms</Link>
            <Link className="hover:text-white" href="/cookies">Cookies</Link>
          </div>

          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Nuuvi
          </p>
        </div>
      </div>
    </footer>
  );
}