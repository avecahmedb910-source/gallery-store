import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  listActiveProducts,
  listAllProducts,
  updateProduct,
} from "./db";
import { storagePut } from "./storage";

const productInput = z.object({
  slug: z.string().min(2).max(180),
  name: z.string().min(2).max(220),
  description: z.string().min(2),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable().optional(),
  images: z.array(z.string().url()).min(1),
  variants: z.array(z.string().min(1)).min(1),
  isActive: z.boolean().default(true),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  products: router({
    list: publicProcedure.query(() => listActiveProducts()),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getProductBySlug(input.slug)),
    adminList: adminProcedure.query(() => listAllProducts()),
    create: adminProcedure.input(productInput).mutation(({ input }) => createProduct(input)),
    update: adminProcedure.input(productInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
      const { id, ...values } = input;
      return updateProduct(id, values);
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteProduct(input.id)),
    uploadImage: adminProcedure.input(z.object({
      fileName: z.string().min(1).max(180),
      contentType: z.string().regex(/^image\//),
      dataUrl: z.string().startsWith("data:image/"),
    })).mutation(async ({ input, ctx }) => {
      const [, encoded] = input.dataUrl.split(",");
      if (!encoded) throw new Error("صورة غير صالحة");
      const buffer = Buffer.from(encoded, "base64");
      const uploaded = await storagePut(`moony-stitch/${ctx.user.id}/${input.fileName}`, buffer, input.contentType);
      return uploaded.url;
    }),
  }),
});

export type AppRouter = typeof appRouter;
