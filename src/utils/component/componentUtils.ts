import { log } from "node:console";
import { getElementFiles, getFileContent } from "../../common/file-reader";
import { ComponentModel } from "../../models/models";
import path = require("path");

export const getAllComponents = (projectPath: string): ComponentModel[] => {
   const componentFiles = getElementFiles(projectPath, 'component');
   let components: ComponentModel[] = [];
   componentFiles.forEach(componentFile => {
      const componentContent = getFileContent(projectPath, componentFile);
      //const selectorMatch = componentContent.match(/selector:\s*['"`]\s*([\w-]+)\s*['"`]/);
      // const templateUrlMatch = componentContent.match(/templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/);
      // const classNameMatch = componentContent.match(/export\s+class\s+([\w-]+)\s+{/);
      const classRegex = /export\s+class\s+([\w-]+)\s+/;
      const selectorRegex = /@Component\s*\({[^}]*selector:\s*['"`]\s*([\w-]+)\s*['"`]/;
      const templateUrlRegex = /@Component\s*\({[^}]*templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/;
      const selectorMatch = componentContent.match(selectorRegex);
      const templateUrlMatch = componentContent.match(templateUrlRegex);
      const classNameMatch = componentContent.match(classRegex);
      if (selectorMatch || templateUrlMatch || classNameMatch) {
         components.push({
            selector: selectorMatch ? selectorMatch[1] : '',
            templateUrl: templateUrlMatch ? templateUrlMatch[1] : '',
            className: classNameMatch ? classNameMatch[1] : '',
            componentTsPath: componentFile
         });

      }
   });
   //log(components);
   return components;
};

export const getUnUsedProjectComponents = (projectPath: string, type: "used" | "not-used"): ComponentModel[] => {
   const components = getAllComponents(projectPath);
   //log(components);
   //return components;
   // Create sets to store used selectors and used classes
   const usedSelectors: Set<string> = new Set();
   const usedClasses: Set<string> = new Set();
   let nb = 0;

   // Iterate through all the components and check if their selectors are used in any of the HTML files
   // and check if their classes are used in any of the TypeScript files
   components.forEach((component) => {
      // Check for selector usage in HTML files
      const absolutePath = path.resolve(path.dirname(component.componentTsPath), component.templateUrl);
      try {
         const componentContent = getFileContent(projectPath, absolutePath);
         // // Use a regex to search for the component selector in the HTML content
         const selectRegex = new RegExp(`<${component.selector}[^>]*>`);
         const selectorMatch = componentContent.match(selectRegex);
         if (selectorMatch) {
            usedSelectors.add(component.selector);
         }
         nb = nb + 1;

      } catch (error) {
         // console.log(error);
      }

      //log(componentContent);
      //log(absolutePath);




      // Check for class usage in the component's TypeScript file
      // (we don't need to check for the class usage in the HTML file because the selector is used in the HTML file)
      const componentTsContent = getFileContent(projectPath, component.componentTsPath);
      const classMatch = componentTsContent.match(new RegExp(`\\b${component.className}\\b`));
      if (classMatch) {
         usedClasses.add(component.className);
      }
   });
   log(nb);


   if (type === "used") {
      const a = components.filter((component) => usedSelectors.has(component.selector) || usedClasses.has(component.className));
      const unUsed = components.filter((component) => !usedSelectors.has(component.selector) && !usedClasses.has(component.className));
      log("in ", components.length, " components, ", a.length, " are used", unUsed);
      return a;
   } else {
      const a = components.filter((component) => !usedSelectors.has(component.selector) && !usedClasses.has(component.className));

      log("in ", components.length, " components, ", a.length, " are not used");
      return a;
   }
};

