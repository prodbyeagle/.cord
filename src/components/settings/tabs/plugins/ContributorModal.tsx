/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

<<<<<<< HEAD
<<<<<<<< HEAD:src/components/settings/tabs/plugins/ContributorModal.tsx
import "./ContributorModal.css";
========
// eslint-disable-next-line path-alias/no-relative
import "./contributorModal.css";
>>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c:src/components/PluginSettings/ContributorModal.tsx

import { ProfileBadge } from "@api/Badges";
=======
import "./ContributorModal.css";

>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c
import { useSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import ErrorBoundary from "@components/ErrorBoundary";
import { Link } from "@components/Link";
<<<<<<< HEAD
import { GithubButton, WebsiteButton } from "@components/PluginSettings/LinkIconButton";
import { DevsById } from "@utils/constants";
import { fetchUserProfile } from "@utils/discord";
import { Margins } from "@utils/margins";
import { classes, pluralise } from "@utils/misc";
import { ModalContent, ModalHeader, ModalRoot, openModal } from "@utils/modal";
<<<<<<<< HEAD:src/components/settings/tabs/plugins/ContributorModal.tsx
=======
import { DevsById } from "@utils/constants";
import { fetchUserProfile } from "@utils/discord";
import { classes, pluralise } from "@utils/misc";
import { ModalContent, ModalHeader, ModalRoot, openModal } from "@utils/modal";
>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c
import { User } from "@vencord/discord-types";
import { Flex, Forms, showToast, useEffect, useMemo, UserProfileStore, useStateFromStores } from "@webpack/common";

import Plugins from "~plugins";

import { GithubButton, WebsiteButton } from "./LinkIconButton";
import { PluginCard } from "./PluginCard";
import { Margins } from "@utils/margins";
import { ProfileBadge } from "@api/Badges";
<<<<<<< HEAD
========
import { Flex, Forms, showToast, useEffect, useMemo, UserProfileStore, useStateFromStores } from "@webpack/common";
import { User } from "@vencord/discord-types";

import Plugins from "~plugins";

import { PluginCard } from ".";
>>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c:src/components/PluginSettings/ContributorModal.tsx
=======
>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c

const cl = classNameFactory("vc-author-modal-");

export function openStaffModal(badge: ProfileBadge) {
    openModal(modalProps =>
        <ModalRoot {...modalProps}>
            <ErrorBoundary>
                <ModalContent className={cl("root")}>
                    <StaffModal badge={badge} />
                </ModalContent>
            </ErrorBoundary>
        </ModalRoot>
    );
}

<<<<<<< HEAD
<<<<<<<< HEAD:src/components/settings/tabs/plugins/ContributorModal.tsx
=======
>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c
function StaffModal({ badge }: { badge: ProfileBadge; }) {
    return (
        <>
            <ModalHeader>
                <Flex style={{ width: "100%", justifyContent: "center", gap: "1rem" }}>
                    <Forms.FormTitle
                        style={{
                            width: "100%",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        🦅 EagleCord
                    </Forms.FormTitle>
                </Flex>
            </ModalHeader>

            <ModalContent>
                <Flex style={{ justifyContent: "center", gap: "1rem" }}>
                    <img
                        src={badge.image}
                        alt="EagleCord Former Staff Badge"
                        style={{
                            width: 64,
                            height: 64,
                            filter: "grayscale(100%)"
                        }}
                    />
                </Flex>
                <div style={{ padding: "1em", textAlign: "center", gap: "1rem" }}>
                    <Forms.FormText>{badge.description}</Forms.FormText>
                    <Forms.FormText className={Margins.top20}>
                        This user is a former staff member of EagleCord. I want to honor and remember my former colleagues.
                    </Forms.FormText>
                </div>
            </ModalContent>
        </>
    );
}

<<<<<<< HEAD
========
>>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c:src/components/PluginSettings/ContributorModal.tsx
=======


>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c
export function openContributorModal(user: User) {
    openModal(modalProps =>
        <ModalRoot {...modalProps}>
            <ErrorBoundary>
                <ModalContent className={cl("root")}>
                    <ContributorModal user={user} />
                </ModalContent>
            </ErrorBoundary>
        </ModalRoot>
    );
}

<<<<<<< HEAD
function StaffModal({ badge }: { badge: ProfileBadge; }) {
    return (
        <>
            <ModalHeader>
                <Flex style={{ width: "100%", justifyContent: "center", gap: "1rem" }}>
                    <Forms.FormTitle
                        style={{
                            width: "100%",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        🦅 EagleCord
                    </Forms.FormTitle>
                </Flex>
            </ModalHeader>

            <ModalContent>
                <Flex style={{ justifyContent: "center", gap: "1rem" }}>
                    <img
                        src={badge.image}
                        alt="EagleCord Former Staff Badge"
                        style={{
                            width: 64,
                            height: 64,
                            filter: "grayscale(100%)"
                        }}
                    />
                </Flex>
                <div style={{ padding: "1em", textAlign: "center", gap: "1rem" }}>
                    <Forms.FormText>{badge.description}</Forms.FormText>
                    <Forms.FormText className={Margins.top20}>
                        This user is a former staff member of EagleCord. I want to honor and remember my former colleagues.
                    </Forms.FormText>
                </div>
            </ModalContent>
        </>
    );
}

=======
>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c
function ContributorModal({ user }: { user: User; }) {
    useSettings();

    const profile = useStateFromStores([UserProfileStore], () => UserProfileStore.getUserProfile(user.id));

    useEffect(() => {
        if (!profile && !user.bot && user.id)
            fetchUserProfile(user.id);
    }, [user.id, user.bot, profile]);

    const githubName = profile?.connectedAccounts?.find(a => a.type === "github")?.name;
    const website = profile?.connectedAccounts?.find(a => a.type === "domain")?.name;

    const plugins = useMemo(() => {
        const allPlugins = Object.values(Plugins);
        const pluginsByAuthor = DevsById[user.id]
            ? allPlugins.filter(p => p.authors.includes(DevsById[user.id]))
            : allPlugins.filter(p => p.authors.some(a => a.name === user.username));

        return pluginsByAuthor
            .filter(p => !p.name.endsWith("API"))
            .sort((a, b) => Number(a.required ?? false) - Number(b.required ?? false));
    }, [user.id, user.username]);

    const ContributedHyperLink = <Link href="https://vencord.dev/source">contributed</Link>;

    return (
        <>
            <div className={cl("header")}>
                <img
                    className={cl("avatar")}
                    src={user.getAvatarURL(void 0, 512, true)}
                    alt=""
                />
                <Forms.FormTitle tag="h2" className={cl("name")}>{user.username}</Forms.FormTitle>

                <div className={classes("vc-settings-modal-links", cl("links"))}>
                    {website && (
                        <WebsiteButton
                            text={website}
                            href={`https://${website}`}
                        />
                    )}
                    {githubName && (
                        <GithubButton
                            text={githubName}
                            href={`https://github.com/${githubName}`}
                        />
                    )}
                </div>
            </div>

            {plugins.length ? (
                <Forms.FormText>
                    This person has {ContributedHyperLink} to {pluralise(plugins.length, "plugin")}!
                </Forms.FormText>
            ) : (
                <Forms.FormText>
                    This person has not made any plugins. They likely {ContributedHyperLink} to Vencord in other ways!
                </Forms.FormText>
            )}

            {!!plugins.length && (
                <div className={cl("plugins")}>
                    {plugins.map(p =>
                        <PluginCard
                            key={p.name}
                            plugin={p}
                            disabled={p.required ?? false}
                            onRestartNeeded={() => showToast("Restart to apply changes!")}
                        />
                    )}
                </div>
            )}
        </>
    );
}
<<<<<<< HEAD

=======
>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c
