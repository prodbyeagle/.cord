/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { cpSync, moveSync, readdirSync, rmSync } from "fs-extra";
import { join } from "path";

readdirSync(join(__dirname, "src"))
    .forEach(child => moveSync(join(__dirname, "src", child), join(__dirname, child), { overwrite: true }));

const VencordSrc = join(__dirname, "..", "..", "src");

for (const file of ["preload.d.ts", "userplugins", "main", "debug", "src", "browser", "scripts"]) {
    rmSync(join(__dirname, file), { recursive: true, force: true });
}

function copyDtsFiles(from: string, to: string) {
    for (const file of readdirSync(from, { withFileTypes: true })) {
        // bad
        if (from === VencordSrc && file.name === "globals.d.ts") continue;

        const fullFrom = join(from, file.name);
        const fullTo = join(to, file.name);

        if (file.isDirectory()) {
            copyDtsFiles(fullFrom, fullTo);
        } else if (file.name.endsWith(".d.ts")) {
            cpSync(fullFrom, fullTo);
        }
    }
}

copyDtsFiles(VencordSrc, __dirname);
