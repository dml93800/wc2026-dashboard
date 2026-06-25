export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { home, away, homeScore, awayScore, type } = req.body

  const prompt = type === 'soon' || homeScore === null
    ? `Tu es un expert foot. Analyse le match ${home} vs ${away} à la Coupe du Monde 2026. Prédiction argumentée en 3-4 phrases courtes : vainqueur probable et pourquoi (forme récente, historique, style de jeu). Sois direct et précis.`
    : `Tu es un expert foot. Le match ${home} vs ${away} (CdM 2026) s'est terminé ${homeScore}-${awayScore}. Analyse en 3-4 phrases : ce que ce résultat signifie pour la suite du tournoi.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.find(b => b.type === 'text')?.text || 'Analyse indisponible.'
    res.status(200).json({ analysis: text })
  } catch (e) {
    res.status(500).json({ error: 'Erreur IA' })
  }
}
