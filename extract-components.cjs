#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Packages to analyze
const PACKAGES = [
  '@wix/headless-stores',
  '@wix/headless-ecom', 
  '@wix/headless-seo',
  '@wix/headless-media'
];

// Function to extract service-to-service dependencies from service files
function extractServiceToServiceDependencies(packageName) {
  const packagePath = path.join('node_modules', packageName);
  const servicesPath = path.join(packagePath, 'dist', 'services');
  
  if (!fs.existsSync(servicesPath)) {
    return {};
  }

  const serviceFiles = fs.readdirSync(servicesPath).filter(file => file.endsWith('.js') && file !== 'index.js');
  const serviceDependencies = {};
  
  for (const file of serviceFiles) {
    const filePath = path.join(servicesPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract service name from filename (e.g., collection-service.js -> CollectionService)
    const serviceName = file
      .replace('.js', '')
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + (file.includes('-service') ? '' : 'Service');
    
    const dependencies = [];
    
    // Look for getService calls
    const getServicePattern = /getService\((\w+ServiceDefinition)\)/g;
    let match;
    
    while ((match = getServicePattern.exec(content)) !== null) {
      const depServiceName = match[1].replace('ServiceDefinition', '');
      // Filter out SignalsService as it's a core service dependency for all
      if (depServiceName !== 'Signals' && !dependencies.includes(depServiceName)) {
        dependencies.push(depServiceName);
      }
    }
    
    if (dependencies.length > 0) {
      serviceDependencies[serviceName] = dependencies;
    }
  }
  
  return serviceDependencies;
}

// Function to extract service documentation from TypeScript definition files
function extractServiceInfo(filePath, packageName, serviceName) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const serviceInfo = {
    package: packageName,
    fileName: serviceName,
    interfaces: [],
    services: [],
    examples: []
  };

  let inJSDoc = false;
  let currentJSDoc = [];
  let inExample = false;
  let exampleBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Detect JSDoc start
    if (trimmedLine.startsWith('/**')) {
      inJSDoc = true;
      currentJSDoc = [line];
      inExample = false;
      exampleBuffer = [];
      continue;
    }

    // Detect JSDoc end
    if (inJSDoc && trimmedLine.endsWith('*/')) {
      inJSDoc = false;
      currentJSDoc.push(line);
      
      // Process collected example if any
      if (exampleBuffer.length > 0) {
        serviceInfo.examples.push({
          code: exampleBuffer.join('\n').trim(),
          context: 'JSDoc example'
        });
        exampleBuffer = [];
      }
      
      // Look ahead for the next non-empty line to see what this JSDoc describes
      let nextLineIndex = i + 1;
      while (nextLineIndex < lines.length && lines[nextLineIndex].trim() === '') {
        nextLineIndex++;
      }
      
      if (nextLineIndex < lines.length) {
        const nextLine = lines[nextLineIndex].trim();
        
        // Check if it's an interface
        if (nextLine.startsWith('export interface') || nextLine.startsWith('interface')) {
          const interfaceName = nextLine.match(/(?:export )?interface (\w+)/)?.[1];
          if (interfaceName) {
            serviceInfo.interfaces.push({
              name: interfaceName,
              jsDoc: currentJSDoc.join('\n'),
              definition: extractInterfaceDefinition(lines, nextLineIndex)
            });
          }
        }
        // Check if it's a service declaration (const or function)
        else if (nextLine.startsWith('export declare const') || nextLine.startsWith('export declare function')) {
          const serviceMatch = nextLine.match(/(?:export )?declare (?:const|function) (\w+)/)?.[1];
          if (serviceMatch) {
            serviceInfo.services.push({
              name: serviceMatch,
              jsDoc: currentJSDoc.join('\n'),
              definition: extractServiceDefinition(lines, nextLineIndex)
            });
          }
        }
      }
      
      currentJSDoc = [];
      inExample = false;
      continue;
    }

    // Collect JSDoc content and extract examples
    if (inJSDoc) {
      currentJSDoc.push(line);
      
      // Handle @example tags
      if (trimmedLine.includes('@example')) {
        inExample = true;
        exampleBuffer = [];
      } else if (inExample) {
        // Check if we're still in the example
        if (trimmedLine.startsWith('*') || trimmedLine === '') {
          // Remove JSDoc asterisk and leading spaces
          let exampleLine = line.replace(/^\s*\*\s?/, '');
          
          // Stop collecting if we hit another JSDoc tag
          if (exampleLine.trim().startsWith('@') && !exampleLine.trim().startsWith('@example')) {
            inExample = false;
          } else {
            exampleBuffer.push(exampleLine);
          }
        } else {
          // End of JSDoc comment section
          inExample = false;
        }
      }
    }

    // Also capture interfaces and services without JSDoc (for undocumented services like current-cart-service)
    if (!inJSDoc) {
      // Check if it's an interface without JSDoc
      if (trimmedLine.startsWith('export interface') || trimmedLine.startsWith('interface')) {
        const interfaceName = trimmedLine.match(/(?:export )?interface (\w+)/)?.[1];
        if (interfaceName) {
          // Check if we already have this interface (from JSDoc processing)
          const alreadyExists = serviceInfo.interfaces.some(iface => iface.name === interfaceName);
          if (!alreadyExists) {
            serviceInfo.interfaces.push({
              name: interfaceName,
              jsDoc: '', // No JSDoc available
              definition: extractInterfaceDefinition(lines, i)
            });
          }
        }
      }
      // Check if it's a service declaration without JSDoc
      else if (trimmedLine.startsWith('export declare const') || trimmedLine.startsWith('export declare function') || 
               trimmedLine.startsWith('declare const') || trimmedLine.startsWith('declare function')) {
        const serviceMatch = trimmedLine.match(/(?:export )?declare (?:const|function) (\w+)/)?.[1];
        if (serviceMatch) {
          // Check if we already have this service (from JSDoc processing)
          const alreadyExists = serviceInfo.services.some(service => service.name === serviceMatch);
          if (!alreadyExists) {
            serviceInfo.services.push({
              name: serviceMatch,
              jsDoc: '', // No JSDoc available
              definition: extractServiceDefinition(lines, i)
            });
          }
        }
      }
    }
  }

  return serviceInfo;
}

