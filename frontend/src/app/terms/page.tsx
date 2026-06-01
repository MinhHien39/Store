import type { Metadata } from "next";
import PublicInfoPage from "@/app/_components/PublicInfoPage";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Dieu khoan su dung | ${SITE_NAME}`,
  description:
    "Cac dieu khoan co ban khi truy cap, su dung noi dung va dat hang tren website TMH Store.",
  alternates: {
    canonical: SITE_PATHS.terms,
  },
};

export default function TermsPage() {
  return (
    <PublicInfoPage
      eyebrow="Terms"
      title="Dieu khoan su dung"
      description="Cac dieu khoan nay ap dung cho viec truy cap website, xem san pham va su dung cac tinh nang dat hang cua TMH Store."
    >
      <p>
        Bang viec su dung website, ban dong y truy cap va su dung noi dung cua TMH Store mot cach
        hop phap, khong can thiep vao hoat dong cua he thong va khong su dung du lieu tren site
        cho muc dich gay hai hoac gian lan.
      </p>
      <p>
        Thong tin san pham, gia ban va tinh trang san co co the thay doi theo thoi diem cap nhat.
        Trong truong hop can xac nhan lai thong tin truoc khi xu ly don, chung toi se lien he voi
        khach hang qua thong tin da cung cap.
      </p>
      <p>
        TMH Store co quyen dieu chinh noi dung, cau truc website va chinh sach van hanh de phu hop
        voi nhu cau kinh doanh va quy dinh hien hanh. Ban nen xem lai trang nay khi tiep tuc su
        dung website sau moi lan cap nhat.
      </p>
    </PublicInfoPage>
  );
}
