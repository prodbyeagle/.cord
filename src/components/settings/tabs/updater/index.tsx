/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { Link } from "@components/Link";
import { handleSettingsTabError, SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { ModalCloseButton, ModalContent, ModalProps, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { useAwaiter } from "@utils/react";
import { getRepo, isNewer, UpdateLogger } from "@utils/updater";
import { Forms, React, Switch } from "@webpack/common";

import gitHash from "~git-hash";

import { CommonProps, HashLink, Newer, Updatable } from "./Components";

function Updater() {
    const settings = useSettings(["autoUpdate", "autoUpdateNotification"]);

    const [repo, err, repoPending] = useAwaiter(getRepo, {
        fallbackValue: "Loading...",
        onError: e => UpdateLogger.error("Failed to retrieve repo", err)
    });

    const commonProps: CommonProps = {
        repo,
        repoPending
    };

    return (
        <SettingsTab title="EagleCord Updater">
            <Forms.FormTitle tag="h5">Updater Settings</Forms.FormTitle>

            <Switch
                value={settings.autoUpdate}
                onChange={(v: boolean) => settings.autoUpdate = v}
                note="Automatically update EagleCord without confirmation prompt"
            >
                Automatically update
            </Switch>
            <Switch
                value={settings.autoUpdateNotification}
                onChange={(v: boolean) => settings.autoUpdateNotification = v}
                note="Show a notification when EagleCord automatically updates"
                disabled={!settings.autoUpdate}
            >
                Get notified when an automatic update completes
            </Switch>

            <Forms.FormTitle tag="h5">Repo</Forms.FormTitle>

            <Forms.FormText>
                {repoPending
                    ? repo
                    : err
                        ? "Failed to retrieve - check console"
                        : (
                            <Link href={repo}>
                                {repo.split("/").slice(-2).join("/")}
                            </Link>
                        )
                }
                {" "}
                (<HashLink hash={gitHash} repo={repo} disabled={repoPending} />)
            </Forms.FormText>

            <Forms.FormDivider className={Margins.top8 + " " + Margins.bottom8} />

            <Forms.FormTitle tag="h5">Updates</Forms.FormTitle>

            {isNewer
                ? <Newer {...commonProps} />
                : <Updatable {...commonProps} />
            }
        </SettingsTab>
    );
}

export default IS_UPDATER_DISABLED
    ? null
    : wrapTab(Updater, "Updater");

export const openUpdaterModal = IS_UPDATER_DISABLED
    ? null
    : function () {
        const UpdaterTab = wrapTab(Updater, "Updater");

        try {
            openModal(wrapTab((modalProps: ModalProps) => (
                <ModalRoot {...modalProps} size={ModalSize.MEDIUM}>
                    <ModalContent className="vc-updater-modal">
                        <ModalCloseButton onClick={modalProps.onClose} className="vc-updater-modal-close-button" />
                        <UpdaterTab />
                    </ModalContent>
                </ModalRoot>
            ), "UpdaterModal"));
        } catch {
            handleSettingsTabError();
        }
    };