// Function to process services for a single package
function processServicesForPackage(packageName) {
  const packagePath = path.join('node_modules', packageName);
  const servicesPath = path.join(packagePath, 'dist', 'services');
  
  if (!fs.existsSync(servicesPath)) {
    console.log(`❌ Services not found for ${packageName}`);
    return [];
  }

  const files = fs.readdirSync(servicesPath).filter(file => file.endsWith('.d.ts'));
  const services = [];

  for (const file of files) {
    if (file === 'index.d.ts') continue; // Skip index files
    
    const filePath = path.join(servicesPath, file);
    const serviceName = path.basename(file, '.d.ts');
    
    console.log(`🔧 Processing service ${packageName}/${serviceName}...`);
    
    const serviceInfo = extractServiceInfo(filePath, packageName, serviceName);
    if (serviceInfo && (serviceInfo.interfaces.length > 0 || serviceInfo.services.length > 0)) {
      services.push(serviceInfo);
    }
  }

  return services;
}

// Function to extract exports from package index
function extractPackageExports(packageName) {
  const packagePath = path.join('node_modules', packageName);
  const indexPath = path.join(packagePath, 'dist', 'react', 'index.d.ts');
  
  if (!fs.existsSync(indexPath)) {
    return {};
  }

  const content = fs.readFileSync(indexPath, 'utf8');
  const exports = {};
  
  // Look for export patterns like:
  // export * as ComponentName from "./ComponentName.js";
  const exportPattern = /export\s+\*\s+as\s+(\w+)\s+from\s+['"`]\.\/([^'"`;\s]+)['"`]/g;
  let match;
  
  while ((match = exportPattern.exec(content)) !== null) {
    const [, exportName, filePath] = match;
    const fileName = path.basename(filePath, '.js'); // Remove .js extension
    
    exports[fileName] = {
      type: 'namespace',
      exportName: exportName,
      fileName: fileName
    };
  }
  
  return exports;
}

// Function to extract component service dependencies from JavaScript files
function extractComponentServiceDependencies(packageName, componentName) {
  const packagePath = path.join('node_modules', packageName);
  const jsFilePath = path.join(packagePath, 'dist', 'react', `${componentName}.js`);
  
  if (!fs.existsSync(jsFilePath)) {
    return [];
  }

  const content = fs.readFileSync(jsFilePath, 'utf8');
  const dependencies = [];
  
  // Look for useService calls
  const useServicePattern = /useService\((\w+ServiceDefinition)\)/g;
  let match;
  
  while ((match = useServicePattern.exec(content)) !== null) {
    const serviceName = match[1].replace('ServiceDefinition', '');
    if (!dependencies.includes(serviceName)) {
      dependencies.push(serviceName);
    }
  }
  
  return dependencies;
}

// Function to read TypeScript definition file and extract components info
function extractComponentInfo(filePath, packageName, componentName, packageExports) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Get export info for this component
  const exportInfo = packageExports[componentName] || null;
  
  const componentInfo = {
    package: packageName,
    fileName: componentName,
    exportInfo: exportInfo,
    interfaces: [],
    components: [],
    examples: [],
    serviceDependencies: extractComponentServiceDependencies(packageName, componentName)
  };

  let inJSDoc = false;
  let currentJSDoc = [];
  let inExample = false;
  let exampleBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Detect JSDoc start
    if (trimmedLine.startsWith('/**')) {
      inJSDoc = true;
      currentJSDoc = [line];
      inExample = false;
      exampleBuffer = [];
      continue;
    }

    // Detect JSDoc end
    if (inJSDoc && trimmedLine.endsWith('*/')) {
      inJSDoc = false;
      currentJSDoc.push(line);
      
      // Process collected example if any
      if (exampleBuffer.length > 0) {
        componentInfo.examples.push({
          code: exampleBuffer.join('\n').trim(),
          context: 'JSDoc example'
        });
        exampleBuffer = [];
      }
      
      // Look ahead for the next non-empty line to see what this JSDoc describes
      let nextLineIndex = i + 1;
      while (nextLineIndex < lines.length && lines[nextLineIndex].trim() === '') {
        nextLineIndex++;
      }
      
      if (nextLineIndex < lines.length) {
        const nextLine = lines[nextLineIndex].trim();
        
        // Check if it's an interface
        if (nextLine.startsWith('export interface')) {
          const interfaceName = nextLine.match(/export interface (\w+)/)?.[1];
          if (interfaceName) {
            componentInfo.interfaces.push({
              name: interfaceName,
              jsDoc: currentJSDoc.join('\n'),
              definition: extractInterfaceDefinition(lines, nextLineIndex)
            });
          }
        }
        // Check if it's a component declaration (const or function)
        else if (nextLine.startsWith('export declare const') || nextLine.startsWith('export declare function')) {
          const componentMatch = nextLine.match(/export declare (?:const|function) (\w+)/)?.[1];
          if (componentMatch) {
            componentInfo.components.push({
              name: componentMatch,
              jsDoc: currentJSDoc.join('\n'),
              definition: extractServiceDefinition(lines, nextLineIndex)
            });
          }
        }
      }
      
      currentJSDoc = [];
      inExample = false;
      continue;
    }

    // Collect JSDoc content and extract examples
    if (inJSDoc) {
      currentJSDoc.push(line);
      
      // Handle @example tags
      if (trimmedLine.includes('@example')) {
        inExample = true;
        exampleBuffer = [];
      } else if (inExample) {
        // Check if we're still in the example
        if (trimmedLine.startsWith('*') || trimmedLine === '') {
          // Remove JSDoc asterisk and leading spaces
          let exampleLine = line.replace(/^\s*\*\s?/, '');
          
          // Stop collecting if we hit another JSDoc tag or @component
          if (exampleLine.trim().startsWith('@') && !exampleLine.trim().startsWith('@example')) {
            inExample = false;
          } else {
            exampleBuffer.push(exampleLine);
          }
        } else {
          // End of JSDoc comment section
          inExample = false;
        }
      }
    }
  }

  return componentInfo;
}

function extractInterfaceDefinition(lines, startIndex) {
  let definition = [];
  let braceCount = 0;
  let started = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    definition.push(line);
    
    // Count braces to know when interface definition ends
    for (const char of line) {
      if (char === '{') {
        braceCount++;
        started = true;
      } else if (char === '}') {
        braceCount--;
      }
    }
    
    // Interface definition complete when:
    // 1. All braces balance and we've started, OR
    // 2. We hit a single-line interface (ends with semicolon)
    const allBracesBalanced = braceCount === 0;
    const lineEndsSemicolon = line.trim().endsWith(';');
    
    if (started && allBracesBalanced) {
      break;
    }
    
    // For single-line interface declarations, stop at first semicolon
    if (!started && lineEndsSemicolon && line.trim().includes('interface')) {
      break;
    }
  }
  
  return definition.join('\n');
}


// Function to extract service definition (const or function declarations)
function extractServiceDefinition(lines, startIndex) {
  let definition = [];
  let braceCount = 0;
  let angleCount = 0;
  let parenCount = 0;
  let started = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    definition.push(line);
    
    // Count various brackets to know when service definition ends
    for (const char of line) {
      if (char === '{') {
        braceCount++;
        started = true;
      } else if (char === '}') {
        braceCount--;
      } else if (char === '<') {
        angleCount++;
        started = true;
      } else if (char === '>') {
        angleCount--;
      } else if (char === '(') {
        parenCount++;
        started = true;
      } else if (char === ')') {
        parenCount--;
      }
    }
    
    // Service definition complete when:
    // 1. All brackets balance and we've started, OR
    // 2. Line ends with semicolon and no open brackets
    const allBracketsBalanced = braceCount === 0 && angleCount === 0 && parenCount === 0;
    const lineEndsSemicolon = line.trim().endsWith(';');
    
    if (started && allBracketsBalanced && lineEndsSemicolon) {
      break;
    }
    
    // For simple function declarations, stop at first semicolon
    if (!started && lineEndsSemicolon) {
      break;
    }
  }
  
  return definition.join('\n');
}

// Function to fix import statements in JSDoc examples
function fixJSDocImports(jsDoc, packageName, exportInfo) {
  if (!packageName) return jsDoc;
  
  let fixedJSDoc = jsDoc;
  
  // Map package names to their short equivalents
  const packageMapping = {
    '@wix/headless-media': 'media',
    '@wix/headless-stores': 'stores', 
    '@wix/headless-ecom': 'ecom',
    '@wix/headless-seo': 'seo'
  };
  
  const shortName = packageMapping[packageName];
  if (!shortName) return jsDoc;
  
     // Fix all variations of incorrect import patterns for this package
   // NOTE: We only fix subpath imports, NOT root package imports (e.g. @wix/seo is valid)
   const patterns = [
     // @wix/shortname/components -> @wix/headless-shortname/react
     { from: new RegExp(`@wix\\/${shortName}\\/components`, 'g'), to: `${packageName}/react` }
     // NOTE: We don't fix /services, /server-actions, /astro or root imports
     // because those are valid SDK imports (e.g. @wix/seo, @wix/seo/services are real packages)
   ];
  
  // Apply all patterns
  for (const pattern of patterns) {
    fixedJSDoc = fixedJSDoc.replace(pattern.from, pattern.to);
  }
  
  return fixedJSDoc;
}

// Function to clean up JSDoc content for markdown
function cleanJSDoc(jsDoc, packageName, exportInfo) {
  let cleaned = jsDoc
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').replace(/^\s*\/\*\*\s?/, '').replace(/^\s*\*\/\s?/, ''))
    .filter(line => !line.trim().startsWith('@component'))
    .filter(line => line.trim() !== '/' && line.trim() !== '') // Remove stray `/` and empty lines
    .join('\n')
    .trim();
    
  // Fix incorrect import statements in the JSDoc
  if (packageName) {
    cleaned = fixJSDocImports(cleaned, packageName, exportInfo);
  }
  
  return cleaned;
}

// Function to get all dependencies recursively
function getAllServiceDependencies(serviceName, allServiceDependencies, visited = new Set()) {
  if (visited.has(serviceName)) {
    return []; // Prevent circular dependencies
  }
  
  visited.add(serviceName);
  let allDeps = [];
  
  const serviceKey = serviceName.endsWith('Service') ? serviceName : serviceName + 'Service';
  const directDeps = allServiceDependencies[serviceKey] || [];
  
  for (const dep of directDeps) {
    allDeps.push(dep);
    // Recursively get dependencies of this dependency
    const depName = dep.replace('Service', '');
    const nestedDeps = getAllServiceDependencies(depName, allServiceDependencies, visited);
    allDeps = allDeps.concat(nestedDeps);
  }
  
  // Remove duplicates and return
  return [...new Set(allDeps)];
}

// Function to process a single package
function processPackage(packageName) {
  const packagePath = path.join('node_modules', packageName);
  const reactPath = path.join(packagePath, 'dist', 'react');
  
  if (!fs.existsSync(reactPath)) {
    console.log(`❌ React components not found for ${packageName}`);
    return { components: [], services: [], serviceDependencies: {} };
  }

  const files = fs.readdirSync(reactPath).filter(file => file.endsWith('.d.ts'));
  const components = [];
  
  // Extract package exports information
  const packageExports = extractPackageExports(packageName);
  
  // Extract service-to-service dependencies for this package
  const serviceDependencies = extractServiceToServiceDependencies(packageName);

  // Process services documentation
  const services = processServicesForPackage(packageName);

  for (const file of files) {
    if (file === 'index.d.ts') continue; // Skip index files
    
    const filePath = path.join(reactPath, file);
    const componentName = path.basename(file, '.d.ts');
    
    console.log(`📋 Processing ${packageName}/${componentName}...`);
    
    const componentInfo = extractComponentInfo(filePath, packageName, componentName, packageExports);
    if (componentInfo) {
      components.push(componentInfo);
    }
  }

  return { components, services, serviceDependencies };
}

// Function to generate individual component markdown
function generateComponentMarkdown(comp, allServiceDependencies) {
  const packageShort = comp.package.replace('@wix/headless-', '');
  
  let markdown = `# ${comp.fileName}

**Package:** ${comp.package}

`;

  // Add import information
  if (comp.exportInfo) {
    markdown += `## Import\n\n`;
    if (comp.exportInfo.type === 'namespace') {
      markdown += `\`\`\`typescript\n`;
      markdown += `import { ${comp.exportInfo.exportName} } from '${comp.package}/react';\n`;
      markdown += `\n`;
      markdown += `// Usage:\n`;
      markdown += `<${comp.exportInfo.exportName}.Root />\n`;
      markdown += `\`\`\`\n\n`;
    } else if (comp.exportInfo.type === 'named') {
      markdown += `\`\`\`typescript\n`;
      markdown += `import { ${comp.exportInfo.exportNames.join(', ')} } from '${comp.package}/react';\n`;
      markdown += `\n`;
      markdown += `// Usage:\n`;
      for (const exportName of comp.exportInfo.exportNames) {
        markdown += `<${exportName} />\n`;
      }
      markdown += `\`\`\`\n\n`;
    }
  } else {
    markdown += `## Import\n\nNot directly exported (check package documentation)\n\n`;
  }
  
  // Add service dependencies with full dependency chains
  if (comp.serviceDependencies.length > 0) {
    const totalServices = comp.serviceDependencies.length + 
      comp.serviceDependencies.reduce((sum, service) => {
        const nested = getAllServiceDependencies(service, allServiceDependencies);
        return sum + nested.length;
      }, 0);
    
    markdown += `## Service Dependencies\n\n`;
    markdown += `**Required:** ${totalServices} service${totalServices > 1 ? 's' : ''}\n\n`;
    for (const service of comp.serviceDependencies) {
      markdown += `- \`${service}Service\`\n`;
      
      // Get all nested dependencies for this service
      const nestedDeps = getAllServiceDependencies(service, allServiceDependencies);
      if (nestedDeps.length > 0) {
        for (const nestedDep of nestedDeps) {
          const depName = nestedDep.endsWith('Service') ? nestedDep : nestedDep + 'Service';
          markdown += `  - \`${depName}\`\n`;
        }
      }
    }
    markdown += '\n';
  }

  // Add components
  if (comp.components.length > 0) {
    markdown += `## Components\n\n`;
    for (const component of comp.components) {
      markdown += `### ${component.name}\n\n`;
      
      // Clean and add JSDoc
      const cleanedJSDoc = cleanJSDoc(component.jsDoc, comp.package, comp.exportInfo);
      if (cleanedJSDoc) {
        markdown += `${cleanedJSDoc}\n\n`;
      }
      
      // Add component definition
      markdown += `\`\`\`typescript\n${component.definition}\n\`\`\`\n\n`;
    }
  }

  // Add interfaces
  if (comp.interfaces.length > 0) {
    markdown += `## Interfaces\n\n`;
    for (const interfaceInfo of comp.interfaces) {
      markdown += `### ${interfaceInfo.name}\n\n`;
      
      // Clean and add JSDoc
      const cleanedJSDoc = cleanJSDoc(interfaceInfo.jsDoc, comp.package, comp.exportInfo);
      if (cleanedJSDoc) {
        markdown += `${cleanedJSDoc}\n\n`;
      }
      
      // Add interface definition
      markdown += `\`\`\`typescript\n${interfaceInfo.definition}\n\`\`\`\n\n`;
    }
  }

  // Add examples
  if (comp.examples.length > 0) {
    markdown += `## Examples\n\n`;
    for (const example of comp.examples) {
      // Clean up the example code and fix imports
      let cleanedCode = example.code
        .replace(/^```tsx\s*\n?/gm, '')
        .replace(/^```\s*$/gm, '')
        .trim();
      
      // Fix import statements in examples
      if (comp.package) {
        cleanedCode = fixJSDocImports(cleanedCode, comp.package, comp.exportInfo);
      }
      
      if (cleanedCode) {
        markdown += `\`\`\`tsx\n${cleanedCode}\n\`\`\`\n\n`;
      }
    }
  }

  return markdown;
}

