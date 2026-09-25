/* Open roles - the single source of truth for careers.html and job.html.

   Every job card and every job page is rendered from this array. Nothing about
   a role is written into markup, so adding a role is a change to this file
   alone.

   ── Populating a role ────────────────────────────────────────────────────
   The five prose fields (about, responsibilities, requirements, whyItMatters,
   notFor) are EMPTY until the real job description is pasted in. That is
   deliberate: job.html renders only the sections that have content, so a
   half-filled role degrades to "title, facts, and a link to the full
   description" rather than showing invented copy under a real heading.

   `notFor` is the self-selection section. BharatNXT's own JDs carry this idea
   ("if you are expecting a 9-5, very well defined structured role - this is
   not the place for you"). Keep it specific and factual: what the job actually
   involves that some people will not want. Not a personality test.

   ── Fields ──────────────────────────────────────────────────────────────
   slug            URL key: job.html?j=<slug>. Never change one that is live.
   title           Exactly as advertised.
   fn              Function facet. Derived from the role title - CONFIRM these.
   locations       Array, because one role spans three cities.
   experience      { min, max } in years, or null when not advertised.
                   Rendered only when present - no empty chips.
   employmentType  null until confirmed; omitted from JSON-LD when null.
   summary         One line for the card. Falls back to nothing.
   applyUrl        Applications go to LinkedIn; we do not take them here.
   postedAt        ISO date, for JobPosting datePosted.                      */

window.BNXT_JOBS = [
  {
    slug: 'strategic-alliances-growth-martech',
    title: 'Strategic Alliances - Growth & Martech Platforms',
    fn: 'Strategic Alliances',
    locations: ['Mumbai'],
    experience: null,
    employmentType: null,
    summary: '',
    about: '',
    responsibilities: [],
    requirements: [],
    whyItMatters: '',
    notFor: [],
    applyUrl: 'https://www.linkedin.com/jobs/view/4468914434',
    postedAt: '2026-09-25'
  },
  {
    slug: 'strategy-ops-growth-retention-engagement',
    title: 'Strategy & Ops - Growth, Retention & Engagement',
    fn: 'Strategy & Operations',
    locations: ['Mumbai'],
    experience: null,
    employmentType: null,
    summary: '',
    about: '',
    responsibilities: [],
    requirements: [],
    whyItMatters: '',
    notFor: [],
    applyUrl: 'https://www.linkedin.com/jobs/view/4461164488',
    postedAt: '2026-09-25'
  },
  {
    slug: 'regional-manager-north-west',
    title: 'Regional Manager - North & West',
    fn: 'Sales',
    locations: ['Delhi NCR', 'Mumbai', 'Pune'],
    experience: { min: 7, max: 12 },
    employmentType: null,
    summary: '',
    about: '',
    responsibilities: [],
    requirements: [],
    whyItMatters: '',
    notFor: [],
    applyUrl: 'https://www.linkedin.com/jobs/view/4466976330',
    postedAt: '2026-09-25'
  }
];

/* ── View-model helpers ───────────────────────────────────────────────────
   The template runtime resolves dotted paths only - no ternaries, no method
   calls, no string concatenation inside {{ }}. So every label, flag and href
   a template needs has to be computed here and handed over as a plain value.
   Both pages call BNXT_JOB_VM() from their renderVals().                    */

window.BNXT_JOB_EXP_LABEL = function (exp) {
  if (!exp) return '';
  if (exp.min != null && exp.max != null) return exp.min + '-' + exp.max + ' years';
  if (exp.min != null) return exp.min + '+ years';
  return '';
};

