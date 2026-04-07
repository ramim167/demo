export const cloudinaryConfig = {
  cloudName: "dwcbgl4oc",
  uploadPreset: "Jersey"
} as const;

export async function uploadImageToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed. Check Cloudinary preset configuration.");
  }

  const payload = (await response.json()) as { secure_url?: string };

  if (!payload.secure_url) {
    throw new Error("Cloudinary did not return a secure image URL.");
  }

  return payload.secure_url;
}
