import { useState, useEffect } from 'react'
import Head from 'next/head'
import MatchCard from '../components/MatchCard'
import { usePronos } from '../lib/usePronos'
import { useNotifications } from '../lib/useNotifications'
import { getTeamName, getScore, isLive, isFinished, isUpcoming, calcPoints } from '../lib/utils'


const API = 'https://worldcup26.ir/get/'

export default function Home() {
  const [tab, setTab] = useState('matchs')
  const [games, setGames] = useState([])
  const [groups, setGroups] = useState([])
  const [usernameInput, setUsernameInput] = useState('')

  const { pronos, saveProno, username, setUsername, getTotalPoints } = usePronos(games)
  const { granted, requestNotif } = useNotifications(games)

  async function fetchData() {
    try {
      const [gRes, grRes] = await Promise.all([
        fetch(API + 'games').catch(() => null),
        fetch(API + 'groups').catch(() => null),
      ])
      if (gRes?.ok) setGames(await gRes.json())
      if (grRes?.ok) setGroups(await grRes.json())
    } catch (e) {}
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const liveGames = games.filter(isLive)
  const finishedGames = games.filter(isFinished).slice(-6).reverse()
  const upcomingGames = games.filter(isUpcoming).slice(0, 6)

  const totalPts = getTotalPoints()
  const pronoList = Object.entries(pronos)

  return (
    <>
      <Head>
        <title>CdM 2026 — Dashboard IA</title>
        <meta name="description" content="Scores live, prédictions IA et pronos — Coupe du Monde 2026" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        {/* HEADER */}
        <div className="header">
          <div className="logo">🏆</div>
          <div className="headerText">
            <h1>Coupe du Monde 2026</h1>
            <p>USA · Canada · Mexique</p>
          </div>
          <div className="livePill">
            <div className="liveDot" />
            <span className="liveLabel">LIVE</span>
          </div>
        </div>

        {/* NOTIF BAR */}
        <div className={`notifBar ${granted ? 'granted' : ''}`}>
          🔔 <span>{granted ? 'Notifs activées — tu seras alerté des buts !' : 'Active les notifs pour être alerté des buts en live'}</span>
          {!granted && <button onClick={requestNotif}>Activer</button>}
        </div>

        {/* TABS */}
        <div className="tabs">
          {[['matchs', '⚽', 'Matchs'], ['pronos', '🎯', 'Pronos'], ['groupes', '📊', 'Groupes'], ['stats', '📈', 'Stats']].map(([key, icon, label]) => (
            <button
              key={key}
              className={`tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* MATCHS */}
        {tab === 'matchs' && (
          <div>
            {liveGames.length > 0 && (
              <>
                <div className="sectionTitle">🔴 En direct</div>
                {liveGames.map(g => (
                  <MatchCard key={g.id || g.fixture_id} game={g} prono={pronos[g.id || g.fixture_id]} onSaveProno={saveProno} />
                ))}
              </>
            )}
            {upcomingGames.length > 0 && (
              <>
                <div className="sectionTitle">🕐 À venir</div>
                {upcomingGames.map(g => (
                  <MatchCard key={g.id || g.fixture_id} game={g} prono={pronos[g.id || g.fixture_id]} onSaveProno={saveProno} />
                ))}
              </>
            )}
            {finishedGames.length > 0 && (
              <>
                <div className="sectionTitle">✅ Résultats récents</div>
                {finishedGames.map(g => (
                  <MatchCard key={g.id || g.fixture_id} game={g} prono={pronos[g.id || g.fixture_id]} onSaveProno={saveProno} />
                ))}
              </>
            )}
            {!liveGames.length && !upcomingGames.length && !finishedGames.length && (
              <div className="empty">⏳ Chargement des matchs...</div>
            )}
          </div>
        )}

        {/* PRONOS */}
        {tab === 'pronos' && (
          <div>
            {!username && (
              <div className="usernameForm">
                <p>Entre ton pseudo pour participer au classement</p>
                <div>
                  <input
                    type="text"
                    placeholder="Ton pseudo..."
                    maxLength={20}
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && usernameInput.trim().length > 1 && setUsername(usernameInput.trim())}
                  />
                  <button onClick={() => usernameInput.trim().length > 1 && setUsername(usernameInput.trim())}>
                    Rejoindre
                  </button>
                </div>
              </div>
            )}

            {username && (
              <div className="userSummary">
                <div>
                  <div className="userPts">{totalPts} pts</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{username}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>
                  {pronoList.length} prono{pronoList.length > 1 ? 's' : ''} enregistré{pronoList.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {!pronoList.length ? (
              <div className="empty">
                🎯<br /><br />Pas encore de prono — va dans l'onglet Matchs pour en faire !
              </div>
            ) : (
              <>
                <div className="sectionTitle">🎯 Mes pronos</div>
                {pronoList.map(([id, p]) => {
                  const game = games.find(g => (g.id || g.fixture_id) == id)
                  const realHs = game ? getScore(game, 'home') : null
                  const realAs = game ? getScore(game, 'away') : null
                  const pts = calcPoints(p, { hs: realHs, as: realAs })
                  return (
                    <div key={id} className="pronoCard">
                      <div className="pronoCardHeader">
                        <span className="pronoCardTitle">{p.home} vs {p.away}</span>
                        <span className={`ptsBadge ${pts === 3 ? 'ptsOk' : pts === 1 ? 'ptsMid' : pts === 0 ? 'ptsBad' : 'ptsPending'}`}>
                          {pts === 3 ? '✓ 3 pts' : pts === 1 ? '~ 1 pt' : pts === 0 ? '✗ 0 pt' : 'En attente'}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span>Mon prono : <strong style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#111' }}>{p.hs} - {p.as}</strong></span>
                        {realHs !== null && <span style={{ marginLeft: 'auto' }}>Résultat : <strong>{realHs}-{realAs}</strong></span>}
                      </div>
                    </div>
                  )
                })}

                <div className="sectionTitle">🏆 Classement</div>
                <div className="leaderboard">
                  <div className="lbRow">
                    <span className="lbPos">1</span>
                    <span className="lbName">{username || 'Toi'}</span>
                    <span className="lbDetail">{pronoList.length} prono{pronoList.length > 1 ? 's' : ''}</span>
                    <span className="lbPts">{totalPts} pts</span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                  Partage l'app avec tes potes pour comparer les pronos !
                </p>
              </>
            )}
          </div>
        )}

        {/* GROUPES */}
        {tab === 'groupes' && (
          <div>
            {!groups.length ? (
              <div className="empty">⏳ Chargement des groupes...</div>
            ) : (
              (Array.isArray(groups) ? groups : Object.values(groups)).slice(0, 12).map((group, i) => {
                const gName = group.name || group.group || group.id || String.fromCharCode(65 + i)
                const teams = group.teams || group.standings || []
                return (
                  <div key={gName}>
                    <div className="sectionTitle">Groupe {gName}</div>
                    <table className="standingsTable">
                      <thead>
                        <tr><th>#</th><th>Équipe</th><th>J</th><th>G</th><th>N</th><th>P</th><th>Pts</th></tr>
                      </thead>
                      <tbody>
                        {teams.map((t, idx) => {
                          const n = t.name || t.team || t.country || t.team_name || '?'
                          const pts = t.points ?? t.pts ?? 0
                          const w = t.won ?? t.wins ?? t.w ?? 0
                          const d = t.drawn ?? t.draws ?? t.d ?? 0
                          const l = t.lost ?? t.losses ?? t.l ?? 0
                          const pl = t.played ?? t.games ?? (w + d + l)
                          return (
                            <tr key={n}>
                              <td className={idx < 2 ? 'qualified' : ''}>{idx + 1}</td>
                              <td>{n}</td>
                              <td>{pl}</td><td>{w}</td><td>{d}</td><td>{l}</td>
                              <td style={{ fontWeight: 600 }}>{pts}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div>
            {(() => {
              const fin = games.filter(isFinished)
              const goals = fin.reduce((acc, g) => acc + (getScore(g, 'home') || 0) + (getScore(g, 'away') || 0), 0)
              const avg = fin.length ? (goals / fin.length).toFixed(1) : '—'
              let hw = 0, d = 0, aw = 0
              fin.forEach(g => {
                const hs = getScore(g, 'home'), as_ = getScore(g, 'away')
                if (hs > as_) hw++; else if (hs === as_) d++; else aw++
              })
              const total = hw + d + aw
              return (
                <>
                  <div className="statGrid">
                    <div className="statCard"><div className="statVal">{fin.length || '—'}</div><div className="statLbl">Matchs joués</div></div>
                    <div className="statCard"><div className="statVal">{goals || '—'}</div><div className="statLbl">Buts marqués</div></div>
                    <div className="statCard"><div className="statVal">{avg}</div><div className="statLbl">Buts / match</div></div>
                  </div>
                  {total > 0 && (
                    <>
                      <div className="sectionTitle">📊 Répartition des résultats</div>
                      {[
                        { label: 'Victoire domicile', pct: Math.round(hw / total * 100), color: '#1D9E75' },
                        { label: 'Match nul', pct: Math.round(d / total * 100), color: '#9ca3af' },
                        { label: 'Victoire extérieur', pct: Math.round(aw / total * 100), color: '#3b82f6' },
                      ].map(({ label, pct, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: '#6b7280', width: 140 }}>{label}</span>
                          <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width .8s' }} />
                          </div>
                          <span style={{ fontSize: 12, color: '#6b7280', width: 36, textAlign: 'right' }}>{pct}%</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>
    </>
  )
}
