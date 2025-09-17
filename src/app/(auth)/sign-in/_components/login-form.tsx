"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type TLoginSchema } from "../login-schema";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (values: TLoginSchema) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      },
      {
        onRequest() {
          setIsSubmitting(true);
        },
        onSuccess() {
          setIsSubmitting(false);
          toast.success("Welcome Back!", {
            description: "You have signed in successfully",
          });
          router.push("/");
        },
        onError(ctx) {
          setIsSubmitting(false);
          toast.error("Sign In Failed", {
            description: ctx.error.message || "Invalid credentials. Try again.",
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* --- Email Field --- */}
        <FormField
          control={form.control}
          name="email"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Password Field --- */}
        <FormField
          control={form.control}
          name="password"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Remember Me --- */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormLabel
                htmlFor="rememberMe"
                className="text-sm font-normal leading-none"
              >
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        {/* --- Submit Button --- */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2Icon size={16} strokeWidth={2} className="animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
