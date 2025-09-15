#!/usr/bin/env node

/**
 * Extract ALL Package Versions from package-lock.json
 *
 * This script extracts every single package version from package-lock.json
 * to create a complete version manifest for cross-project synchronization.
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  devOnly: args.includes('--dev-only'),
  prodOnly: args.includes('--prod-only'),
  directOnly: args.includes('--direct-only'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  format:
    args.find(arg => arg.startsWith('--format='))?.split('=')[1] ||
    'resolutions',
  includeOptional: args.includes('--include-optional'),
  groupByScope: args.includes('--group-by-scope'),
  sortBy:
    args.find(arg => arg.startsWith('--sort-by='))?.split('=')[1] || 'name',
};

// Get file paths (non-flag arguments)
const fileArgs = args.filter(arg => !arg.startsWith('-'));
const PACKAGE_LOCK_PATH = fileArgs[0] || './package-lock.json';
const PACKAGE_JSON_PATH = fileArgs[1] || './package.json';
const OUTPUT_PATH = fileArgs[2] || './version-manifest.json';

function extractAllVersions() {
  try {
    console.log('📦 Complete Version Extractor');
    console.log('='.repeat(50));

    // Read and parse package-lock.json
    const packageLockContent = fs.readFileSync(PACKAGE_LOCK_PATH, 'utf8');
    const packageLock = JSON.parse(packageLockContent);

    // Read package.json for direct dependencies
    let packageJson = {};
    let directDeps = new Set();
    let directDevDeps = new Set();

    if (fs.existsSync(PACKAGE_JSON_PATH)) {
      packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
      directDeps = new Set(Object.keys(packageJson.dependencies || {}));
      directDevDeps = new Set(Object.keys(packageJson.devDependencies || {}));
    }

    console.log(`📁 Package-lock: ${PACKAGE_LOCK_PATH}`);
    console.log(`📄 Package.json: ${PACKAGE_JSON_PATH}`);
    console.log(`📊 Lockfile version: ${packageLock.lockfileVersion}`);
    console.log(`⚙️  Format: ${flags.format}`);
    console.log(
      `🎯 Filters: ${
        Object.entries(flags)
          .filter(([_, v]) => v && typeof v === 'boolean')
          .map(([k]) => k)
          .join(', ') || 'none'
      }`
    );

    // Extract ALL packages and their exact versions
    const allPackages = new Map();
    const packageInfo = new Map();
    const dependencyTree = new Map();

    if (packageLock.packages) {
      for (const [packagePath, packageData] of Object.entries(
        packageLock.packages
      )) {
        if (packagePath === '') continue; // Skip root package

        const packageName = extractPackageName(packagePath);
        const version = packageData.version;

        if (packageName && version) {
          // Store the EXACT version as found in the lockfile
          allPackages.set(packageName, version);

          // Store additional metadata
          packageInfo.set(packageName, {
            version: version,
            isDirect: directDeps.has(packageName),
            isDirectDev: directDevDeps.has(packageName),
            isDev: packageData.dev || false,
            isOptional: packageData.optional || false,
            isWorkspace: packagePath.startsWith('node_modules') === false,
            license: packageData.license || 'Unknown',
            resolved: packageData.resolved || null,
            integrity: packageData.integrity || null,
            dependencies: Object.keys(packageData.dependencies || {}),
            devDependencies: Object.keys(packageData.devDependencies || {}),
            peerDependencies: Object.keys(packageData.peerDependencies || {}),
            optionalDependencies: Object.keys(
              packageData.optionalDependencies || {}
            ),
            path: packagePath,
            hasInstallScript: !!packageData.hasInstallScript,
            deprecated: packageData.deprecated || false,
            funding: packageData.funding || null,
          });

          // Build dependency tree
          dependencyTree.set(packageName, {
            dependencies: Object.keys(packageData.dependencies || {}),
            devDependencies: Object.keys(packageData.devDependencies || {}),
            peerDependencies: Object.keys(packageData.peerDependencies || {}),
            optionalDependencies: Object.keys(
              packageData.optionalDependencies || {}
            ),
          });
        }
      }
    }

    // Apply filters
    let filteredPackages = new Map(allPackages);

    if (flags.devOnly) {
      filteredPackages = new Map(
        [...filteredPackages].filter(
          ([name]) =>
            packageInfo.get(name)?.isDev || packageInfo.get(name)?.isDirectDev
        )
      );
    }

    if (flags.prodOnly) {
      filteredPackages = new Map(
        [...filteredPackages].filter(
          ([name]) =>
            !packageInfo.get(name)?.isDev && !packageInfo.get(name)?.isDirectDev
        )
      );
    }

    if (flags.directOnly) {
      filteredPackages = new Map(
        [...filteredPackages].filter(
          ([name]) =>
            packageInfo.get(name)?.isDirect ||
            packageInfo.get(name)?.isDirectDev
        )
      );
    }

    if (!flags.includeOptional) {
      filteredPackages = new Map(
        [...filteredPackages].filter(
          ([name]) => !packageInfo.get(name)?.isOptional
        )
      );
    }

    // Sort packages
    let sortedPackages;
    switch (flags.sortBy) {
      case 'version':
        sortedPackages = [...filteredPackages].sort(([, a], [, b]) =>
          a.localeCompare(b)
        );
        break;
      case 'type':
        sortedPackages = [...filteredPackages].sort(([nameA], [nameB]) => {
          const aInfo = packageInfo.get(nameA);
          const bInfo = packageInfo.get(nameB);
          const aType = aInfo.isDirect
            ? 'direct'
            : aInfo.isDev
              ? 'dev'
              : 'transitive';
          const bType = bInfo.isDirect
            ? 'direct'
            : bInfo.isDev
              ? 'dev'
              : 'transitive';
          return aType.localeCompare(bType) || nameA.localeCompare(nameB);
        });
        break;
      default: // name
        sortedPackages = [...filteredPackages].sort(([a], [b]) =>
          a.localeCompare(b)
        );
    }

    // Generate different output formats
    const versionManifest = Object.fromEntries(sortedPackages);

    const resolutionsFormat = {
      resolutions: versionManifest,
    };

    const overridesFormat = {
      overrides: versionManifest,
    };

    const detailedManifest = {
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceFiles: {
          packageLock: PACKAGE_LOCK_PATH,
          packageJson: PACKAGE_JSON_PATH,
        },
        projectName: packageJson.name || 'unknown',
        projectVersion: packageJson.version || 'unknown',
        lockfileVersion: packageLock.lockfileVersion,
        nodeVersion: process.version,
        flags: flags,
        statistics: {
          totalPackages: allPackages.size,
          filteredPackages: filteredPackages.size,
          directDependencies: [...allPackages.keys()].filter(
            name => packageInfo.get(name)?.isDirect
          ).length,
          directDevDependencies: [...allPackages.keys()].filter(
            name => packageInfo.get(name)?.isDirectDev
          ).length,
          transitiveDependencies: [...allPackages.keys()].filter(name => {
            const info = packageInfo.get(name);
            return !info?.isDirect && !info?.isDirectDev;
          }).length,
          optionalDependencies: [...allPackages.keys()].filter(
            name => packageInfo.get(name)?.isOptional
          ).length,
          deprecatedPackages: [...allPackages.keys()].filter(
            name => packageInfo.get(name)?.deprecated
          ).length,
        },
      },
      versions: versionManifest,
      packageDetails: flags.verbose
        ? Object.fromEntries(
            [...filteredPackages.keys()].map(name => [
              name,
              packageInfo.get(name),
            ])
          )
        : undefined,
      dependencyTree: flags.verbose
        ? Object.fromEntries(
            [...filteredPackages.keys()].map(name => [
              name,
              dependencyTree.get(name),
            ])
          )
        : undefined,
    };

    // Group by scope if requested
    if (flags.groupByScope) {
      const grouped = groupPackagesByScope(versionManifest);
      detailedManifest.versionsByScope = grouped;
    }

    // Generate different output formats based on flag
    let outputData;
    switch (flags.format) {
      case 'overrides':
        outputData = overridesFormat;
        break;
      case 'detailed':
        outputData = detailedManifest;
        break;
      case 'manifest':
        outputData = {
          name: packageJson.name || 'version-manifest',
          version: packageJson.version || '1.0.0',
          versions: versionManifest,
          metadata: detailedManifest.metadata,
        };
        break;
      case 'pnpm':
        outputData = {
          packageExtensions: versionManifest,
        };
        break;
      default: // resolutions
        outputData = resolutionsFormat;
    }

    // Display summary
    console.log('\n📊 EXTRACTION SUMMARY');
    console.log('='.repeat(30));
    console.log(`📦 Total packages in lockfile: ${allPackages.size}`);
    console.log(`✨ Packages after filtering: ${filteredPackages.size}`);
    console.log(
      `📋 Direct dependencies: ${detailedManifest.metadata.statistics.directDependencies}`
    );
    console.log(
      `🛠️  Direct dev dependencies: ${detailedManifest.metadata.statistics.directDevDependencies}`
    );
    console.log(
      `🔗 Transitive dependencies: ${detailedManifest.metadata.statistics.transitiveDependencies}`
    );

    if (detailedManifest.metadata.statistics.optionalDependencies > 0) {
      console.log(
        `📦 Optional dependencies: ${detailedManifest.metadata.statistics.optionalDependencies}`
      );
    }

    if (detailedManifest.metadata.statistics.deprecatedPackages > 0) {
      console.log(
        `⚠️  Deprecated packages: ${detailedManifest.metadata.statistics.deprecatedPackages}`
      );
    }

    // Show sample packages
    console.log('\n🔍 SAMPLE PACKAGES:');
    sortedPackages.slice(0, 10).forEach(([name, version]) => {
      const info = packageInfo.get(name);
      const type = info.isDirect ? '📌' : info.isDirectDev ? '🛠️' : '🔗';
      console.log(`  ${type} ${name}: ${version}`);
    });

    if (sortedPackages.length > 10) {
      console.log(`  ... and ${sortedPackages.length - 10} more packages`);
    }

    // Write output file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputData, null, 2));
    console.log(`\n💾 Version manifest saved to: ${OUTPUT_PATH}`);

    // Display ready-to-use formats
    console.log('\n📋 READY-TO-USE FORMATS:');

    console.log('\n🧶 YARN RESOLUTIONS:');
    console.log(JSON.stringify(resolutionsFormat, null, 2));

    console.log('\n📦 NPM OVERRIDES:');
    console.log(JSON.stringify(overridesFormat, null, 2));

    // Usage instructions
    console.log('\n💡 USAGE INSTRUCTIONS:');
    console.log(
      "1. Copy the resolutions/overrides to target project's package.json"
    );
    console.log("2. Delete target project's node_modules and lock file");
    console.log('3. Run npm install or yarn install');
    console.log('4. All packages will now use the exact same versions');

    console.log('\n🚀 AUTOMATION COMMANDS:');
    console.log('# Apply to another project:');
    console.log(
      `node scripts/apply-all-versions.js ${OUTPUT_PATH} /path/to/other/project`
    );

    return outputData;
  } catch (error) {
    console.error('❌ Error extracting versions:', error.message);
    if (flags.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function extractPackageName(packagePath) {
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

function groupPackagesByScope(versionManifest) {
  const grouped = {
    scoped: {},
    unscoped: {},
  };

  Object.entries(versionManifest).forEach(([name, version]) => {
    if (name.startsWith('@')) {
      const scope = name.split('/')[0];
      if (!grouped.scoped[scope]) {
        grouped.scoped[scope] = {};
      }
      grouped.scoped[scope][name] = version;
    } else {
      grouped.unscoped[name] = version;
    }
  });

  return grouped;
}

// Command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📦 Extract ALL Package Versions from package-lock.json

Usage:
  node extract-all-versions.js [package-lock.json] [package.json] [output.json] [options]

Options:
  --dev-only             Extract only development dependencies
  --prod-only            Extract only production dependencies  
  --direct-only          Extract only direct dependencies (not transitive)
  --include-optional     Include optional dependencies (excluded by default)
  --group-by-scope       Group packages by npm scope (@org/package)
  --verbose, -v          Include detailed package information
  --format=FORMAT        Output format: resolutions|overrides|detailed|manifest|pnpm
  --sort-by=FIELD        Sort by: name|version|type (default: name)

Formats:
  resolutions            Yarn resolutions format (default)
  overrides              NPM overrides format
  detailed               Complete manifest with metadata
  manifest               Shareable version manifest
  pnpm                   PNPM packageExtensions format

Examples:
  node extract-all-versions.js
  node extract-all-versions.js --direct-only --format=overrides
  node extract-all-versions.js --dev-only --verbose
  node extract-all-versions.js ./package-lock.json ./package.json ./versions.json --format=detailed
  node extract-all-versions.js --group-by-scope --sort-by=type

Use Cases:
- Synchronize exact versions across multiple projects
- Create reproducible builds with locked versions
- Audit complete dependency tree
- Generate version manifests for CI/CD
- Cross-project dependency consistency
  `);
  process.exit(0);
}

// Run the extraction
extractAllVersions();


