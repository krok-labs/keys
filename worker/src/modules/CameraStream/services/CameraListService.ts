import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CameraRole } from "../types";
import { spawn } from "child_process";
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

export interface CameraEntry {
    id: number,
    name: string,
}

@Injectable()
export class CameraListService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CameraListService.name);

    onApplicationBootstrap() {
        // todo: get list of all available cameras
        this.logger.debug(`Spawning new streaming process with ffmpeg configuration: ${JSON.stringify(ffmpeg)}`);
        const process = spawn(ffmpeg.path, [
            "-list_devices", "true", "-f", "dshow", "-i", "dummy"
        ]);

        process.stderr.on('data', (data) => {
            console.log('stderr:', Buffer.from(data).toString('ascii'));
        });
    }

    private readonly cameras: Record<CameraRole, CameraEntry> = {
        [CameraRole.DOCUMENT_SCANNER]: {
            id: 0,
            name: 'Logi C270 HD WebCam'
        },
        [CameraRole.FACE_SCANNER]: {
            id: 0,
            name: 'USB2.0 Camera'
        }
    };

    // Get available cameras
    public getByRole(role: CameraRole) {
        return this.cameras[role];
    };

    public getById(id: number) {
        return Object.values(this.cameras).find((x) => x.id == id);
    }
};
