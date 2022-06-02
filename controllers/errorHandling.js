// export funtion that returns a 400
exports.error400 = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'no endpoint found',
  });
};
