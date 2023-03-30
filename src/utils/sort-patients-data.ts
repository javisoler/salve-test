import { PatientsData } from './api';

export type Sorting = 'id' | 'first' | 'last' | 'dob';
export type Order = 'asc' | 'desc';

/**
 * Sort the patient's data according to the given sorting and order.
 */
export const sortPatientsData = (
  data: PatientsData,
  sorting: Sorting,
  order: Order
) => {
  switch (sorting) {
    case 'id':
      data.sort((a, b) => (order === 'asc' ? +a.id - +b.id : +b.id - +a.id));
      break;

    case 'first':
      data.sort((a, b) =>
        order === 'asc'
          ? a.first_name > b.first_name
            ? 1
            : -1
          : a.first_name < b.first_name
          ? 1
          : -1
      );
      break;

    case 'last':
      data.sort((a, b) =>
        order === 'asc'
          ? a.last_name > b.last_name
            ? 1
            : -1
          : a.last_name < b.last_name
          ? 1
          : -1
      );
      break;

    case 'dob':
      data.sort((a, b) =>
        order === 'asc'
          ? new Date(a.date_of_birth).getTime() -
            new Date(b.date_of_birth).getTime()
          : new Date(b.date_of_birth).getTime() -
            new Date(a.date_of_birth).getTime()
      );
      break;

    default:
      break;
  }
};
