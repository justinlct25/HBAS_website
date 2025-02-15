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
      // update device name if it does not match the one in database
      if (!!deviceInfo && deviceInfo.deviceName !== deviceName) {
        const id = await this.devicesService.updateDevice(deviceInfo.id, deviceName);
        if (!id || !id.length)
          return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Cannot update device.' });
        // success
        return res.status(httpStatusCodes.OK).json({ message: 'Device updated.' });
      }

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
    const { battery, timestamp, latitude, longitude, msgtype, rssi, snr }: IObjectJSON = JSON.parse(
      data.objectJSON
    );
    const address = await gpsFetch(parseFloat(latitude), parseFloat(longitude));

    const id = await this.alertDataService.postData(
      deviceInfo.id,
      // check if the date is within 24 hours
      timestamp &&
        new Date().valueOf() - timestamp <= 86400000 &&
        new Date().valueOf() - timestamp > 0
        ? new Date(timestamp).toISOString()
        : new Date().toISOString(),
      latitude && longitude ? `${latitude},${longitude}` : '0,0',
      address ?? 'GPS NOT FOUND',
      msgtype,
      battery,
      data.data,
      rssi,
      snr
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
    const dataId = req.query.id;
    const msgType = req.query.msg;
    const perPage = req.query.rows;
    const currentPage = req.query.page;
    const searchString = req.query.search;
    const startDate = req.query.from;
    const endDate = req.query.to;

    // get data
    const data = await this.alertDataService.getData(
      req.user.devices,
      !!dataId ? parseInt(String(dataId)) : null,
      !!msgType ? (String(msgType).toUpperCase() as msgType) : null,
      !!perPage ? parseInt(String(perPage)) : 20,
      !!currentPage ? parseInt(String(currentPage)) : 1,
      !!searchString ? `%${String(searchString)}%` : null,
      !!startDate ? String(startDate) : null,
      !!endDate ? String(endDate) : null
    );
    return res.status(httpStatusCodes.OK).json(data);
  };

  getLatestLocations = async (req: Request, res: Response) => {
    const data = await this.alertDataService.getLatestLocations(req.user.devices);
    return res.status(httpStatusCodes.OK).json({ data });
  };

  getDatesWithMessages = async (req: Request, res: Response) => {
    const { deviceId } = req.params;

    if (!req.user.devices?.includes(parseInt(deviceId)) && req.user.role !== 'ADMIN')
      return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized access.' });

    const data = await this.alertDataService.getDatesWithMessages(parseInt(deviceId));
    data.forEach((d) => (d.messageCount = parseInt(String(d.messageCount))));
    return res.status(httpStatusCodes.OK).json({ data });
  };

  getHistoryByDeviceAndDate = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const { date } = req.query;

    if (!req.user.devices?.includes(parseInt(deviceId)) && req.user.role !== 'ADMIN')
      return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized access.' });

    const data = await this.alertDataService.getHistoryByDeviceAndDate(
      parseInt(deviceId),
      !!date ? String(date) : null
    );
    return res.status(httpStatusCodes.OK).json({ data });
  };

  getLowBatteryNotifications = async (req: Request, res: Response) => {
    const { min } = req.query;
    if (!min) return res.status(httpStatusCodes.BAD_REQUEST).json('Missing required information.');
    const data = await this.alertDataService.getLowBatteryNotifications(
      parseInt(String(min)),
      req.user.devices
    );
    return res.status(httpStatusCodes.OK).json({ data });
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