// Function to generate individual service markdown
function generateServiceMarkdown(service) {
  const packageShort = service.package.replace('@wix/headless-', '');
  
  let markdown = `# ${service.fileName} Service

**Package:** ${service.package}

## Import

\`\`\`typescript
`;

  // Generate import statement based on actual service exports
  if (service.services.length > 0) {
    const serviceNames = service.services.map(s => s.name);
    markdown += `import { ${serviceNames.join(', ')} } from '${service.package}/services';\n`;
  } else {
    // Fallback to filename if no services found (shouldn't happen with the fix)
    markdown += `import { ${service.fileName} } from '${service.package}/services';\n`;
  }
  
  markdown += `\`\`\`

`;

  // Add service methods/functions
  if (service.services.length > 0) {
    markdown += `## Methods\n\n`;
    for (const serviceMethod of service.services) {
      markdown += `### ${serviceMethod.name}\n\n`;
      
      // Clean and add JSDoc
      const cleanedJSDoc = cleanJSDoc(serviceMethod.jsDoc, service.package);
      if (cleanedJSDoc) {
        markdown += `${cleanedJSDoc}\n\n`;
      }
      
      // Add method definition
      markdown += `\`\`\`typescript\n${serviceMethod.definition}\n\`\`\`\n\n`;
    }
  }

  // Add service interfaces
  if (service.interfaces.length > 0) {
    markdown += `## Interfaces\n\n`;
    for (const interfaceInfo of service.interfaces) {
      markdown += `### ${interfaceInfo.name}\n\n`;
      
      // Clean and add JSDoc
      const cleanedJSDoc = cleanJSDoc(interfaceInfo.jsDoc, service.package);
      if (cleanedJSDoc) {
        markdown += `${cleanedJSDoc}\n\n`;
      }
      
      // Add interface definition
      markdown += `\`\`\`typescript\n${interfaceInfo.definition}\n\`\`\`\n\n`;
    }
  }

  // Add service examples
  if (service.examples.length > 0) {
    markdown += `## Examples\n\n`;
    for (const example of service.examples) {
      // Clean up the example code and fix imports
      let cleanedCode = example.code
        .replace(/^```typescript\s*\n?/gm, '')
        .replace(/^```tsx\s*\n?/gm, '')
        .replace(/^```\s*$/gm, '')
        .trim();
      
      // Fix import statements in examples
      if (service.package) {
        cleanedCode = fixJSDocImports(cleanedCode, service.package);
      }
      
      if (cleanedCode) {
        markdown += `\`\`\`typescript\n${cleanedCode}\n\`\`\`\n\n`;
      }
    }
  }

  return markdown;
}

