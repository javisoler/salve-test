/**
 * Very basic CSV to JSON conversion.
 */
export const csvToJson = (csv: string) => {
  try {
    const lines = csv.split('\n').filter(Boolean);
    const names = lines.splice(0, 1)[0].split(',');

    return lines.map((line) => {
      const items = line.split(',');
      const obj: any = {};

      items.forEach((item, idx) => {
        obj[names[idx]] = item;
      });
      return obj;
    });
  } catch (error) {
    return null;
  }
};
