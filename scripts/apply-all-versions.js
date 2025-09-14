#!/usr/bin/env node

/**
 * Apply Complete Version Manifest to Project
 *
 * Takes a version manifest and applies ALL versions to a target project,
 * ensuring exact version synchronization across projects.
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  backup: !args.includes('--no-backup'),
  dryRun: args.includes('--dry-run'),
  force: args.includes('--force'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  yarn: args.includes('--yarn'),
  npm: args.includes('--npm'),
  clean: args.includes('--clean'),
  install: args.includes('--install'),
  directOnly: args.includes('--direct-only'),
  skipMissing: args.includes('--skip-missing'),
};

// Get file paths (non-flag arguments)
const fileArgs = args.filter(arg => !arg.startsWith('-'));
const VERSION_MANIFEST_PATH = fileArgs[0];
const TARGET_PROJECT_PATH = fileArgs[1] || './';

if (!VERSION_MANIFEST_PATH) {
  console.error('❌ Version manifest file path is required');
  console.log(
    'Usage: node apply-all-versions.js <version-manifest.json> [target-project-path]'
  );
  process.exit(1);
}

function applyAllVersions() {
  try {
    console.log('🚀 Apply Complete Version Manifest');
    console.log('='.repeat(50));

    // Resolve paths
    const manifestPath = path.resolve(VERSION_MANIFEST_PATH);
    const targetPath = path.resolve(TARGET_PROJECT_PATH);
    const targetPackageJsonPath = path.join(targetPath, 'package.json');

    console.log(`📄 Version manifest: ${manifestPath}`);
    console.log(`🎯 Target project: ${targetPath}`);

    // Read version manifest
    if (!fs.existsSync(manifestPath)) {
      console.error(`❌ Version manifest not found: ${manifestPath}`);
      process.exit(1);
    }

    const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Extract versions from different manifest formats
    let versions;
    if (manifestData.versions) {
      // Detailed manifest format
      versions = manifestData.versions;
    } else if (manifestData.resolutions) {
      // Yarn resolutions format
      versions = manifestData.resolutions;
    } else if (manifestData.overrides) {
      // NPM overrides format
      versions = manifestData.overrides;
    } else if (manifestData.packageExtensions) {
      // PNPM format
      versions = manifestData.packageExtensions;
    } else {
      // Assume direct key-value pairs
      versions = manifestData;
    }

    console.log(
      `📦 Found ${Object.keys(versions).length} package versions in manifest`
    );

    // Read target project's package.json
    if (!fs.existsSync(targetPackageJsonPath)) {
      console.error(
        `❌ Target package.json not found: ${targetPackageJsonPath}`
      );
      process.exit(1);
    }

    const targetPackageJson = JSON.parse(
      fs.readFileSync(targetPackageJsonPath, 'utf8')
    );

    // Auto-detect package manager if not specified
    if (!flags.yarn && !flags.npm) {
      const hasYarnLock = fs.existsSync(path.join(targetPath, 'yarn.lock'));
      const hasPackageLock = fs.existsSync(
        path.join(targetPath, 'package-lock.json')
      );

      if (hasYarnLock && !hasPackageLock) {
        flags.yarn = true;
        console.log('🧶 Detected Yarn project');
      } else if (hasPackageLock && !hasYarnLock) {
        flags.npm = true;
        console.log('📦 Detected NPM project');
      } else {
        console.log(
          '⚠️  Cannot auto-detect package manager. Defaulting to NPM overrides.'
        );
        flags.npm = true;
      }
    }

    const resolutionKey = flags.yarn ? 'resolutions' : 'overrides';

    // Filter versions if directOnly flag is set
    let versionsToApply = versions;
    if (flags.directOnly) {
      const directDeps = new Set([
        ...Object.keys(targetPackageJson.dependencies || {}),
        ...Object.keys(targetPackageJson.devDependencies || {}),
      ]);

      versionsToApply = Object.fromEntries(
        Object.entries(versions).filter(([name]) => directDeps.has(name))
      );

      console.log(
        `🎯 Filtering to direct dependencies only: ${Object.keys(versionsToApply).length} packages`
      );
    }

    // Check for packages that exist in target but not in manifest
    const targetDeps = new Set([
      ...Object.keys(targetPackageJson.dependencies || {}),
      ...Object.keys(targetPackageJson.devDependencies || {}),
    ]);

    const missingInManifest = [...targetDeps].filter(dep => !versions[dep]);
    if (missingInManifest.length > 0 && !flags.skipMissing) {
      console.log('\n⚠️  Packages in target project not found in manifest:');
      missingInManifest.forEach(pkg => console.log(`  📌 ${pkg}`));
      console.log('\n💡 Use --skip-missing to ignore these packages');
      if (!flags.force) {
        console.log('💡 Use --force to continue anyway');
        process.exit(1);
      }
    }

    // Show what will be applied
    console.log(
      `\n📝 Applying ${Object.keys(versionsToApply).length} version ${resolutionKey}:`
    );

    if (flags.verbose) {
      Object.entries(versionsToApply)
        .slice(0, 20)
        .forEach(([pkg, version]) => {
          const inTarget = targetDeps.has(pkg) ? '📌' : '🔗';
          console.log(`  ${inTarget} ${pkg}: ${version}`);
        });
      if (Object.keys(versionsToApply).length > 20) {
        console.log(
          `  ... and ${Object.keys(versionsToApply).length - 20} more packages`
        );
      }
    } else {
      console.log(
        `  First 5: ${Object.keys(versionsToApply).slice(0, 5).join(', ')}`
      );
      if (Object.keys(versionsToApply).length > 5) {
        console.log(
          `  ... and ${Object.keys(versionsToApply).length - 5} more`
        );
      }
    }

    if (flags.dryRun) {
      console.log('\n🔍 DRY RUN - No changes will be made');
      console.log('\nProposed package.json addition:');
      console.log(
        JSON.stringify({ [resolutionKey]: versionsToApply }, null, 2)
      );
      return;
    }

    // Check for existing resolutions/overrides
    const existingResolutions = targetPackageJson[resolutionKey] || {};
    const conflicts = Object.keys(versionsToApply).filter(
      pkg =>
        existingResolutions[pkg] &&
        existingResolutions[pkg] !== versionsToApply[pkg]
    );

    if (conflicts.length > 0 && !flags.force) {
      console.log('\n⚠️  Conflicts with existing resolutions:');
      conflicts.slice(0, 10).forEach(pkg => {
        console.log(
          `  📌 ${pkg}: ${existingResolutions[pkg]} → ${versionsToApply[pkg]}`
        );
      });
      if (conflicts.length > 10) {
        console.log(`  ... and ${conflicts.length - 10} more conflicts`);
      }
      console.log('\n💡 Use --force to override existing resolutions');
      process.exit(1);
    }

    // Create backup
    if (flags.backup) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${targetPackageJsonPath}.backup.${timestamp}`;
      fs.writeFileSync(backupPath, fs.readFileSync(targetPackageJsonPath));
      console.log(`\n💾 Backup created: ${backupPath}`);
    }

    // Apply all versions
    const updatedPackageJson = { ...targetPackageJson };
    updatedPackageJson[resolutionKey] = {
      ...(updatedPackageJson[resolutionKey] || {}),
      ...versionsToApply,
    };

    // Write updated package.json
    fs.writeFileSync(
      targetPackageJsonPath,
      JSON.stringify(updatedPackageJson, null, 2) + '\n'
    );
    console.log('\n✅ All versions applied successfully!');

    // Clean and install if requested
    if (flags.clean || flags.install) {
      console.log('\n🧹 Cleaning existing installations...');

      const nodeModulesPath = path.join(targetPath, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true, force: true });
        console.log('  ✅ Removed node_modules');
      }

      if (flags.yarn) {
        const yarnLockPath = path.join(targetPath, 'yarn.lock');
        if (fs.existsSync(yarnLockPath)) {
          fs.unlinkSync(yarnLockPath);
          console.log('  ✅ Removed yarn.lock');
        }
      } else {
        const packageLockPath = path.join(targetPath, 'package-lock.json');
        if (fs.existsSync(packageLockPath)) {
          fs.unlinkSync(packageLockPath);
          console.log('  ✅ Removed package-lock.json');
        }
      }

      if (flags.install) {
        console.log('\n📦 Installing dependencies...');
        const { execSync } = require('child_process');
        try {
          const installCmd = flags.yarn ? 'yarn install' : 'npm install';
          execSync(installCmd, {
            cwd: targetPath,
            stdio: 'inherit',
          });
          console.log('  ✅ Dependencies installed successfully');
        } catch (error) {
          console.error('  ❌ Installation failed:', error.message);
        }
      }
    }

    // Show next steps
    console.log('\n📋 NEXT STEPS:');
    if (!flags.clean && !flags.install) {
      console.log('1. Delete node_modules and lock file in target project');
      console.log('2. Run dependency installation');
      console.log('3. Test the target project thoroughly');

      console.log('\n🏃‍♂️ Quick commands:');
      if (flags.yarn) {
        console.log(
          `  cd ${targetPath} && rm -rf node_modules yarn.lock && yarn install`
        );
      } else {
        console.log(
          `  cd ${targetPath} && rm -rf node_modules package-lock.json && npm install`
        );
      }
    } else {
      console.log('1. Test the target project thoroughly');
      console.log('2. Verify all functionality works as expected');
    }

    console.log('\n📊 SYNCHRONIZATION COMPLETE:');
    console.log(
      `  ✅ Applied ${Object.keys(versionsToApply).length} package versions`
    );
    console.log(`  🎯 Target project now uses identical versions`);

    if (manifestData.metadata?.projectName) {
      console.log(`  📦 Source project: ${manifestData.metadata.projectName}`);
    }
  } catch (error) {
    console.error('❌ Error applying versions:', error.message);
    if (flags.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🚀 Apply Complete Version Manifest to Project

Usage:
  node apply-all-versions.js <version-manifest.json> [target-project-path] [options]

Arguments:
  version-manifest.json  Path to version manifest file (required)
  target-project-path    Path to target project (default: current directory)

Options:
  --dry-run              Show what would be changed without applying
  --no-backup            Skip creating backup of package.json
  --force                Override existing resolutions and continue on conflicts
  --verbose, -v          Show detailed information
  --yarn                 Force yarn resolutions format
  --npm                  Force npm overrides format
  --clean                Remove node_modules and lock file after applying
  --install              Run npm/yarn install after cleaning
  --direct-only          Only apply versions for packages that are direct dependencies
  --skip-missing         Skip packages that are in target but not in manifest
  --help, -h             Show this help message

Examples:
  node apply-all-versions.js ./version-manifest.json
  node apply-all-versions.js ./versions.json ../other-project --clean --install
  node apply-all-versions.js ./manifest.json . --dry-run --verbose
  node apply-all-versions.js ./versions.json /path/to/project --direct-only --yarn

Workflow:
1. Generate version manifest from source project
2. Apply manifest to target project(s)
3. All projects now use identical package versions
4. Ensures reproducible builds across environments
  `);
  process.exit(0);
}

// Run the script
applyAllVersions();

