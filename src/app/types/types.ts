export type Receipt = {
    [date: string]: {
      [itemName: string]: number;
    };
  };