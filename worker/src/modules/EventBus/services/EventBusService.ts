import { Injectable } from "@nestjs/common";
import { EventEmitter } from "stream";

@Injectable()
export class EventBusService {
    public readonly instance = new EventEmitter();
};