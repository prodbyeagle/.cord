/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./iconStyles.css";

import { getIntlMessage } from "@utils/discord";
import { classes } from "@utils/misc";
import type { JSX, PropsWithChildren } from "react";

interface BaseIconProps extends IconProps {
    viewBox: string;
}

type IconProps = JSX.IntrinsicElements["svg"];

function Icon({ height = 24, width = 24, className, children, viewBox, ...svgProps }: PropsWithChildren<BaseIconProps>) {
    return (
        <svg
            className={classes(className, "vc-icon")}
            role="img"
            width={width}
            height={height}
            viewBox={viewBox}
            {...svgProps}
        >
            {children}
        </svg>
    );
}

/**
 * Discord's link icon, as seen in the Message context menu "Copy Message Link" option
 */
export function LinkIcon({ height = 24, width = 24, className }: IconProps) {
    return (
        <Icon
            height={height}
            width={width}
            className={classes(className, "vc-link-icon")}
            viewBox="0 0 24 24"
        >
            <g fill="none" fillRule="evenodd">
                <path fill="currentColor" d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z" />
                <rect width={width} height={height} />
            </g>
        </Icon>
    );
}

/**
 * Discord's copy icon, as seen in the user panel popout on the right of the username and in large code blocks
 */
export function CopyIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-copy-icon")}
            viewBox="0 0 24 24"
        >
            <g fill="currentColor">
                <path d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z" />
                <path d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z" />
                <path d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z" />
            </g>
        </Icon>
    );
}

/**
 * Discord's open external icon, as seen in the user profile connections
 */
export function OpenExternalIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-open-external-icon")}
            viewBox="0 0 24 24"
        >
            <polygon
                fill="currentColor"
                fillRule="nonzero"
                points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"
            />
        </Icon>
    );
}

export function ImageIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-image-icon")}
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="M21,19V5c0,-1.1 -0.9,-2 -2,-2H5c-1.1,0 -2,0.9 -2,2v14c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2zM8.5,13.5l2.5,3.01L14.5,12l4.5,6H5l3.5,-4.5z" />
        </Icon>
    );
}

export function InfoIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-info-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-9.5-4.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-.77 3.96a1 1 0 1 0-1.96-.42l-1.04 4.86a2.77 2.77 0 0 0 4.31 2.83l.24-.17a1 1 0 1 0-1.16-1.62l-.24.17a.77.77 0 0 1-1.2-.79l1.05-4.86Z" clipRule="evenodd"
            />
        </Icon>
    );
}

export function OwnerCrownIcon(props: IconProps) {
    return (
        <Icon
            aria-label={getIntlMessage("GUILD_OWNER")}
            {...props}
            className={classes(props.className, "vc-owner-crown-icon")}
            role="img"
            viewBox="0 0 16 16"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z"
            />
        </Icon>
    );
}

/**
 * Discord's screenshare icon, as seen in the connection panel
 */
export function ScreenshareIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-screenshare-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M2 4.5C2 3.397 2.897 2.5 4 2.5H20C21.103 2.5 22 3.397 22 4.5V15.5C22 16.604 21.103 17.5 20 17.5H13V19.5H17V21.5H7V19.5H11V17.5H4C2.897 17.5 2 16.604 2 15.5V4.5ZM13.2 14.3375V11.6C9.864 11.6 7.668 12.6625 6 15C6.672 11.6625 8.532 8.3375 13.2 7.6625V5L18 9.6625L13.2 14.3375Z"
            />
        </Icon>
    );
}

export function ImageVisible(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-image-visible")}
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm0-2h14V5H5v14Zm1-2h12l-3.75-5-3 4L9 13Zm-1 2V5v14Z" />
        </Icon>
    );
}

export function ImageInvisible(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-image-invisible")}
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="m21 18.15-2-2V5H7.85l-2-2H19q.825 0 1.413.587Q21 4.175 21 5Zm-1.2 4.45L18.2 21H5q-.825 0-1.413-.587Q3 19.825 3 19V5.8L1.4 4.2l1.4-1.4 18.4 18.4ZM6 17l3-4 2.25 3 .825-1.1L5 7.825V19h11.175l-2-2Zm7.425-6.425ZM10.6 13.4Z" />
        </Icon>
    );
}

export function Microphone(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-microphone")}
            viewBox="0 0 24 24"
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z" fill="currentColor" />
        </Icon >
    );
}

export function CogWheel(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-cog-wheel")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                clipRule="evenodd"
            />
        </Icon>
    );
}

export function ReplyIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-reply-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z"
            />
        </Icon>
    );
}

export function DeleteIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-delete-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"
            />
            <path
                fill="currentColor"
                d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"
            />
        </Icon>
    );
}

export function PlusIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-plus-icon")}
            viewBox="0 0 18 18"
        >
            <polygon
                fillRule="nonzero"
                fill="currentColor"
                points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"
            />
        </Icon>
    );
}

export function NoEntrySignIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-no-entry-sign-icon")}
            viewBox="0 0 24 24"
        >
            <path
                d="M0 0h24v24H0z"
                fill="none"
            />
            <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
            />
        </Icon>
    );
}

export function SafetyIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-safety-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.27 5.22A2.66 2.66 0 0 0 3 7.5v2.3c0 5.6 3.3 10.68 8.42 12.95.37.17.79.17 1.16 0A14.18 14.18 0 0 0 21 9.78V7.5c0-.93-.48-1.78-1.27-2.27l-6.17-3.76a3 3 0 0 0-3.12 0L4.27 5.22ZM6 7.68l6-3.66V12H6.22C6.08 11.28 6 10.54 6 9.78v-2.1Zm6 12.01V12h5.78A11.19 11.19 0 0 1 12 19.7Z"
            />
        </Icon>

    );
}

