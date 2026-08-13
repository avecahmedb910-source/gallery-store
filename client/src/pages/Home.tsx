import { ArrowLeft, ChevronLeft, Instagram, MessageCircle, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { getWhatsAppContactUrl, INSTAGRAM_URL } from "@/lib/whatsapp";
import { useAuth } from "@/_core/hooks/useAuth";

const formatPrice = (value: number) => `${value.toLocaleString("ar-EG")} ج.م`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { user } = useAuth();

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-ink)] pb-20">
      {/* Announcement bar */}
      <div className="relative overflow-hidden bg-gradient-to-l from-[var(--brand-plum)] via-[#2c2337] to-[var(--brand-plum)] px-4 py-2.5 text-center text-xs font-bold text-[#f8ddae]">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={13} className="animate-pulse" /> شحن سريع لباب البيت — اطلب الآن عبر واتساب
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#eadfd3] bg-[var(--brand-surface)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-[#c58b65]/25 ring-1 ring-black/5">
              <img src="/manus-storage/gallery-store-logo-hd_698a1ec8.png" alt="شعار Gallery Store" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">Gallery Store</div>
              <div className="text-[10px] font-bold text-[#9e7b68]">بيت الهدايا والهاند ميد</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-bold md:flex">
            <a href="#products" className="relative transition hover:text-[var(--brand-rose)] after:absolute after:-bottom-1 after:right-0 after:h-[2px] after:w-0 after:bg-[var(--brand-rose)] after:transition-all after:content-[''] hover:after:w-full">المنتجات</a>
            <a href="#why" className="relative transition hover:text-[var(--brand-rose)] after:absolute after:-bottom-1 after:right-0 after:h-[2px] after:w-0 after:bg-[var(--brand-rose)] after:transition-all after:content-[''] hover:after:w-full">ليه Gallery Store؟</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[var(--brand-rose)]"><Instagram size={16} /> Instagram</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={getWhatsAppContactUrl()} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#2d9b62] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#2d9b62]/25 transition hover:-translate-y-0.5 hover:shadow-xl sm:block">
              كلمينا على واتساب
            </a>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" className="rounded-full border-[var(--brand-copper)] px-4 py-2 text-xs font-black text-[var(--brand-plum)]">إدارة المنتجات</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--brand-sand)]">
          <div className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 animate-[float_9s_ease-in-out_infinite] rounded-full bg-[#d9b58c]/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 animate-[float_11s_ease-in-out_infinite_reverse] rounded-full bg-[var(--brand-rose)]/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#3a2730_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[1fr_0.9fr] md:px-8 md:py-24">
            <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10">
              <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--brand-copper)]/30 bg-white/70 px-4 py-2 text-xs font-black text-[#9b6248] shadow-sm backdrop-blur">
                <Sparkles size={14} /> هاند ميد وتطريز يدوي
              </motion.div>
              <motion.h1 variants={fadeUp} className="max-w-xl text-4xl font-black leading-[1.15] tracking-tight md:text-6xl">
                هديتك الأجمل تبدأ من <span className="bg-gradient-to-l from-[var(--brand-rose)] to-[#8e5c46] bg-clip-text text-transparent">تفصيلة</span>.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 max-w-lg text-base leading-8 text-[#6d5c56] md:text-lg">
                هدايا و هاند ميد و تطريز يدوي وباكدجات العرايس
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <a href="#products">
                  <Button className="rounded-full bg-[var(--brand-plum)] px-7 py-6 font-black text-white shadow-lg shadow-[var(--brand-plum)]/20 transition hover:-translate-y-0.5 hover:bg-[#392d4a] hover:shadow-xl">
                    اكتشف المنتجات <ArrowLeft className="mr-2" size={18} />
                  </Button>
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="rounded-full border-[var(--brand-copper)] bg-white/60 px-7 py-6 font-black text-[#8e5c46] backdrop-blur transition hover:-translate-y-0.5">
                    شوف Instagram
                  </Button>
                </a>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6 text-xs font-bold text-[#745f56]">
                <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[var(--brand-rose)]" /> جودة مختارة</span>
                <span className="flex items-center gap-2"><PackageCheck size={18} className="text-[var(--brand-rose)]" /> تغليف هدايا</span>
                <span className="flex items-center gap-2"><Truck size={18} className="text-[var(--brand-rose)]" /> توصيل لباب البيت</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-[#d1b198] to-[#b98d69] shadow-2xl shadow-[#8e5c46]/25" />
              <div className="absolute inset-8 flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/60 bg-white p-6 text-center shadow-xl">
                <img src="/manus-storage/gallery-store-logo-hd_698a1ec8.png" alt="Gallery Store" className="h-full w-full object-cover" />
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-4 rounded-2xl bg-white px-5 py-4 text-sm font-black shadow-xl"
              >
                هدية تفرّح من أول نظرة ✦
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <p className="text-sm font-black text-[var(--brand-rose)]">اختيارات Gallery Store</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">هدايا معمولة عشان تتحب</h2>
            </div>
            <span className="hidden text-sm font-bold text-[#927b71] md:block">اختار هديتك وإحنا نجهزها ونوصلها لباب البيت</span>
          </motion.div>

          {isLoading ? (
            <div className="rounded-3xl bg-white p-12 text-center font-bold text-[#927b71]">بنجهز المنتجات ليكي...</div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d8c4b5] bg-white p-12 text-center">
              <Sparkles className="mx-auto text-[#c58b65]" />
              <h3 className="mt-4 text-xl font-black">الكتالوج بيتجهز</h3>
              <p className="mt-2 text-sm text-[#927b71]">أضيفي أول منتجاتك من لوحة الإدارة عشان تظهر هنا.</p>
              <Link href="/admin">
                <Button className="mt-6 rounded-full bg-[var(--brand-plum)] font-black">دخول لوحة الإدارة</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="group block overflow-hidden rounded-[2rem] border border-[#eadfd3] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[var(--brand-copper)]/40 hover:shadow-2xl hover:shadow-[#8e5c46]/15"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f3ebe4]">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onError={(event) => { event.currentTarget.src = "/manus-storage/gallery-store-logo-hd_698a1ec8.png"; }}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="absolute right-4 top-4 rounded-full bg-[var(--brand-rose)] px-3 py-1 text-xs font-black text-white shadow-md">
                          خصم {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-black">{product.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--brand-muted)]">{product.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-[var(--brand-rose)]">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && <del className="mr-2 text-xs text-[#aa9b94]">{formatPrice(product.compareAtPrice)}</del>}
                        </div>
                        <span className="flex items-center gap-1 text-xs font-black text-[var(--brand-plum)] transition group-hover:gap-2">
                          التفاصيل <ChevronLeft size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Why us */}
        <section id="why" className="relative overflow-hidden bg-gradient-to-b from-[var(--brand-plum)] to-[#2c2337] px-4 py-16 text-white md:py-20">
          <div className="pointer-events-none absolute -left-10 top-10 h-64 w-64 rounded-full bg-[#e2b987]/10 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-7xl"
          >
            <div className="max-w-xl">
              <p className="text-sm font-black text-[#e2b987]">تجربة Gallery Store</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">مش بس هدية… دي ذكرى بتفضل فاكرة.</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Sparkles, title: "هدايا لكل مناسبة", desc: "بوكيهات، تطريز، وباكدجات عروسة بتتفصل بذوقك." },
                { icon: ShieldCheck, title: "شغل هاند ميد", desc: "كل قطعة معمولة بإيدين بتحب التفاصيل وتهتم بالجودة." },
                { icon: PackageCheck, title: "مناسباتك أحلى", desc: "من هدية بسيطة لباكدج عروسة كامل، بنجهزها بمحبة." },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group rounded-3xl border border-white/10 bg-white/10 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e2b987]/15 transition group-hover:scale-110">
                    <Icon className="text-[#e2b987]" size={20} />
                  </div>
                  <h3 className="mt-6 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#eadfd3] bg-[var(--brand-surface)] px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-black">Gallery Store</div>
            <p className="mt-1 text-sm text-[#927b71]">هدايا صغيرة، فرحة كبيرة.</p>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-black text-[#8e5c46] transition hover:text-[var(--brand-rose)]">
            <Instagram size={18} /> @gallery_store16
          </a>
        </div>
      </footer>

      {/* Floating actions */}
      <a href={getWhatsAppContactUrl()} target="_blank" rel="noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#2d9b62] text-white shadow-2xl shadow-[#2d9b62]/30 transition hover:scale-110">
        <MessageCircle size={26} />
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Gallery Store" className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-plum)] text-white shadow-2xl transition hover:scale-110">
        <Instagram size={21} />
      </a>
    </div>
  );
}
