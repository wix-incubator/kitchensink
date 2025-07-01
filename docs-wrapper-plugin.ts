import { transformSync } from "@babel/core";
import type { PluginItem } from "@babel/core";
import * as t from "@babel/types";
import kebabCase from "lodash.kebabcase";
import path from "path";
import type { Plugin } from "vite";

interface ImportInfo {
  source: string;
  importedName: string;
}

interface NodeToWrap {
  path: any; // Babel path object - complex type, using any for simplicity
  componentName: string;
  componentPath: string;
}

export function headlessDocsWrapper(): Plugin {
  return {
    name: "headless-docs-wrapper",
    enforce: "pre",
    transform(code: string, id: string) {
      if (
        !id.endsWith(".tsx") ||
        id.includes("node_modules") ||
        id.includes("src/headless/")
      ) {
        return null;
      }

      const headlessImports = new Map<string, ImportInfo>();

      // First pass to find headless imports to avoid running babel if not needed
      const headlessPath = path.resolve(process.cwd(), "src/headless");
      const usedJSXComponents = new Set<string>();

      transformSync(code, {
        ast: true,
        code: false,
        filename: id,
        plugins: [
          ["@babel/plugin-syntax-typescript", { isTSX: true }] as PluginItem,
          function precheckPlugin() {
            return {
              visitor: {
                ImportDeclaration(p: any) {
                  const source = p.node.source.value;
                  let isHeadlessImport = false;

                  if (source.startsWith(".")) {
                    const resolvedPath = path.resolve(path.dirname(id), source);
                    if (resolvedPath.startsWith(headlessPath)) {
                      isHeadlessImport = true;
                    }
                  }

                  if (isHeadlessImport) {
                    p.node.specifiers.forEach((spec: any) => {
                      if (spec.type === "ImportSpecifier") {
                        headlessImports.set(spec.local.name, {
                          source,
                          importedName: spec.imported.name,
                        });
                      }
                    });
                  }
                },
                JSXElement(p: any) {
                  const openingElement = p.node.openingElement;
                  if (openingElement.name.type === "JSXIdentifier") {
                    usedJSXComponents.add(openingElement.name.name);
                  } else if (
                    openingElement.name.type === "JSXMemberExpression"
                  ) {
                    if (openingElement.name.object.type === "JSXIdentifier") {
                      usedJSXComponents.add(openingElement.name.object.name);
                    }
                  }
                },
              },
            };
          },
        ],
      });

      // Filter headless imports to only those actually used as JSX components
      const filteredHeadlessImports = new Map<string, ImportInfo>();
      for (const [localName, importInfo] of headlessImports) {
        if (usedJSXComponents.has(localName)) {
          filteredHeadlessImports.set(localName, importInfo);
        }
      }

      headlessImports.clear();
      for (const [key, value] of filteredHeadlessImports) {
        headlessImports.set(key, value);
      }

      if (headlessImports.size === 0) {
        return null;
      }

      const result = transformSync(code, {
        filename: id,
        sourceMaps: true,
        plugins: [
          ["@babel/plugin-syntax-typescript", { isTSX: true }] as PluginItem,
          ["@babel/plugin-syntax-jsx"] as PluginItem,
          function autoDocsWrapperPlugin({ types }: { types: typeof t }) {
            const nodesToWrap: NodeToWrap[] = [];
            return {
              visitor: {
                JSXElement(p: any) {
                  const openingElement = p.node.openingElement;
                  let componentId = "";
                  let importInfo: ImportInfo | null = null;
                  let isHeadlessComponent = false;

                  if (types.isJSXIdentifier(openingElement.name)) {
                    // Direct usage: <ComponentName>
                    componentId = openingElement.name.name;
                    if (headlessImports.has(componentId)) {
                      importInfo = headlessImports.get(componentId)!;
                      isHeadlessComponent = true;
                    }
                  } else if (types.isJSXMemberExpression(openingElement.name)) {
                    // Namespaced usage: <Namespace.ComponentName>
                    const { object, property } = openingElement.name;
                    if (
                      types.isJSXIdentifier(object) &&
                      types.isJSXIdentifier(property)
                    ) {
                      const namespaceName = object.name;
                      componentId = `${namespaceName}.${property.name}`;
                      if (headlessImports.has(namespaceName)) {
                        importInfo = headlessImports.get(namespaceName)!;
                        isHeadlessComponent = true;
                      }
                    }
                  }

                  // Only process headless components
                  if (!isHeadlessComponent || !importInfo) {
                    return;
                  }

                  // Filter out whitespace-only text nodes
                  const meaningfulChildren = p.node.children.filter(
                    (child: any) => {
                      if (types.isJSXText(child)) {
                        return child.value.trim() !== "";
                      }
                      return true;
                    }
                  );

                  if (meaningfulChildren.length !== 1) {
                    return;
                  }

                  const child = meaningfulChildren[0];
                  if (
                    !types.isJSXExpressionContainer(child) ||
                    !types.isArrowFunctionExpression(child.expression)
                  ) {
                    return;
                  }

                  const componentProperty = componentId.split(".")[1] || "";

                  const sourcePath = importInfo.source;
                  const fileNameWithExt = path.basename(sourcePath);
                  const fileName = path.parse(fileNameWithExt).name;

                  const componentName = componentId;
                  const componentPath =
                    `/docs/components/${kebabCase(fileName)}` +
                    (componentProperty
                      ? `#${componentProperty.toLowerCase()}`
                      : "");

                  // Find the index of the meaningful child in the original children array
                  const childIndex = p.node.children.indexOf(child);

                  nodesToWrap.push({
                    path: p.get(`children.${childIndex}.expression`),
                    componentName,
                    componentPath,
                  });
                },
                Program: {
                  exit(programPath: any) {
                    if (nodesToWrap.length === 0) {
                      return;
                    }

                    // Add import if needed
                    let alreadyHasWrapperImport = false;
                    programPath.traverse({
                      ImportDeclaration(p: any) {
                        const source = p.node.source.value;
                        const from = path.dirname(id);
                        const docsModePath = path.resolve(
                          process.cwd(),
                          "src/components/DocsMode.tsx"
                        );
                        const resolvedSource = path.resolve(from, source);

                        if (
                          resolvedSource.startsWith(
                            docsModePath.replace(".tsx", "")
                          )
                        ) {
                          p.node.specifiers.forEach((spec: any) => {
                            if (
                              types.isImportSpecifier(spec) &&
                              types.isIdentifier(spec.imported, {
                                name: "withDocsWrapper",
                              })
                            ) {
                              alreadyHasWrapperImport = true;
                            }
                          });
                        }
                      },
                    });

                    if (!alreadyHasWrapperImport) {
                      const from = path.dirname(id);
                      const to = path.resolve(
                        process.cwd(),
                        "src/components/DocsMode"
                      );
                      let relativePath = path.relative(from, to);
                      if (!relativePath.startsWith(".")) {
                        relativePath = "./" + relativePath;
                      }

                      const importDecl = types.importDeclaration(
                        [
                          types.importSpecifier(
                            types.identifier("withDocsWrapper"),
                            types.identifier("withDocsWrapper")
                          ),
                        ],
                        types.stringLiteral(relativePath)
                      );
                      programPath.node.body.unshift(importDecl);
                    }

                    // Apply transformations
                    nodesToWrap.forEach((nodeInfo) => {
                      const { path, componentName, componentPath } = nodeInfo;
                      const renderPropFn = path.node;
                      const wrapperCall = types.callExpression(
                        types.identifier("withDocsWrapper"),
                        [
                          renderPropFn,
                          types.stringLiteral(componentName),
                          types.stringLiteral(componentPath),
                        ]
                      );
                      path.replaceWith(wrapperCall);
                    });
                  },
                },
              },
            };
          },
        ],
      });

      if (result && result.code) {
        return {
          code: result.code,
          map: result.map,
        };
      }
      return null;
    },
  };
}
