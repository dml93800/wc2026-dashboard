import { useState } from 'react'
import { getFlag, getScore, isLive, isFinished } from '../lib/utils'
import styles from '../styles/MatchCard.module.css'

export default function MatchCard({ game, prono, onSaveProno }) {
  const [showPronoForm, setShowPronoForm] = useState(false)
  const [pronoH, setPronoH] = useState(0)
  const [pronoA, setPronoA] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const home = game.team1 || '?'
const away = game.team2 || '?'
const hs = game.score?.ft?.[0] ?? null
const as_ = game.score?.ft?.[1] ?? null
  const live = isLive(game)
  const finished = isFinished(game)
  const upcoming = !live && !finished
  const min = game.minute || game.elapsed || ''
  const group = game.group || game.stage || game.round || ''
  const id = game.id || game.fixture_id || `${home}-${away}`

  const homeP = upcoming ? 42 : (hs > as_ ? 56 : hs === as_ ? 32 : 22)
  const drawP = upcoming ? 25 : 20
  const awayP = 100 - homeP - drawP

  async function getAIAnalysis() {
    setLoadingAI(true)
    setAnalysis(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home, away, homeScore: hs, awayScore: as_, type: upcoming ? 'soon' : 'fin' }),
      })
      const data = await res.json()
      setAnalysis(data.analysis || 'Analyse indisponible.')
    } catch (e) {
      setAnalysis('Erreur lors de la connexion à l\'IA.')
    }
    setLoadingAI(false)
  }

  function handleSaveProno() {
    onSaveProno(id, home, away, pronoH, pronoA)
    setShowPronoForm(false)
  }

  return (
    <div className={`${styles.card} ${live ? styles.live : ''}`}>
      <div className={styles.meta}>
        <span className={`${styles.badge} ${live ? styles.badgeLive : finished ? styles.badgeFin : styles.badgeSoon}`}>
          {live ? (min ? `${min}'` : 'LIVE') : finished ? 'Terminé' : (game.time || game.date || 'À venir')}
        </span>
        {group && <span className={styles.group}>{group}</span>}
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>
          <span className={styles.flag}>{getFlag(home)}</span>
          <span className={styles.name}>{home}</span>
        </div>
        <div className={styles.scoreBlock}>
          {upcoming
            ? <span className={styles.vs}>vs</span>
            : <span className={styles.score}>{hs} - {as_}</span>
          }
          {live && <span className={styles.min}>{min ? `${min}'` : '●'}</span>}
        </div>
        <div className={styles.team}>
          <span className={styles.flag}>{getFlag(away)}</span>
          <span className={styles.name}>{away}</span>
        </div>
      </div>

      <div className={styles.probs}>
        {[
          { label: home.split(' ')[0], pct: homeP, cls: styles.fillH },
          { label: 'Nul', pct: drawP, cls: styles.fillD },
          { label: away.split(' ')[0], pct: awayP, cls: styles.fillA },
        ].map(({ label, pct, cls }) => (
          <div key={label} className={styles.probRow}>
            <span className={styles.probLbl}>{label}</span>
            <div className={styles.probWrap}>
              <div className={`${styles.probFill} ${cls}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={styles.probPct}>{pct}%</span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnIA} onClick={getAIAnalysis} disabled={loadingAI}>
          🧠 {loadingAI ? 'Analyse...' : 'Analyse IA'}
        </button>
        {!finished && (
          <button
            className={`${styles.btnProno} ${prono ? styles.pronoDone : ''}`}
            onClick={() => !prono && setShowPronoForm(v => !v)}
          >
            🎯 {prono ? `Mon prono: ${prono.hs}-${prono.as}` : 'Mon prono'}
          </button>
        )}
      </div>

      {loadingAI && (
        <div className={styles.loading}>
          <span />
          <span />
          <span />
          <p>L'IA analyse le match...</p>
        </div>
      )}

      {analysis && (
        <div className={styles.analysis}>{analysis}</div>
      )}

      {showPronoForm && (
        <div className={styles.pronoForm}>
          <p>Ton pronostic — {home} vs {away}</p>
          <div className={styles.scoreInputs}>
            <div>
              <div className={styles.flagInp}>{getFlag(home)}</div>
              <input type="number" min={0} max={20} value={pronoH} onChange={e => setPronoH(e.target.value)} />
            </div>
            <span>-</span>
            <div>
              <div className={styles.flagInp}>{getFlag(away)}</div>
              <input type="number" min={0} max={20} value={pronoA} onChange={e => setPronoA(e.target.value)} />
            </div>
          </div>
          <button className={styles.btnSave} onClick={handleSaveProno}>Enregistrer</button>
        </div>
      )}
    </div>
  )
}
