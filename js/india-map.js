// india-map.html — SVG network-map render/interaction logic (uses d3 + topojson, loaded via CDN <script> tags before this file).
const CITIES = [
  { city:'Mumbai',     state:'Maharashtra',   ll:[72.88,19.08], biz:'11,400', val:'₹198 Cr',   cat:'Textiles',      w:3 },
  { city:'Delhi NCR',  state:'Delhi',         ll:[77.21,28.61], biz:'10,600', val:'₹176 Cr',   cat:'Electricals',   w:3 },
  { city:'Ahmedabad',  state:'Gujarat',       ll:[72.57,23.03], biz:'7,500', val:'₹135 Cr',   cat:'Packaging',     w:3 },
  { city:'Surat',      state:'Gujarat',       ll:[72.83,21.17], biz:'5,900', val:'₹114 Cr',   cat:'Yarn & fabric', w:2 },
  { city:'Bengaluru',  state:'Karnataka',     ll:[77.59,12.97], biz:'6,800', val:'₹124 Cr',   cat:'Hardware',      w:3 },
  { city:'Chennai',    state:'Tamil Nadu',    ll:[80.27,13.08], biz:'5,600', val:'₹98 Cr',   cat:'Auto parts',    w:2 },
  { city:'Coimbatore', state:'Tamil Nadu',    ll:[76.96,11.02], biz:'4,050',   val:'₹67 Cr',   cat:'Textiles',      w:2 },
  { city:'Hyderabad',  state:'Telangana',     ll:[78.47,17.39], biz:'5,200',   val:'₹93 Cr',   cat:'Pharma inputs', w:2 },
  { city:'Pune',       state:'Maharashtra',   ll:[73.86,18.52], biz:'4,700',   val:'₹83 Cr',   cat:'Engineering',   w:2 },
  { city:'Kolkata',    state:'West Bengal',   ll:[88.36,22.57], biz:'4,450',   val:'₹78 Cr',   cat:'Chemicals',     w:2 },
  { city:'Jaipur',     state:'Rajasthan',     ll:[75.79,26.91], biz:'3,300',   val:'₹57 Cr',   cat:'Stone & tiles', w:2 },
  { city:'Ludhiana',   state:'Punjab',        ll:[75.86,30.90], biz:'3,780',   val:'₹62 Cr',   cat:'Electricals',   w:2 },
  { city:'Kanpur',     state:'Uttar Pradesh', ll:[80.35,26.45], biz:'2,870',   val:'₹47 Cr',    cat:'Leather',       w:1 },
  { city:'Indore',     state:'Madhya Pradesh',ll:[75.86,22.72], biz:'3,080',   val:'₹52 Cr',   cat:'FMCG trade',    w:1 },
  { city:'Raipur',     state:'Chhattisgarh',  ll:[81.63,21.25], biz:'2,180',   val:'₹41 Cr',    cat:'Steel',         w:1 },
  { city:'Kochi',      state:'Kerala',        ll:[76.27,9.93],  biz:'2,070',   val:'₹36 Cr',    cat:'Spices & food', w:1 },
  { city:'Hubli',      state:'Karnataka',     ll:[75.12,15.36], biz:'1,380',   val:'₹26 Cr',    cat:'Agri inputs',   w:1 },
  { city:'Guwahati',   state:'Assam',         ll:[91.74,26.14], biz:'960',   val:'₹16 Cr',    cat:'Retail supply', w:1 },
  { city:'Patna',      state:'Bihar',         ll:[85.14,25.59], biz:'1,590',   val:'₹31 Cr',    cat:'Building mat.', w:1 },
  { city:'Nagpur',     state:'Maharashtra',   ll:[79.09,21.15], biz:'2,490',   val:'₹42 Cr',    cat:'Distribution',  w:1 }
];
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function postHeight() {
  const el = document.getElementById('wrap');
  if (!el) return;
  parent.postMessage({ type: 'bnxt-map-height', height: Math.ceil(el.getBoundingClientRect().height) }, '*');
}
window.addEventListener('load', postHeight);
window.addEventListener('resize', postHeight);
window.addEventListener('resize', () => { if (typeof paint === 'function' && typeof active === 'number' && active >= 0) paint(active); });
if (window.ResizeObserver) new ResizeObserver(postHeight).observe(document.documentElement);
const svg = d3.select('#stage');
const W = 620, H = 470;
svg.attr('viewBox', '0 0 ' + W + ' ' + H);
let active = 0, project = null, pinSel = null, rowSel = null, arcTimer = null;

const CARDS = 3;
const isNarrow = () => window.matchMedia('(max-width: 820px)').matches;
function fillCard(el, c) {
  el.querySelector('.dcity').textContent = c.city;
  el.querySelector('.dstate').textContent = c.state;
  el.querySelector('.dbiz').textContent = c.biz;
  el.querySelector('.dval').textContent = c.val;
  el.querySelector('.dcat').textContent = c.cat;
  if (!REDUCED) { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); }
}
function paint(i) {
  active = i;
  // the three boxes run the same rotation, offset so they never show the same city
  const narrow = isNarrow();
  document.querySelectorAll('.detail').forEach((el, k) => {
    el.style.display = (narrow && k > 0) ? 'none' : 'flex';
    if (narrow && k > 0) return;
    fillCard(el, CITIES[(i + k * Math.floor(CITIES.length / CARDS)) % CITIES.length]);
  });
  if (pinSel) pinSel.classed('on', (d, k) => k === i);
}

function pulse(i) {
  if (REDUCED) return;
  const g = svg.select('.pin-' + i);
  if (g.empty()) return;
  g.append('circle').attr('class', 'pin-ring').attr('r', 4)
    .style('opacity', .9)
    .transition().duration(1400).ease(d3.easeCubicOut)
    .attr('r', 26).style('opacity', 0).remove();
}

