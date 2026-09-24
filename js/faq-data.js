/* Shared FAQ: the six topics, their icons and all eighteen answers, plus the
   accordion behaviour. One copy for the whole site rather than 322 lines of
   markup duplicated into every page — the nav and footer are already copied
   six times and have drifted, and this would have been the seventh thing to
   keep in sync. Pages read window.BNXT_FAQ in renderVals and call
   window.BNXT_FAQ_INIT(root, cleanups) on mount.

   The three values index.html interpolates (cardFee, carePhone, supportEmail)
   are resolved to its own defaults here: no other page declares those props. */
window.BNXT_FAQ = [
  { title: "Getting started",
    svg: "<path d=\"M12 20.5V13\"></path><path d=\"M12 13 6.6 9.4a1 1 0 0 1-.4-1.1l1.5-4.2a1 1 0 0 1 .95-.6h6.7a1 1 0 0 1 .95.6l1.5 4.2a1 1 0 0 1-.4 1.1L12 13Z\"></path><circle cx=\"12\" cy=\"8.3\" r=\"1.9\" fill=\"#FFDE00\" stroke=\"none\"></circle>",
    items: [
      { q: "What do I need to sign up?",
        a: "Your GST number, PAN and bank account details. Most businesses are verified and making their first payment the same day." },
      { q: "How long does it take to start?",
        a: "Same day for most businesses. Multi-entity or enterprise setups usually take about a week." },
      { q: "Does my supplier need to sign up?",
        a: "No. All we need are their bank details and GST number. They receive the transfer like any other payment." }
    ] },
  { title: "Payments",
    svg: "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2.6\"></rect><path d=\"M3 10h18\"></path><path d=\"M6.4 14.6h3.2\"></path><circle cx=\"17.4\" cy=\"14.4\" r=\"1.8\" fill=\"#FFDE00\" stroke=\"none\"></circle>",
    items: [
      { q: "Does my supplier need a card machine?",
        a: "No. You pay on your card and your supplier receives a normal bank transfer into their existing account." },
      { q: "Which banks and cards work?",
        a: "All major Indian credit cards on Visa, Mastercard and RuPay. Corporate and business cards are supported." },
      { q: "What happens if a payment fails?",
        a: "The amount is either not debited or reversed to your card within standard banking timelines. Support tracks every failed payment until it is resolved." }
    ] },
  { title: "Credit & limits",
    svg: "<path d=\"M4 16.5a8 8 0 1 1 16 0\"></path><path d=\"m12 16.5 4.1-4.6\"></path><circle cx=\"12\" cy=\"16.5\" r=\"1.6\" fill=\"#FFDE00\" stroke=\"none\"></circle>",
    items: [
      { q: "Where do the 50 days come from?",
        a: "From your existing card billing cycle plus its interest-free period. We do not change your bank, your limit or your terms." },
      { q: "Can I get extra limit in my peak season?",
        a: "Yes. You can request headroom on top of your existing card without a new loan file or collateral." },
      { q: "Will this affect my credit score?",
        a: "Using BharatNXT does not open a new credit line. Your usage and repayment continue to sit with your existing card issuer." }
    ] },
  { title: "Pricing",
    svg: "<path d=\"M4.2 11.3V5.4a1.2 1.2 0 0 1 1.2-1.2h5.9a1.2 1.2 0 0 1 .85.35l7.3 7.3a1.2 1.2 0 0 1 0 1.7l-5.9 5.9a1.2 1.2 0 0 1-1.7 0l-7.3-7.3a1.2 1.2 0 0 1-.35-.85Z\"></path><circle cx=\"8.4\" cy=\"8.4\" r=\"1.7\" fill=\"#FFDE00\" stroke=\"none\"></circle>",
    items: [
      { q: "What does BharatNXT charge me?",
        a: "A flat X% fee on each card payment. No joining fee, no annual fee, no minimum volume. The fee is shown before you confirm." },
      { q: "Who pays the fee?",
        a: "You, the buyer. Your supplier receives the full invoice amount." },
      { q: "Is there interest on the 50 days?",
        a: "None, as long as you clear your card bill by its due date." }
    ] },
  { title: "Collections",
    svg: "<path d=\"M3.5 13.5h4l1.4 2.4h6.2l1.4-2.4h4\"></path><path d=\"M5.8 5.6h12.4l2.3 7.9v3.3a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7v-3.3Z\"></path><circle cx=\"12\" cy=\"9.3\" r=\"1.7\" fill=\"#FFDE00\" stroke=\"none\"></circle>",
    items: [
      { q: "I mostly sell. What is in it for me?",
        a: "Send payment links, let reminders go out automatically, track outstanding by dealer and get settled in 24 hours, while your dealer still pays on credit." },
      { q: "Do reminders go out automatically?",
        a: "Yes. WhatsApp reminders follow your schedule, so your staff makes no recovery calls." },
      { q: "How fast do I get settled?",
        a: "Within 24 hours of your dealer paying, straight into your existing bank account." }
    ] },
  { title: "Security & support",
    svg: "<path d=\"M12 3.5 19 6v6c0 4-3 7-7 8.5C8 19 5 16 5 12V6l7-2.5Z\"></path><path d=\"m9.2 12 2 2 3.6-3.8\" stroke=\"#FFDE00\" stroke-width=\"2.1\"></path>",
    items: [
      { q: "Is my card data safe?",
        a: "Card details are tokenised by the payment network and never stored on our servers. We are PCI-DSS compliant." },
      { q: "Does BharatNXT hold my money?",
        a: "Never. Funds settle bank to bank through RBI-regulated partners. We hold no customer money at any point." },
      { q: "How do I reach support?",
        a: "Call 1800 000 0000, email support@bharatnxt.in, or message us on WhatsApp, we answer on business days." }
    ] }
];