window.BNXT_JOB_VM = function (job) {
  if (!job) return null;
  var expLabel = window.BNXT_JOB_EXP_LABEL(job.experience);
  return {
    slug: job.slug,
    title: job.title,
    fn: job.fn,
    href: 'job.html?j=' + job.slug,
    applyUrl: job.applyUrl,
    postedAt: job.postedAt,

    locations: (job.locations || []).slice(),
    locationLabel: (job.locations || []).join(' / '),
    expLabel: expLabel,
    employmentType: job.employmentType || '',
    summary: job.summary || '',

    // one boolean per optional block, because the templates cannot branch
    hasExp: !!expLabel,
    hasType: !!job.employmentType,
    hasSummary: !!job.summary,
    hasAbout: !!job.about,
    hasResponsibilities: !!(job.responsibilities && job.responsibilities.length),
    hasRequirements: !!(job.requirements && job.requirements.length),
    hasWhy: !!job.whyItMatters,
    hasNotFor: !!(job.notFor && job.notFor.length),
    // true when no prose has been pasted yet, so the page can say so plainly
    // instead of rendering empty headings
    isStub: !(job.about || (job.responsibilities || []).length ||
              (job.requirements || []).length || job.whyItMatters ||
              (job.notFor || []).length),

    about: job.about || '',
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    whyItMatters: job.whyItMatters || '',
    notFor: job.notFor || [],

    // filter keys, lower-cased once so matching never re-does the work
    fnKey: (job.fn || '').toLowerCase(),
    locKeys: (job.locations || []).map(function (l) { return l.toLowerCase(); }),
    expBand: !job.experience ? '' : (job.experience.min >= 7 ? 'senior'
           : job.experience.min >= 3 ? 'mid' : 'early')
  };
};

window.BNXT_JOBS_VM = function () {
  return (window.BNXT_JOBS || []).map(window.BNXT_JOB_VM);
};

/* ── Filters ──────────────────────────────────────────────────────────────
   Every card is rendered into the DOM by the page's own <sc-for>, so all roles
   are present for crawlers and readable with JS off. Filtering only toggles
   visibility - it never re-renders, which keeps this clear of the template
   runtime's render cycle.

   Facets are derived from the data, never hardcoded. A facet whose options do
   not actually divide the list (one option, or every role matching) hides
   itself rather than offering a filter that cannot change anything.          */

