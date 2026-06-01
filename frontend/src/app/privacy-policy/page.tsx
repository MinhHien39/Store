import type { Metadata } from "next";
import PolicyExperience from "@/app/_components/PolicyExperience";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Chính sách bảo mật | ${SITE_NAME}`,
  description:
    "Tóm tắt cách TMH Store tiếp nhận, sử dụng và bảo vệ thông tin người dùng khi truy cập và đặt hàng trên website.",
  alternates: {
    canonical: SITE_PATHS.privacyPolicy,
  },
};

export default function PrivacyPolicyPage() {
  return <PolicyExperience page="privacyPolicy" />;
}
