/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoticesAPI",
    description: "Fixes notices being automatically dismissed",
    authors: [Devs.Ven],
    required: true,
    patches: [
        {
            find: '"NoticeStore"',
            replacement: [
                {
                    match: /(?<=!1;)\i=null;(?=.{0,80}getPremiumSubscription\(\))/g,
                    replace: "if(Vencord.Api.Notices.currentNotice)return false;$&"
                },
                {
                    match: /(?<=,NOTICE_DISMISS:function\(\i\){)return null!=(\i)/,
                    replace: "if($1?.id==\"VencordNotice\")return($1=null,Vencord.Api.Notices.nextNotice(),true);$&"
                }
            ]
        }
    ],
});
