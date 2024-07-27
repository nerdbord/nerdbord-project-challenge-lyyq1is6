import { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";

interface CameraComponentProps {
  setPhotoName: React.Dispatch<React.SetStateAction<string>>;
  setPhoto: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null | ImageData | undefined>
  >;
}

const CameraComponent = (props: CameraComponentProps) => {
  const { setPhoto, setPhotoName } = props;
  const camera = useRef<CameraType>(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);

  return (
    <div className="flex flex-col">
      <Camera
        ref={camera}
        numberOfCamerasCallback={setNumberOfCameras}
        aspectRatio={1}
        errorMessages={{
          noCameraAccessible:
            "No camera device accessible. Please connect your camera or try a different browser.",
          permissionDenied:
            "Permission denied. Please refresh and give camera permission.",
          switchCamera:
            "It is not possible to switch camera to different one because there is only one video device accessible.",
          canvas: "Canvas is not supported.",
        }}
      />
      <div className="flex flex-row">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (camera.current) {
              const cameraPhoto = camera.current.takePhoto();
              setPhoto(cameraPhoto);
              setPhotoName(Date.now().toString() + ".jpg");
            } else {
              console.error("Camera is not available");
            }
          }}
        >
          TAKE PHOTO
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={numberOfCameras <= 1}
          onClick={() => {
            if (camera.current) {
              camera.current.switchCamera();
            } else {
              console.error("Can't switch camera.");
            }
          }}
        >
          SWAP CAMERA
        </button>
      </div>
    </div>
  );
};

export default CameraComponent;
