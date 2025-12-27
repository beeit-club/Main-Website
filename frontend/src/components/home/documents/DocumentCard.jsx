"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Lock,
  Users,
  Globe,
  Folder,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function DocumentCard({ document }) {
  const {
    id,
    title,
    slug,
    description,
    file_url,
    preview_url,
    category,
    category_name,
    access_level,
    download_count,
    created_at,
  } = document;

  const getAccessBadge = () => {
    switch (access_level) {
      case "public":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            <Globe className="h-3 w-3 mr-1" />
            Công khai
          </Badge>
        );
      case "member_only":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            <Users className="h-3 w-3 mr-1" />
            Thành viên
          </Badge>
        );
      case "restricted":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
          >
            <Lock className="h-3 w-3 mr-1" />
            Hạn chế
          </Badge>
        );
      default:
        return null;
    }
  };

  const documentUrl = slug ? `/documents/${slug}` : "#";

  return (
    <Card className="h-full hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
      <Link href={documentUrl}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </div>
            <div className="flex-shrink-0">{getAccessBadge()}</div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {description}
            </p>
          )}

          {/* Category */}
          {(category || category_name) && (
            <Badge variant="outline" className="text-xs">
              <Folder className="h-3 w-3 mr-1" />
              {category?.name || category_name || category}
            </Badge>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {format(new Date(created_at), "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>
          {download_count !== undefined && download_count !== null && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{download_count} lượt tải</span>
            </div>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
