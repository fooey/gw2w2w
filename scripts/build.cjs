const PackageJson = require('@npmcli/package-json');
const { DateTime } = require('luxon');
const path = require('path');

const packagePath = path.join(__dirname, '..');
console.log(`🚀 ~ file: build.js ~ line 6 ~ packagePath`, packagePath);

PackageJson.load(packagePath).then((pkgJson) => {
  pkgJson.update({ buildDate: DateTime.local().toISO() });
  return pkgJson.save();
});
