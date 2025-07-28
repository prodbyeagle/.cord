/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@webpack/common";

import { shiki } from "../api/shiki";
import { settings as pluginSettings, ShikiSettings } from "../settings";

export function useShikiSettings<F extends keyof ShikiSettings>(settingKeys: F[]) {
    const settings = pluginSettings.use([...settingKeys, "customTheme", "theme"]);
    const [isLoading, setLoading] = React.useState(false);

    const themeUrl = settings.customTheme || settings.theme;

    const willChangeTheme = shiki.currentThemeUrl && themeUrl && themeUrl !== shiki.currentThemeUrl;

    if (isLoading && (!willChangeTheme)) setLoading(false);
    if (!isLoading && willChangeTheme) {
        setLoading(true);
        shiki.setTheme(themeUrl);
    }

    return {
        ...settings,
        isThemeLoading: isLoading,
    };
}
