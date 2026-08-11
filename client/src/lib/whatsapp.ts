export const WHATSAPP_NUMBER = "01055700826";
const WHATSAPP_URL_NUMBER = `20${WHATSAPP_NUMBER.slice(1)}`;
export const INSTAGRAM_URL = "https://www.instagram.com/moony_stitch/";

export type OrderDetails = {
  name: string;
  phone: string;
  address: string;
  product: string;
  variant: string;
  quantity: number;
};

export function buildWhatsAppMessage(order: OrderDetails) {
  return [
    "طلب جديد من Moony Stitch",
    "",
    `اسم العميل: ${order.name}`,
    `رقم الهاتف: ${order.phone}`,
    `العنوان: ${order.address}`,
    `المنتج: ${order.product}`,
    `الاختيار: ${order.variant}`,
    `الكمية: ${order.quantity}`,
  ].join("\n");
}

export function getWhatsAppOrderUrl(order: OrderDetails) {
  return `https://wa.me/${WHATSAPP_URL_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}

export function getWhatsAppContactUrl() {
  return `https://wa.me/${WHATSAPP_URL_NUMBER}?text=${encodeURIComponent("مرحبًا، أريد الاستفسار عن منتجات Moony Stitch")}`;
}
