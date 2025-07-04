import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { nominal, produk } = req.body;

  const reffId = crypto.randomBytes(5).toString("hex").toUpperCase();
  const expiredAt = Date.now() + 6 * 60 * 1000;
  const expiredTime = new Date(expiredAt).toLocaleTimeString("id-ID", {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  const params = new URLSearchParams();
  params.append("api_key", process.env.APIKEY_ATLANTIC);
  params.append("reff_id", reffId);
  params.append("nominal", nominal);
  params.append("type", "ewallet");
  params.append("metode", "qrisfast");

  const response = await fetch("https://atlantich2h.com/deposit/create", {
    method: "POST",
    body: params
  });

  const data = await response.json();

  if (!data.status) {
    return res.status(400).json({ error: data.message });
  }

  global.statusDB = global.statusDB || {};
  global.statusDB[data.data.id] = "pending";

  // simulasi update ke success
  setTimeout(() => {
    global.statusDB[data.data.id] = "success";
  }, 15000);

  res.json({
    qrString: data.data.qr_url,
    reffId: reffId,
    expiredTime,
    atlanticId: data.data.id
  });
}
