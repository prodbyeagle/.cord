/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType } from "@api/Commands";
import { sendMessage } from "@utils/discord";
import { Command } from "@vencord/discord-types";
import { showToast, Toasts } from "@webpack/common";

import { settings } from "./settings";
import { ensureChannelPrimed, formatMessage, PsychiatrieLogger } from "./utils";

export const commands = [
    {
        name: "w",
        description: "Sendet einen Versprecher in den Words-Channel von überall! Sogar DM`s",
        options: [
            {
                name: "falsch",
                type: ApplicationCommandOptionType.STRING,
                description: "Das falsche Wort oder die falsche Aussage.",
                required: true,
            },
            {
                name: "richtig",
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
        async execute(args) {
            PsychiatrieLogger.log("Command `/w` executed with args:", args);

            const falsch = args.find(arg => arg.name === "falsch")?.value?.trim();
            const richtig = args.find(arg => arg.name === "richtig")?.value?.trim();
            const person = args.find(arg => arg.name === "person")?.value;

            if (!falsch || !richtig) {
                showToast("Sowohl 'falsch' als auch 'richtig' müssen angegeben werden.", Toasts.Type.FAILURE);
                return;
            }

            const rawMessage = `${falsch} = ${richtig}${person ? ` <@${person}>` : ""}`.trim();
            const message = formatMessage(rawMessage);

            PsychiatrieLogger.log("Sending message:", message);

            const channelId = settings.store.targetChannelId?.trim();
            if (!channelId) {
                PsychiatrieLogger.error("No channel ID set in plugin settings.");
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
                showToast("✅ Nachricht erfolgreich gesendet.", Toasts.Type.SUCCESS);
                return {
                    content: "‎"
                };
            } catch (error) {
                PsychiatrieLogger.error("Failed to send message:", error);
                showToast("❌ Nachricht konnte nicht gesendet werden.", Toasts.Type.FAILURE);
                return {
                    content: "‎"
                };
            }
        }
    } satisfies Command
];
