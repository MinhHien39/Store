"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Clock3,
  Globe,
  LayoutPanelLeft,
  Mail,
  MessageCircle,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
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

interface Stat {
  value: string;
  label: string;
  hint: string;
}

interface PageCopy {
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  summaryTitle: string;
  summaryPoints: string[];
  stats: Stat[];
  sections: Section[];
  supportTitle: string;
  supportBody: string;
  supportChecklist: string[];
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
  footerNoteTitle: string;
  footerNote: string;
  updatedLabel: string;
  updatedValue: string;
  sectionLabel: string;
  summaryLabel: string;
  pages: Record<PolicyPageKey, PageCopy>;
}

interface Theme {
  heroSurface: string;
  heroAccent: string;
  heroBorder: string;
  badgeSurface: string;
  badgeText: string;
  statSurface: string;
  summarySurface: string;
  summaryBorder: string;
  supportSurface: string;
  supportBorder: string;
  sectionLine: string;
  sectionNumber: string;
  sectionNumberText: string;
  actionPrimary: string;
  actionSecondary: string;
}

const copy: Record<SupportedLanguage, LocaleCopy> = {
  vi: {
    brandTag: "Thông tin minh bạch cho khách hàng",
    navLabel: "Bộ trang thông tin",
    languageLabel: "Ngôn ngữ",
    homeLink: "Về trang chủ",
    browseLink: "Xem sản phẩm",
    browseHref: SITE_PATHS.products,
    supportEyebrow: "Hỗ trợ trực tiếp",
    supportLinks: [
      { label: "Messenger", href: MESSENGER_URL },
      { label: "Facebook", href: FACEBOOK_URL },
    ],
    quickFactsTitle: "Vì sao các trang này đáng tin hơn",
    quickFacts: [
      "Nội dung được viết lại dựa trên luồng thật đang có trong source và storefront hiện tại.",
      "Toàn bộ liên kết điều hướng, hỗ trợ và trang chính sách đều là route thật, không dùng placeholder.",
      "Bản tiếng Việt có dấu đầy đủ và bản tiếng Anh đi cùng cùng một cấu trúc để người dùng lẫn reviewer đọc nhanh hơn.",
    ],
    footerNoteTitle: "Thông tin cần thấy rõ",
    footerNote:
      "TMH Store ưu tiên trải nghiệm minh bạch: người dùng nhìn thấy kênh liên hệ thật, hiểu website thu thập gì, và biết điều gì xảy ra khi gửi đơn hoặc cần hỗ trợ.",
    updatedLabel: "Cập nhật",
    updatedValue: "01/06/2026",
    sectionLabel: "Nội dung chi tiết",
    summaryLabel: "Tóm tắt nhanh",
    nav: [
      { key: "about", label: "Giới thiệu", href: SITE_PATHS.about },
      { key: "contact", label: "Liên hệ", href: SITE_PATHS.contact },
      { key: "privacyPolicy", label: "Bảo mật", href: SITE_PATHS.privacyPolicy },
      { key: "terms", label: "Điều khoản", href: SITE_PATHS.terms },
    ],
    pages: {
      about: {
        eyebrow: "Giới thiệu",
        title: "TMH Store được trình bày như một storefront gọn, rõ và đủ đáng tin để khách hàng biết mình đang mua ở đâu.",
        description:
          "Trang này cho thấy website vận hành ra sao, vì sao cách trình bày sản phẩm được tối ưu cho việc đọc nhanh, và TMH Store hỗ trợ người dùng bằng những kênh nào trước và sau khi mua.",
        badges: ["Danh mục rõ ràng", "Route thật", "Hỗ trợ qua Messenger"],
        summaryTitle: "TMH Store ưu tiên điều gì",
        summaryPoints: [
          "Giữ bố cục đơn giản để người dùng xem sản phẩm mà không phải đoán bước tiếp theo.",
          "Đưa thông tin giá, mô tả và kênh liên hệ vào những vị trí dễ thấy trên cả mobile lẫn desktop.",
          "Dùng các trang chính sách như một phần của trải nghiệm thật, không phải lớp nội dung đối phó.",
        ],
        stats: [
          { value: "3", label: "nhóm nội dung chính", hint: "giới thiệu, hỗ trợ, chính sách" },
          { value: "2", label: "kênh hỗ trợ thật", hint: "Facebook và Messenger" },
          { value: "100%", label: "route công khai", hint: "mọi link đều điều hướng được" },
        ],
        sections: [
          {
            title: "TMH Store là gì",
            paragraphs: [
              "TMH Store được xây dựng như một cửa hàng trực tuyến giúp người dùng xem sản phẩm, so sánh thông tin và gửi yêu cầu mua hàng theo cách gọn gàng, dễ hiểu.",
              "Thay vì làm người dùng lạc giữa quá nhiều lớp nội dung, website ưu tiên điều hướng rõ, nhịp đọc dễ theo và vị trí liên hệ luôn hiện diện.",
            ],
          },
          {
            title: "Những gì website hiện hỗ trợ",
            paragraphs: [
              "Người dùng có thể đăng ký tài khoản, đăng nhập, xem lịch sử đơn hàng, thêm sản phẩm vào giỏ hàng và gửi thông tin giao hàng để tạo đơn.",
              "Website cũng ghi nhận lượt xem sản phẩm và dữ liệu truy cập cơ bản để cải thiện cách sắp xếp sản phẩm, chất lượng điều hướng và hiệu quả vận hành.",
            ],
          },
          {
            title: "Cách TMH Store hỗ trợ khách hàng",
            paragraphs: [
              "Kênh hỗ trợ hiện tại của TMH Store là Facebook và Messenger. Đây là nơi người dùng có thể hỏi trước khi mua, xác nhận đơn hoặc xử lý các vướng mắc sau khi đặt hàng.",
              "Khi cần làm rõ sản phẩm, tồn kho hay thời gian giao nhận, cửa hàng sẽ phản hồi qua đúng những kênh liên hệ đã công bố trên website.",
            ],
          },
        ],
        supportTitle: "Muốn nói chuyện trực tiếp với cửa hàng?",
        supportBody:
          "Bạn có thể chuyển sang Liên hệ hoặc mở Messenger ngay để nhận hỗ trợ nhanh hơn cho sản phẩm, đơn hàng và thông tin giao nhận.",
        supportChecklist: [
          "Tư vấn trước khi mua",
          "Xác nhận đơn và thông tin nhận hàng",
          "Hỗ trợ sau bán hàng qua kênh chính thức",
        ],
      },
      contact: {
        eyebrow: "Liên hệ",
        title: "Người dùng có thể chạm tới TMH Store nhanh, rõ và không phải đi qua những đường dẫn mơ hồ.",
        description:
          "Trang này gom lại các kênh liên hệ đang được công bố trên website và giải thích cách chúng được dùng để hỗ trợ tư vấn, xác nhận đơn và theo dõi xử lý sau khi mua.",
        badges: ["Messenger trực tiếp", "Facebook page", "Hỗ trợ trước và sau mua"],
        summaryTitle: "Điểm quan trọng của trang liên hệ",
        summaryPoints: [
          "Kênh hỗ trợ được hiển thị nhất quán giữa header, footer và các trang công khai.",
          "Không có nút liên hệ giả hoặc điều hướng đánh lạc hướng người dùng.",
          "Mọi liên kết đều trỏ tới đúng kênh mà storefront thực sự đang dùng.",
        ],
        stats: [
          { value: "2", label: "kênh liên hệ công khai", hint: "Facebook và Messenger" },
          { value: "24/7", label: "truy cập kênh hỗ trợ", hint: "luôn mở được từ website" },
          { value: "1", label: "nguồn hỗ trợ thống nhất", hint: "dùng cùng bộ link trên site" },
        ],
        sections: [
          {
            title: "Kênh liên hệ chính",
            paragraphs: [
              "Hiện tại TMH Store hỗ trợ khách hàng chủ yếu qua Facebook Page và Messenger. Hai kênh này được đặt ở những vị trí dễ thấy để người dùng truy cập nhanh trên cả điện thoại lẫn máy tính.",
              "Đây là các kênh dành cho tư vấn sản phẩm, xác nhận thông tin giao hàng, hỗ trợ thay đổi đơn và tiếp nhận phản hồi sau mua.",
            ],
          },
          {
            title: "Khi nào nên liên hệ",
            paragraphs: [
              "Bạn nên liên hệ khi cần kiểm tra thông số sản phẩm, giá bán, tình trạng còn hàng hoặc muốn xác nhận lại thông tin trước khi gửi đơn.",
              "Sau khi đặt hàng, khách hàng cũng có thể dùng các kênh này để theo dõi tiến độ xử lý, bổ sung ghi chú hoặc xử lý các tình huống phát sinh liên quan đến đơn.",
            ],
          },
          {
            title: "Cam kết về điều hướng hỗ trợ",
            paragraphs: [
              "TMH Store cố gắng giữ đường dẫn liên hệ rõ ràng, dễ nhận biết và không dẫn người dùng tới các đích giả hoặc nội dung gây hiểu nhầm.",
              "Nếu website bổ sung email hỗ trợ hoặc hotline trong tương lai, thông tin sẽ được cập nhật ngay trên trang này và khu vực chân trang.",
            ],
          },
        ],
        supportTitle: "Mở kênh hỗ trợ ngay",
        supportBody:
          "Các liên kết hỗ trợ bên phải dùng đúng URL đang được công bố trên storefront, nên người dùng không bị tách sang một hệ thống khác.",
        supportChecklist: [
          "Hỏi thông tin sản phẩm trước khi mua",
          "Xác nhận lại địa chỉ, số điện thoại, ghi chú",
          "Theo dõi hoặc xử lý vấn đề sau khi đặt hàng",
        ],
      },
      privacyPolicy: {
        eyebrow: "Chính sách bảo mật",
        title: "TMH Store chỉ thu thập dữ liệu ở mức cần thiết để vận hành tài khoản, xử lý đơn hàng và cải thiện trải nghiệm xem sản phẩm.",
        description:
          "Nội dung dưới đây bám theo luồng dữ liệu thực tế hiện có trong source: đăng ký tài khoản, đăng nhập, đặt hàng, xem sản phẩm và liên hệ hỗ trợ qua các kênh công khai.",
        badges: ["Tài khoản", "Đơn hàng", "Dữ liệu truy cập cơ bản"],
        summaryTitle: "Tóm tắt nhanh về dữ liệu",
        summaryPoints: [
          "Thông tin người dùng chủ yếu đến từ form đăng ký, đăng nhập và checkout.",
          "Dữ liệu kỹ thuật được dùng để hiểu cách website được truy cập và cải thiện hiệu năng hiển thị.",
          "TMH Store không bán dữ liệu cá nhân và chỉ dùng trong phạm vi vận hành, hỗ trợ hoặc nghĩa vụ pháp lý hợp lệ.",
        ],
        stats: [
          { value: "2", label: "nguồn dữ liệu chính", hint: "tài khoản và checkout" },
          { value: "1", label: "mục tiêu cốt lõi", hint: "vận hành cửa hàng an toàn hơn" },
          { value: "0", label: "mua bán dữ liệu", hint: "không bán thông tin cá nhân" },
        ],
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
              "Những dữ liệu này giúp TMH Store hiểu người dùng tương tác với site ra sao, từ đó cải thiện điều hướng, hiệu năng và chất lượng hỗ trợ.",
            ],
          },
          {
            title: "Mục đích sử dụng dữ liệu",
            paragraphs: [
              "Thông tin được dùng để tạo và duy trì tài khoản, xác thực đăng nhập, lưu phiên truy cập, xử lý đơn hàng, xác nhận giao hàng và phản hồi yêu cầu hỗ trợ.",
              "TMH Store cũng có thể dùng dữ liệu tổng hợp để đánh giá mức độ quan tâm tới sản phẩm, cách người dùng di chuyển trên site và hiệu quả trình bày nội dung.",
            ],
          },
          {
            title: "Cookie, phiên đăng nhập và bảo mật",
            paragraphs: [
              "Website sử dụng cookie và token phiên để giữ trạng thái đăng nhập, làm mới phiên và hỗ trợ các khu vực yêu cầu xác thực như tài khoản và đơn hàng.",
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
        supportTitle: "Cần điều chỉnh hoặc xác minh thông tin?",
        supportBody:
          "Messenger và Facebook vẫn là hai đường nhanh nhất để xác nhận thông tin tài khoản, đơn hàng hoặc yêu cầu hỗ trợ liên quan đến dữ liệu đã cung cấp.",
        supportChecklist: [
          "Yêu cầu cập nhật thông tin đơn hàng",
          "Xác nhận lại dữ liệu đã gửi qua checkout",
          "Liên hệ qua kênh chính thức để được hỗ trợ",
        ],
      },
      terms: {
        eyebrow: "Điều khoản sử dụng",
        title: "Các điều khoản này mô tả rõ cách người dùng sử dụng TMH Store, gửi yêu cầu mua hàng và tương tác với nội dung trên website.",
        description:
          "Nội dung được viết theo đúng những gì storefront hiện có: tài khoản người dùng, thông tin sản phẩm, giỏ hàng, checkout, xác nhận đơn và hỗ trợ qua nền tảng bên thứ ba.",
        badges: ["Quy tắc sử dụng", "Thông tin sản phẩm", "Quy trình đơn hàng"],
        summaryTitle: "Điều người dùng cần nắm nhanh",
        summaryPoints: [
          "Việc dùng website đồng nghĩa với việc chấp nhận các điều khoản và chính sách liên quan.",
          "Thông tin sản phẩm và tồn kho luôn được cố gắng cập nhật, nhưng có thể cần xác nhận lại trước khi xử lý đơn.",
          "TMH Store có quyền từ chối các hành vi giả mạo, truy cập trái phép hoặc gây ảnh hưởng đến hoạt động bình thường của website.",
        ],
        stats: [
          { value: "5", label: "nhóm nội dung cốt lõi", hint: "tài khoản, sản phẩm, đơn hàng, điều hướng, nền tảng ngoài" },
          { value: "1", label: "quy trình xác nhận đơn", hint: "có thể cần bước đối chiếu thêm" },
          { value: "0", label: "chấp nhận hành vi giả mạo", hint: "không cho phép" },
        ],
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
        supportTitle: "Muốn xác nhận rõ trước khi gửi đơn?",
        supportBody:
          "Bạn có thể dùng trang Liên hệ hoặc nhắn thẳng cho cửa hàng để làm rõ sản phẩm, giá, tình trạng còn hàng và thông tin giao nhận trước khi checkout.",
        supportChecklist: [
          "Kiểm tra lại thông tin sản phẩm và giá",
          "Hỏi tình trạng tồn kho trước khi đặt",
          "Làm rõ quy trình xác nhận đơn nếu cần",
        ],
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
    supportEyebrow: "Direct support",
    supportLinks: [
      { label: "Messenger", href: MESSENGER_URL },
      { label: "Facebook", href: FACEBOOK_URL },
    ],
    quickFactsTitle: "Why these pages feel more credible",
    quickFacts: [
      "The copy is based on real storefront and source-code flows rather than generic placeholder policy text.",
      "Navigation, support actions and policy links all point to real destinations that are already live on the site.",
      "Vietnamese and English share the same structure so both visitors and reviewers can scan the information quickly.",
    ],
    footerNoteTitle: "What should be obvious",
    footerNote:
      "TMH Store aims to make support paths, privacy expectations and order handling clear enough that customers never need to guess what happens next.",
    updatedLabel: "Updated",
    updatedValue: "June 1, 2026",
    sectionLabel: "Detailed sections",
    summaryLabel: "Quick summary",
    nav: [
      { key: "about", label: "About", href: SITE_PATHS.about },
      { key: "contact", label: "Contact", href: SITE_PATHS.contact },
      { key: "privacyPolicy", label: "Privacy", href: SITE_PATHS.privacyPolicy },
      { key: "terms", label: "Terms", href: SITE_PATHS.terms },
    ],
    pages: {
      about: {
        eyebrow: "About",
        title: "TMH Store is presented as a storefront that feels clean, understandable and trustworthy from the first screen.",
        description:
          "This page explains how the website works, why products are organised for quick scanning and how TMH Store supports people before and after they place an order.",
        badges: ["Clear catalogue", "Real routes", "Messenger support"],
        summaryTitle: "What TMH Store prioritises",
        summaryPoints: [
          "Simple navigation so visitors can browse products without guessing the next step.",
          "Visible pricing, product context and support paths across both desktop and mobile views.",
          "Policy pages that behave like part of the real experience, not decorative compliance filler.",
        ],
        stats: [
          { value: "3", label: "core content layers", hint: "about, support and policies" },
          { value: "2", label: "live support channels", hint: "Facebook and Messenger" },
          { value: "100%", label: "public routes", hint: "every key link is usable" },
        ],
        sections: [
          {
            title: "What TMH Store is",
            paragraphs: [
              "TMH Store is designed as an online storefront where visitors can browse products, compare information and submit purchase requests without unnecessary friction.",
              "Instead of burying people under too many layers, the site focuses on readable layouts, straightforward paths and support options that remain visible.",
            ],
          },
          {
            title: "What the website currently supports",
            paragraphs: [
              "Visitors can create an account, sign in, review order history, add items to the cart and submit shipping details through the checkout flow.",
              "The platform also records product views and basic traffic data so product organisation, navigation quality and storefront usefulness can keep improving.",
            ],
          },
          {
            title: "How TMH Store supports customers",
            paragraphs: [
              "TMH Store currently supports customers through Facebook and Messenger. These are the channels used for product questions, order confirmation and post-purchase support.",
              "When extra clarification is needed around stock, delivery timing or product details, the store responds through the same contact paths already shown on the website.",
            ],
          },
        ],
        supportTitle: "Need to speak with the store directly?",
        supportBody:
          "You can jump to Contact or open Messenger right away for faster help with products, orders and delivery details.",
        supportChecklist: [
          "Pre-purchase product guidance",
          "Order confirmation and delivery details",
          "Post-sale support through official channels",
        ],
      },
      contact: {
        eyebrow: "Contact",
        title: "Visitors can reach TMH Store quickly and clearly, without being pushed through vague or misleading paths.",
        description:
          "This page gathers the support channels currently published on the website and explains how they are used for product advice, order confirmation and post-purchase follow-up.",
        badges: ["Direct Messenger", "Facebook page", "Pre and post-sale support"],
        summaryTitle: "What matters on this contact page",
        summaryPoints: [
          "Support channels are displayed consistently across the header, footer and public pages.",
          "There are no fake support buttons or dead-end contact routes.",
          "Every contact action points to the same channels the storefront is already using.",
        ],
        stats: [
          { value: "2", label: "public contact channels", hint: "Facebook and Messenger" },
          { value: "24/7", label: "channel access", hint: "available from the website at any time" },
          { value: "1", label: "consistent source of support", hint: "the same links across the site" },
        ],
        sections: [
          {
            title: "Primary contact channels",
            paragraphs: [
              "TMH Store currently supports customers mainly through Facebook Page and Messenger. These channels are placed where people can reach them quickly on both mobile and desktop.",
              "They are used for product advice, shipping confirmation, order adjustments and post-purchase follow-up.",
            ],
          },
          {
            title: "When to reach out",
            paragraphs: [
              "You should contact the store if you need more detail about a product, pricing, stock availability or if you want to confirm information before placing an order.",
              "After an order is submitted, the same channels can be used to ask about processing progress, add notes or resolve delivery-related issues.",
            ],
          },
          {
            title: "Support navigation commitment",
            paragraphs: [
              "TMH Store aims to keep contact paths clear, visible and free from misleading destinations.",
              "If new channels such as support email or a hotline are added later, this page and the footer will be updated to reflect them.",
            ],
          },
        ],
        supportTitle: "Open a support channel now",
        supportBody:
          "The support links in the side column use the exact public URLs already exposed across the storefront, so visitors are not pushed into a disconnected workflow.",
        supportChecklist: [
          "Ask product questions before ordering",
          "Confirm address, phone number or notes",
          "Follow up on issues after an order is placed",
        ],
      },
      privacyPolicy: {
        eyebrow: "Privacy Policy",
        title: "TMH Store only collects the information needed to run accounts, process orders and improve how product pages and navigation perform.",
        description:
          "The sections below reflect the real data paths present in the codebase today: account registration, sign-in, checkout, product views and support contact.",
        badges: ["Accounts", "Orders", "Basic traffic data"],
        summaryTitle: "Privacy at a glance",
        summaryPoints: [
          "Most user data comes directly from registration, sign-in and checkout forms.",
          "Technical data is used to understand access patterns and improve storefront performance and usability.",
          "TMH Store does not sell personal data and uses information only for operations, support and valid legal obligations.",
        ],
        stats: [
          { value: "2", label: "primary data sources", hint: "accounts and checkout" },
          { value: "1", label: "core objective", hint: "operate the store more safely" },
          { value: "0", label: "data resale", hint: "no personal information sales" },
        ],
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
              "This helps TMH Store understand how visitors move through the site, which in turn improves navigation, performance and support quality.",
            ],
          },
          {
            title: "Why the data is used",
            paragraphs: [
              "The data is used to create and maintain accounts, support sign-in, manage sessions, process orders, confirm shipping and respond to support requests.",
              "TMH Store may also use aggregated usage information to understand product interest, spot navigation bottlenecks and improve how content is organised.",
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
              "If you need to correct or discuss account or order data, you can contact the store through the official support channels shown on the website.",
            ],
          },
        ],
        supportTitle: "Need to update or verify your information?",
        supportBody:
          "Messenger and Facebook remain the fastest paths for account, order and privacy-related support requests on the current storefront.",
        supportChecklist: [
          "Request account or order-data clarification",
          "Confirm information submitted at checkout",
          "Use official public channels for privacy support",
        ],
      },
      terms: {
        eyebrow: "Terms of Use",
        title: "These terms clearly describe how visitors use TMH Store, submit purchase requests and interact with the information published on the site.",
        description:
          "The content is tailored to the actual storefront feature set: user accounts, product listings, cart, checkout, order confirmation and third-party support channels.",
        badges: ["Usage rules", "Product information", "Order handling"],
        summaryTitle: "What visitors should know quickly",
        summaryPoints: [
          "Using the site means accepting these terms and the related policies linked from it.",
          "Product information and stock are kept as current as possible, but may still require confirmation before an order is processed.",
          "TMH Store may refuse impersonation, unauthorised access and behaviour that disrupts the normal operation of the storefront.",
        ],
        stats: [
          { value: "5", label: "core policy areas", hint: "accounts, products, orders, navigation and external platforms" },
          { value: "1", label: "order confirmation path", hint: "may include an extra verification step" },
          { value: "0", label: "tolerance for fake activity", hint: "not accepted" },
        ],
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
        supportTitle: "Need clarification before checkout?",
        supportBody:
          "You can use the Contact page or message the store directly to confirm product details, pricing, stock and delivery expectations before placing an order.",
        supportChecklist: [
          "Double-check product details and pricing",
          "Confirm stock before ordering",
          "Clarify order handling when needed",
        ],
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

const pageThemes: Record<PolicyPageKey, Theme> = {
  about: {
    heroSurface:
      "bg-[radial-gradient(circle_at_top_left,#fff7ed_0%,#ffffff_44%,#f8fafc_100%)]",
    heroAccent:
      "bg-[linear-gradient(135deg,rgba(251,146,60,0.18),rgba(14,165,233,0.10))]",
    heroBorder: "border-amber-200/80",
    badgeSurface: "bg-amber-100/90",
    badgeText: "text-amber-900",
    statSurface: "bg-white/80",
    summarySurface: "bg-amber-50/70",
    summaryBorder: "border-amber-200/80",
    supportSurface: "bg-slate-950",
    supportBorder: "border-slate-800",
    sectionLine: "bg-amber-300",
    sectionNumber: "bg-amber-100",
    sectionNumberText: "text-amber-900",
    actionPrimary: "bg-slate-950 text-white hover:bg-slate-800",
    actionSecondary:
      "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
  },
  contact: {
    heroSurface:
      "bg-[radial-gradient(circle_at_top_left,#eff6ff_0%,#ffffff_46%,#f8fafc_100%)]",
    heroAccent:
      "bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(16,185,129,0.10))]",
    heroBorder: "border-sky-200/80",
    badgeSurface: "bg-sky-100/90",
    badgeText: "text-sky-900",
    statSurface: "bg-white/82",
    summarySurface: "bg-sky-50/80",
    summaryBorder: "border-sky-200/80",
    supportSurface: "bg-slate-950",
    supportBorder: "border-slate-800",
    sectionLine: "bg-sky-300",
    sectionNumber: "bg-sky-100",
    sectionNumberText: "text-sky-900",
    actionPrimary: "bg-sky-700 text-white hover:bg-sky-800",
    actionSecondary:
      "border border-sky-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50",
  },
  privacyPolicy: {
    heroSurface:
      "bg-[radial-gradient(circle_at_top_left,#ecfdf5_0%,#ffffff_46%,#f8fafc_100%)]",
    heroAccent:
      "bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(14,165,233,0.10))]",
    heroBorder: "border-emerald-200/80",
    badgeSurface: "bg-emerald-100/90",
    badgeText: "text-emerald-900",
    statSurface: "bg-white/82",
    summarySurface: "bg-emerald-50/80",
    summaryBorder: "border-emerald-200/80",
    supportSurface: "bg-slate-950",
    supportBorder: "border-slate-800",
    sectionLine: "bg-emerald-300",
    sectionNumber: "bg-emerald-100",
    sectionNumberText: "text-emerald-900",
    actionPrimary: "bg-emerald-700 text-white hover:bg-emerald-800",
    actionSecondary:
      "border border-emerald-200 bg-white text-slate-900 hover:border-emerald-300 hover:bg-emerald-50",
  },
  terms: {
    heroSurface:
      "bg-[radial-gradient(circle_at_top_left,#fef2f2_0%,#ffffff_46%,#f8fafc_100%)]",
    heroAccent:
      "bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(245,158,11,0.10))]",
    heroBorder: "border-rose-200/80",
    badgeSurface: "bg-rose-100/90",
    badgeText: "text-rose-900",
    statSurface: "bg-white/82",
    summarySurface: "bg-rose-50/80",
    summaryBorder: "border-rose-200/80",
    supportSurface: "bg-slate-950",
    supportBorder: "border-slate-800",
    sectionLine: "bg-rose-300",
    sectionNumber: "bg-rose-100",
    sectionNumberText: "text-rose-900",
    actionPrimary: "bg-rose-700 text-white hover:bg-rose-800",
    actionSecondary:
      "border border-rose-200 bg-white text-slate-900 hover:border-rose-300 hover:bg-rose-50",
  },
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
  const theme = pageThemes[page];

  const activeNav = useMemo(
    () =>
      localeCopy.nav.map((item) => ({
        ...item,
        active: item.key === page,
      })),
    [localeCopy.nav, page]
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_28%,#f8fafc_100%)] text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <Link
              href={SITE_PATHS.home}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
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
                  ? "bg-slate-950 text-white"
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
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <section className="overflow-hidden border-b border-slate-200/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[minmax(0,1.25fr)_360px]">
          <div className={`relative overflow-hidden rounded-[36px] border ${theme.heroBorder} ${theme.heroSurface} px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.10)] md:px-8 md:py-10`}>
            <div className={`pointer-events-none absolute inset-y-0 right-0 w-[44%] blur-3xl ${theme.heroAccent}`} />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] ${theme.badgeSurface} ${theme.badgeText}`}
                >
                  <Sparkles size={14} />
                  {pageCopy.eyebrow}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                  <PageIcon size={14} />
                  {SITE_NAME}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 backdrop-blur">
                  <Clock3 size={14} />
                  {localeCopy.updatedLabel}: {localeCopy.updatedValue}
                </span>
              </div>

              <div className="mt-7 max-w-4xl">
                <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-[3.45rem]">
                  {pageCopy.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  {pageCopy.description}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {pageCopy.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-slate-200 bg-white/82 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={SITE_PATHS.home}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${theme.actionPrimary}`}
                >
                  {localeCopy.homeLink}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={localeCopy.browseHref}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${theme.actionSecondary}`}
                >
                  {localeCopy.browseLink}
                  <ShoppingBag size={16} />
                </Link>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {pageCopy.stats.map((stat) => (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className={`rounded-[26px] border border-white/70 ${theme.statSurface} px-4 py-4 shadow-[0_16px_34px_rgba(15,23,42,0.06)] backdrop-blur`}
                  >
                    <p className="text-3xl font-black tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {stat.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                <LayoutPanelLeft size={15} />
                {localeCopy.navLabel}
              </div>
              <nav className="mt-5 space-y-3">
                {activeNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      item.active
                        ? "bg-slate-950 text-white shadow-[0_16px_36px_rgba(15,23,42,0.18)]"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </nav>
            </div>

            <div className={`rounded-[32px] border ${theme.summaryBorder} ${theme.summarySurface} px-6 py-6`}>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                <BadgeCheck size={15} />
                {localeCopy.quickFactsTitle}
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {localeCopy.quickFacts.map((fact) => (
                  <p key={fact}>{fact}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                {localeCopy.sectionLabel}
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {pageCopy.summaryTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
              {pageCopy.description}
            </p>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {pageCopy.summaryPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <BookOpenText size={18} className="text-slate-500" />
                  <p className="mt-3 text-sm leading-7 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {pageCopy.sections.map((section, index) => (
              <article
                key={section.title}
                className="grid gap-5 border-t border-slate-200 pt-8 md:grid-cols-[88px_minmax(0,1fr)]"
              >
                <div className="flex items-start gap-3 md:block">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.sectionNumber} ${theme.sectionNumberText} text-lg font-black shadow-sm`}
                  >
                    {index + 1}
                  </div>
                  <div className={`mt-3 hidden h-20 w-[2px] ${theme.sectionLine} md:block`} />
                </div>

                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950">
                    {section.title}
                  </h3>
                  <div className="mt-4 space-y-4 text-[15px] leading-8 text-slate-600 md:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className={`rounded-[32px] border ${theme.summaryBorder} bg-white px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.07)]`}>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              <Sparkles size={15} />
              {localeCopy.summaryLabel}
            </div>
            <div className="mt-5 space-y-4">
              {pageCopy.summaryPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[32px] border ${theme.supportBorder} ${theme.supportSurface} px-6 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]`}>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-300">
              <MessageCircle size={15} />
              {localeCopy.supportEyebrow}
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-tight">
              {pageCopy.supportTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {pageCopy.supportBody}
            </p>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
              {pageCopy.supportChecklist.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-200">
                  <BadgeCheck size={18} className="mt-1 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {localeCopy.supportLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-slate-50 px-6 py-6">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              <Globe size={15} />
              {localeCopy.footerNoteTitle}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {localeCopy.footerNote}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <Globe size={15} />
                Facebook
              </a>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <Mail size={15} />
                Messenger
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
