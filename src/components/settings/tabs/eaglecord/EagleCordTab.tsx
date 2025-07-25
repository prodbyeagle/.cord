import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { React, Forms, Switch, UserStore } from "@webpack/common";
import { useSettings } from "@api/Settings";
import { Margins } from "@utils/margins";

function EagleCordTab() {
    const user = UserStore.getCurrentUser();

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
