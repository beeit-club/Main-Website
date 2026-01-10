"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { emailTemplateServices } from "@/services/admin/emailTemplateServices";
import { bulkEmailServices } from "@/services/admin/bulkEmailServices";
import { usersServices } from "@/services/admin/users";
import { ArrowLeft, Send, CheckCircle2, User, Search, Info, AlertCircle } from "lucide-react";
import { PaginationControls } from "@/components/common/Pagination";

// Các biến mà hệ thống sẽ tự động map từ User DB
const AUTO_MAPPED_FIELDS = ['fullname', 'email', 'phone', 'student_id', 'role_name', 'otp', 'reset_link'];

export default function BulkSendPage() {
  const router = useRouter();
  
  // Steps: 1. Template -> 2. Users -> 3. Config -> 4. Finish
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATA STATES ---
  const [campaignName, setCampaignName] = useState("");
  
  // Step 1: Template
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("all");

  // Step 2: Users
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userMeta, setUserMeta] = useState({ totalPages: 0, total: 0 });
  const [userPagination, setUserPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedUserIds, setSelectedUserIds] = useState(new Set()); // Set of IDs
  const [selectedUserDetails, setSelectedUserDetails] = useState({}); // Map ID -> {email, fullname...}
  // Filters
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("true");
  const [roles, setRoles] = useState([]);

  // Step 3: Variables
  const [commonVariables, setCommonVariables] = useState({});

  // --- LOAD INITIAL DATA ---
  useEffect(() => {
    async function loadInitial() {
      try {
        // Load Templates
        const tRes = await emailTemplateServices.getAllTemplates({ limit: 100, is_active: true });
        setTemplates(tRes.data?.data || []);
        
        // Load Roles
        const rRes = await usersServices.getAllRoles();
        setRoles(rRes.data?.roles?.data || []);
      } catch (error) {
        console.error("Init Error:", error);
      }
    }
    loadInitial();
  }, []);

  // --- LOAD USERS (When filter/page changes) ---
  useEffect(() => {
    if (step !== 2) return; 

    async function loadUsers() {
      setUserLoading(true);
      try {
        const params = new URLSearchParams({
          page: (userPagination.pageIndex + 1).toString(),
          limit: userPagination.pageSize.toString(),
        });
        
        if (userSearch) params.set("search", userSearch);
        if (roleFilter !== "all") params.set("roleId", roleFilter);
        if (activeFilter !== "all") params.set("active", activeFilter);

        const res = await usersServices.getAllUser(params);
        setUsers(res.data?.data || []);
        setUserMeta({
          totalPages: res.data?.pagination?.totalPages || 0,
          total: res.data?.pagination?.total || 0
        });
      } catch (error) {
        console.error("Load Users Error:", error);
      } finally {
        setUserLoading(false);
      }
    }
    
    // Debounce search
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [step, userPagination, userSearch, roleFilter, activeFilter]);


  // --- HANDLERS ---

  const toggleUser = (user) => {
    const newIds = new Set(selectedUserIds);
    const newDetails = { ...selectedUserDetails };

    if (newIds.has(user.id)) {
      newIds.delete(user.id);
      delete newDetails[user.id];
    } else {
      newIds.add(user.id);
      newDetails[user.id] = { 
        email: user.email, 
        fullname: user.fullname,
        phone: user.phone,
        role_name: user.role_name,
        // Add other fields if needed for auto-mapping
      };
    }
    setSelectedUserIds(newIds);
    setSelectedUserDetails(newDetails);
  };

  const toggleAllPage = () => {
    const newIds = new Set(selectedUserIds);
    const newDetails = { ...selectedUserDetails };
    
    const allSelected = users.every(u => newIds.has(u.id));

    users.forEach(user => {
      if (allSelected) {
        newIds.delete(user.id);
        delete newDetails[user.id];
      } else {
        newIds.add(user.id);
        newDetails[user.id] = { 
          email: user.email, 
          fullname: user.fullname,
          phone: user.phone,
          role_name: user.role_name
        };
      }
    });
    
    setSelectedUserIds(newIds);
    setSelectedUserDetails(newDetails);
  };

  const validateVariables = (templateVars) => {
    if (!templateVars) return true;
    
    const manualVars = templateVars.filter(v => !AUTO_MAPPED_FIELDS.includes(v.name));
    const missing = [];

    manualVars.forEach(v => {
      if (!commonVariables[v.name] || commonVariables[v.name].trim() === "") {
        missing.push(v.name);
      }
    });

    if (missing.length > 0) {
      toast.error(`Vui lòng điền giá trị cho biến: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // 1. Validate Basic Info
    if (!campaignName) return toast.error("Vui lòng nhập tên chiến dịch");
    if (selectedUserIds.size === 0) return toast.error("Vui lòng chọn ít nhất 1 người nhận");

    // 2. Validate Variables
    const templateVars = typeof selectedTemplate.variables === "string" 
      ? JSON.parse(selectedTemplate.variables) 
      : selectedTemplate.variables;
      
    if (!validateVariables(templateVars)) {
      return; // Stop if validation fails
    }

    // 3. Submit
    setIsSubmitting(true);
    try {
      const recipients = Array.from(selectedUserIds).map(id => selectedUserDetails[id]);
      
      await bulkEmailServices.createCampaign({
        name: campaignName,
        template_id: selectedTemplate.id,
        recipients,
        common_variables: commonVariables
      });

      toast.success("Chiến dịch đã được tạo thành công!");
      router.push("/admin/email-templates/bulk-jobs");
    } catch (error) {
      toast.error(error.message || "Lỗi tạo chiến dịch");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER STEPS ---

  // STEP 1: SELECT TEMPLATE
  const renderStep1 = () => {
    const filteredTemplates = templates.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase());
      const matchCat = templateCategory === "all" || t.category === templateCategory;
      return matchSearch && matchCat;
    });

    const categories = ["all", ...new Set(templates.map(t => t.category).filter(Boolean))];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tên Chiến dịch</Label>
            <Input 
              placeholder="VD: Newsletter Tháng 1" 
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label>Tìm Template</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm theo tên..." 
                className="pl-8"
                value={templateSearch}
                onChange={e => setTemplateSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-[200px] space-y-2">
            <Label>Danh mục</Label>
            <Select value={templateCategory} onValueChange={setTemplateCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "Tất cả" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(t => (
            <Card 
              key={t.id} 
              className={`cursor-pointer transition-all hover:border-primary ${selectedTemplate?.id === t.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
              onClick={() => setSelectedTemplate(t)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base flex justify-between">
                  {t.name}
                  {selectedTemplate?.id === t.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription className="line-clamp-1">{t.subject}</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Badge variant="secondary" className="text-xs">{t.category}</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => {
              if(!campaignName) return toast.error("Vui lòng nhập tên chiến dịch");
              if(!selectedTemplate) return toast.error("Vui lòng chọn template");
              setStep(2);
            }}
          >
            Tiếp tục: Chọn người nhận
          </Button>
        </div>
      </div>
    );
  };

  // STEP 2: SELECT USERS
  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label>Tìm User</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tên, Email..." 
                className="pl-8"
                value={userSearch}
                onChange={e => { setUserSearch(e.target.value); setUserPagination(p => ({...p, pageIndex: 0})); }}
              />
            </div>
          </div>
          <div className="w-[180px] space-y-2">
            <Label>Role</Label>
            <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setUserPagination(p => ({...p, pageIndex: 0})); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {roles.map(r => (
                  <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[150px] space-y-2">
            <Label>Trạng thái</Label>
            <Select value={activeFilter} onValueChange={v => { setActiveFilter(v); setUserPagination(p => ({...p, pageIndex: 0})); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={users.length > 0 && users.every(u => selectedUserIds.has(u.id))}
                    onCheckedChange={toggleAllPage}
                  />
                </TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-20">Đang tải...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-20">Không tìm thấy user nào</TableCell></TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id} onClick={() => toggleUser(user)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => toggleUser(user)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role_name}</TableCell>
                    <TableCell>
                      {user.is_active ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="outline">Inactive</Badge>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls 
          pagination={userPagination} 
          meta={userMeta} 
          setPagination={setUserPagination} 
        />

        <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="font-medium">Đã chọn: {selectedUserIds.size} người nhận</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
            <Button 
              onClick={() => {
                if(selectedUserIds.size === 0) return toast.error("Vui lòng chọn ít nhất 1 người nhận");
                setStep(3);
              }}
            >
              Tiếp tục: Cấu hình
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // STEP 3: CONFIG & CONFIRM
  const renderStep3 = () => {
    // Parse Variables
    const templateVars = selectedTemplate?.variables 
      ? (typeof selectedTemplate.variables === "string" 
          ? JSON.parse(selectedTemplate.variables) 
          : selectedTemplate.variables)
      : [];

    // Separate Auto vs Manual Variables
    const autoVars = templateVars.filter(v => AUTO_MAPPED_FIELDS.includes(v.name));
    const manualVars = templateVars.filter(v => !AUTO_MAPPED_FIELDS.includes(v.name));

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: SUMMARY */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Chiến dịch:</span>
                  <span className="font-medium">{campaignName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="font-medium">{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Số người nhận:</span>
                  <span className="font-bold text-primary text-lg">{selectedUserIds.size}</span>
                </div>
              </CardContent>
            </Card>

            {/* Auto Mapped Info */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Tự động điền dữ liệu</AlertTitle>
              <AlertDescription className="text-blue-600 text-sm mt-2">
                Hệ thống sẽ tự động lấy thông tin sau từ Database của từng người dùng để điền vào email:
                <div className="flex flex-wrap gap-2 mt-2">
                  {autoVars.length > 0 ? (
                    autoVars.map(v => (
                      <Badge key={v.name} variant="outline" className="bg-white border-blue-300 text-blue-700 font-mono">
                        {`{{${v.name}}}`}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs italic">(Không có biến tự động nào được sử dụng)</span>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* RIGHT: CONFIG VARIABLES */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Cấu hình Biến (Variables)</CardTitle>
              <CardDescription>Vui lòng điền giá trị cho các biến bên dưới. Giá trị này sẽ áp dụng cho tất cả {selectedUserIds.size} người nhận.</CardDescription>
            </CardHeader>
            <CardContent>
              {manualVars.length > 0 ? (
                <div className="space-y-4">
                  {manualVars.map((variable, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        {variable.name}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder={`Nhập giá trị cho {{${variable.name}}}...`}
                        value={commonVariables[variable.name] || ""}
                        onChange={(e) => {
                          setCommonVariables(prev => ({
                            ...prev,
                            [variable.name]: e.target.value
                          }));
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Sẽ thay thế cho <code>{`{{${variable.name}}}`}</code> trong email.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                  <p>Tuyệt vời! Template này không yêu cầu nhập thêm thông tin nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={() => setStep(2)}>Quay lại</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
            {isSubmitting ? "Đang xử lý..." : (
              <>
                <Send className="mr-2 h-4 w-4" /> Xác nhận & Gửi ngay
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Gửi Email Hàng Loạt</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className={`px-2 py-1 rounded-md ${step === 1 ? "bg-primary text-primary-foreground font-medium" : ""}`}>1. Chọn Template</span>
            <span className="text-muted-foreground/50">→</span>
            <span className={`px-2 py-1 rounded-md ${step === 2 ? "bg-primary text-primary-foreground font-medium" : ""}`}>2. Chọn Người nhận</span>
            <span className="text-muted-foreground/50">→</span>
            <span className={`px-2 py-1 rounded-md ${step === 3 ? "bg-primary text-primary-foreground font-medium" : ""}`}>3. Cấu hình & Gửi</span>
          </div>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}