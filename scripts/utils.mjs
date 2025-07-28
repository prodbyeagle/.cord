/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * @param {string} filePath
 * @returns {string | null}
 */
export function getPluginTarget(filePath) {
    const pathParts = filePath.split(/[/\\]/);
    if (/^index\.tsx?$/.test(pathParts.at(-1))) pathParts.pop();

    const identifier = pathParts.at(-1).replace(/\.tsx?$/, "");
    const identiferBits = identifier.split(".");
    return identiferBits.length === 1 ? null : identiferBits.at(-1);
}
