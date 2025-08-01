/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./checkNodeVersion.js";

import { execFileSync, execSync } from "child_process";
import {
    createWriteStream,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { fileURLToPath } from "url";

const BASE_URL =
    "https://github.com/Vencord/Installer/releases/latest/download/";
const INSTALLER_PATH_DARWIN =
    "VencordInstaller.app/Contents/MacOS/VencordInstaller";

const BASE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_DIR = join(BASE_DIR, "dist", "Installer");
const ETAG_FILE = join(FILE_DIR, "etag.txt");

function getFilename() {
    switch (process.platform) {
        case "win32":
            return "VencordInstallerCli.exe";
        case "darwin":
            return "VencordInstaller.MacOS.zip";
        case "linux":
            return "VencordInstallerCli-linux";
        default:
            throw new Error("Unsupported platform: " + process.platform);
    }
}

async function ensureBinary() {
    const filename = getFilename();
    console.log("Downloading " + filename);

    mkdirSync(FILE_DIR, { recursive: true });

    const downloadName = join(FILE_DIR, filename);
    const outputFile =
        process.platform === "darwin"
            ? join(FILE_DIR, "VencordInstaller")
            : downloadName;

    const etag =
        existsSync(outputFile) && existsSync(ETAG_FILE)
            ? readFileSync(ETAG_FILE, "utf-8")
            : null;

    const res = await fetch(BASE_URL + filename, {
        headers: {
            "User-Agent": "Vencord (https://github.com/Vendicated/Vencord)",
            "If-None-Match": etag,
        },
    });

    if (res.status === 304) {
        console.log("Up to date, not redownloading!");
        return outputFile;
    }
    if (!res.ok)
        throw new Error(
            `Failed to download installer: ${res.status} ${res.statusText}`
        );

    writeFileSync(ETAG_FILE, res.headers.get("etag"));

    if (process.platform === "darwin") {
        console.log("Unzipping...");
        const zip = new Uint8Array(await res.arrayBuffer());

        const ff = await import("fflate");
        const bytes = ff.unzipSync(zip, {
            filter: (f) => f.name === INSTALLER_PATH_DARWIN,
        })[INSTALLER_PATH_DARWIN];

        writeFileSync(outputFile, bytes, { mode: 0o755 });

        console.log(
            "Overriding security policy for installer binary (this is required to run it)"
        );
        console.log("xattr might error, that's okay");

        const logAndRun = (cmd) => {
            console.log("Running", cmd);
            try {
                execSync(cmd);
            } catch {}
        };
        logAndRun(
            `sudo spctl --add '${outputFile}' --label "Vencord Installer"`
        );
        logAndRun(`sudo xattr -d com.apple.quarantine '${outputFile}'`);
    } else {
        // WHY DOES NODE FETCH RETURN A WEB STREAM OH MY GOD
        const body = Readable.fromWeb(res.body);
        await finished(
            body.pipe(
                createWriteStream(outputFile, {
                    mode: 0o755,
                    autoClose: true,
                })
            )
        );
    }

    console.log("Finished downloading!");

    return outputFile;
}

const installerBin = await ensureBinary();

console.log("Now running Installer...");

const argStart = process.argv.indexOf("--");
const args = argStart === -1 ? [] : process.argv.slice(argStart + 1);

try {
    execFileSync(installerBin, args, {
        stdio: "inherit",
        env: {
            ...process.env,
            VENCORD_USER_DATA_DIR: BASE_DIR,
            VENCORD_DEV_INSTALL: "1",
        },
    });
} catch {
    console.error("Something went wrong. Please check the logs above.");
}
