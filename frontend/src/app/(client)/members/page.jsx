"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { memberService } from "@/services/member";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Search,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { PostPagination } from "@/components/home/post/components/post-pagination";

export default function MembersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchMembers = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await memberService.getAllMembers({
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 12,
        search: params.search || searchParams.get("search") || "",
      });

      if (response.status === "success") {
        setMembers(response.data?.data || []);
        setPagination(response.data?.pagination || {});
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setMembers([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset về trang 1 khi search
    router.push(`/members?${params.toString()}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          Danh sách Thành viên
        </h1>
        <p className="text-muted-foreground">
          Khám phá các thành viên đang hoạt động trong câu lạc bộ
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc MSSV..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Tìm kiếm"
            )}
          </Button>
        </div>
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Members Grid */}
      {!isLoading && (
        <>
          {members.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {members.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Avatar & Name */}
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar_url} alt={member.fullname} />
                          <AvatarFallback className="text-lg">
                            {member.fullname?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {member.fullname}
                          </h3>
                          {member.student_id && (
                            <Badge variant="secondary" className="mt-1">
                              <GraduationCap className="h-3 w-3 mr-1" />
                              {member.student_id}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="space-y-2 text-sm">
                        {member.email && (
                          <div className="flex items-center text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.course && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>Khóa: {member.course}</span>
                          </div>
                        )}
                        {member.join_date && (
                          <div className="flex items-center text-muted-foreground">
                            <User className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              Tham gia:{" "}
                              {format(new Date(member.join_date), "dd/MM/yyyy", {
                                locale: vi,
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      {member.bio && (
                        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                          {member.bio}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <PostPagination
                  currentPage={pagination.currentPage || 1}
                  totalPages={pagination.totalPages || 1}
                  baseUrl="/members"
                  searchParams={searchParams}
                />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchParams.get("search")
                    ? "Không tìm thấy thành viên nào phù hợp với từ khóa tìm kiếm."
                    : "Chưa có thành viên nào trong hệ thống."}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

