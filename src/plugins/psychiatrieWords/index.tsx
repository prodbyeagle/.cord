/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType } from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { sendMessage } from "@utils/discord";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { Command } from "@vencord/discord-types";
import { Constants, FluxDispatcher, RestAPI, showToast, Toasts, UserStore } from "@webpack/common";

const log = new Logger("CommandMirror", "#81c8be");

const settings = definePluginSettings({
    targetChannelId: {
        type: OptionType.STRING,
        description: "Die Channel ID, in die der Versprecher gesendet werden soll.",
        placeholder: "1112296580431757392",
        default: "1112296580431757392"
    }
});

/** @todo fix the issue where you need to "visit" the target channel to fix the indefinite stuck being.
 * @author prodbyeagle
*/
async function ensureChannelPrimed(channelId: string): Promise<boolean> {
    log.log(`Versuche Channel ${channelId} vorzubereiten...`);
    try {
        const response = await RestAPI.get({
            url: Constants.Endpoints.MESSAGES(channelId),
            query: { limit: 1 },
            retries: 2
        });

        const messages = response.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            log.warn("Keine Nachrichten im Zielchannel gefunden.");
            return false;
        }

        FluxDispatcher.dispatch({
            type: "MESSAGE_CREATE",
            message: messages[0]
        });

        log.log("MESSAGE_CREATE erfolgreich dispatched.");
        return true;
    } catch (err) {
        log.error("Fehler beim Laden des Channels via RestAPI:", err);
        return false;
    }
}
export default definePlugin({
    name: "Psychiatrie Words",
    description: "Sende von überall einen Versprecher in den Words-Channel",
    authors: [Devs.prodbyeagle],
    settings,

    commands: [
        {
            name: "w",
            description: "Sendet einen Versprecher in den Words-Channel",
            options: [
                {
                    name: "wrong",
                    type: ApplicationCommandOptionType.STRING,
                    description: "Das falsche Wort oder die falsche Aussage.",
                    required: true,
                },
                {
                    name: "right",
                    type: ApplicationCommandOptionType.STRING,
                    description: "Die Korrektur oder das richtige Wort.",
                    required: true,
                },
                {
                    name: "person",
                    type: ApplicationCommandOptionType.USER,
                    description: "Der User, der den Versprecher gemacht hat.",
                    required: false,
                }
            ],
            async execute(args, ctx) {
                log.log("Command `/w` ausgeführt mit args:", args);

                const wrong = args.find(arg => arg.name === "wrong")?.value?.trim();
                const right = args.find(arg => arg.name === "right")?.value?.trim();
                const person = args.find(arg => arg.name === "person")?.value;

                if (!wrong || !right) {
                    showToast("Sowohl 'wrong' als auch 'right' müssen angegeben werden.", Toasts.Type.FAILURE);
                    return;
                }

                const formatted = `${wrong} = ${right}`;
                const suffix = person ? ` (<@${person}>)` : "";
                const message = `${formatted}${suffix} \n\n -# <@${UserStore.getCurrentUser().id}>`;

                log.log("Nachricht wird gesendet:", message);

                const channelId = settings.store.targetChannelId?.trim();
                if (!channelId) {
                    log.error("Keine Channel-ID in den Plugin-Einstellungen gesetzt.");
                    showToast("Keine Channel-ID gesetzt.", Toasts.Type.FAILURE);
                    return;
                }

                const ready = await ensureChannelPrimed(channelId);
                if (!ready) {
                    showToast("Channel konnte nicht vorgeladen werden.", Toasts.Type.FAILURE);
                    return;
                }

                try {
                    await sendMessage(channelId, { content: message });
                    showToast("Nachricht erfolgreich gesendet.", Toasts.Type.SUCCESS);
                } catch (error) {
                    log.error("Fehler beim Senden der Nachricht:", error);
                    showToast("Nachricht konnte nicht gesendet werden.", Toasts.Type.FAILURE);
                }
            }
        } satisfies Command
    ]
});
