/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { debounce } from "@shared/debounce";
import { SettingsStore as SettingsStoreClass } from "@shared/SettingsStore";
import { localStorage } from "@utils/localStorage";
import { Logger } from "@utils/Logger";
import { mergeDefaults } from "@utils/mergeDefaults";
import { putCloudSettings } from "@utils/settingsSync";
import { DefinedSettings, OptionType, SettingsChecks, SettingsDefinition } from "@utils/types";
import { React, useEffect } from "@webpack/common";

import plugins from "~plugins";

const logger = new Logger("Settings");
export interface Settings {
    autoUpdate: boolean;
    autoUpdateNotification: boolean,
    useQuickCss: boolean;
    eagerPatches: boolean;
    enabledThemes: string[];
    enableReactDevtools: boolean;
    themeLinks: string[];
    frameless: boolean;
    transparent: boolean;
    winCtrlQ: boolean;
    macosVibrancyStyle:
    | "content"
    | "fullscreen-ui"
    | "header"
    | "hud"
    | "menu"
    | "popover"
    | "selection"
    | "sidebar"
    | "titlebar"
    | "tooltip"
    | "under-page"
    | "window"
    | undefined;
    disableMinSize: boolean;
    winNativeTitleBar: boolean;
    plugins: {
        [plugin: string]: {
            enabled: boolean;
            [setting: string]: any;
        };
    };

    notifications: {
        timeout: number;
        position: "top-right" | "bottom-right";
        useNative: "always" | "never" | "not-focused";
        logLimit: number;
    };

    cloud: {
        authenticated: boolean;
        url: string;
        settingsSync: boolean;
        settingsSyncVersion: number;
    };

    eaglecord: {
        showBadge: boolean,
        showBanner: boolean,
    };
}

const DefaultSettings: Settings = {
    autoUpdate: true,
    autoUpdateNotification: true,
    useQuickCss: true,
    themeLinks: [],
    eagerPatches: IS_REPORTER,
    enabledThemes: [],
    enableReactDevtools: false,
    frameless: false,
    transparent: false,
    winCtrlQ: false,
    macosVibrancyStyle: undefined,
    disableMinSize: false,
    winNativeTitleBar: false,
    plugins: {},

    notifications: {
        timeout: 5000,
        position: "bottom-right",
        useNative: "not-focused",
        logLimit: 50
    },

    cloud: {
        authenticated: false,
        url: "https://api.vencord.dev/",
        settingsSync: false,
        settingsSyncVersion: 0
    },

    eaglecord: {
        showBadge: true,
        showBanner: true,
    }
};

const settings = !IS_REPORTER ? VencordNative.settings.get() : {} as Settings;
mergeDefaults(settings, DefaultSettings);

const saveSettingsOnFrequentAction = debounce(async () => {
    if (Settings.cloud.settingsSync && Settings.cloud.authenticated) {
        await putCloudSettings();
        delete localStorage.Vencord_settingsDirty;
    }
}, 60_000);


export const SettingsStore = new SettingsStoreClass(settings, {
    readOnly: true,
    getDefaultValue({
        target,
        key,
        path
    }) {
        const v = target[key];
        if (!plugins) return v; // plugins not initialised yet. this means this path was reached by being called on the top level

        if (path === "plugins" && key in plugins)
            return target[key] = {
                enabled: IS_REPORTER || plugins[key].required || plugins[key].enabledByDefault || false
            };

        // Since the property is not set, check if this is a plugin's setting and if so, try to resolve
        // the default value.
        if (path.startsWith("plugins.")) {
            const plugin = path.slice("plugins.".length);
            if (plugin in plugins) {
                const setting = plugins[plugin].options?.[key];
                if (!setting) return v;

                if ("default" in setting)
                    // normal setting with a default value
                    return (target[key] = setting.default);

                if (setting.type === OptionType.SELECT) {
                    const def = setting.options.find(o => o.default);
                    if (def)
                        target[key] = def.value;
                    return def?.value;
                }
            }
        }
        return v;
    }
});

