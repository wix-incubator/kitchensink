#!/usr/bin/env node

/**
 * Apply Resolutions Helper Script
 *
 * Helps apply yarn resolutions or npm overrides to package.json
 * with safety checks and backups.
 */

import fs from 'fs';
import path from 'path';

const PACKAGE_JSON_PATH = process.argv[2] || './package.json';
const RESOLUTIONS_FILE = process.argv[3] || './resolutions.json';

// Command line flags
const flags = {
  backup: !process.argv.includes('--no-backup'),
  dryRun: process.argv.includes('--dry-run'),
  force: process.argv.includes('--force'),
  criticalOnly: process.argv.includes('--critical-only'),
  yarn: process.argv.includes('--yarn'),
  npm: process.argv.includes('--npm'),
  interactive: process.argv.includes('--interactive'),
};

function applyResolutions() {
  try {
    console.log('🔧 Apply Resolutions Helper');
    console.log('='.repeat(40));

    // Read resolutions file
    if (!fs.existsSync(RESOLUTIONS_FILE)) {
      console.error(`❌ Resolutions file not found: ${RESOLUTIONS_FILE}`);
      console.log(
        '💡 Run "npm run extract-resolutions" first to generate resolutions'
      );
      process.exit(1);
    }

    const resolutionsData = JSON.parse(
      fs.readFileSync(RESOLUTIONS_FILE, 'utf8')
    );

    // Read package.json
    if (!fs.existsSync(PACKAGE_JSON_PATH)) {
      console.error(`❌ package.json not found: ${PACKAGE_JSON_PATH}`);
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));

    console.log(`📁 Package.json: ${PACKAGE_JSON_PATH}`);
    console.log(`📊 Resolutions file: ${RESOLUTIONS_FILE}`);

    // Determine which resolutions to use
    let resolutionsToApply;

    if (resolutionsData.resolutions) {
      // Simple format from basic script
      resolutionsToApply =
        resolutionsData.yarnResolutions || resolutionsData.resolutions;
    } else if (resolutionsData.packageJsonFormats) {
      // Advanced format
      if (flags.criticalOnly) {
        resolutionsToApply = resolutionsData.resolutions.critical;
        console.log('🔴 Using critical resolutions only');
      } else {
        resolutionsToApply = resolutionsData.resolutions.all;
        console.log('📋 Using all resolutions');
      }
    } else {
      console.error('❌ Invalid resolutions file format');
      process.exit(1);
    }

    // Auto-detect package manager if not specified
    if (!flags.yarn && !flags.npm) {
      const hasYarnLock = fs.existsSync('./yarn.lock');
      const hasPackageLock = fs.existsSync('./package-lock.json');

      if (hasYarnLock && !hasPackageLock) {
        flags.yarn = true;
        console.log('🧶 Detected Yarn project');
      } else if (hasPackageLock && !hasYarnLock) {
        flags.npm = true;
        console.log('📦 Detected NPM project');
      } else {
        console.log(
          '⚠️  Cannot auto-detect package manager. Defaulting to Yarn resolutions.'
        );
        flags.yarn = true;
      }
    }

    const resolutionKey = flags.npm ? 'overrides' : 'resolutions';

    console.log(
      `\n📝 Applying ${Object.keys(resolutionsToApply).length} ${resolutionKey}:`
    );

    // Show what will be applied
    Object.entries(resolutionsToApply).forEach(([pkg, version]) => {
      console.log(`  📌 ${pkg}: ${version}`);
    });

    if (flags.dryRun) {
      console.log('\n🔍 DRY RUN - No changes will be made');
      console.log('\nProposed package.json changes:');
      const proposedChanges = { ...packageJson };
      proposedChanges[resolutionKey] = {
        ...(proposedChanges[resolutionKey] || {}),
        ...resolutionsToApply,
      };
      console.log(
        JSON.stringify(
          { [resolutionKey]: proposedChanges[resolutionKey] },
          null,
          2
        )
      );
      return;
    }

    // Check for existing resolutions
    const existingResolutions = packageJson[resolutionKey] || {};
    const conflicts = Object.keys(resolutionsToApply).filter(
      pkg =>
        existingResolutions[pkg] &&
        existingResolutions[pkg] !== resolutionsToApply[pkg]
    );

    if (conflicts.length > 0 && !flags.force) {
      console.log('\n⚠️  Conflicts detected with existing resolutions:');
      conflicts.forEach(pkg => {
        console.log(
          `  📌 ${pkg}: ${existingResolutions[pkg]} → ${resolutionsToApply[pkg]}`
        );
      });
      console.log('\n💡 Use --force to override existing resolutions');
      process.exit(1);
    }

    // Create backup
    if (flags.backup) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${PACKAGE_JSON_PATH}.backup.${timestamp}`;
      fs.writeFileSync(backupPath, fs.readFileSync(PACKAGE_JSON_PATH));
      console.log(`\n💾 Backup created: ${backupPath}`);
    }

    // Apply resolutions
    const updatedPackageJson = { ...packageJson };
    updatedPackageJson[resolutionKey] = {
      ...(updatedPackageJson[resolutionKey] || {}),
      ...resolutionsToApply,
    };

    // Write updated package.json
    fs.writeFileSync(
      PACKAGE_JSON_PATH,
      JSON.stringify(updatedPackageJson, null, 2) + '\n'
    );

    console.log('\n✅ Resolutions applied successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Delete node_modules and lock file');
    console.log('2. Run npm install or yarn install');
    console.log('3. Test your application thoroughly');

    if (flags.npm) {
      console.log('\n🏃‍♂️ Quick commands:');
      console.log('  rm -rf node_modules package-lock.json && npm install');
    } else {
      console.log('\n🏃‍♂️ Quick commands:');
      console.log('  rm -rf node_modules yarn.lock && yarn install');
    }
  } catch (error) {
    console.error('❌ Error applying resolutions:', error.message);
    process.exit(1);
  }
}

// Command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔧 Apply Resolutions Helper

Usage:
  node apply-resolutions.js [package.json] [resolutions.json] [options]

Options:
  --dry-run              Show what would be changed without applying
  --no-backup            Skip creating backup of package.json
  --force                Override existing resolutions
  --critical-only        Apply only critical resolutions (requires advanced format)
  --yarn                 Force yarn resolutions format
  --npm                  Force npm overrides format
  --interactive          Interactive mode for selective application
  --help, -h             Show this help message

Examples:
  node apply-resolutions.js --dry-run
  node apply-resolutions.js --critical-only --npm
  node apply-resolutions.js ./package.json ./resolutions.json --force
  node apply-resolutions.js --no-backup --yarn

Auto-detection:
- Package manager is auto-detected from lock files
- Uses yarn.lock → yarn resolutions
- Uses package-lock.json → npm overrides
  `);
  process.exit(0);
}

// Run the script
applyResolutions();