/* Two-level accordion, same rules as the homepage: opening a topic closes the
   others, opening a question closes its siblings. Open state is read straight
   back off the inline style, so the authored grid-template-rows:0fr has to stay
   inline — do not move it to a stylesheet.

   Topic icons are injected here rather than interpolated: the template runtime
   escapes {{ }} as text, so inline SVG markup cannot travel that way. */
window.BNXT_FAQ_INIT = function (root, cleanups) {
  if (!root) return;
  var groups = Array.prototype.slice.call(root.querySelectorAll('[data-faq-group]'));
  if (!groups.length) return;
  var data = window.BNXT_FAQ || [];

  groups.forEach(function (g, i) {
    var holder = g.querySelector('[data-faq-icon]');
    if (holder && data[i] && data[i].svg) holder.innerHTML = data[i].svg;
  });

  var closeQuestionsIn = function (scope) {
    Array.prototype.slice.call(scope.querySelectorAll('[data-faq-q]')).forEach(function (qEl) {
      var qb = qEl.querySelector('[data-faq-qbody]');
      var bar2 = qEl.querySelector('[data-faq-qbar]');
      if (qb) qb.style.gridTemplateRows = '0fr';
      if (bar2) bar2.style.transform = 'rotate(90deg)';
      qEl.style.borderColor = '#E4E7F2';
      qEl.style.background = '#fff';
    });
  };
  var closeAllGroups = function () {
    groups.forEach(function (gr) {
      var bd = gr.querySelector('[data-faq-body]');
      var br = gr.querySelector('[data-faq-bar]');
      if (bd) bd.style.gridTemplateRows = '0fr';
      if (br) br.style.transform = 'rotate(90deg)';
      gr.style.borderColor = '#E4E7F2';
      gr.style.boxShadow = '0 4px 18px rgba(17,26,61,.05)';
      closeQuestionsIn(gr);
    });
  };

  groups.forEach(function (g) {
    var head = g.querySelector('[data-faq-head]');
    var body = g.querySelector('[data-faq-body]');
    var bar = g.querySelector('[data-faq-bar]');
    if (head && body) {
      var toggle = function () {
        var open = body.style.gridTemplateRows === '1fr';
        if (!open) closeAllGroups();
        body.style.gridTemplateRows = open ? '0fr' : '1fr';
        if (bar) bar.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
        g.style.borderColor = open ? '#E4E7F2' : '#C9D6FF';
        g.style.boxShadow = open ? '0 4px 18px rgba(17,26,61,.05)' : '0 10px 30px rgba(0,41,255,.1)';
        if (open) closeQuestionsIn(g);
      };
      head.addEventListener('click', toggle);
      if (cleanups) cleanups.push(function () { head.removeEventListener('click', toggle); });
    }
    Array.prototype.slice.call(g.querySelectorAll('[data-faq-q]')).forEach(function (qEl) {
      var btn = qEl.querySelector('[data-faq-qbtn]');
      var qBody = qEl.querySelector('[data-faq-qbody]');
      var qBar = qEl.querySelector('[data-faq-qbar]');
      if (!btn || !qBody) return;
      var toggleQ = function () {
        var open = qBody.style.gridTemplateRows === '1fr';
        if (!open) closeQuestionsIn(g);
        qBody.style.gridTemplateRows = open ? '0fr' : '1fr';
        if (qBar) qBar.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
        qEl.style.borderColor = open ? '#E4E7F2' : '#C9D6FF';
        qEl.style.background = open ? '#fff' : '#FBFCFF';
      };
      btn.addEventListener('click', toggleQ);
      if (cleanups) cleanups.push(function () { btn.removeEventListener('click', toggleQ); });
    });
  });
  /* Narrow layout, ported from index.html's apply() at the same 760 breakpoint.
     It stays a copy rather than a shared call: index's FAQ is hardcoded markup
     with its own accordion, so it never runs this module, and its rules ride on
     its own snapshot-restoring `set` helper. Below 760 the grid drops to a
     single column and the heading column pins to the top, so topic cards scroll
     up behind it -- the same behaviour the homepage has.

     Each rule records the authored value the first time it is applied and puts
     it back when the window widens, because none of these pages carry a width
     media query to fall back to. */
  var sec = root.querySelector('[data-faq-sec]');
  var grid = root.querySelector('[data-faq-grid]');
  var headCol = root.querySelector('[data-faq-head-col]');
  var cols = root.querySelector('[data-faq-cols]');

  var set = function (el, props) {
    if (!el) return;
    if (!el.__faqOrig) {
      el.__faqOrig = {};
      Object.keys(props).forEach(function (k) { el.__faqOrig[k] = el.style[k]; });
    }
    Object.keys(props).forEach(function (k) {
      el.style[k] = tight ? props[k] : el.__faqOrig[k];
    });
  };

  var tight = false;
  var layout = function () {
    tight = window.innerWidth < 760;
    set(sec, { paddingTop: '0px' });
    set(grid, { gridTemplateColumns: 'minmax(0,1fr)' });
    set(headCol, {
      position: 'sticky', top: '0px', zIndex: '6', background: '#EDF2FF',
      marginLeft: '-20px', marginRight: '-20px',
      paddingLeft: '20px', paddingRight: '20px',
      paddingTop: '54px', paddingBottom: '8px',
      marginTop: '0px', marginBottom: '4px', boxShadow: 'none'
    });
    // tail room so the final topic card can scroll fully behind the pinned heading
    set(cols, { gridTemplateColumns: 'minmax(0,1fr)', paddingBottom: '48px' });
  };
  layout();
  window.addEventListener('resize', layout);
  if (cleanups) cleanups.push(function () { window.removeEventListener('resize', layout); });
};
