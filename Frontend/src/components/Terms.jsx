import React from 'react'

const LAST_UPDATED = '31 October 2026'
const COMPANY = 'ExportYard'
const EMAIL = 'support@exportyard.com' // TODO: replace with your real email
const LOCATION = 'Mumbai, Maharashtra, India'

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    body: [
      `By accessing this website or placing an enquiry or order with ${COMPANY}, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.`,
    ],
  },
  {
    id: 'services',
    title: '2. Our Business',
    body: [
      `${COMPANY} supplies and exports packaged drinking (mineral) water in bottles to business buyers, distributors and importers worldwide, shipped from ${LOCATION}.`,
      'Information on this website is for general guidance and does not by itself constitute an offer. A binding contract is formed only when we confirm your order in writing.',
    ],
  },
  {
    id: 'enquiries',
    title: '3. Enquiries, Quotations & Orders',
    list: [
      'Quotations are valid for the period stated on them (15 days if not stated).',
      'Each quotation specifies bottle size, packaging, quantity, price, Incoterm and delivery port.',
      'An order is accepted only after our written order confirmation (and, where applicable, receipt of advance payment).',
      'Minimum order quantities (MOQ) apply and may vary by product and destination.',
    ],
  },
  {
    id: 'pricing',
    title: '4. Pricing & Payment',
    list: [
      'Prices are quoted in the currency stated on the quotation, exclusive of bank charges, duties, taxes and import levies in the destination country unless the Incoterm says otherwise.',
      'Payment terms (e.g. advance, T/T, Letter of Credit) are agreed in writing for each order.',
      'Goods will not be dispatched until the agreed advance or payment instrument has been received and verified.',
      'Delayed payments may lead to suspension of shipment and storage or demurrage charges payable by the buyer.',
    ],
  },
  {
    id: 'shipping',
    title: '5. Shipping, Incoterms & Risk',
    list: [
      'Shipments are made by sea (containerised) or as otherwise agreed, under the Incoterms 2020 rule stated in the order (e.g. FOB, CIF, CFR).',
      'Risk passes to the buyer as defined by the applicable Incoterm.',
      'Delivery dates are estimates. Delays caused by shipping lines, weather, port congestion, customs, strikes or other events outside our control are not a breach of contract.',
      'The buyer is responsible for import licences, customs clearance, duties and any destination-country compliance, unless agreed otherwise.',
    ],
  },
  {
    id: 'quality',
    title: '6. Quality, Inspection & Claims',
    list: [
      'Products are packed in line with applicable Indian food-safety and packaged drinking water standards and the specifications confirmed in the order.',
      'The buyer should inspect goods on arrival and report visible damage, shortage or non-conformity in writing, with photos and shipping documents, within 7 days of delivery at the destination port.',
      'Claims reported after this period, or for goods stored or handled improperly after delivery, may not be accepted.',
      'Our remedy for a valid claim is limited to replacement of the affected goods or a credit/refund of their invoice value, at our discretion.',
    ],
  },
  {
    id: 'cancellation',
    title: '7. Cancellations & Returns',
    body: [
      'Because bottled water is a consumable, perishable product, confirmed orders cannot be cancelled once production or packing has begun. Goods are not returnable except for valid claims under Section 6.',
    ],
  },
  {
    id: 'ip',
    title: '8. Intellectual Property',
    body: [
      `All content on this website, including the ${COMPANY} name, logo, text, images and design, belongs to ${COMPANY} or its licensors. You may not copy, reproduce or use it without our prior written consent. Private-label or custom branding orders require the buyer to confirm they own or are licensed to use the branding supplied.`,
    ],
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    body: [
      `To the maximum extent permitted by law, ${COMPANY} is not liable for indirect, incidental or consequential losses (including loss of profit or business). Our total liability for any claim is limited to the invoice value of the goods concerned.`,
    ],
  },
  {
    id: 'force-majeure',
    title: '10. Force Majeure',
    body: [
      `${COMPANY} is not liable for failure or delay caused by events beyond reasonable control, including natural disasters, war, government action, export or import restrictions, pandemics, shipping disruptions or supply shortages.`,
    ],
  },
  {
    id: 'privacy',
    title: '11. Privacy',
    body: [
      'We collect contact and business details you submit through enquiry forms only to respond to you, process orders and meet legal requirements. We do not sell your personal data.',
    ],
  },
  {
    id: 'law',
    title: '12. Governing Law & Disputes',
    body: [
      `These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at ${LOCATION}, after good-faith attempts to resolve them amicably.`,
    ],
  },
  {
    id: 'changes',
    title: '13. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. The updated version applies from the date posted on this page.',
    ],
  },
]

const Terms = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <section className="bg-gradient-to-b from-sky-900 to-sky-700 px-4 py-14 text-center text-white sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-sky-100 sm:text-base">
          Last updated: {LAST_UPDATED}
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
          <p className="mb-8 text-slate-600">
            Please read these Terms carefully before using the {COMPANY} website
            or placing an order. They set out the rules that apply to our
            export of bottled mineral water.
          </p>

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
            </section>
          ))}

          {/* Contact */}
          <section className="mt-10 rounded-lg bg-sky-50 p-5">
            <h2 className="mb-1 text-lg font-semibold text-sky-900">
              Questions about these Terms?
            </h2>
            <p className="text-slate-600">
              Contact us at{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="font-medium text-sky-700 underline"
              >
                {EMAIL}
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}

export default Terms