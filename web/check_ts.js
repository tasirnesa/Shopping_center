import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log("Running TSC...");
try {
    execSync('npx tsc -b', { stdio: 'pipe' });
    console.log("Build succeeded!");
} catch (e) {
    const output = e.stdout.toString() + "\\n" + e.stderr.toString();
    fs.writeFileSync('tsc_errors.log', output);
    console.log("Saved TS errors to tsc_errors.log");
}
