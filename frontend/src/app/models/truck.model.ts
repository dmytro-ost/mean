export interface TrucksList {
  trucks: [
    {
      _id: string;
      created_by: string;
      assigned_to: string;
      type: string;
      status: string;
      created_date: string;
    }
  ];
}

export enum TruckModel {
  SPRINTER = 'SPRINTER',
  SMALL_STRAIGHT = 'SMALL STRAIGHT',
  LARGE_STRAIGHT = 'LARGE STRAIGHT',
}

export interface TruckType {
  type: TruckModel;
}
