/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

<<<<<<<< HEAD:src/components/settings/QuickAction.tsx
import "./QuickAction.css";
========
// eslint-disable-next-line path-alias/no-relative
import "./quickActions.css";
>>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c:src/components/VencordSettings/quickActions.tsx

import { classNameFactory } from "@api/Styles";
import { Card } from "@webpack/common";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";

const cl = classNameFactory("vc-settings-quickActions-");

export interface QuickActionProps {
    Icon: ComponentType<{ className?: string; }>;
    text: ReactNode;
    action?: () => void;
    disabled?: boolean;
}

export function QuickAction(props: QuickActionProps) {
    const { Icon, action, text, disabled } = props;

    return (
        <button className={cl("pill")} onClick={action} disabled={disabled}>
            <Icon className={cl("img")} />
            {text}
        </button>
    );
}

export function QuickActionCard(props: PropsWithChildren) {
    return (
        <Card className={cl("card")}>
            {props.children}
        </Card>
    );
}
