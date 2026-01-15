export interface Game {
  id: string;
  name: string;
  description: string;
  sectionid: string;
  type: string;
  tags: string[];
  tagType:string;
  format: string;
  settings: {
    coinvalue: number;
    denominations: number[];
  };
  linescount: string;
  basebet: number;
  image: string;
}