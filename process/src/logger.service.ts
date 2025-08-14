import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger: winston.Logger;
    
    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} ${level.toUpperCase()}: ${message}`;
                })
            ),
            transports: [
                new winston.transports.File({ 
                    filename: 'error.log', 
                    level: 'error' 
                }),

                new winston.transports.File({ 
                    filename: 'app.log',
                    level: 'info'
                }),

                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
            ],
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace?: string) {
        this.logger.error(`${message}${trace ? ` - Trace: ${trace}` : ''}`);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
}
