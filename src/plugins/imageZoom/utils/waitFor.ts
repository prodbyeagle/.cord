/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function waitFor(condition: () => boolean, cb: () => void) {
    if (condition()) cb();
    else requestAnimationFrame(() => waitFor(condition, cb));
}
