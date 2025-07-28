/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalRoot,
    openModal,
} from "@utils/modal";
import { Button, Forms, React, TextInput } from "@webpack/common";

import { decrypt } from "../index";

export function DecModal(props: any) {
    const encryptedMessage: string = props?.message?.content;
    const [password, setPassword] = React.useState("password");

    return (
        <ModalRoot {...props}>
            <ModalHeader>
                <Forms.FormTitle tag="h4">Decrypt Message</Forms.FormTitle>
            </ModalHeader>

            <ModalContent>
                <Forms.FormTitle tag="h5" style={{ marginTop: "10px" }}>Message with Encryption</Forms.FormTitle>
                <TextInput defaultValue={encryptedMessage} disabled={true}></TextInput>
                <Forms.FormTitle tag="h5" style={{ marginTop: "10px" }}>Password</Forms.FormTitle>
                <TextInput
                    style={{ marginBottom: "20px" }}
                    onChange={setPassword}
                />
            </ModalContent>

            <ModalFooter>
                <Button
                    color={Button.Colors.GREEN}
                    onClick={() => {
                        const toSend = decrypt(encryptedMessage, password, true);
                        if (!toSend || !props?.message) return;
                        // @ts-expect-error
                        Vencord.Plugins.plugins.InvisibleChat.buildEmbed(props?.message, toSend);
                        props.onClose();
                    }}>
                    Decrypt
                </Button>
                <Button
                    color={Button.Colors.TRANSPARENT}
                    look={Button.Looks.LINK}
                    style={{ left: 15, position: "absolute" }}
                    onClick={props.onClose}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </ModalRoot>
    );
}

export function buildDecModal(msg: any): any {
    openModal((props: any) => <DecModal {...props} {...msg} />);
}
