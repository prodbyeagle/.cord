/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Guild } from "@vencord/discord-types";
import { Menu } from "@webpack/common";
<<<<<<< HEAD
=======
import { Guild } from "@vencord/discord-types";
>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c

import { openGuildInfoModal } from "./GuildInfoModal";

const Patch: NavContextMenuPatchCallback = (children, { guild }: { guild: Guild; }) => {
    const group = findGroupChildrenByChildId("privacy", children);

    group?.push(
        <Menu.MenuItem
            id="vc-server-info"
            label="Server Info"
            action={() => openGuildInfoModal(guild)}
        />
    );
};

export default definePlugin({
    name: "ServerInfo",
    description: "Allows you to view info about a server",
    authors: [Devs.Ven, Devs.Nuckyz],
    dependencies: ["DynamicImageModalAPI"],
    tags: ["guild", "info", "ServerProfile"],

    contextMenus: {
        "guild-context": Patch,
        "guild-header-popout": Patch
    }
});
