import React from 'react'

const LAST_UPDATED = '31 October 2026'
const COMPANY = 'ExportYard'
const SITE = 'exportyard.com'
const SITE_URL = 'https://exportyard.com'
const EMAIL = 'support@exportyard.com' // TODO: must be a real, monitored address
const LOCATION = 'Mumbai, Maharashtra, India'

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: [
      `${COMPANY} ("we", "us", "our") operates the website ${SITE} (the "Service"), through which businesses can learn about and enquire for our bottled mineral water export services. This Privacy Policy explains what personal information we collect, how we use, share, store and protect it, how long we keep it, and the choices you have. By using the Service you agree to this policy.`,
      `This policy is intended to comply with applicable Indian law, including the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000, and with the Google API Services User Data Policy where you choose to sign in with Google.`,
    ],
  },
  {
    id: 'collect',
    title: '2. Information We Collect',
    body: ['We collect the following categories of information:'],
    list: [
      'Information you provide: name, company name, email address, phone or WhatsApp number, country, and enquiry details such as product type, bottle size, quantity, destination port and any message you send.',
      'Order and shipping information: billing and delivery addresses, import registration or tax numbers, and documents required for shipping, customs and payment.',
      'Google account information (only if you choose "Sign in with Google"): your name, email address and profile picture, as described in Section 3.',
      'Automatically collected information: IP address, browser type, device information, pages visited and time spent, collected through server logs and cookies.',
    ],
  },
  {
    id: 'google',
    title: '3. Google User Data',
    body: [
      `If you choose to sign in to ${COMPANY} with your Google account, we request access to the following Google user data through Google OAuth:`,
    ],
    list: [
      'Your email address (scope: userinfo.email) - used to create and identify your account and to contact you about your enquiries and orders.',
      'Your basic profile information: name and profile picture (scope: userinfo.profile) - used to personalise your account and address you correctly.',
      'Your Google account identifier (scope: openid) - used to recognise you when you sign in again.',
    ],
    after: [
      'How we use Google user data: only to provide and improve the user-facing features of the Service that you request, namely authenticating you, creating and managing your account, and communicating with you about your enquiries and orders. We do not access your Gmail messages, contacts, calendar, Drive files or any other Google data.',
      'How we share Google user data: we do not sell, rent or transfer Google user data to third parties, and we do not use it for advertising, including personalised, retargeted or interest-based advertising. We disclose it only where necessary to provide the Service you requested (for example, to our hosting provider that stores it on our behalf), to comply with applicable law, or as part of a merger or acquisition with notice to you.',
      'No human access and no AI training: our staff do not read your Google user data unless you give us explicit permission for a specific purpose, it is necessary for security or abuse investigation, or it is required by law. We do not use Google user data to develop, improve or train generalised artificial intelligence or machine learning models.',
      'How we store and protect Google user data: it is stored in an access-controlled database on secured servers, transmitted over HTTPS, and accessible only to authorised personnel who need it to operate the Service. We do not store Google passwords. Our application never sees your Google password.',
      'Retention and deletion: we keep Google user data only while your account is active. You can ask us to delete your account and all associated Google user data at any time by emailing us (see Section 10); we will delete it within 30 days, except where we must keep limited records to meet legal obligations.',
      'Revoking access: you can withdraw our access to your Google account at any time at https://myaccount.google.com/permissions.',
      `${COMPANY}'s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy (https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.`,
    ],
  },
  {
    id: 'use',
    title: '4. How We Use Your Information',
    list: [
      'To respond to enquiries and prepare quotations.',
      'To create and manage your account and authenticate you.',
      'To process orders and arrange shipping, customs documentation and payments.',
      'To communicate with you about your enquiry, order or account.',
      'To maintain the security of the Service and prevent fraud or abuse.',
      'To improve our website, products and services.',
      'To comply with legal, tax, export and customs obligations.',
      'To send updates about our products, only where you have agreed or where the law permits. You can opt out at any time.',
    ],
  },
  {
    id: 'cookies',
    title: '5. Cookies & Similar Technologies',
    body: [
      'We use cookies and similar technologies to keep you signed in, remember your preferences, keep the Service secure and understand how visitors use it. You can block or delete cookies in your browser settings, but parts of the Service may then not work properly.',
    ],
  },
  {
    id: 'sharing',
    title: '6. Sharing of Information',
    body: [
      'We do not sell your personal information. We share it only where needed to deliver our services, with:',
    ],
    list: [
      'Freight forwarders, shipping lines, customs agents and logistics partners handling your order.',
      'Banks and payment providers that process payments.',
      'Hosting, email and analytics service providers who process data on our behalf and are bound to protect it.',
      'Government or regulatory authorities where required by law.',
    ],
    after: [
      'Sharing of Google user data is limited as described in Section 3.',
    ],
  },
  {
    id: 'international',
    title: '7. International Transfers',
    body: [
      'We serve buyers in many countries. Your information may be stored and processed in India and, where needed to complete your order, shared with partners in other countries. We take reasonable steps to ensure such partners protect your information.',
    ],
  },
  {
    id: 'retention',
    title: '8. Data Retention',
    list: [
      'Enquiry and contact details: kept for up to 24 months after our last communication, then deleted or anonymised.',
      'Order, invoice and shipping records: kept for the period required by Indian tax, accounting and customs law (typically 6 to 8 years).',
      'Account data, including Google user data: kept while your account is active and deleted within 30 days of a verified deletion request.',
      'Server logs: kept for up to 90 days.',
    ],
  },
  {
    id: 'security',
    title: '9. Data Security',
    body: [
      'We use reasonable technical and organisational safeguards, including encrypted connections (HTTPS), access controls and secured hosting, to protect your information from unauthorised access, loss, alteration or misuse. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. If a breach affecting your data occurs, we will notify you and the authorities as required by law.',
    ],
  },
  {
    id: 'rights',
    title: '10. Your Rights & How to Delete Your Data',
    body: ['Subject to applicable law, you may ask us to:'],
    list: [
      'Tell you what personal information we hold about you and how it is used.',
      'Correct inaccurate or incomplete information.',
      'Delete your personal information and account, including any Google user data.',
      'Withdraw your consent or stop sending you marketing communications.',
    ],
    after: [
      `To make a request, email ${EMAIL} from the address linked to your account with the subject "Privacy request". We may need to verify your identity and will respond within 30 days.`,
    ],
  },
  {
    id: 'third-party',
    title: '11. Third-Party Links',
    body: [
      'The Service may link to third-party sites. We are not responsible for their content or privacy practices, so please read their policies separately.',
    ],
  },
  {
    id: 'children',
    title: "12. Children's Privacy",
    body: [
      'The Service is intended for businesses and adults. We do not knowingly collect personal information from anyone under 18. If you believe a child has given us information, contact us and we will delete it.',
    ],
  },
  {
    id: 'changes',
    title: '13. Changes to This Policy',
    body: [
      'We may update this policy from time to time. The latest version is always available at this page with its updated date. If we make material changes, including to how we use Google user data, we will notify you by email or a notice on the Service before they take effect.',
    ],
  },
]

const Privacy = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <section className="bg-gradient-to-b from-sky-900 to-sky-700 px-4 py-14 text-center text-white sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-sky-100 sm:text-base">
          {COMPANY} &middot;{' '}
          <a href={SITE_URL} className="underline">
            {SITE}
          </a>{' '}
          &middot; Last updated: {LAST_UPDATED}
        </p>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:py-14">
        {/* Table of contents (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              On this page
            </h2>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-slate-600 transition-colors hover:text-sky-700"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <article className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-8 scroll-mt-24">
              <h2 className="mb-3 text-xl font-semibold text-slate-900">
                {s.title}
              </h2>
              {s.body?.map((p, i) => (
                <p key={i} className="mb-3 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="list-disc space-y-2 pl-5 text-slate-600">
                  {s.list.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* Contact */}
          <section className="mt-10 rounded-lg bg-sky-50 p-5">
            <h2 className="mb-1 text-lg font-semibold text-sky-900">
              Contact us about your privacy
            </h2>
            <p className="text-slate-600">
              {COMPANY}, {LOCATION}
              <br />
              Website: {SITE}
              <br />
              Email:{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="font-medium text-sky-700 underline"
              >
                {EMAIL}
              </a>
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}

export default Privacy