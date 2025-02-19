/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const regex = /Unique constraint failed on the fields: \(`(.+?)`\)/;
  const extractedMessage = err.message.match(regex)[0];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: extractedMessage,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `${err.meta.target} is already exists`,
    errorSources,
  };
};

export default handleDuplicateError;