window.BNXT_JOBS_INIT = function (root, cleanups) {
  if (!root) return;
  var wrap = root.querySelector('[data-jobs]');
  if (!wrap) return;

  var jobs = window.BNXT_JOBS_VM();
  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-job-card]'));
  var filterHost = root.querySelector('[data-job-filters]');
  var countEl = root.querySelector('[data-job-count]');
  var emptyEl = root.querySelector('[data-job-empty]');

  var EXP_BANDS = { early: '0-3 years', mid: '3-7 years', senior: '7+ years' };

  var facets = [
    { key: 'fn', label: 'Function',
      options: uniq(jobs.map(function (j) { return j.fn; })),
      match: function (j, v) { return j.fn === v; } },
    { key: 'loc', label: 'Location',
      options: uniq(flatten(jobs.map(function (j) { return j.locations || []; }))),
      match: function (j, v) { return j.locKeys.indexOf(v.toLowerCase()) !== -1; } },
    { key: 'exp', label: 'Experience',
      options: uniq(jobs.map(function (j) { return EXP_BANDS[j.expBand] || ''; })),
      match: function (j, v) { return EXP_BANDS[j.expBand] === v; } }
  ].filter(function (f) {
    // a facet earns its place only if it can actually narrow the list
    return f.options.length > 1;
  });

  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (v) {
      if (!v || seen[v]) return;
      seen[v] = 1; out.push(v);
    });
    return out.sort();
  }
  function flatten(arrs) {
    var out = [];
    arrs.forEach(function (a) { out = out.concat(a); });
    return out;
  }

  var active = {};   // { facetKey: optionValue }

  var CHIP_BASE = 'flex-shrink:0;font-family:inherit;font-size:13px;font-weight:700;' +
    // 44px, not the 40 the tool tabs use: these are the main touch target
    // on a phone and the tabs predate the guideline
    'white-space:nowrap;min-height:44px;display:inline-flex;align-items:center;' +
    'padding:10px 16px;border-radius:100px;cursor:pointer;' +
    'transition:background .2s,color .2s,border-color .2s;';
  var CHIP_ON = 'background:#314259;color:#fff;border:1px solid #314259';
  var CHIP_OFF = 'background:#fff;color:#686D77;border:1px solid #EEEEEE';

  function paintChip(btn, on) {
    btn.setAttribute('style', CHIP_BASE + (on ? CHIP_ON : CHIP_OFF));
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function visible(j) {
    for (var k in active) {
      if (!Object.prototype.hasOwnProperty.call(active, k) || !active[k]) continue;
      var f = facets.filter(function (x) { return x.key === k; })[0];
      if (f && !f.match(j, active[k])) return false;
    }
    return true;
  }

  function apply(trackedFacet) {
    var shown = 0;
    cards.forEach(function (card) {
      var slug = card.getAttribute('data-job-card');
      var j = jobs.filter(function (x) { return x.slug === slug; })[0];
      var on = !j || visible(j);
      card.style.display = on ? '' : 'none';
      if (on) shown++;
    });
    if (countEl) {
      countEl.textContent = shown === 1 ? '1 open role' : shown + ' open roles';
    }
    if (emptyEl) emptyEl.style.display = shown ? 'none' : 'block';
    if (trackedFacet && window.BNXT_TRACK) {
      window.BNXT_TRACK('job_filter_used', {
        filter_name: trackedFacet,
        filter_value: active[trackedFacet] || '(all)',
        results_count: shown
      });
    }
  }

  if (filterHost && facets.length) {
    facets.forEach(function (f) {
      var group = document.createElement('div');
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Filter by ' + f.label);
      group.setAttribute('style', 'display:flex;align-items:center;gap:8px;flex-wrap:nowrap;' +
        'overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px 0');

      var lbl = document.createElement('span');
      lbl.textContent = f.label;
      lbl.setAttribute('style', 'flex-shrink:0;font-size:10.5px;font-weight:700;' +
        'letter-spacing:1.1px;text-transform:uppercase;color:#9092A3;margin-right:2px');
      group.appendChild(lbl);

      var all = document.createElement('button');
      all.type = 'button';
      all.textContent = 'All';
      paintChip(all, true);
      group.appendChild(all);

      var btns = [all];
      f.options.forEach(function (opt) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = opt;
        paintChip(b, false);
        group.appendChild(b);
        btns.push(b);
        var onClick = function () {
          active[f.key] = opt;
          btns.forEach(function (x) { paintChip(x, x === b); });
          apply(f.key);
        };
        b.addEventListener('click', onClick);
        if (cleanups) cleanups.push(function () { b.removeEventListener('click', onClick); });
      });

      var onAll = function () {
        active[f.key] = '';
        btns.forEach(function (x) { paintChip(x, x === all); });
        apply(f.key);
      };
      all.addEventListener('click', onAll);
      if (cleanups) cleanups.push(function () { all.removeEventListener('click', onAll); });

      filterHost.appendChild(group);
    });
  }

  apply();

  // card clicks - the card is a real <a>, so this only reports, never navigates
  cards.forEach(function (card) {
    var onClick = function () {
      if (!window.BNXT_TRACK) return;
      window.BNXT_TRACK('job_card_clicked', {
        job_slug: card.getAttribute('data-job-card'),
        job_title: card.getAttribute('data-job-title') || ''
      });
    };
    card.addEventListener('click', onClick);
    if (cleanups) cleanups.push(function () { card.removeEventListener('click', onClick); });
  });

  if (window.BNXT_TRACK_VIEW) {
    window.BNXT_TRACK_VIEW(wrap, 'open_roles_view', { roles_count: jobs.length }, cleanups);
  }
};
