import React from "react";

interface PhotoUploadProps {
  setPhotoName: React.Dispatch<React.SetStateAction<string>>;
  setPhoto: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null | ImageData | undefined>
  >;
}

const PhotoUpload: React.FC<PhotoUploadProps> = (props: PhotoUploadProps) => {
  const { setPhotoName, setPhoto } = props;

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result;
        setPhotoName(file.name);
        setPhoto(result);
        //await axios.post("/api/upload", { name: file.name, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
      {
        //photoName && <img src={`/api/${photoName}`} alt="Selected" />
      }
    </div>
  );
};

export default PhotoUpload;
