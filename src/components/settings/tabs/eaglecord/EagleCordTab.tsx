/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { Forms, React, Switch } from "@webpack/common";

function EagleCordTab() {
    const settings = useSettings([
        "eaglecord.showBadge",
        "eaglecord.showBanner"
    ]);

    return (
        <SettingsTab title="EagleCord">
            <Forms.FormSection className={Margins.top16} title="Funktionen">
                <Switch
                    key="eaglecord.showBadge"
                    value={false} // settings.eaglecord.showBadge
                    onChange={v => settings.eaglecord.showBadge = v}
                    disabled
                    note="Zeigt benutzerdefinierte Badges bei manchen Nutzern."
                >
                    Benutzerdefinierte-Badges anzeigen ( GERADE KAPUTT )
                </Switch>

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
