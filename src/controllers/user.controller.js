const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services/index");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUser() function
/**
 * Get user details
 *  - Use service layer to get User data
 * 
 *  - If query param, "q" equals "address", return only the address field of the user
 *  - Else,
 *  - Return the whole user object fetched from Mongo

 *  - If data exists for the provided "userId", return 200 status code and the object
 *  - If data doesn't exist, throw an error using `ApiError` class
 *    - Status code should be "404 NOT FOUND"
 *    - Error message, "User not found"
 *  - If the user whose token is provided and user whose data to be fetched don't match, throw `ApiError`
 *    - Status code should be "403 FORBIDDEN"
 *    - Error message, "User not found"
 *
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3
 * Response - 
 * {
 *     "walletMoney": 500,
 *     "address": "ADDRESS_NOT_SET",
 *     "_id": "6010008e6c3477697e8eaba3",
 *     "name": "crio-users",
 *     "email": "crio-user@gmail.com",
 *     "password": "criouser123",
 *     "createdAt": "2021-01-26T11:44:14.544Z",
 *     "updatedAt": "2021-01-26T11:44:14.544Z",
 *     "__v": 0
 * }
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3?q=address
 * Response - 
 * {
 *   "address": "ADDRESS_NOT_SET"
 * }
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 403 - If request data doesn't match that of authenticated user
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 *
 */ 
const getUser = catchAsync(async (req, res) => {
  let data;
  if (req.query.q === "address") {
    data = await userService.getUserAddressById(req.params.userId);
  } 
  else {
    data = await userService.getUserById(req.params.userId);
  }
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (data.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }
  if (req.query.q === "address") {
    res.send({
      address: data.address,
    });
  } 
  else {
    res.send(data);
  }
});

const setAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.send({
    address: address,
  });
});

/**
 * Get user addresses
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<User>}
 */
const getAddresses = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found");
  }
  res.send({ addresses: user.addresses || [] });
});

/**
 * Add new address
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<User>}
 */
const addAddress = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found");
  }
  if (!req.body.address || req.body.address.length < 20) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address should be greater than 20 characters");
  }
  user.addresses = user.addresses || [];
  user.addresses.push({ address: req.body.address });
  await user.save();
  res.send({ success: true });
});

/**
 * Delete address
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<User>}
 */
const deleteAddress = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found");
  }
  user.addresses = user.addresses || [];
  const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
  if (addressIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Address to delete was not found");
  }
  user.addresses.splice(addressIndex, 1);
  await user.save();
  res.send({ success: true });
});

module.exports = {
  getUser,
  setAddress,
  getAddresses,
  addAddress,
  deleteAddress,
};
