import { Injectable } from "@nestjs/common";
import { EventEmitter } from "stream";

@Injectable()
export class SocketEventsService {
    public events = new EventEmitter();
};
