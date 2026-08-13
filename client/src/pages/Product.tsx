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
  const recordOrderIntent = trpc.products.recordOrderIntent.useMutation();

  if (isLoading) return <div dir="rtl" className="min-h-screen bg-[#fbfaf8] p-10 text-center font-bold">بنجهز التفاصيل...</div>;
  if (!product) return <div dir="rtl" className="min-h-screen bg-[#fbfaf8] p-10 text-center"><h1 className="text-2xl font-black">المنتج مش موجود</h1><Link href="/"><Button className="mt-5 rounded-full">ارجعي للمنتجات</Button></Link></div>;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!variant) return;
    setOrderError("");
    const whatsappWindow = window.open(getWhatsAppOrderUrl({ ...form, product: product.name, variant, quantity, unitPrice: product.price, total: product.price * quantity }), "_blank", "noopener,noreferrer");
    if (!whatsappWindow) {
      setOrderError("لم نتمكن من فتح واتساب تلقائيًا. اسمحي بالنوافذ المنبثقة أو اضغطي على زر التواصل الأخضر أسفل الصفحة.");
      return;
    }
    recordOrderIntent.mutate({ productId: product.id, productName: product.name, variant, quantity, customerName: form.name, customerPhone: form.phone, customerAddress: form.address }, {
      onSuccess: () => setOrderSent(true),
      onError: () => setOrderError("تم فتح واتساب، لكن تعذر تسجيل الطلب في النظام. أرسلي الرسالة من واتساب، ثم حاولي الضغط مرة أخرى إذا احتجتِ تسجيله.")
    });
  };

  return <div dir="rtl" className="min-h-screen bg-[#fbfaf8] pb-24 text-[#201d2b]"><header className="border-b border-[#eadfd3] bg-[#fbfaf8]"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8"><Link href="/" className="text-lg font-black">Gallery Store</Link><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-[#8e5c46]"><Instagram size={16}/> Instagram</a></div></header><main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8e5c46]"><ArrowRight size={16}/> كل المنتجات</Link><div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]"><section><div className="overflow-hidden rounded-[2rem] bg-[#f1e6dc]"><img src={product.images[selectedImage]} alt={product.name} onError={(event) => { event.currentTarget.src = "/manus-storage/gallery-store-logo-hd_698a1ec8.png"; }} className="aspect-square w-full object-cover"/></div><div className="mt-4 flex gap-3 overflow-x-auto">{product.images.map((image, index) => <button key={image} onClick={() => setSelectedImage(index)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${selectedImage === index ? "border-[#b56d50]" : "border-transparent"}`}><img src={image} alt="" onError={(event) => { event.currentTarget.src = "/manus-storage/gallery-store-logo-hd_698a1ec8.png"; }} className="h-full w-full object-cover"/></button>)}</div></section><section><p className="text-sm font-black text-[#b56d50]">اختيار Gallery Store</p><h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{product.name}</h1><p className="mt-5 leading-8 text-[#806e66]">{product.description}</p><div className="mt-7 flex items-center gap-3"><span className="text-3xl font-black text-[#b56d50]">{price(product.price)}</span>{product.compareAtPrice && <del className="text-lg text-[#aa9b94]">{price(product.compareAtPrice)}</del>}</div><div className="my-7 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#806e66]"><div className="rounded-2xl bg-[#f3ebe4] p-3"><ShieldCheck className="mx-auto mb-1 text-[#b56d50]" size={19}/> طلب آمن</div><div className="rounded-2xl bg-[#f3ebe4] p-3"><Truck className="mx-auto mb-1 text-[#b56d50]" size={19}/> توصيل سريع</div><div className="rounded-2xl bg-[#f3ebe4] p-3"><Check className="mx-auto mb-1 text-[#b56d50]" size={19}/> اختيار واضح</div></div><form onSubmit={submit} className="rounded-[2rem] bg-white p-5 shadow-xl shadow-[#8e5c46]/10 md:p-7"><h2 className="text-xl font-black">اطلبيها دلوقتي</h2>{orderError && <div role="alert" className="mt-4 rounded-2xl border border-[#efc4b8] bg-[#fff5f1] p-4 text-sm font-bold leading-6 text-[#a64b35]">{orderError}</div>}<div className="mt-5 grid gap-4"><div><label className="mb-2 block text-sm font-bold">اختاري المتغير</label><div className="flex flex-wrap gap-2">{product.variants.map((item) => <button type="button" key={item} onClick={() => setVariant(item)} className={`rounded-full border px-4 py-2 text-sm font-bold ${variant === item ? "border-[#b56d50] bg-[#b56d50] text-white" : "border-[#e5d8ce] bg-[#fbfaf8]"}`}>{item}</button>)}</div></div><Input required placeholder="الاسم بالكامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/><Input required type="tel" placeholder="رقم الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/><Input required placeholder="العنوان بالتفصيل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/><div><label className="mb-2 block text-sm font-bold">الكمية</label><div className="flex w-fit items-center rounded-full border border-[#e5d8ce]"><button type="button" className="px-4 py-2 text-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span className="min-w-8 text-center font-black">{quantity}</span><button type="button" className="px-4 py-2 text-xl" onClick={() => setQuantity(quantity + 1)}>+</button></div></div>{orderSent ? <div className="rounded-2xl border border-[#b9dfc7] bg-[#effaf2] p-5 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2d9b62] text-white"><Check size={22}/></div><h3 className="mt-3 text-lg font-black text-[#216b43]">تم تجهيز طلبك بنجاح</h3><p className="mt-2 text-sm leading-6 text-[#537261]">تم فتح واتساب برسالة كاملة إلى Gallery Store. أرسلي الرسالة من واتساب لتأكيد وصول الطلب.</p><p className="mt-3 text-xs font-black text-[#8e5c46]">رقم الطلب: {orderReference}</p><div className="mt-4 flex flex-wrap justify-center gap-2"><Button type="button" variant="outline" className="rounded-full border-[#b9dfc7] font-bold text-[#216b43]" onClick={() => setOrderSent(false)}>تعديل البيانات</Button><Link href="/"><Button type="button" className="rounded-full bg-[#211b2b] font-bold text-white">متابعة التسوق</Button></Link></div></div> : <><Button type="submit" disabled={!variant || recordOrderIntent.isPending} className="rounded-full bg-[#2d9b62] py-6 text-base font-black text-white hover:bg-[#258453]">{recordOrderIntent.isPending ? "بنجهز طلبك..." : "إتمام الطلب عبر واتساب"} <MessageCircle className="mr-2" size={19}/></Button><p className="text-center text-xs text-[#927b71]">هتوصلك رسالة واتساب جاهزة بكل تفاصيل الطلب قبل الإرسال.</p></>}</div></form></section></div></main><a href={getWhatsAppContactUrl()} target="_blank" rel="noreferrer" className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#2d9b62] text-white shadow-2xl"><MessageCircle size={26}/></a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Moony Stitch" className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#211b2b] text-white shadow-2xl"><Instagram size={21}/></a></div>;
}
