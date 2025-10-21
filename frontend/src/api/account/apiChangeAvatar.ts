import { instance } from "../instance";

export const apiChangeAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/change-avatar`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization:
          instance.defaults.headers["Authorization"]?.toString() || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.text();
};
