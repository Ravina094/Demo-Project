const db = require("../Models");
require("dotenv").config();

/**
 * Register a new user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - Express response object.
 *
 * @returns {void}
 *
 * @description This function handles user registration. It receives the user's name, email, and password, creates a new user in the database, and returns a success message with the user data if successful. If an error occurs, it returns an error message.
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await db.user.create({ name, email, password, location });
    res.json({
      message: "User registered successfully!",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

/**
 * Log in a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void}
 *
 * @description This function handles user login. It assumes that the user has already been authenticated by Passport.js. It returns a success message with the authenticated user data.
 */
const loginUser = (req, res) => {
  res.json({ message: "User logged in successfully!", data: req.user });
};


/**
 * Fetch and return weather data for the current logged-in user's location.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.user - The authenticated user object.
 * @param {string} req.user.location - The location of the user.
 * @param {Object} res - Express response object.
 *
 * @returns {Promise<void>}
 *
 * @description This function uses the OpenWeatherMap API to fetch the weather data for the location specified in the user's profile. It returns the weather data in JSON format. If an error occurs, it sends a 500 status code with an error message.
 */
const getWeather = async (req, res) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const userLocation = req.user.location; // Assuming location is stored in user data
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(weatherUrl);
    res.json({ weather: response.data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weather data", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getWeather,
};
