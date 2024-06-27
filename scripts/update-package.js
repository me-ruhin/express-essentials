const { exec } = require('child_process');
const packageJson = require('../package.json');

const action = process.argv[2]; // 'update' or 'remove'
const packageNames = process.argv.slice(3); // package names to update or remove

if (!action || (action !== 'update' && action !== 'remove')) {
  console.log('Usage: npm run update:package <update|remove> <package-name1> <package-name2> ...');
  process.exit(1);
}

if (packageNames.length === 0) {
  console.log('No package names provided.');
  process.exit(1);
}

const removePackages = (packages, callback) => {
  if (packages.length === 0) {
    callback();
    return;
  }

  const packageName = packages.shift();
  console.log(`Removing ${packageName}...`);

  exec(`npm uninstall ${packageName}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error removing ${packageName}:`, err);
    } else {
      console.log(stdout);
      console.error(stderr);
      console.log(`${packageName} has been removed.`);
    }
    removePackages(packages, callback);
  });
};

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

if (action === 'remove') {
  removePackages(packageNames, () => {
    console.log('All specified packages have been removed.');
  });
} else if (action === 'update') {
  updatePackages(packageNames, () => {
    console.log('All specified packages have been updated.');
  });
}
