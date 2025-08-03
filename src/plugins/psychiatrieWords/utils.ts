/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Constants, FluxDispatcher, RestAPI } from "@webpack/common";

import { PsychiatrieLogger } from ".";

/**
 * Formats a string containing segments separated by '=' by wrapping each segment
 * (except '=' signs) in backticks. If the input ends with a Discord mention (e.g. ` <@123456>`),
 * the mention is preserved outside the backticks.
 *
 * Example:
 * Input:  "abc = def <@123456>"
 * Output: "`abc` = `def` <@123456>"
 *
 * @param input - The raw input string to format.
 * @returns The formatted string with segments wrapped in backticks and mention preserved.
 */
export function formatMessage(input: string): string {
    const mentionMatch = input.match(/(\s<@\d+>)$/);
    const mention = mentionMatch ? mentionMatch[1] : "";

    const mainPart = mention ? input.slice(0, -mention.length).trim() : input.trim();

    if (!mainPart) {
        PsychiatrieLogger.log(`Input contains only a mention: "${mention.trim()}"`);
        return mention.trim();
    }

    const parts = mainPart.split("=").map(p => p.trim());
    const formattedParts = parts.map(p => (p ? `\`${p}\`` : ""));
    const formattedMessage = formattedParts.join(" = ");
    const result = mention ? `${formattedMessage}${mention}` : formattedMessage;

    PsychiatrieLogger.log(`Formatted input: "${input}" → "${result}"`);
    return result;
}

/**
 * Attempts to prime a Discord channel by fetching its latest message
 * and dispatching a MESSAGE_CREATE event to preload it into the client cache.
 *
 * This helps avoid issues where the channel appears empty or "stuck" until visited.
 *
 * @param channelId - The ID of the Discord channel to prime.
 * @returns A promise resolving to true if priming succeeded, false otherwise.
 */
export async function ensureChannelPrimed(channelId: string): Promise<boolean> {
    PsychiatrieLogger.log(`Attempting to prime channel ${channelId}...`);

    try {
        //* faking an api call to get the channel we want to send the message in, this works with the stuck bug.
        const response = await RestAPI.get({
            url: Constants.Endpoints.MESSAGES(channelId),
            query: { limit: 50 },
            retries: 2
        });

        const messages = response.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            PsychiatrieLogger.warn("No messages found in target channel.");
            return false;
        }

        FluxDispatcher.dispatch({
            type: "MESSAGE_CREATE",
            message: messages[0]
        });

        PsychiatrieLogger.log("MESSAGE_CREATE event dispatched successfully.");
        return true;
    } catch (err) {
        PsychiatrieLogger.error("Failed to load channel via RestAPI:", err);
        return false;
    }
}
