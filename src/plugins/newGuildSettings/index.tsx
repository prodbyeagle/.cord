/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    findGroupChildrenByChildId,
    NavContextMenuPatchCallback
} from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { CogWheel } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Guild } from "@vencord/discord-types";
import { findByCodeLazy, findByPropsLazy, mapMangledModuleLazy } from "@webpack";
import { Menu } from "@webpack/common";

const { updateGuildNotificationSettings } = findByPropsLazy("updateGuildNotificationSettings");
const { toggleShowAllChannels } = mapMangledModuleLazy(".onboardExistingMember(", {
    toggleShowAllChannels: m => {
        const s = String(m);
        return s.length < 100 && !s.includes("onboardExistingMember") && !s.includes("getOptedInChannels");
    }
});
const isOptInEnabledForGuild = findByCodeLazy(".COMMUNITY)||", ".isOptInEnabled(");

const settings = definePluginSettings({
    guild: {
        description: "Mute Guild automatically",
        type: OptionType.BOOLEAN,
        default: true
    },
    messages: {
        description: "Server Notification Settings",
        type: OptionType.SELECT,
        options: [
            { label: "All messages", value: 0 },
            { label: "Only @mentions", value: 1 },
            { label: "Nothing", value: 2 },
            { label: "Server default", value: 3, default: true }
        ],
    },
    everyone: {
        description: "Suppress @everyone and @here",
        type: OptionType.BOOLEAN,
        default: true
    },
    role: {
        description: "Suppress All Role @mentions",
        type: OptionType.BOOLEAN,
        default: true
    },
    highlights: {
        description: "Suppress Highlights automatically",
        type: OptionType.BOOLEAN,
        default: true
    },
    events: {
        description: "Mute New Events automatically",
        type: OptionType.BOOLEAN,
        default: true
    },
    showAllChannels: {
        description: "Show all channels automatically",
        type: OptionType.BOOLEAN,
        default: true
    }
});

const makeContextMenuPatch: (shouldAddIcon: boolean) => NavContextMenuPatchCallback = (shouldAddIcon: boolean) => (children, { guild }: { guild: Guild, onClose(): void; }) => {
    if (!guild) return;

    const group = findGroupChildrenByChildId("privacy", children);
    group?.push(
        <Menu.MenuItem
            label="Apply NewGuildSettings"
            id="vc-newguildsettings-apply"
            icon={shouldAddIcon ? CogWheel : void 0}
            action={() => applyDefaultSettings(guild.id)}
        />
    );
};

function applyDefaultSettings(guildId: string | null) {
    if (guildId === "@me" || guildId === "null" || guildId == null) return;
    updateGuildNotificationSettings(guildId,
        {
            muted: settings.store.guild,
            suppress_everyone: settings.store.everyone,
            suppress_roles: settings.store.role,
            mute_scheduled_events: settings.store.events,
            notify_highlights: settings.store.highlights ? 1 : 0
        });
    if (settings.store.messages !== 3) {
        updateGuildNotificationSettings(guildId,
            {
                message_notifications: settings.store.messages,
            });
    }
    if (settings.store.showAllChannels && isOptInEnabledForGuild(guildId)) {
        toggleShowAllChannels(guildId);
    }
}

export default definePlugin({
    name: "NewGuildSettings",
    description: "Automatically mute new servers and change various other settings upon joining",
    tags: ["MuteNewGuild", "mute", "server"],
    authors: [Devs.Glitch, Devs.Nuckyz, Devs.carince, Devs.Mopi, Devs.GabiRP],
    contextMenus: {
        "guild-context": makeContextMenuPatch(false),
        "guild-header-popout": makeContextMenuPatch(true)
    },
    patches: [
        {
            find: ",acceptInvite(",
            replacement: {
                match: /INVITE_ACCEPT_SUCCESS.+?,(\i)=null!=.+?;/,
                replace: (m, guildId) => `${m}$self.applyDefaultSettings(${guildId});`
            }
        },
        {
            find: "{joinGuild:",
            replacement: {
                match: /guildId:(\i),lurker:(\i).{0,20}}\)\);/,
                replace: (m, guildId, lurker) => `${m}if(!${lurker})$self.applyDefaultSettings(${guildId});`
            }
        }
    ],
    settings,
    applyDefaultSettings
});
