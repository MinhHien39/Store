import type { Metadata } from "next";
import PublicInfoPage from "@/app/_components/PublicInfoPage";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Chinh sach bao mat | ${SITE_NAME}`,
  description:
    "Tom tat cach TMH Store tiep nhan, su dung va bao ve thong tin nguoi dung khi truy cap va dat hang tren website.",
  alternates: {
    canonical: SITE_PATHS.privacyPolicy,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PublicInfoPage
      eyebrow="Privacy"
      title="Chinh sach bao mat"
      description="Trang nay mo ta cac loai thong tin co the duoc thu thap va muc dich su dung khi ban truy cap TMH Store."
    >
      <p>
        TMH Store co the thu thap thong tin ma ban chu dong cung cap khi dang ky tai khoan,
        dat hang hoac lien he ho tro, bao gom ho ten, so dien thoai, dia chi giao hang va noi
        dung trao doi lien quan den don hang.
      </p>
      <p>
        Cac thong tin nay duoc su dung de xu ly don hang, xac nhan giao dich, giao tiep voi
        khach hang va cai thien trai nghiem mua sam. Chung toi khong cong bo thong tin ca nhan
        cho ben thu ba ngoai pham vi can thiet de van hanh don hang hoac tuan thu yeu cau phap ly.
      </p>
      <p>
        Nguoi dung nen chi cung cap thong tin can thiet phuc vu mua hang. Khi can dieu chinh hoac
        xoa thong tin lien quan den tai khoan va don hang, ban co the lien he qua cac kenh ho tro
        duoc cong bo tren website.
      </p>
    </PublicInfoPage>
  );
}
