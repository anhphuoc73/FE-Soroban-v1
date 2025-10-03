// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  REPORT: '/report',
  FINGER_MATH:'/fingermath',
  SOROBAN:'/soroban',
  FRANCHISE:'/franchise',
  GUIDE: '/guide',
  CONFIG: '/config',
  CONTENT: '/content',
  CHAT: '/chat',
  CUSTOMER: '/customer',
  TICKET: '/ticket',
  OTT: '/ott',
  ADMIN: '/admin',
  CENTER: '/center',
  USER: '/user',
  CLASS: '/class',

  // endpoint
  SAVED_CONTACTS: '/saved-contacts',
  TEMPORARY_CONTACTS: '/temporary-contacts',
  EDIT_TICKET: '/edit-ticket',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // Content Page
  content: {
    root: ROOTS.CONTENT,
    fingermath: `${ROOTS.CONTENT}${ROOTS.FINGER_MATH}`,
    franchise: `${ROOTS.CONTENT}${ROOTS.FRANCHISE}`,
    soroban: `${ROOTS.CONTENT}${ROOTS.SOROBAN}`,
    guide: `${ROOTS.CONTENT}${ROOTS.GUIDE}`,
    // center: `${ROOTS.CONTENT}${ROOTS.CENTER}`,
    // class: `${ROOTS.CONTENT}${ROOTS.CLASS}`,
    user: `${ROOTS.CONTENT}${ROOTS.USER}`,
    // admin: `${ROOTS.CONTENT}${ROOTS.ADMIN}`,
    customer: {
      root: `${ROOTS.CONTENT}${ROOTS.CUSTOMER}`,
      savedContacts: `${ROOTS.CONTENT}${ROOTS.CUSTOMER}${ROOTS.SAVED_CONTACTS}`,
      temporaryContacts: `${ROOTS.CONTENT}${ROOTS.CUSTOMER}${ROOTS.TEMPORARY_CONTACTS}`
    },
    config: {
      root: `${ROOTS.CONTENT}${ROOTS.CONFIG}`,
      permission: `${ROOTS.CONTENT}${ROOTS.CONFIG}/permission`,
      staffGroup: `${ROOTS.CONTENT}${ROOTS.CONFIG}/staff-group`,
      staff: `${ROOTS.CONTENT}${ROOTS.CONFIG}/staff`,
      interactiveChannel: `${ROOTS.CONTENT}${ROOTS.CONFIG}/interactive-channel`,
      templateMessage: `${ROOTS.CONTENT}${ROOTS.CONFIG}/template-message`,
      conversationDistribution: `${ROOTS.CONTENT}${ROOTS.CONFIG}/conversation-distribution`,
      conversationTag: `${ROOTS.CONTENT}${ROOTS.CONFIG}/conversation-tag`,
      chatWindow: `${ROOTS.CONTENT}${ROOTS.CONFIG}/chat-window`,
      webIntegration: `${ROOTS.CONTENT}${ROOTS.CONFIG}/web-integration`,
      dataField: `${ROOTS.CONTENT}${ROOTS.CONFIG}/data-field`,
      smsZnsTemplate: `${ROOTS.CONTENT}${ROOTS.CONFIG}/sms-zns-template`,
      branchDevice: `${ROOTS.CONTENT}${ROOTS.CONFIG}/branch-device`,
    },
  },
};
