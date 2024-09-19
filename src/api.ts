import axios from 'axios';

const API_URL = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/';

export const fetchCovidData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.records;  
  } catch (error) {
    console.error("Error fetching COVID data:", error);
    throw error;
  }
};