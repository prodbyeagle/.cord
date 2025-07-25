/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, SettingsStore } from "@api/Settings";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { Toasts } from "@webpack/common";

const log = new Logger("USRBG (eagleCord)", "#139375");

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/prodbyeagle/dotfiles/refs/heads/main/Vencord/eagleCord/usrbg.json";
const GITHUB_IMAGE_BASE = "https://raw.githubusercontent.com/prodbyeagle/dotfiles/refs/heads/main/Vencord/eagleCord/images/";

type UsrbgGitHubData = Record<string, string>;

const settings = definePluginSettings({
    nitroFirst: {
        description: "Banner to use if both Nitro and GitHub banners are present",
        type: OptionType.SELECT,
        options: [
            { label: "Nitro banner", value: true, default: true },
            { label: "GitHub banner", value: false }
        ]
    },
    voiceBackground: {
        description: "Use GitHub banners as voice chat backgrounds",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: true
    }
});

async function reloadBanners(context: {
    log: Logger,
    setData: (data: UsrbgGitHubData) => void;
}): Promise<boolean> {
    context.log.info("Reloading banner data from GitHub...");

    try {
        const res = await fetch(GITHUB_JSON_URL);
        if (!res.ok) {
            context.log.error("Failed to reload banner data. Status:", res.status);
            return false;
        }

        const data = await res.json() as UsrbgGitHubData;
        context.setData(data);

        const count = Object.keys(data ?? {}).length;
        context.log.info(`Reloaded ${count} GitHub banners`);
        return true;
    } catch (err) {
        context.log.error("Error reloading GitHub banner data:", err);
        return false;
    }
}

export default definePlugin({
    name: "USRBG",
    description: "Displays user banners from USRBG (MODDED BY EAGLE), allowing anyone to get a banner without Nitro",
    authors: [Devs.AutumnVN, Devs.katlyn, Devs.pylix, Devs.TheKodeToad, Devs.prodbyeagle],
    settings,
    required: true,
    toolboxActions: {
        async "Refetch Banners"() {
            const success = await reloadBanners({
                log,
                setData: data => { data = data; }
            });

            if (success) {
                Toasts.show({
                    id: Toasts.genId(),
                    message: "Successfully refetched Banner Images!",
                    type: Toasts.Type.SUCCESS
                });
            } else {
                Toasts.show({
                    id: Toasts.genId(),
                    message: "Failed to refetch Banner Images.",
                    type: Toasts.Type.FAILURE
                });
            }
        }
    },

    patches: [
        {
            find: '.banner)==null?"COMPLETE"',
            replacement: {
                match: /(?<=void 0:)\i.getPreviewBanner\(\i,\i,\i\)/,
                replace: "$self.patchBannerUrl(arguments[0])||$&"
            }
        },
        {
            find: "\"data-selenium-video-tile\":",
            predicate: () => settings.store.voiceBackground,
            replacement: [
                {
                    match: /(?<=function\((\i),\i\)\{)(?=let.{20,40},style:)/,
                    replace: "$1.style=$self.getVoiceBackgroundStyles($1);"
                }
            ]
        }
    ],

    getVoiceBackgroundStyles({ className, participantUserId }: any) {
        log.debug("getVoiceBackgroundStyles called with:", { className, participantUserId });

        if (!participantUserId) {
            log.warn("Missing participantUserId in getVoiceBackgroundStyles");
            return;
        }

        if (className.includes("tile_") && this.userHasBackground(participantUserId)) {
            const url = this.getImageUrl(participantUserId);
            log.debug("Applying voice background for user:", participantUserId, "->", url);

            return {
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            };
        }

        log.debug("No background applied for user:", participantUserId);
    },

    patchBannerUrl({ displayProfile }: any) {
        log.debug("patchBannerUrl called with:", displayProfile);

        if (!displayProfile) {
            log.warn("Missing displayProfile in patchBannerUrl");
            return;
        }

        if (displayProfile?.banner && settings.store.nitroFirst) {
            log.debug("User has Nitro banner, skipping GitHub banner:", displayProfile.userId);
            return;
        }

        if (this.userHasBackground(displayProfile.userId)) {
            const url = this.getImageUrl(displayProfile.userId);
            log.debug("Returning GitHub banner URL for user:", displayProfile.userId, "->", url);
            return url;
        }

        log.debug("No GitHub banner found for user:", displayProfile.userId);
    },

    data: null as UsrbgGitHubData | null,

    userHasBackground(userId: string) {
        const has = !!this.data?.[userId];
        log.debug(`userHasBackground(${userId}) =>`, has);
        return has;
    },

    getImageUrl(userId: string): string | null {
        const filename = this.data?.[userId];

        if (!filename) {
            log.debug("getImageUrl: No image found for user:", userId);
            return null;
        }

        const url = `${GITHUB_IMAGE_BASE}${filename}`;
        log.debug("getImageUrl:", userId, "->", url);
        return url;
    },

    async start() {
        if (SettingsStore.store.eaglecord?.showBanner) {
            await reloadBanners({
                log,
                setData: data => { this.data = data; }
            });
        } else {
            this.data = null;
        }

        SettingsStore.addChangeListener("eaglecord.showBanner", async (enabled: boolean) => {
            if (enabled) {
                Toasts.show({
                    id: Toasts.genId(),
                    message: "Custom Banner eingeschalten.",
                    type: Toasts.Type.SUCCESS
                });
                await reloadBanners({
                    log,
                    setData: (data) => { this.data = data; }
                });
            } else {
                Toasts.show({
                    id: Toasts.genId(),
                    message: "Custom Banner ausgeschalten.",
                    type: Toasts.Type.SUCCESS
                });
                this.data = null;
            }
        });

        log.info("Starting plugin... Fetching banner data");

        try {
            const res = await fetch(GITHUB_JSON_URL);
            if (!res.ok) {
                log.error("Failed to fetch banner data. Status:", res.status);
                return;
            }

            this.data = await res.json();

            const count = Object.keys(this.data ?? {}).length;
            log.info(`Loaded ${count} GitHub banners`);
        } catch (err) {
            log.error("Error fetching GitHub banner data:", err);
        }
    }
});
