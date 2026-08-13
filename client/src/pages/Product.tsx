import { FormEvent, useState } from "react";
import { ArrowRight, Check, Instagram, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { getWhatsAppContactUrl, getWhatsAppOrderUrl, INSTAGRAM_URL } from "@/lib/whatsapp";

const price = (value: number) => `${value.toLocaleString("ar-EG")} ج.م`;

export default function Product() {
  const [, params] = useRoute("/product/:slug");
  const [, navigate] = useLocation();
  const { data: product, isLoading } = trpc.products.bySlug.useQuery({ slug: params?.slug ?? "" });
  const [selectedImage, setSelectedImage] = useState(0);
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [orderSent, setOrderSent] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderReference] = useState(() => `GS-${Date.now().toString().slice(-6)}`);
  const [orderUrl, setOrderUrl] = useState("");
  const recordOrderIntent = trpc.products.recordOrderIntent.useMutation();

  if (isLoading) {
    return <div dir="rtl" className="min-h-screen bg-[var(--brand-surface)] p-10 text-center font-bold">بنجهز التفاصيل...</div>;
  }

  if (!product) {
    return (
      <div dir="rtl" className="min-h-screen bg-[var(--brand-surface)] p-10 text-center">
        <h1 className="text-2xl font-black">المنتج مش موجود</h1>
        <Link href="/"><Button className="mt-5 rounded-full bg-[var(--brand-plum)] font-bold text-white">ارجعي للمنتجات</Button></Link>
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!variant) return;
    setOrderError("");
    const url = getWhatsAppOrderUrl({ ...form, product: product.name, variant, quantity, unitPrice: product.price, total: product.price * quantity });
    setOrderUrl(url);
    setOrderSent(true);
    window.open(url, "_blank", "noopener,noreferrer");
    recordOrderIntent.mutate(
      { productId: product.id, productName: product.name, variant, quantity, customerName: form.name, customerPhone: form.phone, customerAddress: form.address },
      { onError: () => setOrderError("تم تجهيز طلبك، ويمكنك إرسال التفاصيل من زر واتساب في صفحة التأكيد.") }
    );
  };

  if (orderSent) {
    return (
      <div dir="rtl" className="min-h-screen bg-[var(--brand-surface)] pb-24 text-[var(--brand-ink)]">
        <header className="border-b border-[#eadfd3] bg-[var(--brand-surface)]/90">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8">
            <Link href="/" className="text-lg font-black">Gallery Store</Link>
            <span className="text-sm font-bold text-[#8e5c46]">تأكيد الطلب</span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-14">
          <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#8e5c46]/10">
            <div className="bg-gradient-to-l from-[var(--brand-plum)] to-[#8e5c46] px-6 py-10 text-center text-white md:px-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#2d9b62] shadow-lg"><Check size={32} strokeWidth={3} /></div>
              <p className="mt-5 text-sm font-bold text-[#f4dfc9]">Gallery Store</p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">تم تأكيد طلبك بنجاح</h1>
              <p className="mt-3 text-sm leading-7 text-white/80">طلبك اتسجل عندنا، ورسالة التفاصيل جاهزة للإرسال على واتساب.</p>
              <div className="mx-auto mt-5 w-fit rounded-full bg-white/15 px-5 py-2 text-sm font-black">رقم الطلب: {orderReference}</div>
            </div>
            <div className="grid gap-6 p-5 md:p-8">
              <div className="flex gap-4 rounded-2xl bg-[var(--brand-surface)] p-4">
                <img src={product.images[0]} alt={product.name} onError={(event) => { event.currentTarget.src = "/manus-storage/gallery-store-logo-hd_698a1ec8.png"; }} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1"><p className="text-xs font-bold text-[#8e5c46]">المنتج</p><h2 className="mt-1 text-lg font-black">{product.name}</h2><p className="mt-2 text-sm font-bold text-[var(--brand-muted)]">{variant} · الكمية: {quantity}</p></div>
                <strong className="text-lg text-[var(--brand-rose)]">{price(product.price * quantity)}</strong>
              </div>
              <div className="grid gap-3 rounded-2xl border border-[#eadfd3] p-5 text-sm">
                <div className="flex justify-between gap-4"><span className="text-[var(--brand-muted)]">الاسم</span><strong>{form.name}</strong></div>
                <div className="flex justify-between gap-4"><span className="text-[var(--brand-muted)]">رقم الهاتف</span><strong dir="ltr">{form.phone}</strong></div>
                <div className="flex justify-between gap-4"><span className="text-[var(--brand-muted)]">العنوان</span><strong className="max-w-[65%] text-left">{form.address}</strong></div>
              </div>
              <div className="rounded-2xl bg-[#f3ebe4] p-5">
                <div className="flex justify-between text-sm"><span>الإجمالي</span><strong className="text-xl text-[var(--brand-rose)]">{price(product.price * quantity)}</strong></div>
                <p className="mt-2 text-xs leading-6 text-[var(--brand-muted)]">التوصيل يتم تنسيقه معك عبر واتساب.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={orderUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#2d9b62] px-5 py-4 text-center font-black text-white shadow-lg shadow-[#2d9b62]/20"><MessageCircle size={19} /> إرسال التفاصيل على واتساب</a>
                <Link href="/"><Button type="button" variant="outline" className="h-full w-full rounded-full border-[var(--brand-copper)] font-black text-[var(--brand-plum)]">متابعة التسوق</Button></Link>
              </div>
              <p className="text-center text-xs leading-6 text-[var(--brand-muted)]">لو لم يفتح واتساب تلقائيًا، اضغطي على الزر الأخضر لإرسال الرسالة يدويًا.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--brand-surface)] pb-24 text-[var(--brand-ink)]">
      <header className="sticky top-0 z-30 border-b border-[#eadfd3] bg-[var(--brand-surface)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="text-lg font-black">Gallery Store</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-[#8e5c46] transition hover:text-[var(--brand-rose)]"><Instagram size={16} /> Instagram</a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8e5c46] transition hover:text-[var(--brand-rose)]"><ArrowRight size={16} /> كل المنتجات</Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <div className="overflow-hidden rounded-[2rem] bg-[#f1e6dc] shadow-xl shadow-[#8e5c46]/10">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                onError={(event) => { event.currentTarget.src = "/manus-storage/gallery-store-logo-hd_698a1ec8.png"; }}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${selectedImage === index ? "border-[var(--brand-rose)]" : "border-transparent hover:border-[var(--brand-copper)]/40"}`}
                >
                  <img src={image} alt="" onError={(event) => { event.currentTarget.src = "/manus-storage/gallery-store-logo-hd_698a1ec8.png"; }} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-black text-[var(--brand-rose)]">اختيار Gallery Store</p>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{product.name}</h1>
            <p className="mt-5 leading-8 text-[var(--brand-muted)]">{product.description}</p>

            <div className="mt-7 flex items-center gap-3">
              <span className="text-3xl font-black text-[var(--brand-rose)]">{price(product.price)}</span>
              {product.compareAtPrice && <del className="text-lg text-[#aa9b94]">{price(product.compareAtPrice)}</del>}
            </div>

            <div className="my-7 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[var(--brand-muted)]">
              <div className="rounded-2xl bg-[#f3ebe4] p-3"><ShieldCheck className="mx-auto mb-1 text-[var(--brand-rose)]" size={19} /> طلب آمن</div>
              <div className="rounded-2xl bg-[#f3ebe4] p-3"><Truck className="mx-auto mb-1 text-[var(--brand-rose)]" size={19} /> توصيل سريع</div>
              <div className="rounded-2xl bg-[#f3ebe4] p-3"><Check className="mx-auto mb-1 text-[var(--brand-rose)]" size={19} /> اختيار واضح</div>
            </div>

            <form onSubmit={submit} className="rounded-[2rem] bg-white p-5 shadow-xl shadow-[#8e5c46]/10 md:p-7">
              <h2 className="text-xl font-black">اطلبيها دلوقتي</h2>

              {orderError && (
                <div role="alert" className="mt-4 rounded-2xl border border-[#efc4b8] bg-[#fff5f1] p-4 text-sm font-bold leading-6 text-[#a64b35]">
                  {orderError}
                </div>
              )}

              <div className="mt-5 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold">اختاري المتغير</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setVariant(item)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${variant === item ? "border-[var(--brand-rose)] bg-[var(--brand-rose)] text-white" : "border-[#e5d8ce] bg-[var(--brand-surface)] hover:border-[var(--brand-copper)]"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <Input required placeholder="الاسم بالكامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input required type="tel" placeholder="رقم الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input required placeholder="العنوان بالتفصيل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

                <div>
                  <label className="mb-2 block text-sm font-bold">الكمية</label>
                  <div className="flex w-fit items-center rounded-full border border-[#e5d8ce]">
                    <button type="button" className="px-4 py-2 text-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <span className="min-w-8 text-center font-black">{quantity}</span>
                    <button type="button" className="px-4 py-2 text-xl" onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!variant || recordOrderIntent.isPending}
                  className="rounded-full bg-[#2d9b62] py-6 text-base font-black text-white shadow-lg shadow-[#2d9b62]/25 transition hover:-translate-y-0.5 hover:bg-[#258453]"
                >
                  {recordOrderIntent.isPending ? "بنجهز طلبك..." : "إتمام الطلب عبر واتساب"} <MessageCircle className="mr-2" size={19} />
                </Button>
                <p className="text-center text-xs text-[#927b71]">بعد الإتمام ستظهر صفحة تأكيد كاملة بتفاصيل طلبك.</p>
              </div>
            </form>
          </section>
        </div>
      </main>

      <a href={getWhatsAppContactUrl()} target="_blank" rel="noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#2d9b62] text-white shadow-2xl transition hover:scale-110">
        <MessageCircle size={26} />
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Gallery Store" className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-plum)] text-white shadow-2xl transition hover:scale-110">
        <Instagram size={21} />
      </a>
    </div>
  );
}
