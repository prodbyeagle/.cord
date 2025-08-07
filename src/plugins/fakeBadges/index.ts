/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    addProfileBadge,
    BadgePosition,
    ProfileBadge,
    removeProfileBadge,
} from "@api/Badges";
import { definePluginSettings, SettingsStore } from "@api/Settings";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { Toasts, UserStore } from "@webpack/common";

import { BADGES, ProfileBadgeWithName } from "./badges";

const logger = new Logger("FakeBadges", "#5aa5ff");
const registeredBadges: ProfileBadge[] = [];

const settings = definePluginSettings(
    Object.fromEntries(
        (BADGES as ProfileBadgeWithName[]).map(badge => [
            badge.name,
            {
                type: OptionType.BOOLEAN,
                description: badge.description ?? "",
                default: false,
                onChange: () => reloadBadges(),
            },
        ])
    )
);

settings.pluginName = "FakeBadges";

function createProfileBadge(
    badge: ProfileBadgeWithName,
    userId: string,
    props: Partial<ProfileBadge["props"]> = {}
): ProfileBadge {
    logger.debug(`Creating profile badge "${badge.name}" for userId ${userId}`);

    const emojiUrl = `https://cdn.discordapp.com/emojis/${badge.emojiId}`;

    return {
        ...badge,
        image: emojiUrl,
        position: BadgePosition.END,
        shouldShow: badge.shouldShow ?? (({ userId: id }) => id === userId),
        props: {
            ...props,
            ...(badge.props ?? {}),
        },
    };
}

function reloadBadges() {
    logger.info("Reloading FakeBadges...");
    const userId = UserStore.getCurrentUser()?.id;
    if (!userId) {
        logger.warn("No current user found; cannot reload badges.");
        return;
    }

    for (const badge of registeredBadges) {
        try {
            removeProfileBadge(badge);
            logger.debug(`Removed badge: ${badge.description}`);
        } catch (err) {
            logger.error(`Failed to remove badge: ${badge.description}`, err);
        }
    }
    registeredBadges.length = 0;

    const pluginSettings = SettingsStore.store.plugins.FakeBadges;
    if (!pluginSettings) {
        logger.warn("Plugin settings for FakeBadges missing or invalid.");
        return;
    }

    let count = 0;
    for (const badge of BADGES as ProfileBadgeWithName[]) {
        if (!pluginSettings[badge.name]) {
            logger.debug(`Badge "${badge.name}" is disabled in settings.`);
            continue;
        }

        try {
            const profileBadge = createProfileBadge(badge, userId, badge.props ?? {});
            addProfileBadge(profileBadge);
            registeredBadges.push(profileBadge);
            count++;
        } catch (err) {
            logger.error(`Failed to add badge "${badge.name}":`, err);
        }
    }

    logger.info(`Reload complete. ${count} badge(s) active.`);
}

export default definePlugin({
    name: "E: FakeBadges",
    description: "Add fake badges that you can wear.",
    authors: [Devs.prodbyeagle],
    settings,

    toolboxActions: {
        async "Reload Fake Badges"() {
            logger.info("Toolbox action: Reload Fake Badges");
            reloadBadges();
            Toasts.show({
                id: Toasts.genId(),
                message: "Successfully refetched Fake badges!",
                type: Toasts.Type.SUCCESS
            });
        }
    },

    start() {
        reloadBadges();
    },

    stop() {
        logger.info(`Stopping FakeBadges plugin. Removing ${registeredBadges.length} badges.`);
        for (const badge of registeredBadges) {
            try {
                removeProfileBadge(badge);
                logger.debug(`Removed badge: ${badge.description}`);
            } catch (err) {
                logger.error(`Failed to remove badge: ${badge.description}`, err);
            }
        }
        registeredBadges.length = 0;
        logger.info("All fake badges unregistered.");
    },
});
