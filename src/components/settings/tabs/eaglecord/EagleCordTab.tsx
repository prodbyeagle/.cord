/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { SpecialCard } from "@components/settings/SpecialCard";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { Forms, Switch, UserStore } from "@webpack/common";

const EAGLE_ICON = "https://cdn.discordapp.com/emojis/1385016033831555233.gif";
const BG_IMAGE = "https://media.discordapp.net/stickers/1311070166481895484.png?size=2048";

function EagleCordTab() {
    const user = UserStore.getCurrentUser();

    const settings = useSettings([
        "eaglecord.showBanner",
    ]);

    return (
        <SettingsTab title="EagleCord">
            <SpecialCard
                title="EagleCord"
                subtitle="Entwickelt mit ❤️ für die Psychiatrie."
                description="EagleCord erweitert Vencord um visuelle Verbesserungen, eigene Badges, Themes und mehr."
                cardImage={EAGLE_ICON}
                backgroundImage={BG_IMAGE}
                backgroundColor="#cfa6f5"
            />

            <Forms.FormSection title="Funktionen" className={Margins.top16}>
                <Switch
                    key="eaglecord.showBanner"
                    value={settings.eaglecord.showBanner}
                    onChange={v => settings.eaglecord.showBanner = v}
                    note="Zeigt benutzerdefinierte Banner in Profilen und Einstellungen."
                >
                    Benutzerdefinierte Banner anzeigen
                </Switch>
            </Forms.FormSection>
        </SettingsTab>
    );
}

export default wrapTab(EagleCordTab, "EagleCord");
