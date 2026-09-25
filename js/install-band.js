/* Install band behaviour, shared by every page that carries the band.

   index.html keeps its own copy of this logic inside its apply()/submit
   handlers - it renders the same markup but drives it from its own
   snapshot-restoring `set` helper, and rewiring it here would mean touching
   the homepage's layout pass. The markup and the resulting behaviour are the
   same; only the owner differs.

   Breakpoint is the homepage's 760, so a page carrying both this and the FAQ
   flips them together.

   NOTE: the SMS form is a faithful port of the homepage's, which reports
   "Link sent. Check your messages." without calling any endpoint. Nothing is
   sent. It is here because the band was asked to match the homepage exactly;
   wiring it to a real endpoint is a separate change and has to happen on
   index.html at the same time. */
window.BNXT_INSTALL_INIT = function (root, cleanups) {
  if (!root) return;
  var band = root.querySelector('#install');
  if (!band) return;

  var mobBtn = band.querySelector('[data-mob-only]');
  var qrRow = band.querySelector('[data-qr-row]');
  var card = band.querySelector('[data-install-card]');
  var storeRow = band.querySelector('[data-store-row]');

  var layout = function () {
    var wide = window.innerWidth >= 760;
    // the QR is useless on the device it would be scanned with, so the card
    // narrows to just the SMS form there
    if (qrRow) qrRow.style.display = wide ? 'flex' : 'none';
    // the homepage shows this as a block-level flex row, so it spans the column
    if (mobBtn) mobBtn.style.display = wide ? 'none' : 'flex';
    if (card) {
      card.style.maxWidth = wide ? '360px' : 'none';
      card.style.justifySelf = wide ? 'end' : 'stretch';
    }
    if (storeRow) storeRow.style.justifyContent = wide ? 'flex-start' : 'center';
  };
  layout();
  window.addEventListener('resize', layout);
  if (cleanups) cleanups.push(function () { window.removeEventListener('resize', layout); });

  var form = band.querySelector('[data-sms-form]');
  if (!form) return;
  var input = band.querySelector('[data-sms-input]');
  var note = band.querySelector('[data-sms-note]');

  if (input) {
    // digits only, capped at 10, grouped 5 + 5 as they type
    var format = function () {
      var d = input.value.replace(/\D/g, '').slice(0, 10);
      if (note && d.length === 10) {
        note.textContent = 'We will text you the install link once. No spam.';
        note.style.color = 'rgba(255,255,255,.68)';
      }
      var next = d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d;
      if (next === input.value) return;
      var atEnd = input.selectionStart === input.value.length;
      input.value = next;
      if (atEnd) input.setSelectionRange(next.length, next.length);
    };
    var onKey = function (e) {
      // let editing and navigation keys through; block any other non-digit
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    };
    input.addEventListener('input', format);
    input.addEventListener('keydown', onKey);
    if (cleanups) cleanups.push(function () {
      input.removeEventListener('input', format);
      input.removeEventListener('keydown', onKey);
    });
  }

  var onSubmit = function (e) {
    e.preventDefault();
    var digits = ((input && input.value) || '').replace(/\D/g, '');
    if (!note) return;
    if (digits.length < 10) {
      note.textContent = 'Please enter a 10-digit mobile number.';
      note.style.color = '#FFFF00';
      return;
    }
    note.textContent = 'Link sent. Check your messages.';
    note.style.color = '#FFFF00';
    if (input) input.value = '';
  };
  form.addEventListener('submit', onSubmit);
  if (cleanups) cleanups.push(function () { form.removeEventListener('submit', onSubmit); });
};
