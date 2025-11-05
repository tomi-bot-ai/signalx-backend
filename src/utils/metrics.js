let counters = Object.create(null);

export function inc(name, v = 1) {
  counters[name] = (counters[name] || 0) + v;
}

export function set(name, v) {
  counters[name] = v;
}

export function renderProm() {
  return Object.entries(counters)
    .map(([k, v]) => `# TYPE ${k} counter\n${k} ${v}`)
    .join('\n') + '\n';
}
