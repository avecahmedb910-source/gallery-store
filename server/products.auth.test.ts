import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function regularUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const product = {
  slug: "sample-product",
  name: "منتج تجريبي",
  description: "وصف تجريبي",
  price: 100,
  compareAtPrice: 120,
  images: ["https://example.com/sample.jpg"],
  variants: ["بيج"],
  isActive: true,
};

describe("products admin authorization", () => {
  it("rejects a regular user from every admin product operation", async () => {
    const caller = appRouter.createCaller(regularUserContext());
    await expect(caller.products.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.products.create(product)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.products.update({ id: 1, ...product })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.products.delete({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.products.uploadImage({ fileName: "sample.jpg", contentType: "image/jpeg", dataUrl: "data:image/jpeg;base64,AA==" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
