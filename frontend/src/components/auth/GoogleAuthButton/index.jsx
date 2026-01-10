"use client";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuthHook } from "@/hooks/useAuth";

export default function GoogleAuthButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const { loginGoogle } = useAuthHook();
  // CALLBACK: server exchange code => tạo JWT app
  const onCodeSuccess = async (codeResponse) => {
    // codeResponse khi dùng flow: 'auth-code' có property `code`
    setErr(null);
    setLoading(true);
    try {
      const code = codeResponse.code;
      const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
      // Gửi code về backend để exchange token và verify
      const res = await loginGoogle({ code, redirect_uri });

      //   localStorage.setItem("token", token); // hoặc cookie, secure httpOnly cookie...
      //   console.log("User logged in:", user);
    } catch (e) {
      console.error("Backend exchange failed:", e);
      setErr(e?.response?.data || e);
    } finally {
      setLoading(false);
    }
  };

  const onError = (error) => {
    console.error("Google login error:", error);
    setErr(error);
  };

  // Khởi tạo hook login
  const login = useGoogleLogin({
    flow: "auth-code", // <-- dùng Authorization Code flow (recommended)
    ux_mode: "popup", // "popup" (mặc định) hoặc "redirect"
    scope: "openid profile email",
    onSuccess: onCodeSuccess,
    onError,
  });

  return (
    <div>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => login()}
        disabled={loading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Continue with Google
      </Button>
      {err && (
        <p className="text-sm text-red-600 mt-2">
          Lỗi: {err?.message || JSON.stringify(err)}
        </p>
      )}
    </div>
  );
}
