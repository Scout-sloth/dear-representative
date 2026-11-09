import type {Legislator, State} from '../../types';

export const oregon: State = {code: 'OR', name: 'Oregon'};

// Source verification is independent of form functionality. No test messages were sent.
export const officials: Legislator[] = [
  {
    "id": "wyden",
    "socialAccounts": [
      {
        "id": "wyden-bluesky",
        "platform": "bluesky",
        "accountType": "official-office",
        "handle": "wyden.senate.gov",
        "profileUrl": "https://bsky.app/profile/wyden.senate.gov",
        "status": "verified",
        "sourceUrls": [
          "https://www.wyden.senate.gov/news"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Ron Wyden",
    "salutation": "Senator Wyden",
    "state": "OR",
    "chamber": "senate",
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://www.wyden.senate.gov/contact/email-ron",
        "status": "verified",
        "sourceUrls": [
          "https://www.wyden.senate.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "could-not-test",
          "checkedAt": "2026-11-08",
          "notes": "The official form entry page was readable, but the correspondence form was not available in the retrieved content. No interaction or submission was tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022245244",
        "status": "verified",
        "sourceUrls": [
          "https://www.wyden.senate.gov/contact/office-locations",
          "https://www.senate.gov/states/OR/intro.htm"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://www.wyden.senate.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.senate.gov/states/OR/intro.htm"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://www.wyden.senate.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.senate.gov/states/OR/intro.htm"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://www.wyden.senate.gov/contact",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "merkley",
    "socialAccounts": [
      {
        "id": "merkley-x",
        "platform": "x",
        "accountType": "official-office",
        "handle": "SenJeffMerkley",
        "profileUrl": "https://x.com/SenJeffMerkley",
        "status": "verified",
        "sourceUrls": [
          "https://www.merkley.senate.gov/connect/follow-jeff/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Jeff Merkley",
    "salutation": "Senator Merkley",
    "state": "OR",
    "chamber": "senate",
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://www.merkley.senate.gov/connect/contact/",
        "status": "verified",
        "sourceUrls": [
          "https://www.merkley.senate.gov/connect/contact/"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "not-tested",
          "checkedAt": "2026-11-08",
          "notes": "Published form fields were inspected read-only. Validation and submission were not tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022243753",
        "status": "verified",
        "sourceUrls": [
          "https://www.merkley.senate.gov/connect/office-locations/",
          "https://www.senate.gov/states/OR/intro.htm"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://www.merkley.senate.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.senate.gov/states/OR/intro.htm"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://www.merkley.senate.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.senate.gov/states/OR/intro.htm"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "other",
        "effect": "required-information",
        "appliesTo": [
          "form"
        ],
        "description": "The form requires an address, including state and ZIP code. This does not establish a residency-based response policy.",
        "status": "verified",
        "sourceUrl": "https://www.merkley.senate.gov/connect/contact/",
        "lastVerified": "2026-11-08"
      },
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://www.merkley.senate.gov/connect/contact/",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "bonamici",
    "socialAccounts": [
      {
        "id": "bonamici-bluesky",
        "platform": "bluesky",
        "accountType": "official-office",
        "handle": "repbonamici.bsky.social",
        "profileUrl": "https://bsky.app/profile/repbonamici.bsky.social",
        "status": "verified",
        "sourceUrls": [
          "https://bonamici.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Suzanne Bonamici",
    "salutation": "Representative Bonamici",
    "state": "OR",
    "chamber": "house",
    "district": 1,
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://bonamici.house.gov/contact/email",
        "status": "verified",
        "sourceUrls": [
          "https://bonamici.house.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "could-not-test",
          "checkedAt": "2026-11-08",
          "notes": "The official contact page links to this form. The form controls were not available in the retrieved content. No interaction or submission was tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022250855",
        "status": "verified",
        "sourceUrls": [
          "https://bonamici.house.gov/contact",
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://bonamici.house.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://bonamici.house.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.house.gov/representatives"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://bonamici.house.gov/contact",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "bentz",
    "socialAccounts": [
      {
        "id": "bentz-x",
        "platform": "x",
        "accountType": "official-office",
        "handle": "RepBentz",
        "profileUrl": "https://x.com/RepBentz",
        "status": "verified",
        "sourceUrls": [
          "https://bentz.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Cliff Bentz",
    "salutation": "Representative Bentz",
    "state": "OR",
    "chamber": "house",
    "district": 2,
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://bentz.house.gov/contact",
        "status": "verified",
        "sourceUrls": [
          "https://bentz.house.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "not-tested",
          "checkedAt": "2026-11-08",
          "notes": "Published contact instructions and form markup were inspected read-only. Validation and submission were not tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022256730",
        "status": "verified",
        "sourceUrls": [
          "https://bentz.house.gov/contact",
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://bentz.house.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://bentz.house.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.house.gov/representatives"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "other",
        "effect": "required-information",
        "appliesTo": [
          "form"
        ],
        "description": "The contact page instructs visitors to enter a ZIP code to email the office. This alone does not establish a district-based submission block or response policy.",
        "status": "verified",
        "sourceUrl": "https://bentz.house.gov/contact",
        "lastVerified": "2026-11-08"
      },
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://bentz.house.gov/contact",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "dexter",
    "socialAccounts": [
      {
        "id": "dexter-bluesky",
        "platform": "bluesky",
        "accountType": "official-office",
        "handle": "repdexteror.bsky.social",
        "profileUrl": "https://bsky.app/profile/repdexteror.bsky.social",
        "status": "verified",
        "sourceUrls": [
          "https://dexter.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      },
      {
        "id": "dexter-x",
        "platform": "x",
        "accountType": "official-office",
        "handle": "repdexteror",
        "profileUrl": "https://x.com/repdexteror",
        "status": "verified",
        "sourceUrls": [
          "https://dexter.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Maxine Dexter",
    "salutation": "Representative Dexter",
    "state": "OR",
    "chamber": "house",
    "district": 3,
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://dexter.house.gov/contact/email-me",
        "status": "verified",
        "sourceUrls": [
          "https://dexter.house.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "not-tested",
          "checkedAt": "2026-11-08",
          "notes": "Published form fields were inspected read-only. Validation and submission were not tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022254811",
        "status": "verified",
        "sourceUrls": [
          "https://dexter.house.gov/contact",
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://dexter.house.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://dexter.house.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.house.gov/representatives"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://dexter.house.gov/contact",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "hoyle",
    "socialAccounts": [
      {
        "id": "hoyle-bluesky",
        "platform": "bluesky",
        "accountType": "official-office",
        "handle": "repvalhoyle.bsky.social",
        "profileUrl": "https://bsky.app/profile/repvalhoyle.bsky.social",
        "status": "verified",
        "sourceUrls": [
          "https://hoyle.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      },
      {
        "id": "hoyle-x",
        "platform": "x",
        "accountType": "official-office",
        "handle": "RepValHoyle",
        "profileUrl": "https://x.com/RepValHoyle",
        "status": "verified",
        "sourceUrls": [
          "https://hoyle.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Val Hoyle",
    "salutation": "Representative Hoyle",
    "state": "OR",
    "chamber": "house",
    "district": 4,
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://hoyle.house.gov/contact/email-val?clear=",
        "status": "verified",
        "sourceUrls": [
          "https://hoyle.house.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "could-not-test",
          "checkedAt": "2026-11-08",
          "notes": "The official contact page links to this form. The embedded form was not available in the retrieved content. No interaction or submission was tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022256416",
        "status": "verified",
        "sourceUrls": [
          "https://hoyle.house.gov/",
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://hoyle.house.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://hoyle.house.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.house.gov/representatives"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://hoyle.house.gov/contact",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "bynum",
    "socialAccounts": [
      {
        "id": "bynum-bluesky",
        "platform": "bluesky",
        "accountType": "official-office",
        "handle": "bynum.house.gov",
        "profileUrl": "https://bsky.app/profile/bynum.house.gov",
        "status": "verified",
        "sourceUrls": [
          "https://bynum.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      },
      {
        "id": "bynum-x",
        "platform": "x",
        "accountType": "official-office",
        "handle": "repbynum",
        "profileUrl": "https://x.com/repbynum",
        "status": "verified",
        "sourceUrls": [
          "https://bynum.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Janelle Bynum",
    "salutation": "Representative Bynum",
    "state": "OR",
    "chamber": "house",
    "district": 5,
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://bynum.house.gov/contact/email-me",
        "status": "verified",
        "sourceUrls": [
          "https://bynum.house.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "could-not-test",
          "checkedAt": "2026-11-08",
          "notes": "The address-verification entry page was inspected read-only. The next step could not be inspected without constituent information; validation and submission were not tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022255711",
        "status": "verified",
        "sourceUrls": [
          "https://bynum.house.gov/contact",
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://bynum.house.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://bynum.house.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.house.gov/representatives"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "address-verification",
        "effect": "verification-step",
        "appliesTo": [
          "form"
        ],
        "description": "The contact form asks you to verify an address within the district before continuing.",
        "status": "verified",
        "sourceUrl": "https://bynum.house.gov/contact/email-me",
        "lastVerified": "2026-11-08"
      },
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://bynum.house.gov/contact",
        "lastVerified": null
      }
    ]
  },
  {
    "id": "salinas",
    "socialAccounts": [
      {
        "id": "salinas-bluesky",
        "platform": "bluesky",
        "accountType": "official-office",
        "handle": "salinas.house.gov",
        "profileUrl": "https://bsky.app/profile/salinas.house.gov",
        "status": "verified",
        "sourceUrls": [
          "https://salinas.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      },
      {
        "id": "salinas-x",
        "platform": "x",
        "accountType": "official-office",
        "handle": "repsalinas",
        "profileUrl": "https://x.com/repsalinas",
        "status": "verified",
        "sourceUrls": [
          "https://salinas.house.gov/"
        ],
        "lastVerified": "2026-11-09"
      }
    ],
    "name": "Andrea Salinas",
    "salutation": "Representative Salinas",
    "state": "OR",
    "chamber": "house",
    "district": 6,
    "contacts": [
      {
        "id": "form",
        "kind": "contact-form",
        "url": "https://salinas.house.gov/contact",
        "status": "verified",
        "sourceUrls": [
          "https://salinas.house.gov/contact"
        ],
        "lastVerified": "2026-11-08",
        "functionality": {
          "status": "could-not-test",
          "checkedAt": "2026-11-08",
          "notes": "The address-verification entry page was inspected read-only. The next step could not be inspected without constituent information; validation and submission were not tested."
        }
      },
      {
        "id": "dc-phone",
        "kind": "phone",
        "office": "washington-dc",
        "number": "+12022255643",
        "status": "verified",
        "sourceUrls": [
          "https://salinas.house.gov/contact",
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      },
      {
        "id": "website",
        "kind": "website",
        "url": "https://salinas.house.gov/",
        "status": "verified",
        "sourceUrls": [
          "https://www.house.gov/representatives"
        ],
        "lastVerified": "2026-11-08"
      }
    ],
    "websiteUrl": "https://salinas.house.gov/",
    "identityVerification": {
      "status": "verified",
      "sourceUrls": [
        "https://www.house.gov/representatives"
      ],
      "lastVerified": "2026-11-08"
    },
    "contactRestrictions": [
      {
        "type": "address-verification",
        "effect": "verification-step",
        "appliesTo": [
          "form"
        ],
        "description": "The contact form asks you to verify an address within the district before continuing.",
        "status": "verified",
        "sourceUrl": "https://salinas.house.gov/contact",
        "lastVerified": "2026-11-08"
      },
      {
        "type": "unknown-policy",
        "effect": "unknown",
        "appliesTo": [
          "form",
          "dc-phone"
        ],
        "description": "A residency-based response policy for correspondence and phone calls has not been established from the reviewed sources.",
        "status": "unknown",
        "sourceUrl": "https://salinas.house.gov/contact",
        "lastVerified": null
      }
    ]
  }
];
