/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

<<<<<<<< HEAD:src/components/settings/PluginBadge.tsx
export function AddonBadge({ text, color }) {
    return (
        <div className="vc-addon-badge" style={{
            backgroundColor: color,
            justifySelf: "flex-end",
            marginLeft: "auto"
        }}>
            {text}
        </div>
    );
}
========
import PluginSettings from "@components/PluginSettings";
import { wrapTab } from "@components/VencordSettings/shared";

export default wrapTab(PluginSettings, "Plugins");
>>>>>>>> 9c5b8cc7de5c5efe7d24387258b9df376abf077c:src/components/VencordSettings/PluginsTab.tsx
