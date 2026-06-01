import type { Metadata } from "next";
import PolicyExperience from "@/app/_components/PolicyExperience";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Liên hệ | ${SITE_NAME}`,
  description:
    "Thông tin liên hệ và cách nhận hỗ trợ từ TMH Store trước khi mua hàng, trong lúc đặt hàng và sau khi nhận hàng.",
  alternates: {
    canonical: SITE_PATHS.contact,
  },
};

export default function ContactPage() {
  return <PolicyExperience page="contact" />;
}
