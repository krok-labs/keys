import { Duplex } from "stream";
import { SerialDeviceType } from "./SerialDeviceTypeEnum";
import { SerialPort } from "serialport";
// import { ReadlineParser } from "@serialport/parser-readline";

export interface SerialPortDevice {
    type: SerialDeviceType,
    device: SerialPort,
    parser: Duplex
};
