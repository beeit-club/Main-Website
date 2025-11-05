import * as React from "react";

// Import các component cần thiết từ shadcn/ui
// ... (imports giữ nguyên)
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Import Collapsible components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// THÊM: Import Sheet, Button, và Icons
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";

// Import tiện ích `cn` để gộp class
// ... (import cn giữ nguyên)
import { cn } from "@/lib/utils";

// --- DỮ LIỆU ---
// ... (Dữ liệu baiVietData và taiLieuData giữ nguyên) ...
const baiVietData = [
  {
    id: 1,
    name: "Tin Tức Công Nghệ",
    slug: "tin-tuc-cong-nghe",
    parent_id: null,
  },
  {
    id: 2,
    name: "Đánh Giá Sản Phẩm",
    slug: "danh-gia-san-pham-5494",
    parent_id: null,
  },
  {
    id: 3,
    name: "Thủ Thuật Máy Tính",
    slug: "thu-thuat-may-tinh-8354",
    parent_id: null,
  },
  {
    id: 5,
    name: "Game & Giải Trí",
    slug: "game-giai-tri-1158",
    parent_id: null,
  },
  {
    id: 6,
    name: "Tin Tức Doanh Nghiệp",
    slug: "tin-tuc-doanh-nghiep-8483",
    parent_id: null,
  },
  {
    id: 7,
    name: "Hướng Dẫn Sử Dụng",
    slug: "huong-dan-su-dung-756",
    parent_id: null,
  },
  {
    id: 8,
    name: "Khuyến Mãi & Sự Kiện",
    slug: "khuyen-mai-su-kien-8019",
    parent_id: null,
  },
  { id: 17, name: "demo", slug: "demo", parent_id: null },
  { id: 18, name: "dddddd111111", slug: "dddddd111111", parent_id: 8 },
  { id: 19, name: "dcmaaaaaaaaaaa", slug: "dcmaaaaaaaaaaa", parent_id: 5 },
];

// Dữ liệu Tài liệu (mock data)
const taiLieuData = [
  { id: 100, name: "Lập trình Web", slug: "lap-trinh-web", parent_id: null },
  {
    id: 101,
    name: "Thiết kế Giao diện",
    slug: "thiet-ke-giao-dien",
    parent_id: null,
  },
  {
    id: 102,
    name: "Quản trị Cơ sở dữ liệu",
    slug: "quan-tri-csdl",
    parent_id: null,
  },
  { id: 103, name: "ReactJS", slug: "reactjs", parent_id: 100 },
  { id: 104, name: "NodeJS", slug: "nodejs", parent_id: 100 },
  { id: 105, name: "Figma", slug: "figma", parent_id: 101 },
  { id: 106, name: "SQL Server", slug: "sql-server", parent_id: 102 },
  { id: 107, name: "MongoDB", slug: "mongodb", parent_id: 102 },
  { id: 108, name: "VueJS", slug: "vuejs", parent_id: 100 },
];

// ... HÀM buildTree ...
function buildTree(items, parentId = null) {
  const tree = [];

  const children = items.filter((item) => item.parent_id === parentId);

  for (const item of children) {
    const grandchildren = buildTree(items, item.id);
    tree.push({
      ...item,
      children: grandchildren,
    });
  }

  return tree;
}

// ... HÀM classNameStyle ...
const classNameStyle = () => `${navigationMenuTriggerStyle()} text-[16px]`;

