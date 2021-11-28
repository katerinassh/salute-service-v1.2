const geoip = require('geoip-lite');
const ip = require('ip');
require('dotenv').config();

const ipDefault = '88.81.235.26';

const getGeo = (req, res, next) => {
  const clientIp = ip.address();
  const geo = geoip.lookup(clientIp) || geoip.lookup(ipDefault);
  req.geo = geo.ll;
  next();
};

module.exports = { getGeo };
