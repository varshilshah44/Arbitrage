export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

export const sendSuccessResponseForList = (
  res,
  data,
  statusCode,
  message,
  totalCount
) => {
  return res.status(statusCode).send({
    status: "success",
    statusCode,
    data: {
      totalCount,
      data,
    },
    message,
  });
};

export const sendSuccessResponseWithoutList = (
  res,
  data,
  statusCode,
  message
) => {
  return res.status(statusCode).send({
    status: "success",
    statusCode,
    data: data,
    message,
  });
};
