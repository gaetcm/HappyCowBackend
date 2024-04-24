require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(express.json());
// const mongoose =require("mongoose")

// Requête restaurant :
app.get("/restaurants", cors(), async (req, res) => {
  try {
    const { name = "", skip = "", limit = "" } = req.query;
    const response = await axios.get(
      `https://res.cloudinary.com/lereacteur-apollo/raw/upload/v1575242111/10w-full-stack/Scraping/restaurants.json`
    );
    const filteredRestaurants = response.data.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(name.toLowerCase())
    );

    // skip and limit
    const startIndex = parseInt(skip) || 0;
    const endIndex =
      startIndex + (parseInt(limit) || filteredRestaurants.length);
    const paginatedRestaurants = filteredRestaurants.slice(
      startIndex,
      endIndex
    );

    res.json(paginatedRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Requête resto par ID
app.get("/restaurants/:id", cors(), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await axios.get(
      "https://res.cloudinary.com/lereacteur-apollo/raw/upload/v1575242111/10w-full-stack/Scraping/restaurants.json"
    );
    const restaurant = response.data.find(
      (restaurant) => restaurant.placeId === id
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/carte", cors(), async (req, res) => {
  try {
    const {
      name = "",
      skip = "",
      limit = "",
      category = "",
      vegan = "",
    } = req.query;
    const response = await axios.get(
      `https://res.cloudinary.com/lereacteur-apollo/raw/upload/v1575242111/10w-full-stack/Scraping/restaurants.json`
    );
    const filteredRestaurants = response.data.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(name.toLowerCase())
    );

    // Filtrage par catégorie
    const categoryFilter = parseInt(category);
    const filteredByCategory = categoryFilter
      ? filteredRestaurants.filter((restaurant) =>
          restaurant.category.includes(categoryFilter)
        )
      : filteredRestaurants;

    const veganFilter = parseInt(vegan);
    const filteredByVegan = veganFilter
      ? filteredRestaurants.filter((restaurant) =>
          restaurant.vegan.includes(veganFilter)
        )
      : filteredRestaurants;

    // skip and limit
    const startIndex = parseInt(skip) || 0;
    const endIndex =
      startIndex + (parseInt(limit) || filteredByCategory.length);
    const paginatedRestaurants = filteredByCategory.slice(startIndex, endIndex);

    res.json(paginatedRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(3000, () => {
  console.log("Server has started");
});
