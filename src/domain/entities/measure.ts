import { MeasurementType } from './measurement-type';

export class Measurement {
  public customerCode: string;
  public measurementDatetime: Date;
  public measurementType: MeasurementType;
  public imageUrl: string;
  public measurementValue: number;
  public hasConfirmed: boolean;
  public id: string;

  constructor(
    customerCode: string,
    measurementDatetime: Date,
    measurementType: MeasurementType,
    imageUrl: string,
    measurementValue: number,
    hasConfirmed: boolean,
    id: string,
  ) {
    this.customerCode = customerCode;
    this.measurementDatetime = measurementDatetime;
    this.measurementType = measurementType;
    this.imageUrl = imageUrl;
    this.measurementValue = measurementValue;
    this.hasConfirmed = hasConfirmed;
    this.id = id;
  }
}