// Function to generate index markdown with navigation
function generateIndexMarkdown(allData) {
  const allComponents = allData.flatMap(data => data.components);
  const allServices = allData.flatMap(data => data.services);
  const allServiceDependencies = Object.assign({}, ...allData.map(data => data.serviceDependencies));

  let markdown = `# Wix Headless Components & Services Documentation

> Auto-generated from TypeScript definitions and JSDoc comments

This documentation is split into individual files for easier navigation and LLM consumption.

## Navigation

### By Package

`;

  // Generate table of contents by package
  for (const packageName of PACKAGES) {
    const packageComponents = allComponents.filter(comp => comp.package === packageName);
    const packageServices = allServices.filter(service => service.package === packageName);
    
    if (packageComponents.length > 0 || packageServices.length > 0) {
      const packageShort = packageName.replace('@wix/headless-', '');
      markdown += `#### ${packageName}\n\n`;
      
      if (packageComponents.length > 0) {
        markdown += `**Components:**\n`;
        for (const comp of packageComponents) {
          const filename = `${packageShort}-${comp.fileName}.md`;
          markdown += `- [${comp.fileName}](./components/${filename})\n`;
        }
        markdown += '\n';
      }
      
      if (packageServices.length > 0) {
        markdown += `**Services:**\n`;
        for (const service of packageServices) {
          const filename = `${packageShort}-${service.fileName}.md`;
          markdown += `- [${service.fileName}](./services/${filename})\n`;
        }
        markdown += '\n';
      }
    }
  }

  // Add alphabetical index
  markdown += `### Alphabetical Index

#### Components

`;
  const sortedComponents = allComponents.sort((a, b) => a.fileName.localeCompare(b.fileName));
  for (const comp of sortedComponents) {
    const packageShort = comp.package.replace('@wix/headless-', '');
    const filename = `${packageShort}-${comp.fileName}.md`;
    markdown += `- [${comp.fileName}](./components/${filename}) (${comp.package})\n`;
  }

  markdown += `\n#### Services\n\n`;
  const sortedServices = allServices.sort((a, b) => a.fileName.localeCompare(b.fileName));
  for (const service of sortedServices) {
    const packageShort = service.package.replace('@wix/headless-', '');
    const filename = `${packageShort}-${service.fileName}.md`;
    markdown += `- [${service.fileName}](./services/${filename}) (${service.package})\n`;
  }

  // Add service dependencies reference
  if (Object.keys(allServiceDependencies).length > 0) {
    markdown += `\n### Additional References\n\n`;
    markdown += `- [Service Dependencies Reference](./service-dependencies.md)\n`;
  }

  // Add summary statistics
  markdown += `\n## Summary\n\n`;
  markdown += `- **Total Components:** ${allComponents.length}\n`;
  markdown += `- **Total Services:** ${allServices.length}\n`;
  markdown += `- **Packages:** ${PACKAGES.length}\n`;
  markdown += `- **Services with Dependencies:** ${Object.keys(allServiceDependencies).length}\n`;

  return markdown;
}

