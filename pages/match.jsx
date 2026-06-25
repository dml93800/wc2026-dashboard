export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
    )
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60')
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ matches: [] })
  }
}