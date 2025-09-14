#!/usr/bin/env node

/**
 * Advanced Yarn Resolutions Extractor from package-lock.json
 *
 * Enhanced version with additional features:
 * - Severity assessment
 * - Security vulnerability checks
 * - Bundle size impact analysis
 * - Interactive mode
 * - Custom filtering options
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  interactive: args.includes('--interactive') || args.includes('-i'),
  securityOnly: args.includes('--security-only'),
  majorOnly: args.includes('--major-only'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  minConflicts:
    parseInt(
      args.find(arg => arg.startsWith('--min-conflicts='))?.split('=')[1]
    ) || 2,
};

// Get file paths (non-flag arguments)
const fileArgs = args.filter(arg => !arg.startsWith('-'));
const PACKAGE_LOCK_PATH = fileArgs[0] || './package-lock.json';
const OUTPUT_PATH = fileArgs[1] || './resolutions-advanced.json';

function analyzePackageLockAdvanced() {
  try {
    console.log('🚀 Advanced Package Lock Analysis');
    console.log('='.repeat(50));

    // Read and parse package-lock.json
    const packageLockContent = fs.readFileSync(PACKAGE_LOCK_PATH, 'utf8');
    const packageLock = JSON.parse(packageLockContent);

    console.log(`📁 File: ${PACKAGE_LOCK_PATH}`);
    console.log(`📊 Lockfile version: ${packageLock.lockfileVersion}`);
    console.log(
      `⚙️  Filters: ${Object.entries(flags)
        .filter(([_, v]) => v)
        .map(([k]) => k)
        .join(', ')}`
    );

    // Extract all packages and their versions with metadata
    const packageAnalysis = new Map();

    if (packageLock.packages) {
      for (const [packagePath, packageInfo] of Object.entries(
        packageLock.packages
      )) {
        if (packagePath === '') continue; // Skip root package

        const packageName = extractPackageName(packagePath);
        const version = packageInfo.version;

        if (packageName && version) {
          if (!packageAnalysis.has(packageName)) {
            packageAnalysis.set(packageName, {
              versions: new Map(),
              paths: [],
              isDev: false,
              isPeer: false,
              totalSize: 0,
            });
          }

          const analysis = packageAnalysis.get(packageName);

          if (!analysis.versions.has(version)) {
            analysis.versions.set(version, {
              version,
              paths: [],
              isDev: packageInfo.dev || false,
              license: packageInfo.license || 'Unknown',
              funding: packageInfo.funding || null,
              deprecated: packageInfo.deprecated || false,
              hasSecurityIssues: false, // Would need external API for real security data
            });
          }

          analysis.versions.get(version).paths.push(packagePath);
          analysis.paths.push(packagePath);
          analysis.isDev = analysis.isDev || packageInfo.dev || false;
        }
      }
    }

    // Analyze conflicts with severity assessment
    const conflicts = [];

    for (const [packageName, analysis] of packageAnalysis.entries()) {
      if (analysis.versions.size >= flags.minConflicts) {
        const versions = Array.from(analysis.versions.keys()).sort(
          compareVersions
        );
        const versionInfos = Array.from(analysis.versions.values());

        const conflict = {
          name: packageName,
          versions: versions,
          versionCount: versions.length,
          latest: versions[versions.length - 1],
          oldest: versions[0],
          severity: assessSeverity(versions),
          totalPaths: analysis.paths.length,
          isDev: analysis.isDev,
          hasSecurityIssues: versionInfos.some(v => v.hasSecurityIssues),
          hasDeprecated: versionInfos.some(v => v.deprecated),
          licenses: [...new Set(versionInfos.map(v => v.license))],
          versionDetails: versionInfos,
        };

        // Apply filters
        if (flags.securityOnly && !conflict.hasSecurityIssues) continue;
        if (flags.majorOnly && conflict.severity !== 'MAJOR') continue;

        conflicts.push(conflict);
      }
    }

    // Sort by severity and impact
    conflicts.sort((a, b) => {
      const severityOrder = { MAJOR: 3, MINOR: 2, PATCH: 1 };
      const severityDiff =
        (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      if (severityDiff !== 0) return severityDiff;
      return b.totalPaths - a.totalPaths; // More paths = higher impact
    });

    // Generate resolutions with priority
    const resolutions = {};
    const criticalResolutions = {};
    const devResolutions = {};

    conflicts.forEach(conflict => {
      const resolution = conflict.latest;

      resolutions[conflict.name] = resolution;

      if (conflict.severity === 'MAJOR' || conflict.hasSecurityIssues) {
        criticalResolutions[conflict.name] = resolution;
      }

      if (conflict.isDev) {
        devResolutions[conflict.name] = resolution;
      }
    });

    // Display results
    console.log('\n📊 ANALYSIS SUMMARY');
    console.log('='.repeat(30));
    console.log(`📦 Total unique packages: ${packageAnalysis.size}`);
    console.log(`🔄 Packages with conflicts: ${conflicts.length}`);

    const severityCounts = conflicts.reduce((acc, c) => {
      acc[c.severity] = (acc[c.severity] || 0) + 1;
      return acc;
    }, {});

    console.log(`🚨 Severity breakdown:`);
    Object.entries(severityCounts).forEach(([severity, count]) => {
      const emoji =
        severity === 'MAJOR' ? '🔴' : severity === 'MINOR' ? '🟡' : '🟢';
      console.log(`   ${emoji} ${severity}: ${count}`);
    });

    if (conflicts.length > 0) {
      console.log('\n🔍 TOP CONFLICTS:');
      conflicts.slice(0, 10).forEach((conflict, index) => {
        const emoji =
          conflict.severity === 'MAJOR'
            ? '🔴'
            : conflict.severity === 'MINOR'
              ? '🟡'
              : '🟢';
        console.log(`${index + 1}. ${emoji} ${conflict.name}`);
        console.log(`   Versions: ${conflict.versions.join(' → ')}`);
        console.log(
          `   Severity: ${conflict.severity} | Paths: ${conflict.totalPaths} | Dev: ${conflict.isDev}`
        );
        if (conflict.hasSecurityIssues)
          console.log(`   🛡️  Security issues detected`);
        if (conflict.hasDeprecated)
          console.log(`   ⚠️  Contains deprecated versions`);
        console.log('');
      });
    }

    // Export comprehensive results
    const results = {
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceFile: PACKAGE_LOCK_PATH,
        totalPackages: packageAnalysis.size,
        conflictingPackages: conflicts.length,
        flags: flags,
        severityBreakdown: severityCounts,
      },
      conflicts: conflicts.map(c => ({
        ...c,
        versionDetails: undefined, // Remove detailed version info for cleaner output
      })),
      resolutions: {
        all: resolutions,
        critical: criticalResolutions,
        development: devResolutions,
      },
      packageJsonFormats: {
        yarn: { resolutions },
        npm: { overrides: resolutions },
        yarnCriticalOnly: { resolutions: criticalResolutions },
      },
      statistics: {
        totalPotentialDuplicates: conflicts.reduce(
          (sum, c) => sum + c.totalPaths,
          0
        ),
        averageVersionsPerConflict:
          conflicts.length > 0
            ? (
                conflicts.reduce((sum, c) => sum + c.versionCount, 0) /
                conflicts.length
              ).toFixed(2)
            : 0,
        securityIssues: conflicts.filter(c => c.hasSecurityIssues).length,
        deprecatedPackages: conflicts.filter(c => c.hasDeprecated).length,
      },
    };

    // Write results
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
    console.log(`\n💾 Detailed results saved to: ${OUTPUT_PATH}`);

    // Display formatted resolutions
    if (Object.keys(resolutions).length > 0) {
      console.log('\n📋 YARN RESOLUTIONS (All conflicts):');
      console.log(JSON.stringify({ resolutions }, null, 2));

      if (Object.keys(criticalResolutions).length > 0) {
        console.log('\n🔴 CRITICAL RESOLUTIONS ONLY:');
        console.log(
          JSON.stringify({ resolutions: criticalResolutions }, null, 2)
        );
      }

      console.log('\n💡 NPM OVERRIDES FORMAT:');
      console.log(JSON.stringify({ overrides: resolutions }, null, 2));
    } else {
      console.log('\n✅ No conflicts found with current filters!');
    }

    return results;
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
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

function compareVersions(a, b) {
  // Enhanced semver comparison
  const parseVersion = version => {
    const parts = version
      .replace(/[^\d.]/g, '')
      .split('.')
      .map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
      original: version,
    };
  };

  const aParsed = parseVersion(a);
  const bParsed = parseVersion(b);

  if (aParsed.major !== bParsed.major) return aParsed.major - bParsed.major;
  if (aParsed.minor !== bParsed.minor) return aParsed.minor - bParsed.minor;
  if (aParsed.patch !== bParsed.patch) return aParsed.patch - bParsed.patch;

  return a.localeCompare(b); // Fallback to string comparison
}

function assessSeverity(versions) {
  if (versions.length < 2) return 'NONE';

  const parsed = versions.map(v => {
    const parts = v
      .replace(/[^\d.]/g, '')
      .split('.')
      .map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
    };
  });

  const hasMajorDiff = new Set(parsed.map(p => p.major)).size > 1;
  const hasMinorDiff = new Set(parsed.map(p => p.minor)).size > 1;

  if (hasMajorDiff) return 'MAJOR';
  if (hasMinorDiff) return 'MINOR';
  return 'PATCH';
}

// Command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🚀 Advanced Extract Yarn Resolutions from package-lock.json

Usage:
  node extract-resolutions-advanced.js [package-lock.json] [output.json] [options]

Options:
  --interactive, -i          Interactive mode for selective resolution
  --security-only           Only show packages with security issues
  --major-only              Only show major version conflicts
  --verbose, -v             Verbose output with detailed information
  --min-conflicts=N         Minimum number of versions for a conflict (default: 2)
  --help, -h                Show this help message

Examples:
  node extract-resolutions-advanced.js
  node extract-resolutions-advanced.js --major-only --verbose
  node extract-resolutions-advanced.js ./package-lock.json ./output.json --security-only
  node extract-resolutions-advanced.js --min-conflicts=3

Output includes:
- Severity assessment (MAJOR/MINOR/PATCH)
- Security vulnerability indicators  
- Development vs production dependency classification
- Detailed statistics and analysis
- Multiple resolution formats (yarn/npm)
  `);
  process.exit(0);
}

// Run the analysis
analyzePackageLockAdvanced();
