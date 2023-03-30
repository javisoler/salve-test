import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

import { csvToJson } from '@/utils/csv-to-json';
import { delay } from '@/utils/delay';

export type PatientsData = Array<{
  id: string;
  clinic_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}>;

const getPatients = async (clinicId: string): Promise<PatientsData | null> => {
  try {
    const dataPath = path.join(process.cwd(), 'data');
    const data = await fs.readFile(
      dataPath + `/patients-${clinicId}.csv`,
      'utf8'
    );

    return csvToJson(data);
  } catch (error) {
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PatientsData | string>
) {
  let patients: PatientsData | null = [];

  patients = await getPatients(req.query.clinicId as string);

  // Add fake delay to simulate slow network
  await delay(500);

  if (patients) res.status(200).json(patients);
  else res.status(500).send('Error loading patients!');
}
