import { shopifyFetch } from "./shopify";

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_BUYER_IDENTITY_UPDATE_MUTATION = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 20) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                product {
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function shopifyCreateCart(variantId: string, quantity: number, customerAccessToken?: string) {
  const buyerIdentity = customerAccessToken ? { customerAccessToken } : undefined;
  const res = await shopifyFetch<any>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
        buyerIdentity,
      },
    },
    cache: "no-store",
  });
  return res.body.data.cartCreate;
}

export async function shopifyCreateCartWithMultipleLines(lines: { variantId: string; quantity: number }[], customerAccessToken?: string) {
  const buyerIdentity = customerAccessToken ? { customerAccessToken } : undefined;
  const res = await shopifyFetch<any>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: lines.map(line => ({ merchandiseId: line.variantId, quantity: line.quantity })),
        buyerIdentity,
      },
    },
    cache: "no-store",
  });
  return res.body.data.cartCreate;
}

export async function shopifyAddLinesToCart(cartId: string, variantId: string, quantity: number) {
  const res = await shopifyFetch<any>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: "no-store",
  });
  return res.body.data.cartLinesAdd;
}

export async function shopifyAddMultipleLinesToCart(cartId: string, lines: { variantId: string; quantity: number }[]) {
  const res = await shopifyFetch<any>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: lines.map(line => ({ merchandiseId: line.variantId, quantity: line.quantity })),
    },
    cache: "no-store",
  });
  return res.body.data.cartLinesAdd;
}

export async function shopifyUpdateCartLine(cartId: string, lineId: string, quantity: number) {
  const res = await shopifyFetch<any>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: "no-store",
  });
  return res.body.data.cartLinesUpdate;
}

export async function shopifyRemoveCartLine(cartId: string, lineId: string) {
  const res = await shopifyFetch<any>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    cache: "no-store",
  });
  return res.body.data.cartLinesRemove;
}

export async function shopifyGetCart(cartId: string) {
  try {
    const res = await shopifyFetch<any>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: "no-store",
    });
    return res.body.data?.cart || null;
  } catch (err) {
    console.error("Error fetching shopify cart:", err);
    return null;
  }
}

export async function shopifyUpdateCartBuyer(cartId: string, customerAccessToken: string) {
  const res = await shopifyFetch<any>({
    query: CART_BUYER_IDENTITY_UPDATE_MUTATION,
    variables: {
      cartId,
      buyerIdentity: { customerAccessToken },
    },
    cache: "no-store",
  });
  return res.body.data.cartBuyerIdentityUpdate;
}
