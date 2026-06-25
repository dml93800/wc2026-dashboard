export const FLAG = {
  'Morocco':'🇲🇦','Portugal':'🇵🇹','Spain':'🇪🇸','USA':'🇺🇸','United States':'🇺🇸',
  'Brazil':'🇧🇷','Argentina':'🇦🇷','France':'🇫🇷','Germany':'🇩🇪','England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Netherlands':'🇳🇱','Belgium':'🇧🇪','Italy':'🇮🇹','Mexico':'🇲🇽','Canada':'🇨🇦',
  'Japan':'🇯🇵','South Korea':'🇰🇷','Australia':'🇦🇺','Serbia':'🇷🇸','Croatia':'🇭🇷',
  'Uruguay':'🇺🇾','Colombia':'🇨🇴','Ecuador':'🇪🇨','Senegal':'🇸🇳','Ghana':'🇬🇭',
  'Cameroon':'🇨🇲','Tunisia':'🇹🇳','Nigeria':'🇳🇬','Algeria':'🇩🇿','Saudi Arabia':'🇸🇦',
  'Iran':'🇮🇷','Poland':'🇵🇱','Denmark':'🇩🇰','Switzerland':'🇨🇭','Austria':'🇦🇹',
  'Turkey':'🇹🇷','Romania':'🇷🇴','Ukraine':'🇺🇦','Georgia':'🇬🇪','Qatar':'🇶🇦',
  'New Zealand':'🇳🇿','Chile':'🇨🇱','Peru':'🇵🇪','Paraguay':'🇵🇾','Venezuela':'🇻🇪',
  'Honduras':'🇭🇳','Costa Rica':'🇨🇷','Panama':'🇵🇦','Jamaica':'🇯🇲','Indonesia':'🇮🇩',
  'Iraq':'🇮🇶','Egypt':'🇪🇬',"Côte d'Ivoire":'🇨🇮','Ivory Coast':'🇨🇮',
  'South Africa':'🇿🇦','Mali':'🇲🇱','DR Congo':'🇨🇩',
}

export function getFlag(name) {
  if (!name) return '🏳️'
  for (const [k, v] of Object.entries(FLAG)) {
    if (name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())) return v
  }
  return '🏳️'
}

export function getTeamName(t) {
  return typeof t === 'string' ? t : (t && (t.name || t.country || t.team_name || '?'))
}

export function getScore(g, side) {
  const keys = side === 'home'
    ? ['home_score', 'homeScore', 'score_home']
    : ['away_score', 'awayScore', 'score_away']
  for (const k of keys) if (g[k] !== undefined && g[k] !== null) return g[k]
  return null
}

export function getStatus(g) {
  return (g.status || g.state || '').toLowerCase()
}

export function isLive(g) {
  const s = getStatus(g)
  return s.includes('live') || s.includes('1h') || s.includes('2h') || s.includes('ht') || s.includes('in play')
}

export function isFinished(g) {
  const s = getStatus(g)
  return s.includes('fin') || s.includes('ft') || s.includes('complet') || s.includes('full')
}

export function isUpcoming(g) {
  const s = getStatus(g)
  return s.includes('schedul') || s.includes('ns') || s.includes('upcoming') || s.includes('not start') || s.includes('tbd')
}

export function calcPoints(prono, real) {
  if (real.hs === null || real.as === null) return null
  const ph = parseInt(prono.hs), pa = parseInt(prono.as)
  const rh = parseInt(real.hs), ra = parseInt(real.as)
  if (ph === rh && pa === ra) return 3
  const pWin = ph > pa ? 'h' : ph < pa ? 'a' : 'd'
  const rWin = rh > ra ? 'h' : rh < ra ? 'a' : 'd'
  if (pWin === rWin) return 1
  return 0
}
