#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { TSDocParser, DocComment, PlainTextEmitter } = require('@microsoft/tsdoc');
const Handlebars = require('handlebars');
const { glob } = require('glob');
const { parallel } = require('async');

// Configuration
const CONFIG = {
  packages: [
    '@wix/headless-stores',
    '@wix/headless-ecom', 
    '@wix/headless-seo',
    '@wix/headless-media'
  ],
  outputDir: 'component-docs',
  templatesDir: path.join(__dirname, 'templates'),
  compilerOptions: {
    target: ts.ScriptTarget.ES2018,
    module: ts.ModuleKind.CommonJS,
    declaration: true,
    skipLibCheck: true,
    allowSyntheticDefaultImports: true
  }
};

// Initialize TSDoc parser with configuration
const tsdocConfiguration = new (require('@microsoft/tsdoc').TSDocConfiguration)();
const tsdocParser = new TSDocParser(tsdocConfiguration);

/**
 * Main class for extracting documentation from TypeScript packages
 */
class TypeScriptDocExtractor {
  constructor() {
    this.setupTemplates();
  }

  /**
   * Set up Handlebars templates
   */
  setupTemplates() {
    // Register Handlebars helpers
    Handlebars.registerHelper('eq', (a, b) => a === b);
    Handlebars.registerHelper('gt', (a, b) => a > b);
    Handlebars.registerHelper('pluralize', (count, singular, plural) => {
      return count === 1 ? singular : plural || (singular + 's');
    });
    Handlebars.registerHelper('packageShort', (pkg) => {
      if (typeof pkg === 'string') {
        return pkg.replace('@wix/headless-', '');
      }
      return pkg || '';
    });
    Handlebars.registerHelper('lookup', (obj, key) => {
      return obj && obj[key];
    });
    Handlebars.registerHelper('length', (arr) => {
      return arr ? arr.length : 0;
    });
    Handlebars.registerHelper('hasServiceDependencies', (serviceDependencies) => {
      return serviceDependencies && Object.keys(serviceDependencies).length > 0;
    });
    Handlebars.registerHelper('serviceNameFromFileName', (fileName) => {
      // Convert "product-modifiers-service" -> "ProductModifiersService"
      return fileName
        .replace(/-service$/, '') // Remove "-service" suffix
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Service';
    });
    Handlebars.registerHelper('getServiceInfo', (serviceName, serviceToComponent, serviceToLoader) => {
      if (!serviceToComponent && !serviceToLoader) return '';
      
      const parts = [];
      
      // Get providing component
      if (serviceToComponent) {
        // First try exact match
        let componentName = serviceToComponent[serviceName];
        
        // If no exact match, try case-insensitive lookup
        if (!componentName) {
          const lowerServiceName = serviceName.toLowerCase();
          const matchingKey = Object.keys(serviceToComponent).find(key => 
            key.toLowerCase() === lowerServiceName
          );
          componentName = matchingKey ? serviceToComponent[matchingKey] : null;
        }
        
        if (componentName) {
          parts.push(`Root: <${componentName}.Root />`);
        }
      }
      
      // Get loader function
      if (serviceToLoader) {
        // First try exact match
        let loaderFunction = serviceToLoader[serviceName];
        
        // If no exact match, try case-insensitive lookup
        if (!loaderFunction) {
          const lowerServiceName = serviceName.toLowerCase();
          const matchingKey = Object.keys(serviceToLoader).find(key => 
            key.toLowerCase() === lowerServiceName
          );
          loaderFunction = matchingKey ? serviceToLoader[matchingKey] : null;
        }
        
        if (loaderFunction) {
          parts.push(`Config function: ${loaderFunction}`);
        }
      }
      
      return parts.length > 0 ? ` ( ${parts.join(', ')} )` : '';
    });
    
    // Load templates
    this.templates = {
      component: this.loadTemplate('component.hbs'),
      service: this.loadTemplate('service.hbs'),
      index: this.loadTemplate('index.hbs'),
      serviceDeps: this.loadTemplate('service-dependencies.hbs')
    };
  }

