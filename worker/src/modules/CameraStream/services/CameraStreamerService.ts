import { Inject, Injectable, Logger, OnApplicationBootstrap, forwardRef } from "@nestjs/common";
import { CameraEntry, CameraListService } from "./CameraListService";
import { CameraRole } from "../types";
import { ChildProcess, spawn } from "child_process";
import { EventBusService } from "src/modules/EventBus/services";
import { SocketCommandsHelper } from "src/helpers";
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

@Injectable()
export class CameraStreamerService implements OnApplicationBootstrap {
    constructor(
        private readonly eventBus: EventBusService,
        private readonly cameraListService: CameraListService,
    ) {}

    private readonly logger = new Logger(CameraStreamerService.name);

    // Current streamer state
    private currentCamera?: CameraEntry;
    private streamerProcess?: ChildProcess;

    onApplicationBootstrap() {
        this.eventBus.instance.on('selectCamera', (role: CameraRole) => {
            this.stream(role);
        });

        this.eventBus.instance.on('stopStreaming', () => {
            this.stop();
        });
    };

    public async stop() {
        if (this.streamerProcess != null) {
            this.logger.warn('Stopping previous camera stream process');
            this.streamerProcess.removeAllListeners();
            this.streamerProcess.kill();
        };
    };

    // Stream camera
    public async stream(role: CameraRole) {
        this.currentCamera = this.cameraListService.getByRole(role);
    
        this.logger.warn(`Received stream request for camera ${JSON.stringify(this.currentCamera)}`);

        // Stopping previos stream (if exists)
        await this.stop();

        // Starting new streamer process
        this.logger.debug(`Spawning new streaming process with ffmpeg configuration: ${JSON.stringify(ffmpeg)}`);
        this.streamerProcess = spawn(ffmpeg.path, [
            "-f", "dshow", 
            "-i", `video=${this.currentCamera.name}`,
            "-f", "mjpeg",
            // old:
            // "-vb", "5M",
            // "-preset", "ultrafast", 
            // '-acodec', 'copy',
            "pipe:1"
        ]);

        // Adding listeners to this process
        this.streamerProcess.stdout.on('data', (frame) => {
            // Sending this frame
            SocketCommandsHelper.sendStreamFrame(this.eventBus.instance, frame);
        });

        this.streamerProcess.on('close', (code) => {
            this.logger.warn('Streaming process stopped. Code: ', code);
        });
    };
};
