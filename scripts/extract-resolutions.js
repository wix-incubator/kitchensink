#!/usr/bin/env node

/**
 * Extract Yarn Resolutions from package-lock.json
 *
 * This script analyzes a package-lock.json file to identify potential yarn resolutions
 * by finding packages with multiple versions and suggesting resolutions.
 */

import fs from 'fs';
import path from 'path';

const PACKAGE_LOCK_PATH = process.argv[2] || './package-lock.json';
const OUTPUT_PATH = process.argv[3] || './resolutions.json';

function analyzePackageLock() {
  try {
    // Read and parse package-lock.json
    const packageLockContent = fs.readFileSync(PACKAGE_LOCK_PATH, 'utf8');
    const packageLock = JSON.parse(packageLockContent);

    console.log('🔍 Analyzing package-lock.json...');
    console.log(`📁 File: ${PACKAGE_LOCK_PATH}`);
    console.log(`📊 Lockfile version: ${packageLock.lockfileVersion}`);

    // Extract all packages and their versions
    const packageVersions = new Map();
    const packagePaths = new Map();

    // Analyze packages from the lockfile
    if (packageLock.packages) {
      for (const [packagePath, packageInfo] of Object.entries(
        packageLock.packages
      )) {
        if (packagePath === '') continue; // Skip root package

        const packageName = extractPackageName(packagePath);
        const version = packageInfo.version;

        if (packageName && version) {
          if (!packageVersions.has(packageName)) {
            packageVersions.set(packageName, new Set());
            packagePaths.set(packageName, []);
          }
          packageVersions.get(packageName).add(version);
          packagePaths.get(packageName).push(packagePath);
        }
      }
    }

    // Find packages with multiple versions (potential resolution candidates)
    const multiVersionPackages = [];
    const potentialResolutions = {};

    for (const [packageName, versions] of packageVersions.entries()) {
      if (versions.size > 1) {
        const versionArray = Array.from(versions).sort(compareVersions);
        const latestVersion = versionArray[versionArray.length - 1];

        multiVersionPackages.push({
          name: packageName,
          versions: versionArray,
          latest: latestVersion,
          paths: packagePaths.get(packageName),
        });

        // Suggest resolution to latest version
        potentialResolutions[packageName] = latestVersion;
      }
    }

    // Generate yarn resolutions format
    const yarnResolutions = {};

    // Direct resolutions (package name to specific version)
    Object.entries(potentialResolutions).forEach(([name, version]) => {
      yarnResolutions[name] = version;
    });

    // Generate report
    console.log('\n📋 Analysis Results:');
    console.log(`📦 Total unique packages: ${packageVersions.size}`);
    console.log(
      `🔄 Packages with multiple versions: ${multiVersionPackages.length}`
    );

    if (multiVersionPackages.length > 0) {
      console.log('\n🚨 Packages with version conflicts:');
      multiVersionPackages.forEach(pkg => {
        console.log(`  📌 ${pkg.name}:`);
        console.log(`     Versions: ${pkg.versions.join(', ')}`);
        console.log(`     Suggested resolution: ${pkg.latest}`);
        console.log(`     Found in: ${pkg.paths.length} locations`);
        console.log('');
      });
    }

    // Output results
    const results = {
      analysis: {
        totalPackages: packageVersions.size,
        conflictingPackages: multiVersionPackages.length,
        generatedAt: new Date().toISOString(),
        sourceFile: PACKAGE_LOCK_PATH,
      },
      conflicts: multiVersionPackages,
      yarnResolutions,
      packageJsonResolutions: {
        resolutions: yarnResolutions,
      },
    };

    // Write results to file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
    console.log(`📄 Results written to: ${OUTPUT_PATH}`);

    // Output yarn resolutions for package.json
    if (Object.keys(yarnResolutions).length > 0) {
      console.log('\n📋 Add this to your package.json:');
      console.log(JSON.stringify({ resolutions: yarnResolutions }, null, 2));

      console.log('\n💡 Or for npm (package.json overrides):');
      console.log(JSON.stringify({ overrides: yarnResolutions }, null, 2));
    } else {
      console.log('\n✅ No version conflicts found - no resolutions needed!');
    }

    return results;
  } catch (error) {
    console.error('❌ Error analyzing package-lock.json:', error.message);
    process.exit(1);
  }
}

function extractPackageName(packagePath) {
  // Remove node_modules prefix and extract package name
  const parts = packagePath.split('/');
  const nodeModulesIndex = parts.lastIndexOf('node_modules');

  if (nodeModulesIndex === -1) return null;

  const nameStartIndex = nodeModulesIndex + 1;
  if (nameStartIndex >= parts.length) return null;

  // Handle scoped packages (@scope/package)
  if (parts[nameStartIndex].startsWith('@')) {
    return nameStartIndex + 1 < parts.length
      ? `${parts[nameStartIndex]}/${parts[nameStartIndex + 1]}`
      : parts[nameStartIndex];
  }

  return parts[nameStartIndex];
}

function compareVersions(a, b) {
  // Simple version comparison (you might want a more robust semver comparison)
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aNum = aParts[i] || 0;
    const bNum = bParts[i] || 0;

    if (aNum !== bNum) {
      return aNum - bNum;
    }
  }

  return 0;
}

// Command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔧 Extract Yarn Resolutions from package-lock.json

Usage:
  node extract-resolutions.js [package-lock.json] [output.json]

Arguments:
  package-lock.json  Path to package-lock.json file (default: ./package-lock.json)
  output.json        Path to output file (default: ./resolutions.json)

Examples:
  node extract-resolutions.js
  node extract-resolutions.js ./package-lock.json ./my-resolutions.json
  node extract-resolutions.js --help

The script will:
1. Analyze package-lock.json for version conflicts
2. Generate suggested yarn resolutions
3. Output results in JSON format
4. Display package.json-ready resolutions
  `);
  process.exit(0);
}

// Run the analysis
analyzePackageLock();

