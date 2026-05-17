const {writeFile: writeFileCb} = require("node:fs");
const {promisify} = require("node:util");
const {exec: execCb} = require("node:child_process");
const exec = promisify(execCb);
const writeFile = promisify(writeFileCb);

// Source : https://stackoverflow.com/a/42199863/1655155

async function createVersionsFile(filename) {
    /** @type VersionInfo */
    const versionInfo = {
        version: process.env["npm_package_version"],
        revision: (await exec("git rev-parse --short HEAD")).stdout.toString().trim(),
        // branch: (await exec('git rev-parse --abbrev-ref HEAD')).stdout.toString().trim(),
    };
    const content = JSON.stringify(versionInfo);
    await writeFile(filename, content, {encoding: 'utf8'});
}

createVersionsFile("src/environments/version-info.json"); // chemin relatif au package.json