function flyArc() {
  if (REDUCED || !project) return;
  const a = CITIES[Math.floor(Math.random() * CITIES.length)];
  let b = CITIES[Math.floor(Math.random() * CITIES.length)];
  if (a === b) b = CITIES[(CITIES.indexOf(a) + 3) % CITIES.length];
  const p = project(a.ll), q = project(b.ll);
  if (!p || !q) return;
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const cx = mx - dy / len * len * 0.28, cy = my + dx / len * len * 0.28;
  const path = svg.append('path').attr('class', 'arc')
    .attr('d', 'M' + p[0] + ',' + p[1] + ' Q' + cx + ',' + cy + ' ' + q[0] + ',' + q[1]);
  const L = path.node().getTotalLength();
  path.attr('stroke-dasharray', L + ' ' + L).attr('stroke-dashoffset', L)
    .transition().duration(900).ease(d3.easeCubicInOut).attr('stroke-dashoffset', 0)
    .transition().duration(500).style('opacity', 0).remove();
  pulse(CITIES.indexOf(b));
}

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(topology => {
  const all = topojson.feature(topology, topology.objects.countries).features;
  const byName = n => all.find(f => f.properties && f.properties.name === n);
  const india = byName('India');
  // Natural Earth splits Jammu & Kashmir and Ladakh along lines of administration.
  // India is shown whole here, as on official maps of India: the northern and western
  // parts are filled from the adjoining real polygons, clipped to the claim outline.
  const CLAIM = [[74.65,32.45],[74.10,32.95],[73.95,33.55],[74.15,34.05],[73.45,34.70],[73.10,35.25],[73.60,35.90],[74.55,36.60],[75.95,36.95],[77.20,36.10],[78.40,35.55],[79.60,34.90],[80.25,34.55],[79.10,33.30],[78.80,32.60],[78.35,32.25],[76.60,31.90],[75.00,31.95],[74.65,32.45]];
  const claim = { type:'Feature', geometry:{ type:'Polygon', coordinates:[CLAIM] } };
  const projection = d3.geoMercator().fitExtent([[18, 14], [W - 18, H - 14]], { type:'FeatureCollection', features:[india, claim] });
  project = ll => projection(ll);
  const path = d3.geoPath(projection);

  const land = svg.append('g').attr('class', 'land');
  svg.append('clipPath').attr('id', 'jk-claim').append('path').attr('d', path(claim));
  land.append('g').attr('clip-path', 'url(#jk-claim)')
    .selectAll('path').data(['Pakistan', 'China'].map(byName).filter(Boolean)).enter()
    .append('path').attr('d', path);
  land.append('path').attr('d', path(india));

  const pins = svg.selectAll('.pin').data(CITIES).enter()
    .append('g')
    .attr('class', (d, i) => 'pin pin-' + i + (d.w >= 3 ? ' big' : ''))
    .attr('transform', d => { const p = projection(d.ll); return 'translate(' + p[0] + ',' + p[1] + ')'; })
    .attr('aria-hidden', 'true');
  pins.append('circle').attr('class', 'pin-dot').attr('r', d => d.w >= 3 ? 5.5 : d.w === 2 ? 4.2 : 3.2);
  pins.append('text').attr('class', 'pin-label').attr('x', 10).attr('y', 4).text(d => d.city);
  pinSel = pins;

  // Voronoi hit layer: every point on the map belongs to its nearest city,
  // so tap targets are large and never overlap however tight the cluster.
  const pts = CITIES.map(d => projection(d.ll));
  const vor = d3.Delaunay.from(pts).voronoi([0, 0, W, H]);
  svg.append('g').attr('class', 'hits').selectAll('path').data(CITIES).enter()
    .append('path')
    .attr('d', (d, i) => vor.renderCell(i))
    .attr('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('click', (e, d) => { const i = CITIES.indexOf(d); paint(i); pulse(i); })
    .on('mouseenter', (e, d) => { const i = CITIES.indexOf(d); svg.selectAll('.pin').classed('hover', (x, k) => k === i); pulse(i); })
    .on('mouseleave', () => svg.selectAll('.pin').classed('hover', false));

  paint(0);

  // auto-rotate the city card; a tap sets the city and rotation carries on from there
  const DWELL = 3400;
  let rotTimer = null, barAnim = null;
  const bars = Array.from(document.querySelectorAll('.dbar i'));
  const runBar = () => {
    bars.forEach(bar => {
      if (REDUCED) { bar.style.width = '100%'; return; }
      bar.style.transition = 'none'; bar.style.width = '0';
      void bar.offsetWidth;
      bar.style.transition = 'width ' + DWELL + 'ms linear';
      bar.style.width = '100%';
    });
  };
  const step = () => {
    const next = (active + 1) % CITIES.length;
    paint(next); pulse(next); runBar();
  };
  const startRotate = () => { clearInterval(rotTimer); if (REDUCED) return; runBar(); rotTimer = setInterval(step, DWELL); };
  const stopRotate = () => { clearInterval(rotTimer); rotTimer = null; };
  document.getElementById('wrap').addEventListener('mouseenter', stopRotate);
  document.getElementById('wrap').addEventListener('mouseleave', startRotate);
  startRotate();
  if (!REDUCED) {
    CITIES.forEach((d, i) => setTimeout(() => pulse(i), 120 + i * 70));
    arcTimer = setInterval(flyArc, 1900);
    setInterval(() => pulse(Math.floor(Math.random() * CITIES.length)), 800);
  }
}).catch(() => {
  document.getElementById('stagewrap').innerHTML =
    '<div style="padding:40px 20px;font-size:14px;color:rgba(255,255,255,.7)">Map data could not be loaded.</div>';
});
