"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpComplete, setSignUpComplete] = useState(false);
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
          setSignUpComplete(true);
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
          <div className="mb-5">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className="mx-auto">
              {/* 네잎클로버 (45도 회전) */}
              <ellipse cx="20.3" cy="20.3" rx="7" ry="9" transform="rotate(-45 20.3 20.3)" fill="#6a9f5b" className="dark:fill-[#7db882]" opacity="0.85" />
              <ellipse cx="31.7" cy="31.7" rx="7" ry="9" transform="rotate(-45 31.7 31.7)" fill="#6a9f5b" className="dark:fill-[#7db882]" opacity="0.85" />
              <ellipse cx="31.7" cy="20.3" rx="7" ry="9" transform="rotate(45 31.7 20.3)" fill="#5a8f4b" className="dark:fill-[#6daa72]" opacity="0.85" />
              <ellipse cx="20.3" cy="31.7" rx="7" ry="9" transform="rotate(45 20.3 31.7)" fill="#5a8f4b" className="dark:fill-[#6daa72]" opacity="0.85" />
              {/* 중심 */}
              <circle cx="26" cy="26" r="3" fill="#4a7a3b" className="dark:fill-[#5d9a62]" />
              {/* 줄기 */}
              <path d="M26 35C26 35 27 42 30 46" stroke="#6a9f5b" className="dark:stroke-[#7db882]" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2c2825] dark:text-[#e8e4df] tracking-tight mb-2">
            감사일기
          </h1>
          <p className="text-sm text-[#8b7355] dark:text-[#a6956e]">
            {isSignUp ? "새 계정 만들기" : "매일 세 줄의 감사를 기록하세요"}
          </p>
        </div>

        {signUpComplete && (
          <div className="mb-6 p-4 rounded-xl bg-[#5a7a5e]/10 dark:bg-[#4a6b4e]/20 border border-[#5a7a5e]/30 dark:border-[#4a6b4e]/40">
            <p className="text-sm font-medium text-[#5a7a5e] dark:text-[#7db882] mb-1">
              가입이 완료되었습니다!
            </p>
            <p className="text-[13px] text-[#5a7a5e]/80 dark:text-[#7db882]/80">
              이메일로 전송된 확인 링크를 클릭한 후 로그인해주세요.
            </p>
          </div>
        )}

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

        <div className="mt-8 text-center">
          <p className="text-[13px] text-[#8b7355] dark:text-[#a6956e] mb-2">
            {isSignUp ? "이미 계정이 있으신가요?" : "처음이신가요?"}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setSignUpComplete(false);
              setToast(null);
            }}
            className="px-5 py-2.5 rounded-[10px] text-[13px] font-medium border border-[#8b7355] dark:border-[#a6956e] text-[#8b7355] dark:text-[#a6956e] hover:bg-[#8b7355]/10 dark:hover:bg-[#a6956e]/10 transition-colors cursor-pointer"
          >
            {isSignUp ? "로그인하기" : "회원가입하기"}
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
