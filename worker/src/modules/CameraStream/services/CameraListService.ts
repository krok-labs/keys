import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CameraRole } from "../types";

export interface CameraEntry {
    id: number,
    name: string,
}

@Injectable()
export class CameraListService implements OnApplicationBootstrap {
    onApplicationBootstrap() {
        // todo: get list of all available cameras
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
