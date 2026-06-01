import App from "@/application/App";
import Link from "next/link";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

const crawlLinks = [
  { href: SITE_PATHS.home, label: "Trang chu" },
  { href: SITE_PATHS.products, label: "San pham" },
  { href: SITE_PATHS.categories, label: "Danh muc" },
  { href: SITE_PATHS.brands, label: "Thuong hieu" },
  { href: SITE_PATHS.about, label: "Gioi thieu" },
  { href: SITE_PATHS.contact, label: "Lien he" },
  { href: SITE_PATHS.privacyPolicy, label: "Chinh sach bao mat" },
  { href: SITE_PATHS.terms, label: "Dieu khoan su dung" },
];

export default function CatchAllPage() {
  return (
    <>
      <section className="sr-only">
        <h1>{SITE_NAME}</h1>
        <p>
          TMH Store la website mua sam truc tuyen voi danh muc san pham, trang thuong hieu,
          thong tin lien he va cac chinh sach van hanh cong khai.
        </p>
        <nav aria-label="Public site links">
          <ul>
            {crawlLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <noscript>
        <div className="mx-auto max-w-3xl px-6 py-12 text-slate-900">
          <h1 className="text-3xl font-bold">{SITE_NAME}</h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Website can JavaScript de hien thi trai nghiem mua sam day du. Ban van co the truy cap
            cac trang thong tin cong khai ben duoi.
          </p>
          <ul className="mt-6 list-disc space-y-2 pl-5">
            {crawlLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      <App />
    </>
  );
}
