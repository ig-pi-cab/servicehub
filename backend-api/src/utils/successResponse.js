function successResponse(
  res,
  { message = "Success", status = 200, data = null, meta = null }
) {
  const response = { message };
  if (data) response.data = data;
  if (meta) response.meta = meta;

  return res.status(status).json(response);
}

function successCreatedResponse(
  res,
  { message = "Resource created", data = null }
) {
  return successResponse(res, {
    message,
    status: 201,
    data,
  });
}

module.exports = { successResponse, successCreatedResponse };
