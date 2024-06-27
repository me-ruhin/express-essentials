const { exec } = require('child_process');
const packageJson = require('../package.json');

const packageNames = process.argv.slice(2);

if (packageNames.length === 0) {
  console.log('No package names provided. Usage: npm run update:package <package-name1> <package-name2> ...');
  process.exit(1);
}

const invalidPackages = packageNames.filter(pkg => !packageJson.dependencies[pkg] && !packageJson.devDependencies[pkg]);

if (invalidPackages.length > 0) {
  console.log(`The following packages are not dependencies of this project: ${invalidPackages.join(', ')}`);
  process.exit(1);
}

const updatePackages = (packages, callback) => {
  if (packages.length === 0) {
    callback();
    return;
  }

  const packageName = packages.shift();
  console.log(`Updating ${packageName}...`);

  exec(`npm show ${packageName} version`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error fetching version for ${packageName}:`, err);
      updatePackages(packages, callback);
      return;
    }

    const latestVersion = stdout.trim();
    if (!latestVersion) {
      console.log(`No versions found for ${packageName}.`);
      updatePackages(packages, callback);
      return;
    }

    exec(`npx npm-check-updates -u ${packageName} && npm install`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error updating ${packageName}:`, err);
      } else {
        console.log(stdout);
        console.error(stderr);
        console.log(`${packageName} has been updated to version ${latestVersion}.`);
      }
      updatePackages(packages, callback);
    });
  });
};

updatePackages(packageNames, () => {
  console.log('All specified packages have been updated.');
});
