require('dotenv').config();
const mongoose = require('mongoose');
const Project = require("../models/Project");
const User = require("../models/User");
const Review = require("../models/Review");

const projects = [
  {
    title: "Organic farm-to-table restaurant",
    status: "planning",
    location: "Los Angeles",
    description:
      "We are planning to open an organic farm-to-table restaurant in the heart of Los Angeles, serving locally-sourced, healthy, and delicious food. Our goal is to promote sustainable agriculture and healthy eating habits while providing a unique culinary experience.",
    industry: ["Food and beverage"],
    fundingNeeded: "seed",
    owner: "64233e86a9d3bd31fb1ad33e",
    investors: ["64233e86a9d3bd31fb1ad33d"],
  },
  {
    title: "Eco-friendly cleaning products",
    status: "active",
    location: "Barcelona",
    description:
      "Our company produces eco-friendly cleaning products that are safe for people and the environment. We use only natural and biodegradable ingredients to create high-quality, effective cleaning solutions that are free from harmful chemicals.",
    industry: ["Consumer goods and retail", "Energy and environment"],
    fundingNeeded: "serie A, B or C",
    owner: "64233e86a9d3bd31fb1ad33e",
    investors: [],
  },
  {
    title: "Online language learning platform",
    status: "initiation",
    location: "Berlin",
    description:
      "Our online language learning platform provides personalized language instruction for students around the world. Our innovative approach combines artificial intelligence and human expertise to create a seamless and effective language learning experience.",
    industry: ["Education", "IT/Tech"],
    fundingNeeded: "angel",
    owner: "64233e86a9d3bd31fb1ad33e",
    investors: [],
  },
  {
    title: "Electric bike rental service",
    status: "planning",
    location: "Amsterdam",
    description:
      "Our company offers electric bike rental services for tourists and locals in Amsterdam. We aim to provide a sustainable and affordable transportation option for the city while promoting a healthy and active lifestyle.",
    industry: ["Transportation", "Energy and environment"],
    fundingNeeded: "pre-seed",
    owner: "64233e86a9d3bd31fb1ad33e",
    investors: [],
  },
  {
    title: "Fitness tracking app",
    status: "execution",
    location: "New York",
    description:
      "Our fitness tracking app helps users track their workouts, set goals, and get personalized workout recommendations based on their fitness level and preferences. Our app uses machine learning algorithms to provide a customized and engaging fitness experience.",
    industry: ["Digital mark", "IT/Tech"],
    fundingNeeded: "serie A, B or C",
    owner: "64233e86a9d3bd31fb1ad33e",
    investors: [],
  },
];

// const users = [
//   {
//     firstName: "Peter",
//     lastName: "Waffelton",
//     image:
//       "https://media.licdn.com/dms/image/D4E03AQGO35dGzbkHDQ/profile-displayphoto-shrink_800_800/0/1677077348201?e=1685577600&v=beta&t=FmF_NFLwCptw0RACCUXXN6ySnzVaJ-K7q74lIud3ia4",
//     email: "peter-waffleton-pro@gmail.com",
//     hashedPassword:
//       "$2a$12$IOYn9tu.zAH20mjXDmIfi.HBX7Ao8JhMOthnCJFnHxR12PYado2sK",
//     role: "investor",
//     linkedIn: "",
//     company: "PWC",
//     industry: ["IT/Tech", "Infrastructures"],
//     bio: "Test biography - to be updated later",
//     status: "active",
//   },
//   {
//     firstName: "Patrícia",
//     lastName: "Costa da Cruz",
//     image:
//       "https://media.licdn.com/dms/image/D4E03AQGO35dGzbkHDQ/profile-displayphoto-shrink_800_800/0/1677077348201?e=1685577600&v=beta&t=FmF_NFLwCptw0RACCUXXN6ySnzVaJ-K7q74lIud3ia4",
//     email: "patriciacstcz@gmail.com",
//     hashedPassword:
//       "$2a$12$36TgA1W39S20OHgFfrk3iOxejBxu2n24NhCishnsjAhsxS7bCd3om",
//     role: "investee",
//     linkedIn: "https://www.linkedin.com/in/patricia-costa-da-cruz/",
//     company: "ADP",
//     industry: ["IT/Tech"],
//     bio: "Test biography - to be updated later",
//     status: "active",
//   },
// ];

mongoose.connect(process.env.MONGO_URL)
  .then(x => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return Project.create(projects);
  })
  .then(() => {
    console.log('Seed done 🌱');
  })
  .catch(e => console.log(e))
  .finally(() => {
    console.log('Closing connection');
    mongoose.connection.close();
  })