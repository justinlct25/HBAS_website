import { DataService } from '../services/dataService';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import httpStatusCodes from 'http-status-codes';

export class DataController {
    constructor(private dataService: DataService){}

    getAlertData = async (req: Request, res: Response) => {
        try {
            const page = req.query;
            const newPage = parseInt(String(page.page));
            const LIMIT:number = 5;
            const OFFSET:number = (LIMIT * (newPage - 1));
            const counting = await this.dataService.getCountingData();
            let totalPage = (parseInt(String(counting[0].count)) / LIMIT);
            if(totalPage > Math.round(totalPage)){
                totalPage = Math.round(totalPage) + 1;  
            } else{ 
                totalPage = Math.round(totalPage);
            }
            const dataResult = await this.dataService.getAlertData(OFFSET, LIMIT);

            res.json({alertData: dataResult, totalPage: totalPage, limit:LIMIT , message: 'handbrake data get'});
            //logger.info('res json data');
            return;
        } catch (err) {
            logger.error(err);
            res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Internal server error!'});
        }
        
    }

    postAlertData = async (req: Request, res: Response) => {//not finish
        try {
            const dataResult = req.body;
            if(!dataResult.data){
                res.status(httpStatusCodes.NOT_ACCEPTABLE).json({message: 'event is not up, data dont update to DB.'});
                return;
            }
            await this.dataService.postAlertData(dataResult.deviceName, dataResult.devEUI, dataResult.data, dataResult.objectJSON[0].date, dataResult.objectJSON[0].time, dataResult.objectJSON[0].latitude, dataResult.objectJSON[0].longitude, dataResult.objectJSON[0].battery);

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