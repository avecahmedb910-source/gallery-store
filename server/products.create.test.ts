import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createProduct: vi.fn().mockResolvedValue(42),
  createOrderIntent: vi.fn(),
  deleteProduct: vi.fn(),
  getProductBySlug: vi.fn(),
  listActiveProducts: vi.fn(),
  listAllProducts: vi.fn(),
  updateProduct: vi.fn(),
}));

import { appRouter } from "./routers";
import { createProduct } from "./db";
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

describe("products.create success", () => {
  it("accepts valid product data and returns the created product id", async () => {
    const product = {
      slug: "gift-box",
      name: "بوكس هدية",
      description: "هدية غير تقليدية ومميزة",
      price: 110,
      compareAtPrice: null,
      images: ["https://example.com/gift-box.jpg"],
      variants: ["اختيار واحد"],
      isActive: true,
    };

    const caller = appRouter.createCaller(adminContext());
    await expect(caller.products.create(product)).resolves.toBe(42);
    expect(createProduct).toHaveBeenCalledWith(product);
  });
});
