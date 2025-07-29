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

import { CONTRIB_BACKGROUND_IMAGE, EAGLECORD_ICON_IMAGE } from "../vencord";


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
                cardImage={EAGLECORD_ICON_IMAGE}
                backgroundImage={CONTRIB_BACKGROUND_IMAGE}
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
