import { NextApiRequest, NextApiResponse } from 'next';
import { getPhoto } from '../../lib/photoStore';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  if (req.method === 'GET') {
    const photo = getPhoto(name as string);
    if (photo) {
      // Extract the base64 string and mime type from the data URL
      const matches = (photo as string).match(/^data:(.*);base64,(.*)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];

        const imgBuffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', imgBuffer.length);
        res.status(200).send(imgBuffer);
      } else {
        res.status(400).json({ error: 'Invalid image data' });
      }
    } else {
      res.status(404).json({ error: 'Photo not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
