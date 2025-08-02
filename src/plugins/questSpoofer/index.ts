/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { ChannelStore, FluxDispatcher, GuildChannelStore, RestAPI, showToast, Toasts } from "@webpack/common";

// lazy loading stores
const ApplicationStreamingStore = findByPropsLazy("getStreamerActiveStreamMetadata");
const RunningGameStore = findByPropsLazy("getRunningGames", "getGameForPID");
const QuestsStore = findByPropsLazy("getQuest");

const log = new Logger("QuestSpoofer", "#473763");

export default definePlugin({
    name: "QuestSpoofer",
    description: "Spoofs Discord Quests for video, desktop play, and streaming.",
    authors: [Devs.prodbyeagle],

    async start() {
        delete (window as any).$;

        const quest = [...QuestsStore.quests.values()].find(
            q => q.id !== "1248385850622869556" &&
                q.userStatus?.enrolledAt &&
                !q.userStatus?.completedAt &&
                new Date(q.config.expiresAt).getTime() > Date.now()
        );

        if (!quest) {
            log.warn("No eligible quest found.");
            return showToast("No uncompleted quest found.", Toasts.Type.MESSAGE);
        }

        log.log(`Detected quest: ${quest.config.application.name} - ${quest.config.messages.questName}`);

        const pid = Math.floor(Math.random() * 30000) + 1000;
        const appId = quest.config.application.id;
        const appName = quest.config.application.name;
        const { questName } = quest.config.messages;
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const task = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"]
            .find(t => taskConfig.tasks[t]);

        const secondsNeeded = taskConfig.tasks[task].target;
        let secondsDone = quest.userStatus?.progress?.[task]?.value ?? 0;

        log.info(`Spoofing task: ${task} | Needed: ${secondsNeeded}s | Done: ${secondsDone}s`);

        if (task === "WATCH_VIDEO" || task === "WATCH_VIDEO_ON_MOBILE") {
            const enrolledAt = new Date(quest.userStatus.enrolledAt).getTime();
            const speed = 7;
            const interval = 1;

            (async function spoofVideo() {
                log.info("Started video spoofing...");
                while (true) {
                    const maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + 10;
                    const diff = maxAllowed - secondsDone;
                    const timestamp = secondsDone + speed;
                    if (diff >= speed) {
                        const postTime = Math.min(secondsNeeded, timestamp + Math.random());
                        const res = await RestRestAPI.post({
                            url: `/quests/${quest.id}/video-progress`,
                            body: { timestamp: postTime }
                        });

                        log.log(`POST /video-progress: +${speed}s → ${postTime}s`);

                        if (res.body.completed_at) {
                            log.info("Video quest marked as completed.");
                            break;
                        }

                        secondsDone = Math.min(secondsNeeded, timestamp);
                    }

                    if (timestamp >= secondsNeeded) break;
                    await new Promise(r => setTimeout(r, interval * 1000));
                }

                await RestAPI.post({
                    url: `/quests/${quest.id}/video-progress`,
                    body: { timestamp: secondsNeeded }
                });

                showToast("✅ Video quest completed!", Toasts.Type.SUCCESS);
                log.info("Sent final video-progress to finish quest.");
            })();

            showToast(`▶️ Spoofing video quest: ${questName}`, Toasts.Type.MESSAGE);
        }

        else if (task === "PLAY_ON_DESKTOP") {
            if (!IS_DISCORD_DESKTOP) {
                log.error("Not in desktop environment.");
                return showToast("❌ Use the desktop app to spoof this quest.", Toasts.Type.FAILURE);
            }

            RestAPI.get({ url: `/applications/public?application_ids=${appId}` }).then(res => {
                const app = res.body[0];
                const exeName = app.executables.find(x => x.os === "win32")?.name.replace(">", "");

                const fakeGame = {
                    cmdLine: `C:\\Program Files\\${app.name}\\${exeName}`,
                    exeName,
                    exePath: `c:/program files/${app.name.toLowerCase()}/${exeName}`,
                    hidden: false,
                    isLauncher: false,
                    id: appId,
                    name: app.name,
                    pid,
                    pidPath: [pid],
                    processName: app.name,
                    start: Date.now(),
                };

                log.log(`Injecting fake game process: ${exeName} (pid ${pid})`);

                const realGames = RunningGameStore.getRunningGames();
                const backupGetGames = RunningGameStore.getRunningGames;
                const backupGetByPid = RunningGameStore.getGameForPID;

                RunningGameStore.getRunningGames = () => [fakeGame];
                RunningGameStore.getGameForPID = () => fakeGame;

                FluxDispatcher.dispatch({
                    type: "RUNNING_GAMES_CHANGE",
                    removed: realGames,
                    added: [fakeGame],
                    games: [fakeGame],
                });

                const listener = (data: any) => {
                    const progress = quest.config.configVersion === 1
                        ? data.userStatus.streamProgressSeconds
                        : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);

                    log.debug(`Heartbeat received: ${progress}/${secondsNeeded}s`);

                    if (progress >= secondsNeeded) {
                        FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", listener);
                        RunningGameStore.getRunningGames = backupGetGames;
                        RunningGameStore.getGameForPID = backupGetByPid;
                        FluxDispatcher.dispatch({
                            type: "RUNNING_GAMES_CHANGE",
                            removed: [fakeGame],
                            added: [],
                            games: [],
                        });

                        showToast("✅ Desktop play quest completed!", Toasts.Type.SUCCESS);
                        log.info("Desktop play quest spoofed successfully.");
                    }
                };

                FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", listener);
                showToast(`🎮 Spoofing game: ${appName}`, Toasts.Type.MESSAGE);
            }).catch(err => {
                log.error("Failed to fetch application data.", err);
            });
        }

        else if (task === "STREAM_ON_DESKTOP") {
            if (!IS_DISCORD_DESKTOP) {
                log.error("Not in desktop environment.");
                return showToast("❌ Use the desktop app to spoof this quest.", Toasts.Type.FAILURE);
            }

            const backup = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
            ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
                id: appId,
                pid,
                sourceName: null,
            });

            log.log(`Simulating stream for ${appName} (pid ${pid})`);

            const listener = (data: any) => {
                const progress = quest.config.configVersion === 1
                    ? data.userStatus.streamProgressSeconds
                    : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);

                log.debug(`Stream heartbeat: ${progress}/${secondsNeeded}s`);

                if (progress >= secondsNeeded) {
                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", listener);
                    ApplicationStreamingStore.getStreamerActiveStreamMetadata = backup;
                    showToast("✅ Streaming quest completed!", Toasts.Type.SUCCESS);
                    log.info("Stream quest spoofed successfully.");
                }
            };

            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", listener);
            showToast(`📡 Spoofing stream for ${appName}`, Toasts.Type.MESSAGE);
        }

        else if (task === "PLAY_ACTIVITY") {
            const vcId =
                ChannelStore.getSortedPrivateChannels()[0]?.id ??
                Object.values(GuildChannelStore.getAllGuilds())
                    .find(g => g?.VOCAL?.length > 0)?.VOCAL?.[0]?.channel?.id;

            if (!vcId) {
                log.error("No voice channel found to spoof activity.");
                return showToast("❌ No voice channel available to spoof activity.", Toasts.Type.FAILURE);
            }

            const streamKey = `call:${vcId}:1`;
            log.log(`Using stream key: ${streamKey}`);

            (async function spoofHeartbeat() {
                log.info("Started activity spoofing...");
                while (true) {
                    const res = await RestAPI.post({
                        url: `/quests/${quest.id}/heartbeat`,
                        body: { stream_key: streamKey, terminal: false }
                    });

                    const progress = res.body.progress.PLAY_ACTIVITY.value;
                    log.debug(`Activity progress: ${progress}/${secondsNeeded}`);

                    if (progress >= secondsNeeded) {
                        await RestAPI.post({
                            url: `/quests/${quest.id}/heartbeat`,
                            body: { stream_key: streamKey, terminal: true }
                        });

                        showToast("✅ Activity quest completed!", Toasts.Type.SUCCESS);
                        log.info("Activity quest spoofed successfully.");
                        break;
                    }

                    await new Promise(r => setTimeout(r, 20_000));
                }
            })();

            showToast(`🧠 Spoofing activity: ${questName}`, Toasts.Type.MESSAGE);
        }

        else {
            log.warn(`Unsupported quest task: ${task}`);
        }
    },

    stop() {
        log.info("QuestSpoofer plugin stopped.");
        showToast("QuestSpoofer plugin stopped.", Toasts.Type.MESSAGE);
    }
});
