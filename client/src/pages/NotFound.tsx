import { Sparkles, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div dir="rtl" className="flex min-h-screen w-full items-center justify-center bg-[var(--brand-surface)] px-4">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#eadfd3] bg-white p-10 text-center shadow-xl shadow-[#8e5c46]/10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-sand)]">
          <Sparkles className="text-[var(--brand-rose)]" size={28} />
        </div>
        <h1 className="text-4xl font-black text-[var(--brand-plum)]">404</h1>
        <h2 className="mt-2 text-xl font-black">الصفحة مش موجودة</h2>
        <p className="mt-4 leading-7 text-[var(--brand-muted)]">
          يبدو أن الرابط ده مش موجود أو اتنقل لمكان تاني.
          <br />
          ارجعي لصفحة Gallery Store الرئيسية عشان تلاقي كل المنتجات.
        </p>
        <div className="mt-8 flex justify-center">
          <Button onClick={() => setLocation("/")} className="rounded-full bg-[var(--brand-plum)] px-7 py-6 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#392d4a]">
            <HomeIcon className="ml-2" size={18} /> العودة للمتجر
          </Button>
        </div>
      </div>
    </div>
  );
}
