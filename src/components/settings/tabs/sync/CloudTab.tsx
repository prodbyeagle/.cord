/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { Settings, useSettings } from "@api/Settings";
import { CheckedTextInput } from "@components/CheckedTextInput";
import { Grid } from "@components/Grid";
import { Link } from "@components/Link";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { authorizeCloud, checkCloudUrlCsp, cloudLogger, deauthorizeCloud, getCloudAuth, getCloudUrl } from "@utils/cloud";
import { Margins } from "@utils/margins";
import { deleteCloudSettings, getCloudSettings, putCloudSettings } from "@utils/settingsSync";
import { Alerts, Button, Forms, Switch, Tooltip } from "@webpack/common";

function validateUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return "Invalid URL";
    }
}

async function eraseAllData() {
    if (!await checkCloudUrlCsp()) return;

    const res = await fetch(new URL("/v1/", getCloudUrl()), {
        method: "DELETE",
        headers: { Authorization: await getCloudAuth() }
    });

    if (!res.ok) {
        cloudLogger.error(`Failed to erase data, API returned ${res.status}`);
        showNotification({
            title: "Cloud Integrations",
            body: `Could not erase all data (API returned ${res.status}), please contact support.`,
            color: "var(--red-360)"
        });
        return;
    }

    Settings.cloud.authenticated = false;
    await deauthorizeCloud();

    showNotification({
        title: "Cloud Integrations",
        body: "Successfully erased all data.",
        color: "var(--green-360)"
    });
}

function SettingsSyncSection() {
    const { cloud } = useSettings(["cloud.authenticated", "cloud.settingsSync"]);
    const sectionEnabled = cloud.authenticated && cloud.settingsSync;

    return (
        <Forms.FormSection title="Settings Sync" className={Margins.top16}>
            <Forms.FormText variant="text-md/normal" className={Margins.bottom20}>
                Synchronize your settings to the cloud. This allows easy synchronization across multiple devices with
                minimal effort.
            </Forms.FormText>
            <Switch
                key="cloud-sync"
                disabled={!cloud.authenticated}
                value={cloud.settingsSync}
                onChange={v => { cloud.settingsSync = v; }}
            >
                Settings Sync
            </Switch>
            <div className="vc-cloud-settings-sync-grid">
                <Button
                    size={Button.Sizes.SMALL}
                    disabled={!sectionEnabled}
                    onClick={() => putCloudSettings(true)}
                >
                    Sync to Cloud
                </Button>
                <Tooltip text="This will overwrite your local settings with the ones on the cloud. Use wisely!">
                    {({ onMouseLeave, onMouseEnter }) => (
                        <Button
                            onMouseLeave={onMouseLeave}
                            onMouseEnter={onMouseEnter}
                            size={Button.Sizes.SMALL}
                            color={Button.Colors.RED}
                            disabled={!sectionEnabled}
                            onClick={() => getCloudSettings(true, true)}
                        >
                            Sync from Cloud
                        </Button>
                    )}
                </Tooltip>
                <Button
                    size={Button.Sizes.SMALL}
                    color={Button.Colors.RED}
                    disabled={!sectionEnabled}
                    onClick={() => deleteCloudSettings()}
                >
                    Delete Cloud Settings
                </Button>
            </div>
        </Forms.FormSection>
    );
}

function CloudTab() {
    const settings = useSettings(["cloud.authenticated", "cloud.url"]);

    return (
        <SettingsTab title="EagleCord Cloud">
            <Forms.FormSection title="Cloud Settings" className={Margins.top16}>
                <Forms.FormText variant="text-md/normal" className={Margins.bottom20}>
                    Vencord comes with a cloud integration that adds goodies like settings sync across devices.
                    It <Link href="https://eaglecord.vercel.app/cloud/privacy">respects your privacy</Link>, and
                    the <Link href="https://github.com/Vencord/Backend">source code</Link> is AGPL 3.0 licensed so you
                    can host it yourself.
                </Forms.FormText>
                <Switch
                    disabled
                    key="backend"
                    value={settings.cloud.authenticated}
                    onChange={v => {
                        if (v)
                            authorizeCloud();
                        else
                            settings.cloud.authenticated = v;
                    }}
                    note="This will request authorization if you have not yet set up cloud integrations."
                >
                    Enable Cloud Integrations
                </Switch>
                <Forms.FormTitle tag="h5">Backend URL</Forms.FormTitle>
                <Forms.FormText className={Margins.bottom8}>
                    Which backend to use when using cloud integrations.
                </Forms.FormText>
                <CheckedTextInput
                    key="backendUrl"
                    value={settings.cloud.url}
                    onChange={async v => {
                        settings.cloud.url = v;
                        settings.cloud.authenticated = false;
                        deauthorizeCloud();
                    }}
                    validate={validateUrl}
                />

                <Grid columns={2} gap="1em" className={Margins.top8}>
                    <Button
                        size={Button.Sizes.MEDIUM}
                        disabled={!settings.cloud.authenticated}
                        onClick={async () => {
                            await deauthorizeCloud();
                            settings.cloud.authenticated = false;
                            await authorizeCloud();
                        }}
                    >
                        Reauthorise
                    </Button>
                    <Button
                        size={Button.Sizes.MEDIUM}
                        color={Button.Colors.RED}
                        disabled={!settings.cloud.authenticated}
                        onClick={() => Alerts.show({
                            title: "Are you sure?",
                            body: "Once your data is erased, we cannot recover it. There's no going back!",
                            onConfirm: eraseAllData,
                            confirmText: "Erase it!",
                            confirmColor: "vc-cloud-erase-data-danger-btn",
                            cancelText: "Nevermind"
                        })}
                    >
                        Erase All Data
                    </Button>
                </Grid>

                <Forms.FormDivider className={Margins.top16} />
            </Forms.FormSection >
            <SettingsSyncSection />
        </SettingsTab>
    );
}

export default wrapTab(CloudTab, "Cloud");