// Function to generate service dependencies reference
function generateServiceDependenciesMarkdown(allData) {
  const allServiceDependencies = Object.assign({}, ...allData.map(data => data.serviceDependencies));
  
  let markdown = `# Service Dependencies Reference

This document shows which services depend on other services internally via \`getService()\` calls.

Understanding these dependencies is important when using components that require services, as you may need to ensure multiple services are available.

## Dependencies

`;
  
  const sortedServices = Object.keys(allServiceDependencies).sort();
  for (const serviceName of sortedServices) {
    const dependencies = allServiceDependencies[serviceName];
    markdown += `### ${serviceName}\n\n`;
    markdown += `**Depends on:**\n`;
    for (const dep of dependencies) {
      const depName = dep.endsWith('Service') ? dep : dep + 'Service';
      markdown += `- \`${depName}\`\n`;
    }
    markdown += '\n';
  }

  return markdown;
}

// Function to generate documentation files
function generateDocumentationFiles(allData) {
  const allComponents = allData.flatMap(data => data.components);
  const allServices = allData.flatMap(data => data.services);
  const allServiceDependencies = Object.assign({}, ...allData.map(data => data.serviceDependencies));
  
  // Create directories
  const docsDir = 'component-docs';
  const componentsDir = path.join(docsDir, 'components');
  const servicesDir = path.join(docsDir, 'services');
  
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true });
  }

  // Generate index file
  const indexMarkdown = generateIndexMarkdown(allData);
  fs.writeFileSync(path.join(docsDir, 'index.md'), indexMarkdown);
  console.log(`✅ Generated index.md`);

  // Generate individual component files
  for (const comp of allComponents) {
    const packageShort = comp.package.replace('@wix/headless-', '');
    const filename = `${packageShort}-${comp.fileName}.md`;
    const componentMarkdown = generateComponentMarkdown(comp, allServiceDependencies);
    fs.writeFileSync(path.join(componentsDir, filename), componentMarkdown);
    console.log(`✅ Generated components/${filename}`);
  }

  // Generate individual service files
  for (const service of allServices) {
    const packageShort = service.package.replace('@wix/headless-', '');
    const filename = `${packageShort}-${service.fileName}.md`;
    const serviceMarkdown = generateServiceMarkdown(service);
    fs.writeFileSync(path.join(servicesDir, filename), serviceMarkdown);
    console.log(`✅ Generated services/${filename}`);
  }

  // Generate service dependencies reference
  if (Object.keys(allServiceDependencies).length > 0) {
    const serviceDepsMarkdown = generateServiceDependenciesMarkdown(allData);
    fs.writeFileSync(path.join(docsDir, 'service-dependencies.md'), serviceDepsMarkdown);
    console.log(`✅ Generated service-dependencies.md`);
  }

  return {
    totalFiles: 1 + allComponents.length + allServices.length + (Object.keys(allServiceDependencies).length > 0 ? 1 : 0),
    components: allComponents.length,
    services: allServices.length
  };
}

// Main execution
function main() {
  console.log('🚀 Starting Wix Headless Components & Services extraction...\n');
  
  let allData = [];

  for (const packageName of PACKAGES) {
    console.log(`📦 Processing package: ${packageName}`);
    const packageData = processPackage(packageName);
    allData.push(packageData);
    console.log(`✅ Found ${packageData.components.length} component files`);
    console.log(`✅ Found ${packageData.services.length} service files`);
    console.log(`✅ Found ${Object.keys(packageData.serviceDependencies).length} services with dependencies\n`);
  }

  console.log(`📝 Generating documentation files...`);
  const result = generateDocumentationFiles(allData);
  
  console.log(`✅ Documentation generated in component-docs/ directory`);
  console.log(`📁 Total files created: ${result.totalFiles}`);
  console.log(`📊 Components: ${result.components} files`);
  console.log(`📊 Services: ${result.services} files`);
  console.log(`📊 Plus index and reference files`);
}

// Run the script
if (require.main === module) {
  main();
}