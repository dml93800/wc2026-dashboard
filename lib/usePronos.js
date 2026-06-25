import { useState, useEffect } from 'react'
import { calcPoints, getScore } from './utils'

export function usePronos(games) {
  const [pronos, setPronos] = useState({})
  const [username, setUsernameState] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wc26_pronos')
      if (saved) setPronos(JSON.parse(saved))
      const name = localStorage.getItem('wc26_username')
      if (name) setUsernameState(name)
    } catch (e) {}
  }, [])

  function saveProno(id, home, away, hs, as_) {
    const updated = { ...pronos, [id]: { hs, as: as_, home, away, time: Date.now() } }
    setPronos(updated)
    try { localStorage.setItem('wc26_pronos', JSON.stringify(updated)) } catch (e) {}
  }

  function setUsername(name) {
    setUsernameState(name)
    try { localStorage.setItem('wc26_username', name) } catch (e) {}
  }

  function getTotalPoints() {
    return Object.entries(pronos).reduce((acc, [id, p]) => {
      const game = games.find(g => (g.id || g.fixture_id) == id)
      if (!game) return acc
      const pts = calcPoints(p, { hs: getScore(game, 'home'), as: getScore(game, 'away') })
      return acc + (pts || 0)
    }, 0)
  }

  return { pronos, saveProno, username, setUsername, getTotalPoints }
}
