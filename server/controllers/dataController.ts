import { DataService } from '../services/dataService';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import httpStatusCodes from 'http-status-codes';

export class DataController {
    constructor(private dataService: DataService){}

    getAlertData = async (req: Request, res: Response) => {
        try {
            const dataResult = await this.dataService.getAlertData();

            res.json({data: dataResult, message: 'handbrake data get'});
        } catch (err) {
            logger.error(err);
            res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Internal server error!'});
        }
        
    }

    postAlertData = async (req: Request, res: Response) => {//not finish
        try {
            await this.dataService.postAlertData();

            res.status(httpStatusCodes.CREATED).json({ message: 'created'});
        } catch (err) {
            logger.error(err);
            res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Internal server error!'});
        }
    }

    putAlertData = async(req: Request, res: Response) => {
        try {
            await this.dataService.putAlertData();

            res.status(httpStatusCodes.ACCEPTED).json({message: 'update data'})
        } catch (err) {
            logger.error(err);
            res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Internal server error!'});
        }
    }

    deleteAlertData = async(req: Request, res: Response) =>{
        try {
            await this.dataService.deleteAlertData();

            res.status(httpStatusCodes.ACCEPTED).json({ message: 'record is delete'})
        } catch (err) {
            logger.error(err);
            res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Internal server error!'});
        }
    }
}