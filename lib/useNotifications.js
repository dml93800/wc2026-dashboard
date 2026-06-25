import { useState, useRef, useEffect } from 'react'
import { isLive, getScore, getTeamName } from './utils'

export function useNotifications(games) {
  const [granted, setGranted] = useState(false)
  const prevScores = useRef({})

  async function requestNotif() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setGranted(true)
      new Notification('🏆 CdM 2026', { body: 'Tu recevras une notif à chaque but !' })
    }
  }

  useEffect(() => {
    if (!granted || !games.length) return
    games.forEach(g => {
      if (!isLive(g)) return
      const id = g.id || g.fixture_id
      const hs = getScore(g, 'home')
      const as_ = getScore(g, 'away')
      const prev = prevScores.current[id]
      if (prev && (prev.hs !== hs || prev.as !== as_)) {
        const home = getTeamName(g.home_team || g.homeTeam || {})
        const away = getTeamName(g.away_team || g.awayTeam || {})
        new Notification('⚽ But !', { body: `${home} ${hs} - ${as_} ${away}` })
      }
      prevScores.current[id] = { hs, as: as_ }
    })
  }, [games, granted])

  return { granted, requestNotif }
}
