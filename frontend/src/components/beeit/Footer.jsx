"use client";

import React, { useState } from "react";
import { Send, Github, Facebook, Instagram } from "lucide-react";
import { submitEmail } from "@/services/client/beeitClient";
import { toast } from "sonner";

const Footer = ({ data }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Default values nếu không có data
  const terminalPrompt = data?.terminal_prompt || "guest@beeit-terminal:~";
  const headingText = data?.heading_text || "# Kết nối với chúng tôi";
  const subheadingText = data?.subheading_text || "Sẵn sàng kích hoạt tiềm năng của bạn?";
  const commandPrompt = data?.command_prompt || "guest@beeit:~$";
  const commandText = data?.command_text || "join --email";
  const placeholderText = data?.placeholder_text || "nhập_email_của_bạn";
  const buttonText = data?.button_text || "[GỬI_LỆNH]";
  const contactEmail = data?.contact_email || "contact@beeit.club";
  const locationText = data?.location_text || "TP.HCM, Việt Nam";
  const githubUrl = data?.github_url || "#";
  const facebookUrl = data?.facebook_url || "#";
  const instagramUrl = data?.instagram_url || "#";
  const copyrightText = data?.copyright_text 
    ? data.copyright_text.replace("{year}", new Date().getFullYear())
    : `© ${new Date().getFullYear()} BEE IT CLUB. MỌI HỆ THỐNG ĐANG HOẠT ĐỘNG.`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }

    try {
      setSubmitting(true);
      await submitEmail(email);
      toast.success("Gửi email thành công! Cảm ơn bạn đã quan tâm.");
      setEmail("");
    } catch (error) {
      toast.error(error?.message || "Gửi email thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className=" bottom-0 h-[600px] md:h-[500px] w-full  text-green-500 font-mono z-0 flex flex-col justify-center border-t border-green-900/30">
      <div className="max-w-4xl mx-auto w-full px-6">
        {/* Terminal Window */}
        <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-gray-500">
              {terminalPrompt}
            </span>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <p className="text-gray-400 mb-2">{headingText}</p>
              <p className="text-primary">
                {subheadingText}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <span className="text-secondary shrink-0">{commandPrompt}</span>
                <span className="text-text shrink-0">{commandText}</span>
                <div className="flex-1 flex gap-2 border-b border-gray-700 focus-within:border-primary">
                  <input
                    type="email"
                    placeholder={placeholderText}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="bg-transparent border-none outline-none text-heading w-full placeholder-gray-700 py-1"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="text-primary hover:text-white transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "..." : buttonText}
                  </button>
                </div>
              </div>
            </form>

            <div className="pt-8 border-t border-dashed border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs">THÔNG_TIN_LIÊN_HỆ:</p>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-sm hover:text-primary cursor-pointer block"
                >
                  {contactEmail}
                </a>
                <p className="text-sm">{locationText}</p>
              </div>

              <div className="flex gap-6">
                {githubUrl && githubUrl !== "#" && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-transform hover:-translate-y-1"
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                )}
                {facebookUrl && facebookUrl !== "#" && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-transform hover:-translate-y-1"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {instagramUrl && instagramUrl !== "#" && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-transform hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/50 p-2 text-center text-[10px] text-gray-700">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