export function NotesIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-notes-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M8 3C7.44771 3 7 3.44772 7 4V5C7 5.55228 7.44772 6 8 6H16C16.5523 6 17 5.55228 17 5V4C17 3.44772 16.5523 3 16 3H15.1245C14.7288 3 14.3535 2.82424 14.1002 2.52025L13.3668 1.64018C13.0288 1.23454 12.528 1 12 1C11.472 1 10.9712 1.23454 10.6332 1.64018L9.8998 2.52025C9.64647 2.82424 9.27121 3 8.8755 3H8Z"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="currentColor"
                d="M19 4.49996V4.99996C19 6.65681 17.6569 7.99996 16 7.99996H8C6.34315 7.99996 5 6.65681 5 4.99996V4.49996C5 4.22382 4.77446 3.99559 4.50209 4.04109C3.08221 4.27826 2 5.51273 2 6.99996V19C2 20.6568 3.34315 22 5 22H19C20.6569 22 22 20.6568 22 19V6.99996C22 5.51273 20.9178 4.27826 19.4979 4.04109C19.2255 3.99559 19 4.22382 19 4.49996ZM8 12C7.44772 12 7 12.4477 7 13C7 13.5522 7.44772 14 8 14H16C16.5523 14 17 13.5522 17 13C17 12.4477 16.5523 12 16 12H8ZM7 17C7 16.4477 7.44772 16 8 16H13C13.5523 16 14 16.4477 14 17C14 17.5522 13.5523 18 13 18H8C7.44772 18 7 17.5522 7 17Z"
            />
        </Icon>
    );
}

export function FolderIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-folder-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M2 5a3 3 0 0 1 3-3h3.93a2 2 0 0 1 1.66.9L12 5h7a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Z"
            />
        </Icon>
    );
}

export function LogIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-log-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.11 8H6v10.82c0 .86.37 1.68 1 2.27.46.43 1.02.71 1.63.84A1 1 0 0 0 9 22h10a4 4 0 0 0 4-4v-1a2 2 0 0 0-2-2h-1V5a3 3 0 0 0-3-3H4.67c-.87 0-1.7.32-2.34.9-.63.6-1 1.42-1 2.28 0 .71.3 1.35.52 1.75a5.35 5.35 0 0 0 .48.7l.01.01h.01L3.11 7l-.76.65a1 1 0 0 0 .76.35Zm1.56-4c-.38 0-.72.14-.97.37-.24.23-.37.52-.37.81a1.69 1.69 0 0 0 .3.82H6v-.83c0-.29-.13-.58-.37-.8C5.4 4.14 5.04 4 4.67 4Zm5 13a3.58 3.58 0 0 1 0 3H19a2 2 0 0 0 2-2v-1H9.66ZM3.86 6.35ZM11 8a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Zm-1 5a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z"
            />
        </Icon>
    );
}

export function RestartIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-restart-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M4 12a8 8 0 0 1 14.93-4H15a1 1 0 1 0 0 2h6a1 1 0 0 0 1-1V3a1 1 0 1 0-2 0v3a9.98 9.98 0 0 0-18 6 10 10 0 0 0 16.29 7.78 1 1 0 0 0-1.26-1.56A8 8 0 0 1 4 12Z"
            />
        </Icon>
    );
}

export function PaintbrushIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-paintbrush-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.35 7.24C15.9 6.67 16 5.8 16 5a3 3 0 1 1 3 3c-.8 0-1.67.09-2.24.65a1.5 1.5 0 0 0 0 2.11l1.12 1.12a3 3 0 0 1 0 4.24l-5 5a3 3 0 0 1-4.25 0l-5.76-5.75a3 3 0 0 1 0-4.24l4.04-4.04.97-.97a3 3 0 0 1 4.24 0l1.12 1.12c.58.58 1.52.58 2.1 0ZM6.9 9.9 4.3 12.54a1 1 0 0 0 0 1.42l2.17 2.17.83-.84a1 1 0 0 1 1.42 1.42l-.84.83.59.59 1.83-1.84a1 1 0 0 1 1.42 1.42l-1.84 1.83.17.17a1 1 0 0 0 1.42 0l2.63-2.62L6.9 9.9Z"
            />
        </Icon>
    );
}

export function PencilIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-pencil-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"
            />
        </Icon>
    );
}

export function GithubIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            viewBox="-3 -3 30 30"
        >
            <path
                fill={props.fill || "currentColor"}
                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.398 3-.403 1.02.005 2.043.137 3 .403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.577C20.565 21.797 24 17.298 24 12c0-6.63-5.37-12-12-12z"
            />
        </Icon>
    );
}

export function WebsiteIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            viewBox="0 0 24 24"
        >
            <path
                fill={props.fill || "currentColor"}
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-.899.156-1.762.431-2.569L6 11l2 2v2l2 2 1 1v1.931C7.061 19.436 4 16.072 4 12zm14.33 4.873C17.677 16.347 16.687 16 16 16v-1a2 2 0 0 0-2-2h-4v-3a2 2 0 0 0 2-2V7h1a2 2 0 0 0 2-2v-.411C17.928 5.778 20 8.65 20 12a7.947 7.947 0 0 1-1.67 4.873z"
            />
        </Icon>
    );
}
