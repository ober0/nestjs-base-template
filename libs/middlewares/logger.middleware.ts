import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger: Logger = new Logger(LoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        this.logger.log(`START [${req.method}] ${req.originalUrl}`);

        res.on("finish", async () => {
            const duration = Date.now() - start;
            this.logger.log(`END [${req.method}] ${req.originalUrl} - ${duration}ms`);
        });

        next();
    }
}
