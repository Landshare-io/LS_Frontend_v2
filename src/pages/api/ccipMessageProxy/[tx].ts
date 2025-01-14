import { CCIP_GET_LATEST_MESSAGE_URL } from "../../../config/constants/environments";

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch(`${CCIP_GET_LATEST_MESSAGE_URL}${req.query.tx}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
}
