import { MeasurementType } from './measurement-type';

export class Measurement {
  public id: string;
  public customerCode: string;
  public measurementDatetime: Date;
  public measurementType: MeasurementType;
  public imageUrl: string;
  public measurementValue: number;
  public hasConfirmed: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(options: {
    id: string,
    customerCode: string,
    measurementDatetime: Date,
    measurementType: MeasurementType,
    imageUrl: string,
    measurementValue: number,
    hasConfirmed: boolean,
    createdAt: Date,
    updatedAt: Date;
  }) {
    const {
      id,
      customerCode,
      measurementDatetime,
      measurementType,
      imageUrl,
      measurementValue,
      hasConfirmed,
      createdAt,
      updatedAt
    } = options;

    this.id = id;
    this.customerCode = customerCode;
    this.measurementDatetime = measurementDatetime;
    this.measurementType = measurementType;
    this.imageUrl = imageUrl;
    this.measurementValue = measurementValue;
    this.hasConfirmed = hasConfirmed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}