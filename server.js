require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.json())

app.post('/create-qris', async (req, res) => {
  const { nominal, produk } = req.body
  const reffId = Math.random().toString(36).substring(2, 10).toUpperCase()

  const form = new URLSearchParams()
  form.append('api_key', process.env.APIKEY_ATLANTIC)
  form.append('reff_id', reffId)
  form.append('nominal', nominal)
  form.append('type', 'ewallet')
  form.append('metode', 'qrisfast')

  try {
    const response = await fetch('https://atlantich2h.com/deposit/create', {
      method: 'POST',
      body: form
    })
    const json = await response.json()
    if (!json.status) return res.status(400).json({ error: json.message })

    res.json({
      qrString: 'data:image/png;base64,' + json.data.qr_base64,
      reffId,
      expiredTime: json.data.expired
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Gagal membuat QRIS' })
  }
})

app.listen(PORT, () => console.log('Server ready on http://localhost:' + PORT))
