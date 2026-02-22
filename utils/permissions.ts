
export const requestLocationPermission = async (): Promise<boolean> => {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser.');
    return false;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => {
        console.error('Error requesting location permission:', error);
        resolve(false);
      }
    );
  });
};

export const requestCameraPermission = async (): Promise<boolean> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('Camera is not supported by this browser.');
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};
