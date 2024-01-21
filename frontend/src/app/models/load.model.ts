export interface Load {
  name: string;
  payload: string;
  pickup_address: string;
  delivery_address: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
}

export interface LoadsList {
  loads: [
    {
      _id: string;
      created_by: string;
      assigned_to: string;
      status: string;
      state: string;
      name: string;
      payload: number;
      pickup_address: string;
      delivery_address: string;
      dimensions: {
        width: number;
        length: number;
        height: number;
      };
      logs: [
        {
          message: string;
          time: string;
        }
      ];
      created_date: string;
    }
  ];
}
