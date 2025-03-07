export const successResponse = (
  res: any,
  status: number = 200,
  message: string = "Executed Successfully",
  data?: any,
  error?: any
) => {
  res.status(status).send({
    code: "OK",
    message,
    statusCode: status,
    success: true,
    data,
  });
};

export const errorResponse = (
  res: any,
  status: number,
  message: string,
  data?: any,
  error?: any
) => {
  res.status(status).send({
    code: "E_ERROR_OCCURRED",
    message,
    statusCode: status,
    success: false,
    data,
  });
};
