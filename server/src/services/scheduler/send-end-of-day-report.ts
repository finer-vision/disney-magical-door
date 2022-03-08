import config from "../../config";

export default async function sendEndOfDayReport() {
  console.log(config.endOfDayReportTimeout);
}
