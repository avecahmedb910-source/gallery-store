import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[var(--brand-surface,#fffaf6)] p-8">
          <div className="flex w-full max-w-lg flex-col items-center rounded-[2rem] border border-[#eadfd3] bg-white p-8 text-center shadow-xl shadow-[#8e5c46]/10">
            <AlertTriangle size={44} className="mb-5 flex-shrink-0 text-[#c05a3f]" />

            <h2 className="text-xl font-black">حصل خطأ غير متوقع</h2>
            <p className="mt-2 text-sm leading-6 text-[#806e66]">
              معلش، حصلت مشكلة مؤقتة في الموقع. جربي تحدّثي الصفحة، ولو المشكلة استمرت كلمينا على واتساب.
            </p>

            {import.meta.env.DEV && this.state.error?.stack && (
              <div className="mt-6 w-full overflow-auto rounded-xl bg-[#f3ebe4] p-4 text-right">
                <pre className="whitespace-break-spaces text-xs text-[#806e66]">{this.state.error.stack}</pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "mt-6 flex items-center gap-2 rounded-full px-6 py-2.5 font-black",
                "bg-[var(--brand-plum,#211b2b)] text-white",
                "transition hover:-translate-y-0.5 hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
