"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  shopifyLogin, 
  shopifyRegister, 
  shopifyAdminRegister,
  shopifyGenerateActivationUrl,
  shopifyActivateByUrl,
  shopifyLogout,
  shopifyAddressCreate,
  shopifyAddressUpdate,
  shopifyAddressDelete,
  shopifyDefaultAddressUpdate
} from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendActivationEmail } from "@/lib/mail";
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

    const activationUrlResult = await shopifyGenerateActivationUrl(customerId);
    if (activationUrlResult.userErrors && activationUrlResult.userErrors.length > 0) {
      return { error: activationUrlResult.userErrors[0].message };
    }

    const shopifyActivationUrl = activationUrlResult.accountActivationUrl;
    if (!shopifyActivationUrl) {
      return { error: "Failed to generate account activation link." };
    }

    // Parse customerId and token from Shopify activation URL
    // Format: https://{shop-domain}/account/activate/{customerId}/{token}
    let numericCustomerId = "";
    let activationToken = "";
    try {
      const url = new URL(shopifyActivationUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      const activateIndex = parts.indexOf("activate");
      if (activateIndex !== -1 && parts.length > activateIndex + 2) {
        numericCustomerId = parts[activateIndex + 1];
        activationToken = parts[activateIndex + 2];
      }
    } catch (e) {
      console.error("Error parsing Shopify activation URL:", e);
    }

    if (!numericCustomerId || !activationToken) {
      return { error: "Failed to extract activation parameters." };
    }

    // Build Next.js local activation URL dynamically using the current host
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const localActivationUrl = `${protocol}://${host}/account/activate/${numericCustomerId}/${activationToken}`;

    // Send custom styled activation email via Mailpit
    await sendActivationEmail({
      email,
      firstName,
      activationUrl: localActivationUrl,
    });

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

  } catch (err: any) {
    console.error("Activate Account Action Error:", err);
    return { error: err.message || "Failed to activate account." };
  }

  redirect("/account/login?activated=true");
}
