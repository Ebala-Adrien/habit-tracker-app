const test = {
  _redirectEventId: undefined,
  apiKey: "_____",
  appName: "[DEFAULT]",
  createdAt: "1734385563685",
  displayName: undefined,
  email: "adrien@test.com",
  emailVerified: false,
  isAnonymous: false,
  lastLoginAt: "1734385563685",
  phoneNumber: undefined,
  photoURL: undefined,
  providerData: [[Object]],
  stsTokenManager: {
    accessToken: "__________",
    expirationTime: 1734389164501,
    refreshToken: "_________",
  },
  tenantId: undefined,
  uid: "__________",
};

const test2 = {
  user: {
    uid: "---",
    email: "ebala.adrien@gmail.com",
    emailVerified: false,
    isAnonymous: false,
    providerData: [
      {
        providerId: "password",
        uid: "ebala.adrien@gmail.com",
        displayName: null,
        email: "ebala.adrien@gmail.com",
        phoneNumber: null,
        photoURL: null,
      },
    ],
    stsTokenManager: {
      refreshToken: "---------",
      accessToken: "---------",
      expirationTime: 1734396064205,
    },
    createdAt: "1734392043413",
    lastLoginAt: "1734392464309",
    apiKey: "--------",
    appName: "[DEFAULT]",
  },
  providerId: null,
  _tokenResponse: {
    kind: "identitytoolkit#VerifyPasswordResponse",
    localId: "-----------",
    email: "ebala.adrien@gmail.com",
    displayName: "",
    idToken: "--------",
    registered: true,
    refreshToken: "----------",
    expiresIn: "3600",
  },
  operationType: "signIn",
};
