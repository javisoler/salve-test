import type { NextApiRequest, NextApiResponse } from 'next';

import { delay } from '@/utils/delay';
import { getPatients, PatientsData } from '@/utils/api';

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
