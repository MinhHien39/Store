import type { Metadata } from "next";
import PolicyExperience from "@/app/_components/PolicyExperience";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Điều khoản sử dụng | ${SITE_NAME}`,
  description:
    "Các điều khoản cơ bản khi truy cập website, đăng ký tài khoản, xem sản phẩm và gửi yêu cầu đặt hàng trên TMH Store.",
  alternates: {
    canonical: SITE_PATHS.terms,
  },
};

export default function TermsPage() {
  return <PolicyExperience page="terms" />;
}
