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
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { makeRange, OptionType } from "@utils/types";
import { Toasts, UserStore } from "@webpack/common";

type UserBadge = {
    userId: string;
    image: string;
    tooltip: string;
    position?: BadgePosition;
    toastMessage?: string;
    borderRadius?: number;
};

const logger = new Logger("CustomBadge", "#d56771");

export const settings = definePluginSettings({
    image: {
        type: OptionType.STRING,
        description: "Badge image URL",
        restartNeeded: true,
    },
    description: {
        type: OptionType.STRING,
        description: "Tooltip text",
        restartNeeded: true,
    },
    toastMessage: {
        type: OptionType.STRING,
        description: "The Text that will appear when click on the Badge.",
        restartNeeded: true,
    },
    position: {
        type: OptionType.SELECT,
        description: "Position of badge (START, END)",
        options: [
            { label: "Start", value: BadgePosition.START, default: true },
            { label: "End", value: BadgePosition.END },
        ],
        restartNeeded: true,
    },
    borderRadius: {
        type: OptionType.SLIDER,
        description: "Border radius of badge (px)",
        markers: makeRange(0, 50, 5),
        default: 25,
        stickToMarkers: true,
        restartNeeded: true,
    },
});

let currentBadge: ProfileBadge | null = null;

export default definePlugin({
    name: "CustomBadge",
    description: "Ever wanted an Own Badge? Now you can have one.",
    authors: [Devs.prodbyeagle],
    settings,
    start() {
        const user = UserStore.getCurrentUser()?.id;
        if (!user) {
            logger.error("No current user found; badge will not be registered");
            return;
        }

        const { borderRadius } = this.settings.store;
        if (!borderRadius || isNaN(Number(borderRadius))) {
            logger.warn("Invalid or missing borderRadius, resetting to 0");
            this.settings.store.borderRadius = 0;
        }

        const badge = this.getBadgeFromSettings(user);
        if (badge) {
            this.registerUserBadge(badge);
        } else {
            logger.warn("No valid badge could be constructed from settings");
        }
    },

    getBadgeFromSettings(userId?: string): UserBadge | null {
        userId ??= UserStore.getCurrentUser()?.id;
        if (!userId) return null;

        const { image, description, position, borderRadius, toastMessage } = this.settings.store;
        if (!image || !description) {
            logger.warn("Missing required badge fields (image or description)");
            return null;
        }

        return {
            userId,
            image,
            tooltip: description,
            toastMessage,
            position: position as BadgePosition,
            borderRadius,
        };
    },

    stop() {
        if (currentBadge) {
            removeProfileBadge(currentBadge);
            currentBadge = null;
        } else {
            logger.info("No badge to remove on stop");
        }
    },

    registerUserBadge(badge: UserBadge) {
        const profileBadge: ProfileBadge = {
            description: badge.tooltip,
            image: badge.image,
            position: badge.position ?? BadgePosition.END,
            shouldShow: ({ userId }) => userId === badge.userId,
            props: {
                style: {
                    transform: "scale(0.9)",
                    borderRadius:
                        badge.borderRadius !== undefined ? `${badge.borderRadius}px` : "50%",
                },
            },
            onClick: () => {
                Toasts.show({
                    id: Toasts.genId(),
                    message: badge.toastMessage || `Custom badge for ${badge.userId}`,
                    type: Toasts.Type.SUCCESS,
                });
            },
        };

        currentBadge = profileBadge;
        addProfileBadge(profileBadge);
        logger.info("Badge registered successfully:", profileBadge);
    },
});
