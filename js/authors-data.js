/* Authors and the blog's post index, shared by article.html (byline, author
   box, schema), author.html (one profile, ?au=<slug>) and authors.html (the
   listing). The CMS will own this data; until then it lives here, in one
   place, so the three pages can never disagree.

   Only real authors go in BNXT_AUTHORS. Add a writer by adding a record:
     slug       url key, e.g. 'priya-sharma' -> author.html?au=priya-sharma
     name, initials, role
     short      one or two sentences, shown in the author box and listing card
     long       the profile page's bio
     expertise  topics they write on, shown as chips
     linkedin   full profile URL, or '' to hide the icon
     photo      image URL, or '' to show the initials

   BNXT_POSTS is the light index of every article (the full text stays in
   article.html): slug, title, category, blurb, read time, updated date and
   the author's slug. */
window.BNXT_AUTHORS = [
  {
    slug: 'editorial-team',
    name: 'BharatNXT Editorial Team',
    initials: 'BN',
    role: 'Business finance, payments and credit, explained simply',
    short: 'We write for the business owner who does his own banking: plain language, real numbers, and the jargon explained wherever it cannot be avoided.',
    long: 'We write for the business owner who does his own banking. Everything here is checked against how payments, credit and GST actually work in India, in plain language, with the jargon explained wherever it cannot be avoided.',
    expertise: ['Cash flow', 'Credit', 'Payments', 'Working capital'],
    linkedin: '',
    photo: ''
  }
];

window.BNXT_POSTS = [
  { slug: 'why-profitable-businesses-run-out-of-cash', title: 'Why profitable businesses still run out of cash', category: 'Cash flow', blurb: 'Profit is not the same as cash in the bank.', readTime: '5 min read', updated: '25 Aug 2026', author: 'editorial-team' },
  { slug: 'loan-vs-credit-line', title: 'Loan or credit line: what is the difference?', category: 'Credit', blurb: 'One is a single large amount. The other you use only when you need it.', readTime: '4 min read', updated: '22 Aug 2026', author: 'editorial-team' },
  { slug: 'pay-supplier-without-card-machine', title: 'How to pay a supplier who has no card machine', category: 'Payments', blurb: 'Your supplier gets a normal bank transfer into his own account.', readTime: '3 min read', updated: '20 Aug 2026', author: 'editorial-team' },
  { slug: 'what-is-working-capital', title: 'What is working capital, in plain English', category: 'Working capital', blurb: 'The money you need between buying goods and getting paid for them.', readTime: '6 min read', updated: '18 Aug 2026', author: 'editorial-team' },
  { slug: 'plan-supplier-payments', title: 'How to plan supplier payments around your collections', category: 'Cash flow', blurb: 'Line up what you pay with what you collect.', readTime: '4 min read', updated: '16 Aug 2026', author: 'editorial-team' },
  { slug: 'customers-pay-late', title: 'How to manage customers who pay late', category: 'Cash flow', blurb: 'Shorten the gap without spoiling the relationship.', readTime: '5 min read', updated: '14 Aug 2026', author: 'editorial-team' },
  { slug: 'business-credit-score', title: 'How business credit scores work', category: 'Credit', blurb: 'What lenders look at, and what you can fix this month.', readTime: '6 min read', updated: '12 Aug 2026', author: 'editorial-team' },
  { slug: 'borrow-to-buy-stock', title: 'Should you borrow to buy stock?', category: 'Credit', blurb: 'Three questions to ask before you take the money.', readTime: '4 min read', updated: '10 Aug 2026', author: 'editorial-team' }
];

window.BNXT_AUTHOR = function (slug) {
  var list = window.BNXT_AUTHORS;
  for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
  return list[0];
};
window.BNXT_POSTS_BY = function (slug) {
  return window.BNXT_POSTS.filter(function (p) { return p.author === slug; });
};
