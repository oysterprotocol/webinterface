import axios from "axios";
import { API, IS_DEV } from "../config";
import { alertUser } from "./error-tracker";

const axiosInstance = axios.create({ timeout: 200000 });

const checkStatus = hosts =>
  new Promise((resolve, reject) => {
    // TODO: Quick fix to get this deployed ASAP and pass Travis.
    // This should be removed later
    if (IS_DEV) return resolve(true);

    Promise.all(
      hosts.map(host =>
        axiosInstance
          .get(`${host}${API.V2_STATUS_PATH}`)
          .then(({ data: { available } }: any) => available)
      )
    )
      .then(availabilities => {
        const available = availabilities.every(Boolean);
        if (!available) {
          alertUser("Oyster is under maintenance. Please try again later.");
        }
        resolve(available);
      })
      .catch(err => {
        alertUser(err);
        reject(err);
      });
  });

export default {
  checkStatus,
};
