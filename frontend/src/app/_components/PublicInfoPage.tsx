import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

interface PublicInfoPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const quickLinks = [
  { href: SITE_PATHS.products, label: "San pham" },
  { href: SITE_PATHS.categories, label: "Danh muc" },
  { href: SITE_PATHS.brands, label: "Thuong hieu" },
  { href: SITE_PATHS.contact, label: "Lien he" },
];

export default function PublicInfoPage({
  eyebrow,
  title,
  description,
  children,
}: PublicInfoPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_52%,#f5f7fb_100%)] text-slate-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 md:px-10 md:py-20">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
            {eyebrow}
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {description}
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
          <article className="rounded-[28px] border border-slate-200 bg-white/95 p-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:p-9">
            <div className="space-y-5 text-[15px] leading-7 text-slate-700 md:text-base">
              {children}
            </div>
          </article>

          <aside className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              {SITE_NAME}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Kenh mua sam truc tuyen voi thong tin ro rang, danh muc san pham de theo doi
              va ho tro nhanh qua Messenger.
            </p>
            <nav className="mt-6 space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-amber-300 hover:bg-amber-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}
