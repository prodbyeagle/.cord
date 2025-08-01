/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";
import { Menu, React } from "@webpack/common";
import type { ReactElement } from "react";

/**
 * @param children The rendered context menu elements
 * @param args Any arguments passed into making the context menu, like the guild, channel, user or message for example
 */
export type NavContextMenuPatchCallback = (children: Array<ReactElement<any> | null>, ...args: Array<any>) => void;
/**
 * @param navId The navId of the context menu being patched
 * @param children The rendered context menu elements
 * @param args Any arguments passed into making the context menu, like the guild, channel, user or message for example
 */
export type GlobalContextMenuPatchCallback = (navId: string, children: Array<ReactElement<any> | null>, ...args: Array<any>) => void;

const ContextMenuLogger = new Logger("ContextMenu");

export const navPatches = new Map<string, Set<NavContextMenuPatchCallback>>();
export const globalPatches = new Set<GlobalContextMenuPatchCallback>();

/**
 * Add a context menu patch
 * @param navId The navId(s) for the context menu(s) to patch
 * @param patch The patch to be applied
 */
export function addContextMenuPatch(navId: string | Array<string>, patch: NavContextMenuPatchCallback) {
    if (!Array.isArray(navId)) navId = [navId];
    for (const id of navId) {
        let contextMenuPatches = navPatches.get(id);
        if (!contextMenuPatches) {
            contextMenuPatches = new Set();
            navPatches.set(id, contextMenuPatches);
        }

        contextMenuPatches.add(patch);
    }
}

/**
 * Add a global context menu patch that fires the patch for all context menus
 * @param patch The patch to be applied
 */
export function addGlobalContextMenuPatch(patch: GlobalContextMenuPatchCallback) {
    globalPatches.add(patch);
}

/**
 * Remove a context menu patch
 * @param navId The navId(s) for the context menu(s) to remove the patch
 * @param patch The patch to be removed
 * @returns Whether the patch was successfully removed from the context menu(s)
 */
export function removeContextMenuPatch<T extends string | Array<string>>(navId: T, patch: NavContextMenuPatchCallback): T extends string ? boolean : Array<boolean> {
    const navIds: string[] = Array.isArray(navId) ? navId : [navId];

    const results = navIds.map(id => navPatches.get(id)?.delete(patch) ?? false);

    return (Array.isArray(navId) ? results : results[0]) as T extends string ? boolean : Array<boolean>;
}

/**
 * Remove a global context menu patch
 * @param patch The patch to be removed
 * @returns Whether the patch was successfully removed
 */
export function removeGlobalContextMenuPatch(patch: GlobalContextMenuPatchCallback): boolean {
    return globalPatches.delete(patch);
}

/**
 * A helper function for finding the children array of a group nested inside a context menu based on the id(s) of its children
 * @param id The id of the child. If an array is specified, all ids will be tried
 * @param children The context menu children
 * @param matchSubstring Whether to check if the id is a substring of the child id
 */
export function findGroupChildrenByChildId(id: string | string[], children: Array<ReactElement<any> | null | undefined>, matchSubstring = false): Array<ReactElement<any> | null | undefined> | null {
    for (const child of children) {
        if (child == null) continue;

        if (Array.isArray(child)) {
            const found = findGroupChildrenByChildId(id, child, matchSubstring);
            if (found !== null) return found;
        }

        if (
            (Array.isArray(id) && id.some(id => matchSubstring ? child.props?.id?.includes(id) : child.props?.id === id))
            || (matchSubstring ? child.props?.id?.includes(id) : child.props?.id === id)
        ) return children;

        let nextChildren = child.props?.children;
        if (nextChildren) {
            if (!Array.isArray(nextChildren)) {
                nextChildren = [nextChildren];
                child.props.children = nextChildren;
            }

            const found = findGroupChildrenByChildId(id, nextChildren, matchSubstring);
            if (found !== null) return found;
        }
    }

    return null;
}

interface ContextMenuProps {
    contextMenuAPIArguments?: Array<any>;
    navId: string;
    children: Array<ReactElement<any> | null>;
    "aria-label": string;
    onSelect: (() => void) | undefined;
    onClose: (callback: (...args: Array<any>) => any) => void;
}

export function _usePatchContextMenu(props: ContextMenuProps) {
    props = {
        ...props,
        children: cloneMenuChildren(props.children),
    };

    props.contextMenuAPIArguments ??= [];
    const contextMenuPatches = navPatches.get(props.navId);

    if (!Array.isArray(props.children)) props.children = [props.children];

    if (contextMenuPatches) {
        for (const patch of contextMenuPatches) {
            try {
                patch(props.children, ...props.contextMenuAPIArguments);
            } catch (err) {
                ContextMenuLogger.error(`Patch for ${props.navId} errored,`, err);
            }
        }
    }

    for (const patch of globalPatches) {
        try {
            patch(props.navId, props.children, ...props.contextMenuAPIArguments);
        } catch (err) {
            ContextMenuLogger.error("Global patch errored,", err);
        }
    }

    return props;
}

function cloneMenuChildren(obj: ReactElement<any> | Array<ReactElement<any> | null> | null) {
    if (Array.isArray(obj)) {
        return obj.map(cloneMenuChildren);
    }

    if (React.isValidElement(obj)) {
        obj = React.cloneElement(obj);

        if (
            obj?.props?.children &&
            (obj.type !== Menu.MenuControlItem || obj.type === Menu.MenuControlItem && obj.props.control != null)
        ) {
            obj.props.children = cloneMenuChildren(obj.props.children);
        }
    }

    return obj;
}
