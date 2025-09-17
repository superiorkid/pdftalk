import z from "zod";

export const loginSchema = z.object({
  email: z.email().min(1, { error: "email is required" }),
  password: z.string().min(6),
  rememberMe: z.boolean(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
