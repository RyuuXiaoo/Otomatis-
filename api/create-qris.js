export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { nominal, produk } = req.body;
  const reffId = Math.random().toString(36).substring(2, 10).toUpperCase();

  global.statusDB = global.statusDB || {};
  global.statusDB[reffId] = "pending";
  setTimeout(() => { global.statusDB[reffId] = "success"; }, 10000);

  res.json({
    qrString: "https://via.placeholder.com/200x200.png?text=QRIS",
    reffId,
    expiredTime: "12:00 WIB"
  });
}
