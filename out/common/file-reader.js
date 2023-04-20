"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDirectives = exports.getAllServices = exports.getAllPipes = exports.getFileContent = exports.getElementFiles = void 0;
const path = require("node:path");
const fs = require("node:fs");
const glob = require("glob");
const getElementFiles = (projectPath, type) => {
    const globPattern = `**/*.${type}.@(ts|js)`;
    return glob.sync(globPattern, { cwd: projectPath });
};
exports.getElementFiles = getElementFiles;
const getFileContent = (projectPath, filePath) => {
    //we need to join the project path with the file path because the file path is relative to the project path
    //and we need to read the file from the project path
    // the file path is src/app/app.component.ts
    //then we need to read the file from /home/user/project/src/app/app.component.ts
    //abolute : 
    return fs.readFileSync(path.join(projectPath, filePath), { encoding: 'utf8' });
};
exports.getFileContent = getFileContent;
const getAllPipes = (projectPath) => {
    const pipeFiles = (0, exports.getElementFiles)(projectPath, 'pipe');
    let pipes = [];
    pipeFiles.forEach(pipeFile => {
        const pipeContent = fs.readFileSync(path.join(projectPath, pipeFile), { encoding: 'utf8' });
        const classNameMatch = pipeContent.match(/export\s+class\s+([\w-]+)\s+implements\s+PipeTransform/);
        if (classNameMatch) {
            pipes.push({
                className: classNameMatch[1],
                pipeTsPath: pipeFile
            });
        }
    });
    return pipes;
};
exports.getAllPipes = getAllPipes;
const getAllServices = (projectPath) => {
    const serviceFiles = (0, exports.getElementFiles)(projectPath, 'service');
    let services = [];
    serviceFiles.forEach(serviceFile => {
        const serviceContent = fs.readFileSync(path.join(projectPath, serviceFile), { encoding: 'utf8' });
        const classNameMatch = serviceContent.match(/export\s+class\s+([\w-]+)\s+/);
        if (classNameMatch) {
            services.push({
                className: classNameMatch[1],
                serviceTsPath: serviceFile
            });
        }
    });
    return services;
};
exports.getAllServices = getAllServices;
const getAllDirectives = (projectPath) => {
    const directiveFiles = (0, exports.getElementFiles)(projectPath, 'directive');
    let directives = [];
    directiveFiles.forEach(directiveFile => {
        const directiveContent = fs.readFileSync(path.join(projectPath, directiveFile), { encoding: 'utf8' });
        const selectorMatch = directiveContent.match(/selector:\s*['"`]\s*([\w-]+)\s*['"`]/);
        const templateUrlMatch = directiveContent.match(/templateUrl:\s*['"`]\s*([\w-]+)\s*['"`]/);
        const classNameMatch = directiveContent.match(/export\s+class\s+([\w-]+)\s+{/);
        if (selectorMatch && templateUrlMatch && classNameMatch) {
            directives.push({
                selector: selectorMatch[1],
                templateUrl: templateUrlMatch[1],
                className: classNameMatch[1],
                directiveTsPath: directiveFile
            });
        }
    });
    return directives;
};
exports.getAllDirectives = getAllDirectives;
//# sourceMappingURL=file-reader.js.map