// --- COMPONENT CHÍNH ---
export default function Nav() {
  const baiVietTree = React.useMemo(() => buildTree(baiVietData), []);
  const taiLieuTree = React.useMemo(() => buildTree(taiLieuData), []);

  return (
    // Sử dụng div bọc ngoài để chứa cả 2 phiên bản
    <div className=" p-0 lg:p-4">
      {/* --- 1. PHIÊN BẢN DESKTOP (NAVIGATION MENU) --- */}
      {/* ... (Code desktop giữ nguyên) ... */}
      <div className="hidden lg:flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Mục 2: Menu đa cấp "Bài viết" */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${classNameStyle()} `}>
                Bài viết
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2 ">
                  {baiVietTree.map((item) => (
                    <React.Fragment key={item.id}>
                      {item.children.length === 0 && (
                        <ListItem
                          title={item.name}
                          href={`/bai-viet/${item.slug}`}
                        ></ListItem>
                      )}
                      {item.children.length > 0 && (
                        <li className="row-span-1">
                          {" "}
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                {item.name}
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 transition-transform data-[state=open]:rotate-180"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <ul className="mt-2 space-y-1 pl-4">
                                <li>
                                  <a
                                    href={`/bai-viet/${item.slug}`}
                                    className="text-sm font-medium text-foreground hover:underline"
                                  >
                                    Tất cả trong "{item.name}"
                                  </a>
                                </li>
                                {item.children.map((child) => (
                                  <li key={child.id}>
                                    <a
                                      href={`/bai-viet/${child.slug}`}
                                      className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                      {child.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Mục 3: Link đơn "Hỏi đáp" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/hoi-dap"
                className={`${classNameStyle()} `}
              >
                Hỏi đáp
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Mục 4: Menu đa cấp "Tài liệu" */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${classNameStyle()} `}>
                Tài liệu
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 lg:w-[500px] lg:grid-cols-2">
                  {taiLieuTree.map((item) => (
                    <React.Fragment key={item.id}>
                      {item.children.length === 0 && (
                        <ListItem
                          title={item.name}
                          href={`/tai-lieu/${item.slug}`}
                        ></ListItem>
                      )}
                      {item.children.length > 0 && (
                        <li className="row-span-1">
                          {" "}
                          <Collapsible>
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                {item.name}
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 transition-transform data-[state=open]:rotate-180"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <ul className="mt-2 space-y-1 pl-4">
                                <li>
                                  <a
                                    href={`/tai-lieu/${item.slug}`}
                                    className="text-sm font-medium text-foreground hover:underline"
                                  >
                                    Tất cả trong "{item.name}"
                                  </a>
                                </li>
                                {item.children.map((child) => (
                                  <li key={child.id}>
                                    <a
                                      href={`/tai-lieu/${child.slug}`}
                                      className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                      {child.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Mục 5: Link đơn "Sự kiện" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/su-kien"
                className={`${classNameStyle()} `}
              >
                Sự kiện
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Mục 6: Link đơn "Thành viên" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/thanh-vien"
                className={`${classNameStyle()} `}
              >
                Thành viên
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* --- 2. PHIÊN BẢN MOBILE (SHEET) --- */}
      {/* ... (Code SheetTrigger giữ nguyên) ... */}
      <div className="flex lg:hidden justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 py-4">
              {/* Render các link đơn */}
              <MobileNavLink href="/hoi-dap">Hỏi đáp</MobileNavLink>
              <MobileNavLink href="/su-kien">Sự kiện</MobileNavLink>
              <MobileNavLink href="/thanh-vien">Thành viên</MobileNavLink>

              {/* Render các nhóm (dùng component lồng nhau) */}
              <MobileNavGroup
                title="Bài viết"
                items={baiVietTree}
                slugPrefix="/bai-viet"
              />
              <MobileNavGroup
                title="Tài liệu"
                items={taiLieuTree}
                slugPrefix="/tai-lieu"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

// --- COMPONENT HELPER MỚI CHO MOBILE ---

/**
 * Component link đơn cho mobile, tự động đóng Sheet khi click
 */
function MobileNavLink({ href, children }) {
  return (
    <SheetClose asChild>
      <a
        href={href}
        // ---- SỬA ĐỔI ----
        // Thêm px-3 py-2, rounded-md và hover:bg-accent
        className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary"
      >
        {children}
      </a>
    </SheetClose>
  );
}

/**
 * Component nhóm menu (Collapsible) cho mobile, có thể lồng nhau
 */
function MobileNavGroup({ title, items, slugPrefix }) {
  return (
    <Collapsible>
      <CollapsibleTrigger
        // ---- SỬA ĐỔI ----
        // Thêm px-3 py-2, rounded-md và hover:bg-accent
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary [&[data-state=open]>svg]:rotate-180"
      >
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {/* ---- SỬA ĐỔI ----
          - Thêm mt-2 (margin-top)
          - Đổi pl-4 (padding left) thành pl-6 để thụt vào sâu hơn
          - Thêm pr-2 (padding right)
          - Đổi space-y-2 và py-2 thành space-y-1 và py-1 (vì link con đã có padding)
        */}
        <ul className="mt-2 flex flex-col space-y-1 py-1 pl-6 pr-2">
          {/* Link "Tất cả" cho mục cha */}
          <li>
            <MobileNavLink href={`${slugPrefix}`}>
              Tất cả trong "{title}"
            </MobileNavLink>
          </li>

          {/* Map qua các mục con */}
          {items.map((item) => (
            <li key={item.id}>
              {/* Nếu item này KHÔNG có con, render link đơn */}
              {item.children.length === 0 && (
                <MobileNavLink href={`${slugPrefix}/${item.slug}`}>
                  {item.name}
                </MobileNavLink>
              )}

              {/* Nếu item này CÓ con, render lồng chính nó (đệ quy) */}
              {item.children.length > 0 && (
                <MobileNavGroup
                  title={item.name}
                  items={item.children}
                  slugPrefix={`${slugPrefix}/${item.slug}`}
                />
              )}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

// --- COMPONENT HELPER (Từ docs của shadcn - cho desktop) ---
// ... (Component ListItem giữ nguyên) ...
const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
