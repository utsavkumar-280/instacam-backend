const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

const { User } = require("../models/user.model");
const { UserProfile } = require("../models/userProfile.model");
