import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { io } from '../main';
import { IJoinMessage, IObjectJSON, IUpMessage } from '../models/messageModels';
import { msgType } from '../models/models';
import { AlertDataService } from '../services/AlertDataService';
import { DevicesService } from '../services/DevicesService';
import { base64ToHex, gpsFetch } from '../utils/postDataFunc';

export class AlertDataController {
  constructor(private alertDataService: AlertDataService, private devicesService: DevicesService) {}

  postData = async (req: Request, res: Response) => {
    const queryMethod = req.query.event;
    const data: IJoinMessage & IUpMessage = req.body;
    const { devEUI, deviceName } = data;

    // check if query method is provided and valid
    if (!queryMethod || (queryMethod !== 'join' && queryMethod !== 'up'))
      return res.status(httpStatusCodes.NOT_ACCEPTABLE).json({ message: 'Invalid query method.' });

    // check if device details is provided
    if (!devEUI || !deviceName)
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ message: 'Missing device information.' });

    // decode device eui
    const hexEui = base64ToHex(devEUI);
    const deviceInfo = await this.devicesService.getDeviceDetails(hexEui);

    /* ----------------------------- 'join' messages handling ----------------------------- */
    if (queryMethod === 'join') {
      if (!!deviceInfo)
        return res.status(httpStatusCodes.CONFLICT).json({ message: 'Device already exists.' });

      // insert new device
      const id = await this.devicesService.addDevice(deviceName, hexEui);

      // if insert failed
      if (!id || !id.length)
        return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot add new device.' });

      // insert successful
      return res.status(httpStatusCodes.CREATED).json({
        message: `Added device ${deviceName} successfully.`,
        id: id[0],
      });
    }

    /* ------------------------------ 'up' messages handling ------------------------------ */
    if (!deviceInfo)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Invalid device EUI.' });

    // handle json
    const { battery, date, time, latitude, longitude, msgtype }: IObjectJSON = JSON.parse(
      data.objectJSON
    )[0];
    const address = await gpsFetch(parseFloat(latitude), parseFloat(longitude));

    const id = await this.alertDataService.postData(
      deviceInfo.id,
      // check if the date is within 24 hours
      date && time && new Date().valueOf() - new Date(`${date} ${time}`).valueOf() <= 86400000
        ? new Date(`${date} ${time}`).toISOString()
        : new Date().toISOString(),
      latitude && longitude ? `${latitude},${longitude}` : '0,0',
      address ?? 'GPS NOT FOUND',
      msgtype,
      battery,
      data.data
    );

    // if insert failed
    if (!id || !id.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot post data.' });

    // insert successful
    io.emit(`new-data-type-${msgtype}`);
    return res.status(httpStatusCodes.CREATED).json({
      message: `Posted data successfully.`,
      id: id[0],
    });
  };

  getData = async (req: Request, res: Response) => {
    const msgType = req.query.msg;
    const perPage = req.query.rows;
    const currentPage = req.query.page;
    const searchString = req.query.search;
    const startDate = req.query.from;
    const endDate = req.query.to;

    // get data
    const data = await this.alertDataService.getData(
      !!msgType ? (msgType as msgType) : null,
      !!perPage ? parseInt(String(perPage)) : 20,
      !!currentPage ? parseInt(String(currentPage)) : 1,
      !!searchString ? `%${String(searchString)}%` : null,
      !!startDate ? String(startDate) : null,
      !!endDate ? String(endDate) : null
    );
    return res
      .status(!data.data.length ? httpStatusCodes.NO_CONTENT : httpStatusCodes.OK)
      .json(data);
  };

  getLatestLocations = async (req: Request, res: Response) => {
    const data = await this.alertDataService.getLatestLocations();
    return res
      .status(!data.length ? httpStatusCodes.NO_CONTENT : httpStatusCodes.OK)
      .json({ data });
  };

  getDatesWithMessages = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const data = await this.alertDataService.getDatesWithMessages(parseInt(deviceId));
    data.forEach((d) => (d.messageCount = parseInt(String(d.messageCount))));
    return res
      .status(!data.length ? httpStatusCodes.NO_CONTENT : httpStatusCodes.OK)
      .json({ data });
  };

  getHistoryByDeviceAndDate = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const { date } = req.query;
    const data = await this.alertDataService.getHistoryByDeviceAndDate(
      parseInt(deviceId),
      !!date ? String(date) : null
    );
    return res
      .status(!data.length ? httpStatusCodes.NO_CONTENT : httpStatusCodes.OK)
      .json({ data });
  };

  getLowBatteryNotifications = async (req: Request, res: Response) => {
    const data = await this.alertDataService.getLowBatteryNotifications();
    return res
      .status(!data.length ? httpStatusCodes.NO_CONTENT : httpStatusCodes.OK)
      .json({ data });
  };

  updateNotificationsStatus = async (req: Request, res: Response) => {
    const { notificationIds }: { notificationIds: number[] } = req.body;
    const successIds = await this.alertDataService.updateNotificationsStatus(notificationIds);

    if (!successIds || !successIds.length)
      return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot post data.' });

    return res
      .status(httpStatusCodes.OK)
      .json({ message: `Updated notifications' status successfully.` });
  };
}
