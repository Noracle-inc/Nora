module.exports = {
  getHealth: (_req, res) => {
    res.json({ status: 'ok', app: 'Noracle' });
  }
};
