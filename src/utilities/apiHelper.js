import axios from "axios";

export async function getData(url) {
  const { data } = await axios.get(url).catch((err) => {
    errorHandler(err);
  });

  return data;
}

export async function postData(url, form) {
  const { data } = await axios.post(url, form).catch((err) => {
    errorHandler(err);
  });

  return data;
}

export async function patchData(url, form) {
  const { data } = await axios.patch(url, form).catch((err) => {
    errorHandler(err);
  });

  return data;
}

export function errorHandler(err) {
  if (axios.isAxiosError(err)) {
    console.log(err.message);
    throw new Error(err.message);
  } else {
    console.log("An unexpected error occurred");
    throw new Error("An unexpected error occurred");
  }
}