if (!IS_REPORTER) {
    SettingsStore.addGlobalChangeListener((_, path) => {
        SettingsStore.plain.cloud.settingsSyncVersion = Date.now();
        localStorage.Vencord_settingsDirty = true;
        saveSettingsOnFrequentAction();
        VencordNative.settings.set(SettingsStore.plain, path);
    });
}

/**
 * Same as {@link Settings} but unproxied. You should treat this as readonly,
 * as modifying properties on this will not save to disk or call settings
 * listeners.
 * WARNING: default values specified in plugin.options will not be ensured here. In other words,
 * settings for which you specified a default value may be uninitialised. If you need proper
 * handling for default values, use {@link Settings}
 */
export const PlainSettings = settings;
/**
 * A smart settings object. Altering props automagically saves
 * the updated settings to disk.
 * This recursively proxies objects. If you need the object non proxied, use {@link PlainSettings}
 */
export const Settings = SettingsStore.store;

/**
 * Settings hook for React components. Returns a smart settings
 * object that automagically triggers a rerender if any properties
 * are altered
 * @param paths An optional list of paths to whitelist for rerenders
 * @returns Settings
 */
// TODO: Representing paths as essentially "string[].join('.')" wont allow dots in paths, change to "paths?: string[][]" later
export function useSettings(paths?: UseSettings<Settings>[]) {
    const [, forceUpdate] = React.useReducer(() => ({}), {});

    useEffect(() => {
        if (paths) {
            paths.forEach(p => SettingsStore.addChangeListener(p, forceUpdate));
            return () => paths.forEach(p => SettingsStore.removeChangeListener(p, forceUpdate));
        } else {
            SettingsStore.addGlobalChangeListener(forceUpdate);
            return () => SettingsStore.removeGlobalChangeListener(forceUpdate);
        }
    }, [paths]);

    return SettingsStore.store;
}

export function migratePluginSettings(name: string, ...oldNames: string[]) {
    const { plugins } = SettingsStore.plain;
    if (name in plugins) return;

    for (const oldName of oldNames) {
        if (oldName in plugins) {
            logger.info(`Migrating settings from old name ${oldName} to ${name}`);
            plugins[name] = plugins[oldName];
            delete plugins[oldName];
            SettingsStore.markAsChanged();
            break;
        }
    }
}

export function migratePluginSetting(pluginName: string, oldSetting: string, newSetting: string) {
    const settings = SettingsStore.plain.plugins[pluginName];
    if (!settings) return;

    if (!Object.hasOwn(settings, oldSetting) || Object.hasOwn(settings, newSetting)) return;

    settings[newSetting] = settings[oldSetting];
    delete settings[oldSetting];
    SettingsStore.markAsChanged();
}

export function definePluginSettings<
    Def extends SettingsDefinition,
    Checks extends SettingsChecks<Def>,
    PrivateSettings extends object = {}
>(def: Def, checks?: Checks) {
    const definedSettings: DefinedSettings<Def, Checks, PrivateSettings> = {
        get store() {
            if (!definedSettings.pluginName) throw new Error("Cannot access settings before plugin is initialized");
            return Settings.plugins[definedSettings.pluginName] as any;
        },
        get plain() {
            if (!definedSettings.pluginName) throw new Error("Cannot access settings before plugin is initialized");
            return PlainSettings.plugins[definedSettings.pluginName] as any;
        },
        use: settings => useSettings(
            settings?.map(name => `plugins.${definedSettings.pluginName}.${name}`) as UseSettings<Settings>[]
        ).plugins[definedSettings.pluginName] as any,
        def,
        checks: checks ?? {} as any,
        pluginName: "",

        withPrivateSettings<T extends object>() {
            return this as DefinedSettings<Def, Checks, T>;
        }
    };

    return definedSettings;
}

type UseSettings<T extends object> = ResolveUseSettings<T>[keyof T];

type ResolveUseSettings<T extends object> = {
    [Key in keyof T]:
    Key extends string
    ? T[Key] extends Record<string, unknown>
    // @ts-expect-error "Type instantiation is excessively deep and possibly infinite"
    ? UseSettings<T[Key]> extends string ? `${Key}.${UseSettings<T[Key]>}` : never
    : Key
    : never;
};
