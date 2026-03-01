"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("이메일과 비밀번호를 입력해주세요", "error");
      return;
    }
    if (password.length < 6) {
      showToast("비밀번호는 6자 이상이어야 합니다", "error");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          showToast(error, "error");
        } else {
          showToast("가입 완료! 이메일을 확인해주세요", "success");
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          showToast("이메일 또는 비밀번호가 올바르지 않습니다", "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#2c2825] dark:text-[#e8e4df] tracking-tight mb-2">
            감사일기
          </h1>
          <p className="text-sm text-[#b8b0a4] dark:text-[#6b6560]">
            {isSignUp ? "새 계정 만들기" : "로그인하여 시작하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-[#b8b0a4] dark:text-[#6b6560] mb-2 ml-0.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="gratitude-input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-[#b8b0a4] dark:text-[#6b6560] mb-2 ml-0.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (6자 이상)"
              className="gratitude-input"
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8b7355] hover:bg-[#7a6549] active:bg-[#6b5842] dark:bg-[#a6956e] dark:hover:bg-[#b8a57d] dark:active:bg-[#c4b48a] text-white dark:text-[#1a1816] text-sm font-medium rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer tracking-wide"
          >
            {loading
              ? "처리 중..."
              : isSignUp
                ? "회원가입"
                : "로그인"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setToast(null);
            }}
            className="text-[13px] text-[#8b7355] dark:text-[#a6956e] hover:text-[#6b5842] dark:hover:text-[#c4b48a] transition-colors cursor-pointer"
          >
            {isSignUp
              ? "이미 계정이 있으신가요? 로그인"
              : "계정이 없으신가요? 회원가입"}
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white z-50 ${
            toast.type === "success"
              ? "bg-[#5a7a5e] dark:bg-[#4a6b4e]"
              : "bg-[#a05252] dark:bg-[#8b4545]"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
