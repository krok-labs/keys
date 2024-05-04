import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { SocketCommandsService } from "src/modules/SocketConnection/services";
import { CameraEntry, CameraListService } from "./CameraListService";
import { CameraRole } from "../types";
import { ChildProcess, spawn } from "child_process";
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

@Injectable()
export class CameraStreamerService implements OnApplicationBootstrap {
    constructor(
        private readonly cameraListService: CameraListService,
        private readonly socketCommandsService: SocketCommandsService
    ) {}

    private readonly logger = new Logger(CameraStreamerService.name);

    // Current streamer state
    private state: 'ERROR' | 'STREAMING' | 'IDLE' = 'IDLE';
    private currentCamera?: CameraEntry;
    private streamerProcess?: ChildProcess;

    onApplicationBootstrap() {
        // todo: remove
        //       @huskie this is only for testing 
        this.stream(CameraRole.DOCUMENT_SCANNER);
    };

    // Stream camera
    public async stream(role: CameraRole) {
        this.currentCamera = this.cameraListService.getByRole(role);
    
        this.logger.warn(`Received stream request for camera ${JSON.stringify(this.currentCamera)}`);

        // Stopping previos stream (if exists)
        if (this.state == 'STREAMING' || (this.streamerProcess != null && this.streamerProcess.connected)) {
            this.logger.warn('Stopping previous camera stream process');
            this.streamerProcess.removeAllListeners();
            this.streamerProcess.kill();
        };

        // Starting new streamer process
        this.logger.debug(`Spawning new streaming process with ffmpeg configuration: ${JSON.stringify(ffmpeg)}`);
        this.streamerProcess = spawn(ffmpeg.path, [
            "-f", "dshow", 
            "-i", `video=${this.currentCamera.name}`,
            "-f", "mjpeg",
            "pipe:1"
        ]);

        this.state = 'STREAMING';

        // Adding listeners to this process
        this.streamerProcess.stdout.on('data', (frame) => {
            // Sending this frame
            this.socketCommandsService.sendVideoFrame(Buffer.from(frame).toString('base64'));
        });

        this.streamerProcess.on('close', (code) => {
            this.logger.warn('Streaming process stopped. Code: ', code);
            this.state = 'ERROR';
        });
    };
};
