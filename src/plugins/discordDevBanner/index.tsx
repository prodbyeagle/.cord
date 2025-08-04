/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    removeCloseButton: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Remove redundant close button, which might actually break plugin if accidentally pressed",
        restartNeeded: true,
        hidden: true,
    }
});

// Useless for the normal User, but useful for me
migratePluginSettings("DiscordDevBanner", "devBanner");

export default definePlugin({
    name: "DiscordDevBanner",
    description: "Enables the Discord developer banner, in which displays the build-ID (CODE BY: krystalskullofficial)",
    authors: [Devs.prodbyeagle],
    settings,
    required: true,

    patches: [
        {
            find: ".devBanner,",
            replacement: [
                {
                    match: '"staging"===window.GLOBAL_ENV.RELEASE_CHANNEL',
                    replace: "true"
                },
                {
                    predicate: () => settings.store.removeCloseButton,
                    match: /(\i=\(\)=>)\(.*?\}\);/,
                    replace: "$1null;",
                },
                {
                    match: /\i\.\i\.format\(.{0,15},{buildNumber:(.{0,10})}\)/,
                    replace: "$self.transform()"
                }
            ]
        }
    ],

    transform() {
        return `eagleCord v${VERSION}`;
    },
});
