import type { Metadata } from "next";
import PublicInfoPage from "@/app/_components/PublicInfoPage";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Lien he | ${SITE_NAME}`,
  description:
    "Thong tin lien he va cach nhan ho tro tu TMH Store truoc khi mua hang, trong luc dat hang va sau khi nhan hang.",
  alternates: {
    canonical: SITE_PATHS.contact,
  },
};

export default function ContactPage() {
  return (
    <PublicInfoPage
      eyebrow="Contact"
      title="Can tu van hay ho tro don hang, ban co the lien he voi TMH Store bat cu luc nao."
      description="Chung toi duy tri cac kenh lien he de giai dap thong tin san pham, xac nhan don hang va ho tro sau mua."
    >
      <p>
        Kenh lien he chinh hien tai cua TMH Store la Facebook Page va Messenger. Cac lien ket
        nay duoc hien thi trong header va footer de khach hang co the truy cap nhanh tren ca
        dien thoai lan may tinh.
      </p>
      <p>
        Thoi gian phan hoi duoc cong bo tren site. Trong truong hop can xac nhan don, thay doi
        thong tin giao hang hoac can giai dap truoc khi thanh toan, ban co the nhan tin truc tiep
        qua Messenger de nhan ho tro nhanh hon.
      </p>
      <p>
        Neu site bo sung email ho tro hoac tong dai trong tuong lai, thong tin se duoc cap nhat
        tai trang nay va trong chan trang cua cua hang.
      </p>
    </PublicInfoPage>
  );
}
