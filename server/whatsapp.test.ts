import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, getWhatsAppOrderUrl, WHATSAPP_NUMBER } from "../client/src/lib/whatsapp";

describe("Gallery Store WhatsApp orders", () => {
  it("includes every required order detail", () => {
    const message = buildWhatsAppMessage({
      name: "سارة علي",
      phone: "01000000000",
      address: "القاهرة، مدينة نصر",
      product: "شنطة هاند ميد",
      variant: "بيج",
      quantity: 2,
    });
    expect(message).toContain("طلب جديد من Gallery Store");
    expect(message).not.toContain("Moony Stitch");
    expect(message).toContain("اسم العميل: سارة علي");
    expect(message).toContain("رقم الهاتف: 01000000000");
    expect(message).toContain("العنوان: القاهرة، مدينة نصر");
    expect(message).toContain("المنتج: شنطة هاند ميد");
    expect(message).toContain("الاختيار: بيج");
    expect(message).toContain("الكمية: 2");
  });

  it("targets the configured WhatsApp number", () => {
    const url = getWhatsAppOrderUrl({ name: "A", phone: "B", address: "C", product: "D", variant: "E", quantity: 1 });
    expect(WHATSAPP_NUMBER).toBe("01055700826");
    expect(url).toContain("wa.me/201055700826");
    expect(url).toContain("text=");
  });
});
