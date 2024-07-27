import { NextApiRequest, NextApiResponse } from 'next';
import { setPhoto } from '../../lib/photoStore';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, photo } = req.body;
    if (name && photo) {
      setPhoto(name, photo);
      res.status(200).json({ message: 'Photo saved' });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
