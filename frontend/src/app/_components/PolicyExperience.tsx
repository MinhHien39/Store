"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Globe,
  Mail,
  MessageCircle,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Waypoints,
} from "lucide-react";
import { SITE_NAME, SITE_PATHS } from "@/core/site";

type SupportedLanguage = "en" | "vi";
type PolicyPageKey = "about" | "contact" | "privacyPolicy" | "terms";

const LANG_STORAGE_KEY = "store_lang";
const FACEBOOK_URL = "https://www.facebook.com/xh.456789";
const MESSENGER_URL = "https://m.me/xh.456789";

interface Section {
  title: string;
  paragraphs: string[];
}

interface PageCopy {
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  sections: Section[];
  supportTitle: string;
  supportBody: string;
}

interface LocaleCopy {
  brandTag: string;
  navLabel: string;
  nav: Array<{ key: PolicyPageKey; label: string; href: string }>;
  languageLabel: string;
  supportEyebrow: string;
  supportLinks: Array<{ label: string; href: string }>;
  quickFactsTitle: string;
  quickFacts: string[];
  homeLink: string;
  browseLink: string;
  browseHref: string;
  footerNote: string;
  pages: Record<PolicyPageKey, PageCopy>;
}

const copy: Record<SupportedLanguage, LocaleCopy> = {
  vi: {
    brandTag: "Thông tin minh bạch cho khách hàng",
    navLabel: "Điều hướng thông tin",
    languageLabel: "Ngôn ngữ",
    homeLink: "Về trang chủ",
    browseLink: "Xem sản phẩm",
    browseHref: SITE_PATHS.products,
    supportEyebrow: "Hỗ trợ",
    supportLinks: [
      { label: "Messenger", href: MESSENGER_URL },
      { label: "Facebook", href: FACEBOOK_URL },
    ],
    quickFactsTitle: "Điểm nổi bật",
    quickFacts: [
      "Các trang này bám theo luồng đăng ký, đăng nhập, đặt hàng và theo dõi sản phẩm đang có trong hệ thống.",
      "Thông tin được viết rõ ràng để người dùng dễ hiểu và để bộ phận kiểm duyệt có thể đọc nhanh.",
      "Liên kết điều hướng, hỗ trợ và chính sách đều là URL thật, không dùng liên kết giả hoặc placeholder.",
    ],
    footerNote:
      "Nếu bạn cần xác nhận thêm về đơn hàng, quyền riêng tư hoặc cách liên hệ hỗ trợ, TMH Store sẽ ưu tiên phản hồi qua các kênh chính thức trên website.",
    nav: [
      { key: "about", label: "Giới thiệu", href: SITE_PATHS.about },
      { key: "contact", label: "Liên hệ", href: SITE_PATHS.contact },
      { key: "privacyPolicy", label: "Bảo mật", href: SITE_PATHS.privacyPolicy },
      { key: "terms", label: "Điều khoản", href: SITE_PATHS.terms },
    ],
    pages: {
      about: {
        eyebrow: "Giới thiệu",
        title: "TMH Store tập trung vào trải nghiệm mua sắm rõ ràng, nhanh và đáng tin.",
        description:
          "Trang này tóm tắt cách TMH Store vận hành website, cách chúng tôi trình bày danh mục sản phẩm và định hướng hỗ trợ khách hàng trước và sau mua.",
        badges: ["Danh mục rõ ràng", "Thông tin minh bạch", "Hỗ trợ qua Messenger"],
        sections: [
          {
            title: "TMH Store là gì",
            paragraphs: [
              "TMH Store được xây dựng như một cửa hàng trực tuyến giúp người dùng xem sản phẩm, so sánh thông tin và gửi yêu cầu mua hàng một cách gọn gàng, dễ hiểu.",
              "Mục tiêu của chúng tôi là giảm cảm giác rối khi mua sắm online bằng cách giữ bố cục rõ ràng, hiển thị giá dễ quét và đưa kênh liên hệ lên những vị trí dễ thấy.",
            ],
          },
          {
            title: "Những gì website hiện hỗ trợ",
            paragraphs: [
              "Người dùng có thể đăng ký tài khoản, đăng nhập, xem lịch sử đơn hàng, thêm sản phẩm vào giỏ hàng và gửi thông tin giao hàng để tạo đơn.",
              "Website cũng ghi nhận lượt xem sản phẩm và dữ liệu truy cập cơ bản để cải thiện cách tổ chức sản phẩm, điều hướng và hiệu quả vận hành.",
            ],
          },
          {
            title: "Cách chúng tôi hỗ trợ khách hàng",
            paragraphs: [
              "Kênh hỗ trợ hiện tại của TMH Store là Facebook và Messenger. Những kênh này được dùng để tư vấn trước khi mua, xác nhận đơn và xử lý các câu hỏi sau bán hàng.",
              "Khi cần làm rõ thông tin về sản phẩm, tồn kho hoặc thời gian giao hàng, chúng tôi sẽ liên hệ lại bằng đúng thông tin mà khách hàng đã cung cấp trong quá trình đặt hàng.",
            ],
          },
        ],
        supportTitle: "Cần trao đổi thêm về sản phẩm hoặc đơn hàng?",
        supportBody:
          "Bạn có thể chuyển thẳng sang trang Liên hệ hoặc nhắn qua Messenger để được hỗ trợ nhanh hơn.",
      },
      contact: {
        eyebrow: "Liên hệ",
        title: "Bạn có thể liên hệ TMH Store bất cứ khi nào cần tư vấn, xác nhận đơn hoặc hỗ trợ sau mua.",
        description:
          "Trang này mô tả các kênh liên hệ đang được công bố trên website và cách chúng tôi sử dụng chúng để hỗ trợ khách hàng.",
        badges: ["Messenger trực tiếp", "Facebook page", "Hỗ trợ trước và sau mua"],
        sections: [
          {
            title: "Kênh liên hệ chính",
            paragraphs: [
              "Hiện tại TMH Store hỗ trợ khách hàng chủ yếu qua Facebook Page và Messenger. Đây là hai kênh được đặt ở header, footer và tài khoản người dùng để khách có thể truy cập nhanh trên cả điện thoại lẫn máy tính.",
              "Các kênh này được dùng để tư vấn sản phẩm, xác nhận thông tin giao hàng, hỗ trợ thay đổi đơn và tiếp nhận phản hồi sau khi nhận hàng.",
            ],
          },
          {
            title: "Khi nào nên liên hệ",
            paragraphs: [
              "Bạn nên liên hệ khi cần kiểm tra thêm về thông số sản phẩm, thương hiệu, giá bán, khả năng còn hàng hoặc muốn xác nhận lại thông tin trước khi gửi đơn.",
              "Sau khi đặt hàng, khách hàng cũng có thể dùng các kênh này để theo dõi tiến độ xử lý, bổ sung ghi chú hoặc xử lý các vấn đề phát sinh liên quan đến đơn.",
            ],
          },
          {
            title: "Cam kết phản hồi",
            paragraphs: [
              "TMH Store cố gắng giữ thông tin liên hệ dễ thấy, không gây hiểu nhầm và không dẫn người dùng đến các trang điều hướng giả.",
              "Nếu website bổ sung email hỗ trợ hoặc hotline trong tương lai, thông tin sẽ được cập nhật tại chính trang này và trong footer của website.",
            ],
          },
        ],
        supportTitle: "Muốn chuyển sang kênh hỗ trợ ngay?",
        supportBody:
          "Các liên kết bên cạnh sẽ mở trực tiếp Facebook hoặc Messenger, đúng với những gì đang hiển thị trên storefront hiện tại.",
      },
      privacyPolicy: {
        eyebrow: "Chính sách bảo mật",
        title: "TMH Store thu thập dữ liệu ở mức cần thiết để vận hành tài khoản, xử lý đơn hàng và cải thiện trải nghiệm sử dụng.",
        description:
          "Nội dung dưới đây bám theo đúng luồng dữ liệu hiện có trong source: đăng ký tài khoản, đăng nhập, đặt hàng, xem sản phẩm và liên hệ hỗ trợ.",
        badges: ["Tài khoản", "Đơn hàng", "Dữ liệu truy cập cơ bản"],
        sections: [
          {
            title: "Thông tin người dùng có thể cung cấp",
            paragraphs: [
              "Khi đăng ký tài khoản hoặc đặt hàng, TMH Store có thể tiếp nhận họ tên, email, số điện thoại, mật khẩu đăng ký, tên người nhận, địa chỉ giao hàng và ghi chú đơn hàng.",
              "Các thông tin này được nhập trực tiếp bởi người dùng thông qua form đăng ký, form đăng nhập và quy trình checkout trên website.",
            ],
          },
          {
            title: "Dữ liệu kỹ thuật và hành vi sử dụng",
            paragraphs: [
              "Hệ thống có thể ghi nhận một số dữ liệu kỹ thuật như địa chỉ IP, user agent, referrer, thiết bị, múi giờ, kích thước màn hình, đường dẫn đã xem và thời điểm xem sản phẩm.",
              "Những dữ liệu này giúp chúng tôi hiểu người dùng tương tác với trang sản phẩm ra sao, từ đó cải thiện bố cục, danh mục, hiệu năng và chất lượng hỗ trợ.",
            ],
          },
          {
            title: "Mục đích sử dụng dữ liệu",
            paragraphs: [
              "Thông tin được sử dụng để tạo và duy trì tài khoản người dùng, xác thực đăng nhập, lưu phiên truy cập, xử lý đơn hàng, xác nhận giao hàng và phản hồi yêu cầu hỗ trợ.",
              "TMH Store cũng có thể sử dụng dữ liệu tổng hợp để đánh giá mức độ quan tâm tới sản phẩm, cách điều hướng trên site và hiệu quả trình bày nội dung.",
            ],
          },
          {
            title: "Cookie, phiên đăng nhập và bảo mật",
            paragraphs: [
              "Website dùng cookie và token phiên để giữ trạng thái đăng nhập, làm mới phiên và hỗ trợ các khu vực yêu cầu xác thực như tài khoản và đơn hàng.",
              "Chúng tôi giới hạn quyền truy cập nội bộ đối với dữ liệu tài khoản và đơn hàng, đồng thời áp dụng các biện pháp kỹ thuật hợp lý để giảm rủi ro truy cập trái phép hoặc thất thoát dữ liệu.",
            ],
          },
          {
            title: "Chia sẻ và yêu cầu hỗ trợ dữ liệu",
            paragraphs: [
              "TMH Store không bán thông tin cá nhân của khách hàng. Dữ liệu chỉ được chia sẻ trong phạm vi cần thiết để vận hành hạ tầng, xử lý đơn hàng hoặc đáp ứng yêu cầu pháp lý hợp lệ.",
              "Nếu bạn cần cập nhật, điều chỉnh hoặc yêu cầu hỗ trợ liên quan đến tài khoản và đơn hàng, bạn có thể liên hệ qua các kênh hỗ trợ chính thức được công bố trên website.",
            ],
          },
        ],
        supportTitle: "Muốn yêu cầu điều chỉnh thông tin?",
        supportBody:
          "Bạn có thể liên hệ qua Messenger hoặc Facebook để xác nhận thông tin tài khoản, đơn hàng hoặc yêu cầu hỗ trợ liên quan đến dữ liệu đã cung cấp.",
      },
      terms: {
        eyebrow: "Điều khoản sử dụng",
        title: "Các điều khoản này mô tả cách người dùng sử dụng TMH Store, gửi yêu cầu mua hàng và tương tác với nội dung trên website.",
        description:
          "Nội dung được viết theo đúng tính năng đang có: tài khoản người dùng, thông tin sản phẩm, giỏ hàng, checkout, xác nhận đơn và hỗ trợ qua nền tảng bên thứ ba.",
        badges: ["Quy tắc sử dụng", "Thông tin sản phẩm", "Quy trình đơn hàng"],
        sections: [
          {
            title: "Phạm vi áp dụng",
            paragraphs: [
              "Khi truy cập hoặc sử dụng TMH Store, bạn đồng ý tuân thủ các điều khoản được công bố trên website cùng các chính sách liên quan như Chính sách bảo mật.",
              "Việc tiếp tục sử dụng website sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận phiên bản đang được công bố tại thời điểm đó.",
            ],
          },
          {
            title: "Tài khoản và trách nhiệm người dùng",
            paragraphs: [
              "Người dùng chịu trách nhiệm về tính chính xác của thông tin đăng ký và việc bảo mật thông tin đăng nhập của mình.",
              "Bạn không được mạo danh người khác, cố truy cập trái phép vào tài khoản khác, tạo đơn hàng giả hoặc thực hiện các hành vi gây ảnh hưởng đến hoạt động bình thường của website.",
            ],
          },
          {
            title: "Thông tin sản phẩm, giá và tồn kho",
            paragraphs: [
              "TMH Store cố gắng giữ thông tin sản phẩm, hình ảnh, giá bán và tình trạng còn hàng ở trạng thái rõ ràng, cập nhật và dễ hiểu.",
              "Tuy nhiên, trong một số trường hợp vẫn có thể phát sinh sai sót về mô tả, giá hoặc tồn kho. Chúng tôi có quyền điều chỉnh những thông tin đó khi phát hiện sai lệch.",
            ],
          },
          {
            title: "Đặt hàng và xác nhận đơn",
            paragraphs: [
              "Việc gửi thông tin qua checkout thể hiện rằng bạn muốn tạo yêu cầu mua hàng với các thông tin giao nhận đã cung cấp.",
              "Đơn hàng sẽ được xem là đang xử lý sau khi hệ thống tiếp nhận và phía cửa hàng có bước xác nhận bổ sung nếu cần. TMH Store có thể liên hệ lại để làm rõ thông tin giao hàng, số lượng hoặc trạng thái tồn kho trước khi tiếp tục xử lý.",
            ],
          },
          {
            title: "Liên kết và nền tảng bên thứ ba",
            paragraphs: [
              "Website có thể dẫn tới Facebook và Messenger để phục vụ hỗ trợ khách hàng. Nội dung và chính sách của các nền tảng bên thứ ba này nằm ngoài phạm vi kiểm soát trực tiếp của TMH Store.",
              "Người dùng cần tự xem xét điều khoản và chính sách của các nền tảng đó khi tiếp tục tương tác ngoài website.",
            ],
          },
        ],
        supportTitle: "Cần xác nhận thêm trước khi gửi đơn?",
        supportBody:
          "Bạn có thể xem thêm trang Liên hệ hoặc nhắn trực tiếp cho cửa hàng để làm rõ sản phẩm, giá và tình trạng đơn hàng.",
      },
    },
  },
  en: {
    brandTag: "Transparent information for customers",
    navLabel: "Information pages",
    languageLabel: "Language",
    homeLink: "Back to home",
    browseLink: "Browse products",
    browseHref: SITE_PATHS.products,
    supportEyebrow: "Support",
    supportLinks: [
      { label: "Messenger", href: MESSENGER_URL },
      { label: "Facebook", href: FACEBOOK_URL },
    ],
    quickFactsTitle: "Highlights",
    quickFacts: [
      "These pages are aligned with the actual account, login, checkout and product-view flows already implemented in the app.",
      "The copy is written for both visitors and reviewers, with clear sections and direct language instead of placeholder policy text.",
      "Navigation, support links and policy URLs are all real routes so visitors are never pushed into misleading dead ends.",
    ],
    footerNote:
      "If you need additional clarification about orders, privacy or support channels, TMH Store prioritises responses through the official contact paths shown on the website.",
    nav: [
      { key: "about", label: "About", href: SITE_PATHS.about },
      { key: "contact", label: "Contact", href: SITE_PATHS.contact },
      { key: "privacyPolicy", label: "Privacy", href: SITE_PATHS.privacyPolicy },
      { key: "terms", label: "Terms", href: SITE_PATHS.terms },
    ],
    pages: {
      about: {
        eyebrow: "About",
        title: "TMH Store is built around a shopping experience that feels clear, fast and trustworthy.",
        description:
          "This page explains how TMH Store operates, how products are presented on the site and how support is handled before and after purchase.",
        badges: ["Clear catalogue", "Transparent information", "Messenger support"],
        sections: [
          {
            title: "What TMH Store is",
            paragraphs: [
              "TMH Store is designed as an online storefront where people can browse products, compare information and submit purchase requests without unnecessary friction.",
              "The goal is to reduce confusion during online shopping by keeping layouts readable, pricing easy to scan and support channels visible throughout the site.",
            ],
          },
          {
            title: "What the website currently supports",
            paragraphs: [
              "Visitors can create an account, sign in, review order history, add items to the cart and submit shipping details through the checkout flow.",
              "The platform also records product views and basic technical signals so we can improve organisation, navigation and the usefulness of product pages.",
            ],
          },
          {
            title: "How support works",
            paragraphs: [
              "TMH Store currently supports customers through Facebook and Messenger. These channels are used for product questions, order confirmation and post-purchase assistance.",
              "When additional clarification is needed around stock, delivery timing or product details, we may reply using the contact information submitted during checkout.",
            ],
          },
        ],
        supportTitle: "Need help with a product or an order?",
        supportBody:
          "You can jump to the Contact page or open Messenger directly for faster assistance.",
      },
      contact: {
        eyebrow: "Contact",
        title: "You can contact TMH Store whenever you need product advice, order confirmation or post-purchase support.",
        description:
          "This page outlines the support channels currently published on the website and how they are used to assist customers.",
        badges: ["Direct Messenger", "Facebook page", "Pre and post-sale support"],
        sections: [
          {
            title: "Primary contact channels",
            paragraphs: [
              "TMH Store currently supports customers mainly through Facebook Page and Messenger. These channels appear in the header, footer and customer account area so they stay easy to reach on both desktop and mobile.",
              "They are used for product advice, shipping confirmation, order adjustments and follow-up support after purchase.",
            ],
          },
          {
            title: "When to reach out",
            paragraphs: [
              "You should contact us if you need extra details about a product, brand, pricing, stock availability or if you want to confirm information before placing an order.",
              "After an order is submitted, these channels can also be used to ask about processing status, add notes or resolve delivery-related issues.",
            ],
          },
          {
            title: "Response commitment",
            paragraphs: [
              "TMH Store aims to keep support paths visible and easy to understand, without misleading navigation or fake destination pages.",
              "If additional channels such as email support or a hotline are introduced later, this page and the footer will be updated accordingly.",
            ],
          },
        ],
        supportTitle: "Want to open a support channel now?",
        supportBody:
          "The links in the sidebar open the same Facebook and Messenger paths already exposed across the storefront.",
      },
      privacyPolicy: {
        eyebrow: "Privacy Policy",
        title: "TMH Store collects only the data needed to run accounts, process orders and improve how the website works.",
        description:
          "The sections below are based on the real flows present in the source code: account registration, sign-in, checkout, product views and support contact.",
        badges: ["Accounts", "Orders", "Basic traffic data"],
        sections: [
          {
            title: "Information you may provide",
            paragraphs: [
              "When you create an account or place an order, TMH Store may receive your full name, email address, phone number, account password, recipient name, shipping address and order notes.",
              "These details are submitted directly by the user through the registration form, sign-in flow and checkout process on the website.",
            ],
          },
          {
            title: "Technical and usage data",
            paragraphs: [
              "The system may also record technical information such as IP address, user agent, referrer, device details, time zone, screen size, viewed path and product view time.",
              "This helps us understand how visitors move through the storefront and how product pages can be improved for clarity, performance and support quality.",
            ],
          },
          {
            title: "Why the data is used",
            paragraphs: [
              "The data is used to create and maintain customer accounts, support sign-in, manage sessions, process orders, confirm shipping and respond to support requests.",
              "TMH Store may also use aggregated usage information to understand interest in products, identify navigation bottlenecks and improve the way products are organised and displayed.",
            ],
          },
          {
            title: "Cookies, sessions and security",
            paragraphs: [
              "The website uses cookies and session tokens to keep users signed in, refresh sessions and protect account-related areas such as order history and profile access.",
              "We limit internal access to account and order information and apply reasonable technical controls to reduce the risk of unauthorised access or data loss.",
            ],
          },
          {
            title: "Sharing and support requests",
            paragraphs: [
              "TMH Store does not sell personal information. Data is shared only where needed to operate infrastructure, process orders or comply with valid legal obligations.",
              "If you need to correct or discuss account or order data, you can contact us through the official support channels shown on the website.",
            ],
          },
        ],
        supportTitle: "Need help updating your information?",
        supportBody:
          "Messenger and Facebook remain the fastest paths for account, order and privacy-related support requests.",
      },
      terms: {
        eyebrow: "Terms of Use",
        title: "These terms explain how visitors use TMH Store, submit purchase requests and interact with the content available on the website.",
        description:
          "The content is tailored to the current feature set: user accounts, product listings, cart, checkout, order confirmation and third-party support channels.",
        badges: ["Usage rules", "Product information", "Order handling"],
        sections: [
          {
            title: "Scope",
            paragraphs: [
              "By accessing or using TMH Store, you agree to follow the terms published on this page together with any related policies linked across the website.",
              "Continuing to use the website after updates are published means you accept the version currently in effect at that time.",
            ],
          },
          {
            title: "Accounts and user responsibility",
            paragraphs: [
              "Users are responsible for keeping registration details accurate and for protecting their own sign-in credentials.",
              "You must not impersonate others, attempt to access accounts without permission, create fake orders or interfere with the normal operation of the website.",
            ],
          },
          {
            title: "Product information, pricing and stock",
            paragraphs: [
              "TMH Store works to keep product information, imagery, pricing and stock status clear and reasonably up to date.",
              "Even so, mistakes can occasionally occur in descriptions, prices or availability, and we reserve the right to correct those issues when identified.",
            ],
          },
          {
            title: "Orders and confirmation",
            paragraphs: [
              "Submitting checkout details means you are sending a purchase request using the delivery information you provided.",
              "An order is treated as being processed after the system receives it and the store completes any required follow-up confirmation around delivery details, quantity or stock status.",
            ],
          },
          {
            title: "Third-party platforms",
            paragraphs: [
              "The website may link to Facebook and Messenger for customer support. Content, services and policies on those third-party platforms are outside TMH Store's direct control.",
              "Users should review the terms and privacy practices of those platforms before continuing interactions beyond the storefront itself.",
            ],
          },
        ],
        supportTitle: "Need clarification before placing an order?",
        supportBody:
          "You can review the Contact page or message the store directly to confirm product, pricing and order details before checkout.",
      },
    },
  },
};

