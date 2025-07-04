export default async function handler(req, res) {
  const id = req.query.id;
  global.statusDB = global.statusDB || {};
  const status = global.statusDB[id] || "pending";
  res.json({ status });
}
