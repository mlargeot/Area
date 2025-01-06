export const logRequest = (label: string, data: any) => {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 2));
  console.log(`=== End of ${label} ===\n`);
};
