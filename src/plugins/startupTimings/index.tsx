/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import StartupTimingPage from "./StartupTimingPage";

export default definePlugin({
    name: "StartupTimings",
    description: "Adds Startup Timings to the Settings menu",
    authors: [Devs.Megu],
    patches: [{
        find: "#{intl::ACTIVITY_SETTINGS}",
        replacement: [
            {
                // FIXME(Bundler spread transform related): Remove old compatiblity once enough time has passed, if they don't revert
                match: /(?<=}\)([,;])(\i\.settings)\.forEach.+?(\i)\.push.+}\)}\))/,
                replace: (_, commaOrSemi, settings, elements) => "" +
                    `${commaOrSemi}${settings}?.[0]==="CHANGELOG"` +
                    `&&${elements}.push({section:"StartupTimings",label:"Startup Timings",element:$self.StartupTimingPage})`,
                noWarn: true
            },
            {
                match: /(?<=}\)([,;])(\i\.settings)\.forEach.+?(\i)\.push.+\)\)\}\))(?=\)\})/,
                replace: (_, commaOrSemi, settings, elements) => "" +
                    `${commaOrSemi}${settings}?.[0]==="CHANGELOG"` +
                    `&&${elements}.push({section:"StartupTimings",label:"Startup Timings",element:$self.StartupTimingPage})`,
            },
        ]
    }],
    StartupTimingPage
});
