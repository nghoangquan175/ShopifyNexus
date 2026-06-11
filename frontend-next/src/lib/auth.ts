import { shopifyFetch } from "./shopify";

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_DETAILS_QUERY = `
  query getCustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      orders(first: 5) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            financialStatus
            fulfillmentStatus
          }
        }
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

export async function shopifyRegister(variables: any) {
  const res = await shopifyFetch<any>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input: variables },
    cache: "no-store",
  });
  return res.body.data.customerCreate;
}

export async function shopifyLogin(variables: any) {
  const res = await shopifyFetch<any>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input: variables },
    cache: "no-store",
  });
  return res.body.data.customerAccessTokenCreate;
}

export async function shopifyGetCustomer(accessToken: string) {
  try {
    const res = await shopifyFetch<any>({
      query: CUSTOMER_DETAILS_QUERY,
      variables: { customerAccessToken: accessToken },
      cache: "no-store",
    });
    return res.body.data?.customer || null;
  } catch (err) {
    console.error("Error fetching shopify customer details:", err);
    return null;
  }
}

export async function shopifyLogout(accessToken: string) {
  try {
    await shopifyFetch<any>({
      query: CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
      variables: { customerAccessToken: accessToken },
      cache: "no-store",
    });
  } catch (err) {
    console.error("Error deleting shopify access token:", err);
  }
}
