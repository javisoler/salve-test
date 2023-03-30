import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr';

import SortButton from '@/components/SortButton';
import { ClinicsData, getClinics, PatientsData } from '@/utils/api';
import { Order, Sorting, sortPatientsData } from '@/utils/sort-patients-data';

const patientsDataFetcher: Fetcher<PatientsData, string> = (clinicId) =>
  fetch(`/api/patients?clinicId=${clinicId}`).then((res) => res.json());

export default function Home({ clinics }: { clinics: ClinicsData }) {
  const [selectedClinic, setSelectedClinic] = useState('');
  const [sortBy, setSortBy] = useState<Sorting>('id');
  const [order, setOrder] = useState<Order>('asc');
  const [patientsData, setPatientsData] = useState<PatientsData>();

  const handleClinicOnChange: ChangeEventHandler<HTMLSelectElement> =
    useCallback((event) => {
      setSelectedClinic(event.target.value);
    }, []);

  // Set `sortBy` and `order` when sort button is clicked
  const setSorting = useCallback(
    (sorting: Sorting) => {
      if (sortBy === sorting)
        setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      else {
        // Reset order when sorting is hit for the first time
        setSortBy(sorting);
        setOrder('asc');
      }
    },
    [sortBy]
  );

  // Fetch patient's data when clinic is selected
  const { data, error, isLoading } = useSWR(
    selectedClinic !== '0' ? selectedClinic : null,
    patientsDataFetcher
  );

  // Apply sorting and ordering to patient's data
  useEffect(() => {
    const dataCopy = data ? [...data] : [];

    sortPatientsData(dataCopy, sortBy, order);

    setPatientsData(dataCopy);
  }, [data, order, selectedClinic, sortBy]);

  return (
    <>
      <Head>
        <title>Salve Coding Test</title>
        <meta name="description" content="Salve Coding Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4 max-w-5xl m-auto">
        <h1 className="text-3xl font-bold text-center">Salve Coding Test</h1>

        <h2 className="text-2xl font-bold mb-2">Clinics</h2>

        <select
          value={selectedClinic}
          onChange={handleClinicOnChange}
          className="border-gray-400 border-2 rounded-md p-2"
        >
          <option value="0">
            {clinics
              ? 'Please select a clinic...'
              : 'Sorry there was a problem loading clinics'}
          </option>
          {clinics?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <h2 className="text-2xl font-bold mb-2 mt-4">Patients</h2>

        {isLoading && (
          <Image
            src="/loader.gif"
            alt="Loading data"
            className="m-auto py-4"
            width={25}
            height={25}
            priority
          />
        )}

        {error && !isLoading && (
          <div className="text-gray-600 italic">
            Sorry, there was a problem loading patients data.
          </div>
        )}

        {!isLoading && !error && !patientsData?.length && (
          <div className="text-gray-600 italic">No patients data found.</div>
        )}

        {!isLoading && !error && !!patientsData?.length && (
          <table className="border-collapse border border-slate-400 w-full">
            <thead>
              <tr>
                <th className="border border-slate-400 p-1">
                  Id{' '}
                  <SortButton
                    onClick={() => setSorting('id')}
                    isActive={sortBy === 'id'}
                    order={order}
                  />
                </th>
                <th className="border border-slate-400 p-1">
                  First Name{' '}
                  <SortButton
                    onClick={() => setSorting('first')}
                    isActive={sortBy === 'first'}
                    order={order}
                  />
                </th>
                <th className="border border-slate-400 p-1">
                  Last Name{' '}
                  <SortButton
                    onClick={() => setSorting('last')}
                    isActive={sortBy === 'last'}
                    order={order}
                  />
                </th>
                <th className="border border-slate-400 p-1">
                  Date of Birth{' '}
                  <SortButton
                    onClick={() => setSorting('dob')}
                    isActive={sortBy === 'dob'}
                    order={order}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {patientsData?.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-blue-100 dark:hover:bg-blue-950 odd:bg-gray-200 dark:odd:bg-gray-800"
                >
                  <td className="border border-slate-400 p-1">{patient.id}</td>
                  <td className="border border-slate-400 p-1">
                    {patient.first_name}
                  </td>
                  <td className="border border-slate-400 p-1">
                    {patient.last_name}
                  </td>
                  <td className="border border-slate-400 p-1">
                    {format(new Date(patient.date_of_birth), 'P')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const clinics = await getClinics();

  return {
    props: { clinics },
  };
};
