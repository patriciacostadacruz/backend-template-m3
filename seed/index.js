require('dotenv').config();
const mongoose = require('mongoose');
const Project = require("../models/Project");
const Review = require("../models/Review");

const projects = [
  {
    title: "Organic farm-to-table restaurant",
    status: "closed",
    location: "Los Angeles",
    description:
      "We are planning to open an organic farm-to-table restaurant in the heart of Los Angeles, serving locally-sourced, healthy, and delicious food. Our goal is to promote sustainable agriculture and healthy eating habits while providing a unique culinary experience.",
    industry: ["Food and beverage"],
    fundingNeeded: "seed",
    owner: "64233279c5d190ee1a2ddacb",
    investors: ["6423324ec5d190ee1a2ddac9"],
  },
  {
    title: "Eco-friendly cleaning products",
    status: "active",
    location: "Barcelona",
    description:
      "Our company produces eco-friendly cleaning products that are safe for people and the environment. We use only natural and biodegradable ingredients to create high-quality, effective cleaning solutions that are free from harmful chemicals.",
    industry: ["Consumer goods and retail", "Energy and environment"],
    fundingNeeded: "serie A, B or C",
    owner: "64233279c5d190ee1a2ddacb",
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
    owner: "64233279c5d190ee1a2ddacb",
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
    owner: "64233279c5d190ee1a2ddacb",
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
    owner: "64233279c5d190ee1a2ddacb",
    investors: [],
  },
];


// const reviews = [
//   {
//     title: "Amazing investor",
//     rating: "4",
//     comment: "Test comment",
//     personRating: "",
//     personRated: ""
//   }
// ]

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