  /**
   * Load a Handlebars template file
   */
  loadTemplate(templateName) {
    try {
      const templatePath = path.join(CONFIG.templatesDir, templateName);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      return Handlebars.compile(templateSource);
    } catch (error) {
      // Fallback to inline templates if template files don't exist
      return this.getInlineTemplate(templateName);
    }
  }

  /**
   * Get inline template as fallback
   */
  getInlineTemplate(templateName) {
    const templates = {
             'component.hbs': `# {{fileName}}

**Package:** {{package}}

## Import

{{#if exportInfo}}
\`\`\`typescript
import { {{exportInfo.exportName}} } from '{{package}}/react';
\`\`\`
{{else}}
Not directly exported (check package documentation)
{{/if}}

{{#if serviceDependencies}}
## Service Dependencies

**Required:** {{totalServices}} {{pluralize totalServices "service"}}

{{#each serviceDependencies}}
- \`{{this}}Service\`
{{/each}}
{{/if}}

{{#if components}}
## Components

{{#each components}}
### {{name}}

{{#if description}}
{{{description}}}
{{/if}}

\`\`\`typescript
{{{definition}}}
\`\`\`

{{/each}}
{{/if}}

{{#if interfaces}}
## Interfaces

{{#each interfaces}}
### {{name}}

{{#if description}}
{{{description}}}
{{/if}}

\`\`\`typescript
{{{definition}}}
\`\`\`

{{/each}}
{{/if}}

{{#if examples}}
## Examples

{{#each examples}}
\`\`\`{{language}}
{{{code}}}
\`\`\`

{{/each}}
{{/if}}
`,
             'service.hbs': `# {{fileName}} Service

**Package:** {{package}}

## Import

\`\`\`typescript
{{#if services}}
import { {{#each services}}{{name}}{{#unless @last}}, {{/unless}}{{/each}} } from '{{package}}/services';
{{else}}
import { {{fileName}} } from '{{package}}/services';
{{/if}}
\`\`\`

{{#if services}}
## Methods

{{#each services}}
### {{name}}

{{#if description}}
{{{description}}}
{{/if}}

\`\`\`typescript
{{{definition}}}
\`\`\`

{{/each}}
{{/if}}

{{#if interfaces}}
## Interfaces

{{#each interfaces}}
### {{name}}

{{#if description}}
{{{description}}}
{{/if}}

\`\`\`typescript
{{{definition}}}
\`\`\`

{{/each}}
{{/if}}
`,
             'service-dependencies.hbs': `# Service Dependencies

{{#each packages}}
## {{name}}

{{#each services}}
{{serviceNameFromFileName fileName}}{{{getServiceInfo (serviceNameFromFileName fileName) ../../serviceToComponent ../../serviceToLoader}}}
{{#with (lookup ../serviceDependencies fileName)}}
{{#each this}}
|- {{.}}
{{/each}}
{{/with}}

{{/each}}
{{/each}}
`,
             'index.hbs': `# Wix Headless Components & Services Documentation

> Auto-generated from TypeScript definitions using TypeScript Compiler API

This documentation is split into individual files for easier navigation and LLM consumption.

## Navigation

### By Package

{{#each packages}}
#### {{name}}

{{#if components}}
**Components:**
{{#each components}}
- [{{fileName}}](./components/{{../packageShort}}-{{fileName}}.md)
{{/each}}
{{/if}}

{{#if services}}
**Services:**
{{#each services}}
- [{{fileName}}](./services/{{../packageShort}}-{{fileName}}.md)
{{/each}}
{{/if}}

{{/each}}

## Summary

- **Total Components:** {{stats.components}}
- **Total Services:** {{stats.services}}
- **Packages:** {{stats.packages}}
`
    };
    
    return Handlebars.compile(templates[templateName] || '# {{fileName}}\n\nNo template available.');
  }

  /**
   * Extract documentation from all packages
   */
  async extractAll() {
    console.log('🚀 Starting TypeScript-based documentation extraction...\n');
    
    const allData = await this.processPackagesInParallel();
    await this.generateDocumentation(allData);
    
    console.log('✅ Documentation extraction complete!');
    return allData;
  }

