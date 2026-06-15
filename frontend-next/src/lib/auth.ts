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
      defaultAddress {
        id
        address1
        address2
        city
        company
        country
        firstName
        lastName
        phone
        province
        zip
      }
      addresses(first: 20) {
        edges {
          node {
            id
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
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

const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION = `
  mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
    customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function shopifyAddressCreate(accessToken: string, address: any) {
  const res = await shopifyFetch<any>({
    query: CUSTOMER_ADDRESS_CREATE_MUTATION,
    variables: { customerAccessToken: accessToken, address },
    cache: "no-store",
  });
  return res.body.data.customerAddressCreate;
}

export async function shopifyAddressUpdate(accessToken: string, addressId: string, address: any) {
  const res = await shopifyFetch<any>({
    query: CUSTOMER_ADDRESS_UPDATE_MUTATION,
    variables: { customerAccessToken: accessToken, id: addressId, address },
    cache: "no-store",
  });
  return res.body.data.customerAddressUpdate;
}

export async function shopifyAddressDelete(accessToken: string, addressId: string) {
  const res = await shopifyFetch<any>({
    query: CUSTOMER_ADDRESS_DELETE_MUTATION,
    variables: { customerAccessToken: accessToken, id: addressId },
    cache: "no-store",
  });
  return res.body.data.customerAddressDelete;
}

export async function shopifyDefaultAddressUpdate(accessToken: string, addressId: string) {
  const res = await shopifyFetch<any>({
    query: CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION,
    variables: { customerAccessToken: accessToken, addressId },
    cache: "no-store",
  });
  return res.body.data.customerDefaultAddressUpdate;
}

