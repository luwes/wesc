const AIRLINES = ['UA', 'AA', 'DL', 'BA', 'LH', 'AF', 'KL', 'JL', 'NH', 'SQ', 'QF', 'EK', 'LX', 'IB'];
const CITIES = [
  ['JFK', 'New York'], ['LAX', 'Los Angeles'], ['ORD', 'Chicago'], ['DFW', 'Dallas'],
  ['DEN', 'Denver'], ['SEA', 'Seattle'], ['SFO', 'San Francisco'], ['BOS', 'Boston'],
  ['MIA', 'Miami'], ['ATL', 'Atlanta'], ['LHR', 'London'], ['CDG', 'Paris'],
  ['AMS', 'Amsterdam'], ['FRA', 'Frankfurt'], ['MAD', 'Madrid'], ['FCO', 'Rome'],
  ['ZRH', 'Zürich'], ['CPH', 'Copenhagen'], ['ARN', 'Stockholm'], ['HEL', 'Helsinki'],
  ['NRT', 'Tokyo'], ['HND', 'Tokyo Haneda'], ['ICN', 'Seoul'], ['HKG', 'Hong Kong'],
  ['SIN', 'Singapore'], ['BKK', 'Bangkok'], ['SYD', 'Sydney'], ['DXB', 'Dubai'],
  ['DOH', 'Doha'], ['IST', 'Istanbul'], ['GRU', 'São Paulo'], ['EZE', 'Buenos Aires'],
];
const STATUSES = [
  { key: 'on-time', label: 'On Time', weight: 55 },
  { key: 'boarding', label: 'Boarding', weight: 10 },
  { key: 'final-call', label: 'Final Call', weight: 3 },
  { key: 'delayed', label: 'Delayed', weight: 15 },
  { key: 'departed', label: 'Departed', weight: 14 },
  { key: 'cancelled', label: 'Cancelled', weight: 3 },
];
const AIRCRAFT = ['A320neo', 'A321', '737 MAX 8', '787-9', 'A350-900', 'E195-E2'];
const CONNECTIONS = ['Connections open', 'Crew assigned', 'Catering loaded', 'Security cleared', 'Bags loading'];
const TERMINALS = ['Terminal 1', 'Terminal 2', 'Terminal 3', 'International'];

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function pick(rand, values) {
  return values[Math.floor(rand() * values.length)];
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function pickStatus(rand) {
  const total = STATUSES.reduce((sum, status) => sum + status.weight, 0);
  let threshold = rand() * total;

  for (const status of STATUSES) {
    threshold -= status.weight;
    if (threshold <= 0) return status;
  }

  return STATUSES[0];
}

export function createDepartureGenerator(seed) {
  const rand = rng(seed);

  return () => {
    const airline = pick(rand, AIRLINES);
    const flightNo = 100 + Math.floor(rand() * 9000);
    const destination = pick(rand, CITIES);
    const hour = Math.floor(rand() * 24);
    const minute = Math.floor(rand() * 12) * 5;
    const status = pickStatus(rand);
    const gateLetter = String.fromCharCode(65 + Math.floor(rand() * 6));
    let eta = '';

    if (status.key === 'delayed') {
      const delay = 15 + Math.floor(rand() * 180);
      const etaMinute = (hour * 60 + minute + delay) % (24 * 60);
      eta = `${pad(Math.floor(etaMinute / 60))}:${pad(etaMinute % 60)}`;
    }

    return {
      flight: `${airline} ${flightNo}`,
      route: `${destination[0]} · ${destination[1]}`,
      time: `${pad(hour)}:${pad(minute)}`,
      gate: `${gateLetter}${1 + Math.floor(rand() * 40)}`,
      statusKey: status.key,
      statusLabel: status.label,
      statusTitle: `Flight ${status.label.toLowerCase()}`,
      statusAriaLabel: `Status: ${status.label}`,
      delayed: status.key === 'delayed',
      eta,
      aircraft: pick(rand, AIRCRAFT),
      connection: pick(rand, CONNECTIONS),
      detailsLabel: 'Details',
      terminal: pick(rand, TERMINALS),
      toggleLabel: 'Details',
    };
  };
}

// A paginated, async data source - the shape of a real DB cursor or a
// paginated HTTP API. `next()` hands out one row at a time and transparently
// `await`s a fetch whenever the current page is exhausted.
export function createDepartureCursor({ total, pageSize = 64, seed = 1 }) {
  const nextDeparture = createDepartureGenerator(seed);
  let produced = 0;
  let buffer = [];

  async function fetchPage() {
    // A real cursor awaits I/O here (a DB round-trip, an HTTP page, ...), which
    // completes on a macrotask. That await is what hands the event loop back so
    // the HTTP socket can flush already-rendered rows before the next page is
    // ready - i.e. what keeps TTFB low and memory bounded.
    await new Promise((resolve) => setImmediate(resolve));
    const size = Math.min(pageSize, total - produced);
    produced += size;
    return Array.from({ length: size }, nextDeparture);
  }

  return {
    pageSize,
    async next() {
      if (buffer.length === 0) buffer = await fetchPage();
      return buffer.shift();
    },
  };
}