  /**
   * Process all packages in parallel
   */
  async processPackagesInParallel() {
    const processingTasks = CONFIG.packages.map(packageName => 
      (callback) => {
        console.log(`📦 Processing package: ${packageName}`);
        this.processPackage(packageName)
          .then(result => callback(null, result))
          .catch(callback);
      }
    );

    return new Promise((resolve, reject) => {
      parallel(processingTasks, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  /**
   * Process a single package
   */
  async processPackage(packageName) {
    const packagePath = path.join('node_modules', packageName);
    
    try {
      const [components, services, serviceDependencies] = await Promise.all([
        this.extractComponents(packagePath, packageName),
        this.extractServices(packagePath, packageName),
        this.extractServiceDependencies(packagePath)
      ]);

      console.log(`✅ ${packageName}: ${components.length} components, ${services.length} services`);
      
      return {
        packageName,
        components,
        services,
        serviceDependencies
      };
    } catch (error) {
      console.error(`❌ Error processing ${packageName}:`, error.message);
      return {
        packageName,
        components: [],
        services: [],
        serviceDependencies: {}
      };
    }
  }

  /**
   * Extract package exports from main index file
   */
  extractPackageExports(packagePath) {
    const indexPath = path.join(packagePath, 'dist', 'react', 'index.js');
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

  /**
   * Extract components from package using TypeScript Compiler API
   */
  async extractComponents(packagePath, packageName) {
    const reactPath = path.join(packagePath, 'dist', 'react');
    
    if (!fs.existsSync(reactPath)) {
      return [];
    }

    // Extract export information
    const packageExports = this.extractPackageExports(packagePath);

    const tsFiles = await glob(path.join(reactPath, '*.d.ts'));
    const components = [];

    for (const filePath of tsFiles) {
      if (path.basename(filePath) === 'index.d.ts') continue;
      
      const componentInfo = await this.parseTypeScriptFile(filePath, packageName, 'component');
      if (componentInfo && (componentInfo.components.length > 0 || componentInfo.interfaces.length > 0)) {
        // Get export info for this component
        const fileName = path.basename(filePath, '.d.ts');
        const exportInfo = packageExports[fileName] || null;
        
        components.push({
          ...componentInfo,
          exportInfo
        });
      }
    }

    return components;
  }

  /**
   * Extract services from package using TypeScript Compiler API
   */
  async extractServices(packagePath, packageName) {
    const servicesPath = path.join(packagePath, 'dist', 'services');
    
    if (!fs.existsSync(servicesPath)) {
      return [];
    }

    const tsFiles = await glob(path.join(servicesPath, '*.d.ts'));
    const services = [];

    for (const filePath of tsFiles) {
      if (path.basename(filePath) === 'index.d.ts') continue;
      
      const serviceInfo = await this.parseTypeScriptFile(filePath, packageName, 'service');
      if (serviceInfo && (serviceInfo.services.length > 0 || serviceInfo.interfaces.length > 0)) {
        services.push(serviceInfo);
      }
    }

    return services;
  }

  /**
   * Parse TypeScript file using Compiler API
   */
  async parseTypeScriptFile(filePath, packageName, type) {
    try {
      const sourceFile = ts.createSourceFile(
        filePath,
        fs.readFileSync(filePath, 'utf8'),
        ts.ScriptTarget.Latest,
        true
      );

      const fileName = path.basename(filePath, '.d.ts');
      const result = {
        package: packageName,
        fileName,
        type,
        components: [],
        services: [],
        interfaces: [],
        examples: [],
        serviceDependencies: await this.extractServiceDependenciesFromFile(filePath)
      };

      // Walk the AST
      this.visitNode(sourceFile, result);

      return result;
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Visit AST nodes and extract information
   */
  visitNode(node, result) {
    switch (node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration:
        this.processInterface(node, result);
        break;
      case ts.SyntaxKind.FunctionDeclaration:
      case ts.SyntaxKind.VariableStatement:
        this.processDeclaration(node, result);
        break;
    }

    ts.forEachChild(node, child => this.visitNode(child, result));
  }

  /**
   * Process interface declaration
   */
  processInterface(node, result) {
    const name = node.name?.getText();
    if (!name) return;

    const jsDocComment = this.getJSDocComment(node);
    const definition = this.getNodeText(node);

    result.interfaces.push({
      name,
      definition,
      description: jsDocComment?.description || '',
      examples: jsDocComment?.examples || []
    });
  }

  /**
   * Process function or variable declaration
   */
  processDeclaration(node, result) {
    let name, definition;

    if (ts.isFunctionDeclaration(node)) {
      name = node.name?.getText();
      definition = this.getNodeText(node);
    } else if (ts.isVariableStatement(node)) {
      const declaration = node.declarationList.declarations[0];
      name = declaration.name?.getText();
      definition = this.getNodeText(node);
    }

    if (!name) return;

    const jsDocComment = this.getJSDocComment(node);
    const item = {
      name,
      definition,
      description: jsDocComment?.description || '',
      examples: jsDocComment?.examples || []
    };

    // Determine if it's a component or service based on context
    if (result.type === 'component') {
      result.components.push(item);
    } else {
      result.services.push(item);
    }
  }

  /**
   * Extract and parse JSDoc comment using @microsoft/tsdoc
   */
  getJSDocComment(node) {
    const jsDocNodes = ts.getJSDocCommentsAndTags(node);
    if (jsDocNodes.length === 0) return null;

    try {
      const commentText = jsDocNodes[0].getFullText();
      
      // Try parsing with TSDoc first
      const parserContext = tsdocParser.parseString(commentText);
      
      if (parserContext.docComment) {
        return this.extractTSDocInfo(parserContext.docComment);
      }
    } catch (error) {
      // Fallback to simple text extraction
      return this.parseJSDocFallback(jsDocNodes[0].getFullText());
    }

    return null;
  }

  /**
   * Extract text content from TSDoc nodes using the official PlainTextEmitter
   */
  extractTextFromTSDocNodes(nodes) {
    const textParts = [];
    
    for (const node of nodes) {
      // Only extract text from paragraphs that contain actual descriptive content
      if (node.constructor.name === 'DocParagraph' && node.nodes) {
        const paragraphText = this.extractDescriptiveTextOnly(node);
        if (paragraphText.trim()) {
          textParts.push(paragraphText);
        }
      }
    }
    
    return textParts.join(' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Extract only descriptive text from a paragraph, skipping JSDoc block tags and their content
   */
  extractDescriptiveTextOnly(paragraphNode) {
    const textParts = [];
    let insideBlockTag = false;
    
    for (const node of paragraphNode.nodes) {
      if (node.constructor.name === 'DocBlockTag') {
        insideBlockTag = true;
        continue; // Skip the block tag itself
      }
      
      if (node.constructor.name === 'DocPlainText') {
        // Skip text that comes after block tags (like "1" after "@order")
        if (!insideBlockTag) {
          textParts.push(node.text || '');
        }
      } else if (node.constructor.name === 'DocSoftBreak') {
        if (!insideBlockTag) {
          textParts.push(' ');
        }
      }
      
      // Reset after processing non-block-tag content
      if (node.constructor.name !== 'DocBlockTag' && 
          node.constructor.name !== 'DocExcerpt' &&
          node.constructor.name !== 'DocSoftBreak') {
        insideBlockTag = false;
      }
    }
    
    return textParts.join('').trim();
  }

  /**
   * Extract information from TSDoc comment
   */
  extractTSDocInfo(docComment) {
    const result = {
      description: '',
      examples: []
    };

          // Extract summary/description
      if (docComment.summarySection) {
        const description = this.extractTextFromTSDocNodes(docComment.summarySection.nodes);
        
        result.description = this.decodeHtmlEntities(description);
    }

    // Extract examples
    if (docComment.customBlocks) {
      for (const block of docComment.customBlocks) {
        if (block.blockTag.tagName === '@example') {
          const exampleText = this.extractTextFromTSDocNodes(block.content.nodes);
          
          result.examples.push({
            code: this.decodeHtmlEntities(exampleText),
            language: 'typescript'
          });
        }
      }
    }

    return result;
  }

  /**
   * Decode HTML entities in text
   */
  decodeHtmlEntities(text) {
    if (!text) return text;
    
    // Named HTML entities
    const namedEntities = {
      '&quot;': '"',
      '&apos;': "'",
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&'
    };
    
    let decoded = text;
    
    // Replace named entities
    for (const [entity, char] of Object.entries(namedEntities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    
    // Replace hexadecimal numeric entities (&#x??;)
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
    
    // Replace decimal numeric entities (&#??;)
    decoded = decoded.replace(/&#([0-9]+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec, 10));
    });
    
    return decoded;
  }

  /**
   * Fallback JSDoc parser for when TSDoc fails
   */
  parseJSDocFallback(commentText) {
    const lines = commentText.split('\n');
    const result = {
      description: '',
      examples: []
    };

    let inExample = false;
    let exampleBuffer = [];
    let descriptionLines = [];

    for (const line of lines) {
      const trimmed = line.replace(/^\s*\*\s?/, '').trim();
      
      if (trimmed.startsWith('@example')) {
        inExample = true;
        exampleBuffer = [];
      } else if (trimmed.startsWith('@') && !trimmed.startsWith('@example')) {
        inExample = false;
        if (exampleBuffer.length > 0) {
          result.examples.push({
            code: exampleBuffer.join('\n').trim(),
            language: 'typescript'
          });
          exampleBuffer = [];
        }
      } else if (inExample) {
        exampleBuffer.push(trimmed);
      } else if (!trimmed.startsWith('@') && trimmed) {
        descriptionLines.push(trimmed);
      }
    }

    // Handle last example
    if (exampleBuffer.length > 0) {
      result.examples.push({
        code: exampleBuffer.join('\n').trim(),
        language: 'typescript'
      });
    }

    result.description = descriptionLines.join(' ').trim();
    return result;
  }

  /**
   * Get the text representation of an AST node
   */
  getNodeText(node) {
    return node.getFullText().trim();
  }

  /**
   * Extract services that a component Root creates by parsing its JavaScript implementation
   */
  extractServicesFromComponentRoot(packageName, componentFileName) {
    const packagePath = path.join('node_modules', packageName);
    const reactPath = path.join(packagePath, 'dist', 'react');
    const jsFilePath = path.join(reactPath, `${componentFileName}.js`);
    
    if (!fs.existsSync(jsFilePath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(jsFilePath, 'utf8');
      const services = [];
      
             // Look for patterns like: addService(SomeServiceDefinition, SomeService, ...)
       const addServicePattern = /addService\((\w+ServiceDefinition)/g;
       let match;
       
       while ((match = addServicePattern.exec(content)) !== null) {
         const serviceDefinition = match[1];
         // Convert ServiceDefinition to Service name: "ProductServiceDefinition" -> "ProductService"  
         const serviceName = serviceDefinition.replace('ServiceDefinition', 'Service');
         
         if (!services.includes(serviceName)) {
           services.push(serviceName);
         }
       }
       
       
      
      return services;
    } catch (error) {
      console.error(`Error reading component file ${jsFilePath}:`, error.message);
      return [];
    }
  }

  /**
   * Extract service loader functions from TypeScript definition files
   */
  extractServiceLoaderFunctions(packageName) {
    const packagePath = path.join('node_modules', packageName);
    const servicesPath = path.join(packagePath, 'dist', 'services');
    
    if (!fs.existsSync(servicesPath)) {
      return {};
    }

    const serviceToLoader = {};
    
    try {
      const tsFiles = fs.readdirSync(servicesPath).filter(file => file.endsWith('.d.ts') && file !== 'index.d.ts');
      
      for (const file of tsFiles) {
        const filePath = path.join(servicesPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Look for loader functions like: export declare function loadXxxServiceConfig
        const loaderPattern = /export declare function (load\w*ServiceConfig.*?)\(/g;
        let match;
        
        while ((match = loaderPattern.exec(content)) !== null) {
          const loaderFunction = match[1];
          
          // Extract service name from loader function name
          // E.g., "loadProductServiceConfig" -> "ProductService"
          const serviceNameMatch = loaderFunction.match(/load(\w+)ServiceConfig/);
          if (serviceNameMatch) {
            const serviceName = serviceNameMatch[1] + 'Service';
            serviceToLoader[serviceName] = loaderFunction.split('(')[0]; // Remove parameters
          }
        }
      }
    } catch (error) {
      console.error(`Error reading service definitions from ${servicesPath}:`, error.message);
    }
    
    return serviceToLoader;
  }

  /**
   * Extract service dependencies from JavaScript files
   */
  async extractServiceDependenciesFromFile(tsFilePath) {
    // Convert .d.ts path to .js path
    const jsFilePath = tsFilePath.replace('/dist/', '/dist/').replace('.d.ts', '.js');
    
    if (!fs.existsSync(jsFilePath)) {
      return [];
    }

    try {
      const content = fs.readFileSync(jsFilePath, 'utf8');
      const dependencies = [];
      
      // Use regex for service dependencies (this part can stay as is)
      const useServicePattern = /useService\((\w+ServiceDefinition)\)/g;
      let match;
      
      while ((match = useServicePattern.exec(content)) !== null) {
        const serviceName = match[1].replace('ServiceDefinition', '');
        if (!dependencies.includes(serviceName)) {
          dependencies.push(serviceName);
        }
      }
      
      return dependencies;
    } catch (error) {
      return [];
    }
  }

  /**
   * Extract service-to-service dependencies
   */
  async extractServiceDependencies(packagePath) {
    const servicesPath = path.join(packagePath, 'dist', 'services');
    
    if (!fs.existsSync(servicesPath)) {
      return {};
    }

    const jsFiles = await glob(path.join(servicesPath, '*.js'));
    const dependencies = {};

    for (const filePath of jsFiles) {
      if (path.basename(filePath) === 'index.js') continue;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, '.js');
        const serviceName = fileName
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('') + (fileName.includes('-service') ? '' : 'Service');
        
        const serviceDeps = [];
        const getServicePattern = /getService\((\w+ServiceDefinition)\)/g;
        let match;
        
        while ((match = getServicePattern.exec(content)) !== null) {
          const depServiceName = match[1].replace('ServiceDefinition', '');
          if (depServiceName !== 'Signals' && !serviceDeps.includes(depServiceName)) {
            // Add "Service" suffix if it doesn't already end with "Service"
            const depNameWithService = depServiceName.endsWith('Service') ? depServiceName : depServiceName + 'Service';
            serviceDeps.push(depNameWithService);
          }
        }
        
        if (serviceDeps.length > 0) {
          dependencies[serviceName] = serviceDeps;
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }

    return dependencies;
  }

  /**
   * Generate documentation files
   */
  async generateDocumentation(allData) {
    console.log('📝 Generating documentation files...');
    
    // Create output directories
    this.ensureDirectories();
    
    // Prepare data for templates
    const templateData = this.prepareTemplateData(allData);
    
    // Generate files
    await Promise.all([
      this.generateIndexFile(templateData),
      this.generateComponentFiles(templateData),
      this.generateServiceFiles(templateData),
      this.generateServiceDependenciesFile(templateData)
    ]);
    
    console.log('✅ Documentation files generated successfully');
  }

  /**
   * Ensure output directories exist
   */
  ensureDirectories() {
    const dirs = [
      CONFIG.outputDir,
      path.join(CONFIG.outputDir, 'components'),
      path.join(CONFIG.outputDir, 'services')
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Prepare data for templates
   */
  prepareTemplateData(allData) {
    const allComponents = allData.flatMap(data => data.components || []);
    const allServices = allData.flatMap(data => data.services || []);
    
    // Organize service dependencies by package for proper template structure
    const allServiceDependencies = {};
    allData.forEach(data => {
      if (data.serviceDependencies && Object.keys(data.serviceDependencies).length > 0) {
        allServiceDependencies[data.packageName] = data.serviceDependencies;
      }
    });
    
    // Create service-to-component mapping by analyzing actual Root component implementations
    const serviceToComponent = {};
    const serviceToLoader = {};
    
    allData.forEach(data => {
      // Extract loader functions for services
      const loaderFunctions = this.extractServiceLoaderFunctions(data.packageName);
      Object.assign(serviceToLoader, loaderFunctions);
      
      (data.components || []).forEach(comp => {
        if (comp && comp.fileName) {
          const services = this.extractServicesFromComponentRoot(data.packageName, comp.fileName);
          services.forEach(serviceName => {
            serviceToComponent[serviceName] = comp.fileName;
          });
        }
      });
    });

    const packages = allData.map(data => {
      const packageShort = (data.packageName || '').replace('@wix/headless-', '');
      return {
        name: data.packageName || 'unknown',
        packageShort: packageShort,
        components: (data.components || []).filter(comp => comp && comp.fileName),
        services: (data.services || []).filter(svc => svc && svc.fileName)
      };
    }).filter(pkg => pkg.name !== 'unknown');
    

    
    return {
      packages,
      allComponents,
      allServices,
      allServiceDependencies,
      serviceToComponent,
      serviceToLoader,
      stats: {
        components: allComponents.length,
        services: allServices.length,
        packages: CONFIG.packages.length
      }
    };
  }

  /**
   * Generate index file
   */
  async generateIndexFile(data) {
    const markdown = this.templates.index(data);
    fs.writeFileSync(path.join(CONFIG.outputDir, 'index.md'), markdown);
    console.log('✅ Generated index.md');
  }

  /**
   * Generate component files
   */
  async generateComponentFiles(data) {
    for (const component of data.allComponents) {
      const packageShort = component.package.replace('@wix/headless-', '');
      const filename = `${packageShort}-${component.fileName}.md`;
      const markdown = this.templates.component({
        ...component,
        packageShort,
        totalServices: component.serviceDependencies.length
      });
      
      fs.writeFileSync(path.join(CONFIG.outputDir, 'components', filename), markdown);
      console.log(`✅ Generated components/${filename}`);
    }
  }

  /**
   * Generate service files
   */
  async generateServiceFiles(data) {
    for (const service of data.allServices) {
      const packageShort = service.package.replace('@wix/headless-', '');
      const filename = `${packageShort}-${service.fileName}.md`;
      const markdown = this.templates.service({
        ...service,
        packageShort
      });
      
      fs.writeFileSync(path.join(CONFIG.outputDir, 'services', filename), markdown);
      console.log(`✅ Generated services/${filename}`);
    }
  }

  /**
   * Generate service dependencies file
   */
  async generateServiceDependenciesFile(data) {
    // Transform service dependencies data to match template expectations
    const packagesWithDeps = data.packages.map(pkg => {
      const packageData = data.allServiceDependencies[pkg.name] || {};
      
      // Convert service dependencies to be keyed by service file name for template lookup
      const serviceDependenciesByFileName = {};
      Object.entries(packageData).forEach(([serviceName, dependencies]) => {
        // Convert service name back to file name format for template lookup
        // E.g., "ProductService" -> "product-service", "ProductModifiersService" -> "product-modifiers-service"
        const fileName = serviceName
          .replace(/Service$/, '') // Remove trailing "Service"
          .replace(/([A-Z])/g, (match, letter, index) => {
            return index === 0 ? letter.toLowerCase() : '-' + letter.toLowerCase();
          }) + '-service';
        serviceDependenciesByFileName[fileName] = dependencies;
      });

      return {
        ...pkg,
        serviceDependencies: serviceDependenciesByFileName
      };
    });

    const templateData = {
      packages: packagesWithDeps,
      serviceToComponent: data.serviceToComponent,
      serviceToLoader: data.serviceToLoader
    };

    const markdown = this.templates.serviceDeps(templateData);
    
    fs.writeFileSync(path.join(CONFIG.outputDir, 'service-dependencies.md'), markdown);
    console.log('✅ Generated service-dependencies.md');
  }
}

// Main execution
async function main() {
  try {
    const extractor = new TypeScriptDocExtractor();
    await extractor.extractAll();
  } catch (error) {
    console.error('❌ Error during extraction:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { TypeScriptDocExtractor, CONFIG }; 