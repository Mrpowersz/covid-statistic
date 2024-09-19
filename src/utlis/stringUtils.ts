export const cleanCountryName = (country: string): string => {
    return country.replace(/_/g, ' ');
  };