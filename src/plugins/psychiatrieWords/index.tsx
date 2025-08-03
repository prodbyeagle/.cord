/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";

import { commands } from "./commands";
import { settings } from "./settings";

export const PsychiatrieLogger = new Logger("PsychiatrieWords", "#81c8be");

export default definePlugin({
    name: "Psychiatrie Words",
    description: "Sende von überall einen Versprecher in den Words-Channel",
    authors: [Devs.prodbyeagle],
    settings,
    commands,
});
