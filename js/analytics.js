/* First-party event shim.

   There is no analytics in this site - no GA4, no GTM, no pixel, no consent
   banner. Rather than pick one (a decision with privacy and consent
   implications that belongs to the business, not to a page), this pushes
   events onto a `dataLayer` queue and no-ops safely when nothing is listening.

   Until a tag is installed these events go nowhere. The moment GTM or GA4 is
   added, everything already queued is there waiting and starts reporting with
   no change to any calling code.

   Usage:  BNXT_TRACK('job_card_clicked', { job_slug: 'regional-manager' });

   Keep event names snake_case and payload keys flat - GA4 rejects nested
   objects in custom parameters. */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  window.BNXT_TRACK = function (event, params) {
    if (!event) return;
    try {
      var payload = { event: event };
      if (params) {
        for (var k in params) {
          if (Object.prototype.hasOwnProperty.call(params, k) && params[k] != null) {
            payload[k] = params[k];
          }
        }
      }
      window.dataLayer.push(payload);
    } catch (e) {
      /* analytics must never break a page */
    }
  };

  /* Fires once per element per page, for "this section was actually seen"
     events. Falls back to firing immediately where IntersectionObserver is
     missing, because a missed view event is worse than an early one. */
  window.BNXT_TRACK_VIEW = function (el, event, params, cleanups) {
    if (!el || !event) return;
    var fired = false;
    var fire = function () {
      if (fired) return;
      fired = true;
      window.BNXT_TRACK(event, params);
    };
    if (!('IntersectionObserver' in window)) { fire(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.disconnect(); fire(); }
      });
    }, { threshold: 0.2 });
    io.observe(el);
    if (cleanups) cleanups.push(function () { io.disconnect(); });
  };
})();
