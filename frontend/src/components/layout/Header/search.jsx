import * as React from "react";
import { Search } from "lucide-react";

// Import các component Command từ shadcn/ui
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
// Import Button để làm trigger
import { Button } from "@/components/ui/button";

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false);

  // Thêm hiệu ứng để lắng nghe phím tắt (Ctrl+K hoặc Cmd+K)
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      {/* Đây là nút trigger, đã được cập nhật responsive:
        - Mặc định (mobile): Chỉ là icon button (w-9, h-9, p-0, justify-center)
        - Từ breakpoint sm: (small) trở lên: Hiển thị đầy đủ
      */}
      <Button
        variant="outline"
        className="flex lg:justify-between  justify-center relative h-9 w-9 p-0 text-sm text-muted-foreground
                   lg:max-w-80 lg:min-w-72 lg:w-full  lg:px-3"
        onClick={() => setOpen(true)}
      >
        {/* Icon: Hiển thị trên mọi kích cỡ, chỉ có margin-right trên sm: */}
        <Search className="h-4 w-4 lg:mr-2" />

        {/* Text: Ẩn trên mobile (hidden), hiển thị trên sm: (sm:flex-grow) */}
        <span className="hidden lg:flex lg:flex-grow lg:text-start">
          Tìm kiếm...
        </span>

        {/* Phím tắt: Đã có sẵn (hidden sm:flex) nên sẽ tự động ẩn trên mobile */}
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>

      {/* Đây là hộp thoại Command, nó sẽ bật lên */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Gõ lệnh hoặc tìm kiếm..." />
        <CommandList>
          <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>

          {/* Thêm các nhóm lệnh mẫu */}
          <CommandGroup heading="Gợi ý">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                // Thêm hành động, ví dụ: window.location.href = "/trang-chu"
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Trang chủ</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                // Thêm hành động
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Bài viết</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                // Thêm hành động
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Hỏi đáp</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cài đặt">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                // Thêm hành động
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                // Thêm hành động
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
