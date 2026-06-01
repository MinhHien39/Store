import type { Metadata } from "next";
import PolicyExperience from "@/app/_components/PolicyExperience";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

export const metadata: Metadata = {
  title: `Giới thiệu | ${SITE_NAME}`,
  description:
    "Tổng quan về TMH Store, định hướng sản phẩm và cách chúng tôi hỗ trợ khách hàng trước và sau mua hàng.",
  alternates: {
    canonical: SITE_PATHS.about,
  },
};

export default function AboutPage() {
  return <PolicyExperience page="about" />;
}
