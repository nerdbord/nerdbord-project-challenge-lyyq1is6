let photos: { [key: string]: string | ArrayBuffer | null } = {};

export const setPhoto = (name: string, newPhoto: string | ArrayBuffer | null) => {
  photos[name] = newPhoto;
};

export const getPhoto = (name: string) => {
  return photos[name];
};

export const deletePhoto = (name: string) => {
    delete photos[name];
}