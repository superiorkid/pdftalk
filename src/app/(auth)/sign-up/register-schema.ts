import z from "zod";
import { loginSchema } from "../sign-in/login-schema";

export const registerSchema = loginSchema
  .omit({ rememberMe: true })
  .extend({
    confirmPassword: z.string().optional(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords not match",
        path: ["confirmPassword"],
      });
    }
  });

export type TRegisterSchema = z.infer<typeof registerSchema>;
