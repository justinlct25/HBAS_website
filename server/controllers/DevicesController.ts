import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { DevicesService } from '../services/DevicesService';

export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  getDevicesForLinking = async (req: Request, res: Response) => {
    const { deviceId } = req.query;
    const data = await this.devicesService.getDevicesForLinking(
      !!deviceId ? parseInt(String(deviceId)) : null
    );
    return res.status(httpStatusCodes.OK).json({ data });
  };

  linkDeviceAndVehicle = async (req: Request, res: Response) => {
    const { deviceId, vehicleId }: { deviceId: number; vehicleId: number } = req.body;

    // check if required info is provided
    if (!deviceId || !vehicleId)
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: 'Missing required information.',
      });

    // unlink device and vehicle if is paired up
    await this.devicesService.unlinkExistingPairs(deviceId, vehicleId);

    // link device and vehicle
    const id = await this.devicesService.linkDeviceAndVehicle(deviceId, vehicleId);

    // if insert failed
    if (!id)
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ message: 'Cannot link device and vehicle.' });

    // insert successful
    return res.status(httpStatusCodes.CREATED).json({
      message: `Linked device and vehicle successfully.`,
      id: id[0],
    });
  };
}
