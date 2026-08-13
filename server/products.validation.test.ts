import { describe, expect, it } from "vitest";
import { appRouter, normalizeUploadedFileName } from "./routers";
import type { TrpcContext } from "./_core/context";

function adminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Gallery Store Admin",
      loginMethod: "test",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("product image upload normalization", () => {
  it("uses a safe stable filename while preserving the image extension", () => {
    expect(normalizeUploadedFileName("WhatsApp Image 2026-08-13 at 3.58.11 AM.jpeg")).toBe("product-image.jpeg");
    expect(normalizeUploadedFileName("photo")).toBe("product-image.jpg");
  });
});

describe("products.create validation", () => {
  it("rejects a product without an image before touching the database", async () => {
    const caller = appRouter.createCaller(adminContext());

    await expect(caller.products.create({
      slug: "gift-box",
      name: "بوكس هدية",
      description: "هدية غير تقليدية ومميزة",
      price: 110,
      compareAtPrice: null,
      images: [],
      variants: ["اختيار واحد"],
      isActive: true,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
