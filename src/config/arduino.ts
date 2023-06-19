import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export const port = new SerialPort({ path: 'COM4', baudRate: 9600, });
export const parser = new ReadlineParser();

port.pipe(parser);