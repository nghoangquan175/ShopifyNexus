"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  shopifyLogin, 
  shopifyRegister, 
  shopifyAdminRegister,
  shopifySendActivationEmail,
  shopifyActivateByUrl,
  shopifyLogout,
  shopifyAddressCreate,
  shopifyAddressUpdate,
  shopifyAddressDelete,
  shopifyDefaultAddressUpdate
} from "@/lib/auth";
import { revalidatePath } from "next/cache";
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

  if (!firstName || !lastName || !email) {
    return { error: "Please fill out all fields." };
  }

  try {
    const regResult = await shopifyAdminRegister({ firstName, lastName, email });

    if (regResult.userErrors && regResult.userErrors.length > 0) {
      return { error: regResult.userErrors[0].message };
    }

    const customerId = regResult.customer?.id;
    if (!customerId) {
      return { error: "Failed to create customer account." };
    }

    const inviteResult = await shopifySendActivationEmail(customerId);
    if (inviteResult.userErrors && inviteResult.userErrors.length > 0) {
      return { error: inviteResult.userErrors[0].message };
    }

  } catch (err: any) {
    console.error("Register Server Action Error:", err);
    return { error: err.message || "Failed to register." };
  }

  redirect("/account/register-success");
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

export async function createAddressAction(addressInput: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await shopifyAddressCreate(token, addressInput);
    if (res.customerUserErrors && res.customerUserErrors.length > 0) {
      return { error: res.customerUserErrors[0].message };
    }
    revalidatePath("/account");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create address" };
  }
}

export async function updateAddressAction(addressId: string, addressInput: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await shopifyAddressUpdate(token, addressId, addressInput);
    if (res.customerUserErrors && res.customerUserErrors.length > 0) {
      return { error: res.customerUserErrors[0].message };
    }
    revalidatePath("/account");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update address" };
  }
}

export async function deleteAddressAction(addressId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await shopifyAddressDelete(token, addressId);
    if (res.customerUserErrors && res.customerUserErrors.length > 0) {
      return { error: res.customerUserErrors[0].message };
    }
    revalidatePath("/account");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete address" };
  }
}

export async function setDefaultAddressAction(addressId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("shopify_customer_token")?.value;
  if (!token) return { error: "Not authenticated" };

  try {
    const res = await shopifyDefaultAddressUpdate(token, addressId);
    if (res.customerUserErrors && res.customerUserErrors.length > 0) {
      return { error: res.customerUserErrors[0].message };
    }
    revalidatePath("/account");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to set default address" };
  }
}

export async function activateAccountAction(prevState: any, formData: FormData) {
  const customerId = formData.get("customerId") as string;
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!customerId || !token || !password || !confirmPassword) {
    return { error: "Please fill out all fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    if (!domain) {
      throw new Error("Missing SHOPIFY_STORE_DOMAIN in environment variables.");
    }

    const activationUrl = `https://${domain}/account/activate/${customerId}/${token}`;
    const result = await shopifyActivateByUrl(activationUrl, password);

    if (result.customerUserErrors && result.customerUserErrors.length > 0) {
      return { error: result.customerUserErrors[0].message };
    }

    const tokenData = result.customerAccessToken;
    if (!tokenData || !tokenData.accessToken) {
      return { error: "Failed to activate account. No access token received." };
    }

    // Set cookie to log them in automatically
    const cookieStore = await cookies();
    cookieStore.set("shopify_customer_token", tokenData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(tokenData.expiresAt),
      path: "/",
      sameSite: "lax",
    });

  } catch (err: any) {
    console.error("Activate Account Action Error:", err);
    return { error: err.message || "Failed to activate account." };
  }

  redirect("/account");
}
