import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Youtube,
  Music,
} from "lucide-react";
import Logo from "../Header/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" bg-background border-t-2 ">
      <div className=" py-8 ">
        <div className=" px-4 py-6  max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-12 pb-12  ">
          {/* Cột 1 - Về Chúng Tôi */}
          <div className="space-y-5">
            <div className="text-3xl font-extrabold tracking-wider">
              <Logo />
            </div>
            <p className="text-foreground leading-relaxed text-justify text-sm">
              Bee IT là câu lạc bộ công nghệ thông tin trực thuộc FPT
              Polytechnic, nơi chia sẻ kiến thức và kết nối cộng đồng sinh viên
              yêu thích CNTT.
            </p>
            <div>
              <ul className="flex items-center gap-5 ">
                <li>
                  <a
                    href="https://www.facebook.com/BeeIT.Club"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-all hover:scale-110"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@BeeITClub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-all hover:scale-110"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@beeit.club"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-all hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      width={24}
                      height={24}
                      fill="currentColor"
                    >
                      <path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Cột 4 - Danh Mục */}
          <div>
            <h3 className="text-lg text-foreground font-semibold mb-5">
              Khám Phá
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Trang chủ", href: "/" },
                { name: "Bài viết", href: "/post" },
                { name: "Hỏi đáp", href: "/questions" },
                { name: "Tài liệu", href: "/documents" },
                { name: "Sự kiện", href: "/events" },
                { name: "Thành viên", href: "/members" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className=" text-foreground/80 hover:text-primary transition-colors inline-block text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Cột 4 - Danh Mục */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-foreground">
              Tài Nguyên
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Về chúng tôi", href: "/beeit" },
                { name: "Blog", href: "/post" },
                { name: "Khóa học", href: "#" },
                { name: "Dự án", href: "#" },
                { name: "Cộng đồng", href: "/members" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className=" text-foreground/80 hover:text-primary transition-colors inline-block text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Cột 2 - Liên Hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-foreground">
              Liên Hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/CkAQdYZye8GN9jev9"
                  target="_blank"
                  className=" text-sm leading-relaxed text-start hover:text-primary transition-colors"
                >
                  Tòa nhà FPT Polytechnic <br /> 13 phố Trịnh Văn Bô
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:support@beeit.club"
                  className=" text-foreground hover:text-primary transition-colors text-sm"
                >
                  support@beeit.club
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 px-4 py-6 ">
          <div className=" max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Bee IT Club. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Điều khoản dịch vụ
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Chính sách cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}