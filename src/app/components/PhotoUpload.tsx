import React, { useState } from 'react';
import axios from 'axios';

const PhotoUpload: React.FC = () => {
  const [photoName, setPhotoName] = useState<string | null>(null);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result;
        setPhotoName(file.name);
        await axios.post('/api/upload', { name: file.name, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      {photoName && <img src={`/api/${photoName}`} alt="Selected" />}
    </div>
  );
};

export default PhotoUpload;
