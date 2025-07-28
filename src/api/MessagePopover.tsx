/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Logger } from "@utils/Logger";
import { Channel, Message } from "@vencord/discord-types";
import type { ComponentType, MouseEventHandler } from "react";

const logger = new Logger("MessagePopover");

export interface MessagePopoverButtonItem {
    key?: string,
    label: string,
    icon: ComponentType<any>,
    message: Message,
    channel: Channel,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    onContextMenu?: MouseEventHandler<HTMLButtonElement>;
}

export type MessagePopoverButtonFactory = (message: Message) => MessagePopoverButtonItem | null;

export const buttons = new Map<string, MessagePopoverButtonFactory>();

export function addMessagePopoverButton(
    identifier: string,
    item: MessagePopoverButtonFactory,
) {
    buttons.set(identifier, item);
}

export function removeMessagePopoverButton(identifier: string) {
    buttons.delete(identifier);
}

export function _buildPopoverElements(
    Component: React.ComponentType<MessagePopoverButtonItem>,
    message: Message
) {
    const items: React.ReactNode[] = [];

    for (const [identifier, getItem] of buttons.entries()) {
        try {
            const item = getItem(message);
            if (item) {
                item.key ??= identifier;
                items.push(
                    <ErrorBoundary noop>
                        <Component {...item} />
                    </ErrorBoundary>
                );
            }
        } catch (err) {
            logger.error(`[${identifier}]`, err);
        }
    }

    return <>{items}</>;
}