const pageIcons: Record<PolicyPageKey, typeof Store> = {
  about: Store,
  contact: MessageCircle,
  privacyPolicy: ShieldCheck,
  terms: Scale,
};

export default function PolicyExperience({ page }: { page: PolicyPageKey }) {
  const [language, setLanguage] = useState<SupportedLanguage>("vi");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    const nextLanguage = stored === "en" || stored === "vi" ? stored : "vi";
    setLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANG_STORAGE_KEY, language);
  }, [language]);

  const localeCopy = copy[language];
  const pageCopy = localeCopy.pages[page];
  const PageIcon = pageIcons[page];

  const activeNav = useMemo(
    () =>
      localeCopy.nav.map((item) => ({
        ...item,
        active: item.key === page,
      })),
    [localeCopy.nav, page]
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf2_0%,#fff 30%,#f7fafc_100%)] text-slate-900">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <Link
              href={SITE_PATHS.home}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
            >
              <Store size={20} />
            </Link>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-950">
                {SITE_NAME}
              </p>
              <p className="text-sm text-slate-500">{localeCopy.brandTag}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-sm">
            <span className="pl-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {localeCopy.languageLabel}
            </span>
            <button
              type="button"
              onClick={() => setLanguage("vi")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                language === "vi"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                language === "en"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-10 md:px-10 md:pb-14 md:pt-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#fff7ed_0%,#ffffff_48%,#f8fafc_100%)] px-6 py-7 shadow-[0_28px_80px_rgba(15,23,42,0.10)] md:px-8 md:py-9">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-800">
                <Sparkles size={14} />
                {pageCopy.eyebrow}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                <PageIcon size={14} />
                {SITE_NAME}
              </span>
            </div>

            <div className="mt-7 max-w-4xl">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-[3.4rem] md:leading-[1.02]">
                {pageCopy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                {pageCopy.description}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {pageCopy.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={SITE_PATHS.home}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {localeCopy.homeLink}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={localeCopy.browseHref}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {localeCopy.browseLink}
              </Link>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                <Waypoints size={15} />
                {localeCopy.navLabel}
              </div>
              <nav className="mt-5 space-y-3">
                {activeNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      item.active
                        ? "bg-slate-900 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="rounded-[28px] border border-emerald-200 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)] p-6">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                <BadgeCheck size={15} />
                {localeCopy.quickFactsTitle}
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {localeCopy.quickFacts.map((fact) => (
                  <p key={fact}>{fact}</p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-10 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            {pageCopy.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8"
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-8 text-slate-600 md:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-amber-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] p-6">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-amber-800">
                <MessageCircle size={15} />
                {localeCopy.supportEyebrow}
              </div>
              <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
                {pageCopy.supportTitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {pageCopy.supportBody}
              </p>
              <div className="mt-5 space-y-3">
                {localeCopy.supportLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-300">
                <Globe size={15} />
                {SITE_NAME}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                {localeCopy.footerNote}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  <Globe size={15} />
                  Facebook
                </a>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  <Mail size={15} />
                  Messenger
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
