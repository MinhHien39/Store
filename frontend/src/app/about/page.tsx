import type { Metadata } from "next";
import PublicInfoPage from "@/app/_components/PublicInfoPage";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Gioi thieu | ${SITE_NAME}`,
  description:
    "Tong quan ve TMH Store, dinh huong san pham va cach chung toi ho tro khach hang truoc va sau mua hang.",
  alternates: {
    canonical: SITE_PATHS.about,
  },
};

export default function AboutPage() {
  return (
    <PublicInfoPage
      eyebrow="About"
      title="TMH Store tap trung vao trai nghiem mua sam ro rang va de tin."
      description="Trang nay giai thich chung toi ban gi, cach danh muc san pham duoc trinh bay va nhung kenh ho tro khach hang co san."
    >
      <p>
        TMH Store xay dung mot cua hang truc tuyen gon gang de khach hang co the xem san
        pham, so sanh thong tin va lien he nhanh khi can tu van truoc khi dat mua.
      </p>
      <p>
        Chung toi uu tien mo ta san pham de doc, hinh anh de theo doi, gia ca minh bach va
        quy trinh giao tiep ro rang qua Facebook va Messenger.
      </p>
      <p>
        Neu ban can them thong tin ve san pham, tinh trang don hang hoac chinh sach cua cua
        hang, vui long truy cap trang lien he hoac nhan tin truc tiep qua kenh ho tro da duoc
        lien ket tren site.
      </p>
    </PublicInfoPage>
  );
}
