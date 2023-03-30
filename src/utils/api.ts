import { promises as fs } from 'fs';
import path from 'path';

import { csvToJson } from './csv-to-json';

export type ClinicsData = Array<{
  id: string;
  name: string;
}>;

export const getClinics = async (): Promise<ClinicsData | null> => {
  try {
    const dataPath = path.join(process.cwd(), 'data');
    const data = await fs.readFile(dataPath + '/clinics.csv', 'utf8');

    return csvToJson(data);
  } catch (error) {
    return null;
  }
};
