import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-neutral-400">
        <div className="flex flex-wrap gap-4">
          <Link className="hover:text-white" href="/privacy">Privacy</Link>
          <Link className="hover:text-white" href="/terms">Terms</Link>
          <Link className="hover:text-white" href="/cookies">Cookies</Link>
        </div>

        <p className="mt-4">© {new Date().getFullYear()} Nuuvi</p>
      </div>
    </footer>
  );
}