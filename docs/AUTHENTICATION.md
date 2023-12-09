# Authentication

We use JWT for uesr authentication. Normally when calling an identity-related API you will receive a response data structure

```json
{
  "userId": "string",
  "token": "string",
  // ISO standard date string
  "issuedAt": "2023-12-09T08:40:47.356Z",
  "expiresAt": "2023-12-09T08:40:47.356Z"
}
```

The property `token` is a jwt string, you can decode it and get its string array property `role`, which contains one or more roles

## Role type

- ROLE_ADMIN
- ROLE_CUSTOMER
- ROLE_CHANGE_PASSWORD
- ROLE_VERIFY_EMAIL

## Update user identify status

If you have a identity-related API response and are **sure** you want to update user status within application, you need to use them to set **cookie**

- Name &#8594; stable string **userToken**
- Value &#8594; property `token`
- Expires &#8594; property `expiresAt`
- Path &#8594; /

You can use a [custom hook](../src/hooks//useUserTokenCookie.ts) to achieve above operations, it provides get, set and delete function to userToken cookie
