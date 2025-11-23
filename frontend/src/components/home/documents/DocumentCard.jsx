"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock, Users, Globe, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const DEFAULT_PREVIEW_IMAGE = "https://picsum.photos/seed/document/800/600";

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

  const handleClick = (e) => {
    e.preventDefault();
    if (file_url) {
      window.open(file_url, "_blank", "noopener,noreferrer");
    }
  };

  const getAccessBadge = () => {
    switch (access_level) {
      case "public":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Globe className="h-3 w-3 mr-1" />
            Công khai
          </Badge>
        );
      case "member_only":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Users className="h-3 w-3 mr-1" />
            Thành viên
          </Badge>
        );
      case "restricted":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <Lock className="h-3 w-3 mr-1" />
            Hạn chế
          </Badge>
        );
      default:
        return null;
    }
  };

  const previewImage = preview_url || DEFAULT_PREVIEW_IMAGE;

  return (
    <Card 
      className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
      onClick={handleClick}
    >
      {/* Preview Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <Image
          src={previewImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-2 right-2">
          {getAccessBadge()}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <div className="flex items-start gap-2 mb-3">
          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <h3 className="text-lg font-bold line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {file_url && (
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>
        )}

        {/* Category */}
        {(category || category_name) && (
          <div className="mb-4">
            <Badge variant="outline" className="text-xs">
              {category?.name || category_name || category}
            </Badge>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
          <span>
            {format(new Date(created_at), "dd/MM/yyyy", { locale: vi })}
          </span>
          {download_count !== undefined && download_count !== null && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{download_count} lượt tải</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

