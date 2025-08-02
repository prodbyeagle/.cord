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
import { Constants, FluxDispatcher, RestAPI, showToast, Toasts } from "@webpack/common";

const log = new Logger("CommandMirror", "#81c8be");

const settings = definePluginSettings({
    targetChannelId: {
        type: OptionType.STRING,
        description: "Die Channel ID, in die der Versprecher gesendet werden soll.",
        placeholder: "1112296580431757392",
        default: "1112296580431757392"
    }
});

async function ensureChannelPrimed(channelId: string): Promise<boolean> {
    log.log(`Versuche Channel ${channelId} vorzubereiten...`);
    try {
        // ? trying to preload the channel to fix the issue with being stuck in the input.
        const messages = await RestAPI.get({
            url: Constants.Endpoints.MESSAGES(channelId),
            query: { limit: 50 },
            retries: 2
        });

        if (!Array.isArray(messages)) {
            log.warn("Unerwartete Antwort von RestAPI:", messages);
            return false;
        }

        if (messages.length === 0) {
            log.warn("Channel hat keine Nachrichten. Kann nicht vorgeladen werden.");
            return false;
        }

        const message = messages[0];
        log.log("Nachricht erfolgreich geladen:", message);

        FluxDispatcher.dispatch({
            type: "MESSAGE_CREATE",
            message
        });

        log.log("MESSAGE_CREATE wurde erfolgreich dispatched.");
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
                    name: "inhalt",
                    type: ApplicationCommandOptionType.STRING,
                    description: "Der Text, den du senden möchtest.",
                    required: true,
                },
            ],
            async execute(args) {
                log.log("Command `/w` ausgeführt mit args:", args);

                const contentArg = args.find(arg => arg.name === "inhalt");
                if (!contentArg?.value) {
                    log.warn("Kein Inhalt angegeben.");
                    showToast("Kein Inhalt angegeben.", Toasts.Type.FAILURE);
                    return;
                }

                const message = contentArg.value.trim();
                log.log("Nachricht zum Senden:", message);

                const channelId = settings.store.targetChannelId?.trim();
                if (!channelId) {
                    log.error("Keine Channel-ID in den Plugin-Einstellungen gesetzt.");
                    showToast("Keine Channel-ID gesetzt.", Toasts.Type.FAILURE);
                    return;
                }

                log.log(`Verwende Channel ID: ${channelId}`);

                const ready = await ensureChannelPrimed(channelId);
                if (!ready) {
                    log.error("Channel konnte nicht vorgeladen werden.");
                    showToast("Channel konnte nicht vorgeladen werden.", Toasts.Type.FAILURE);
                    return;
                }

                log.log("Channel bereit, versuche Nachricht zu senden...");

                try {
                    await sendMessage(channelId, { content: message });
                    log.log("Nachricht erfolgreich gesendet.");
                    showToast("Nachricht erfolgreich gesendet.", Toasts.Type.SUCCESS);
                } catch (error) {
                    log.error("Fehler beim Senden der Nachricht:", error);
                    showToast("Nachricht konnte nicht gesendet werden.", Toasts.Type.FAILURE);
                }
            }
        } satisfies Command,
    ],
});
