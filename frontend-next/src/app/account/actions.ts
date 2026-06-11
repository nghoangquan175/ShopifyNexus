"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyLogin, shopifyRegister, shopifyLogout } from "@/lib/auth";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  try {
    const result = await shopifyLogin({ email, password });

    if (result.customerUserErrors && result.customerUserErrors.length > 0) {
      return { error: result.customerUserErrors[0].message };
    }

    const tokenData = result.customerAccessToken;
    if (!tokenData || !tokenData.accessToken) {
      return { error: "Invalid login credentials." };
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("shopify_customer_token", tokenData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(tokenData.expiresAt),
      path: "/",
      sameSite: "lax",
    });
  } catch (err: any) {
    console.error("Login Server Action Error:", err);
    return { error: err.message || "Failed to log in." };
  }

  const redirectPath = (formData.get("redirect") as string) || "/account";
  redirect(redirectPath);
}

export async function registerAction(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    return { error: "Please fill out all fields." };
  }

  try {
    const regResult = await shopifyRegister({ firstName, lastName, email, password });

    if (regResult.customerUserErrors && regResult.customerUserErrors.length > 0) {
      return { error: regResult.customerUserErrors[0].message };
    }

    // Auto-login after registration
    const loginResult = await shopifyLogin({ email, password });

    if (loginResult.customerUserErrors && loginResult.customerUserErrors.length > 0) {
      return { success: true, redirect: "/account/login" };
    }

    const tokenData = loginResult.customerAccessToken;
    if (tokenData && tokenData.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("shopify_customer_token", tokenData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(tokenData.expiresAt),
        path: "/",
        sameSite: "lax",
      });
    }
  } catch (err: any) {
    console.error("Register Server Action Error:", err);
    return { error: err.message || "Failed to register." };
  }

  const redirectPath = (formData.get("redirect") as string) || "/account";
  redirect(redirectPath);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;

  if (token) {
    await shopifyLogout(token);
    cookieStore.delete("shopify_customer_token");
  }

  redirect("/");
}
