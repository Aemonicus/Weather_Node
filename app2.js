const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./src/utils/geocode");
const forecast = require("./src/utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirPath = path.join(__dirname, "/public"); // Notamment utilisé pour link les fichiers css/js aux views
const viewsPath = path.join(__dirname, "/templates2/views");
const partialsPath = path.join(__dirname, "/templates2/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

// Setup index page
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Florent VICENTE"
  });
});

// Setup about page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Welcome to MY Castle !",
    name: "Florent VICENTE (again)"
  });
});

// Setup 404 page
app.get("/404/*", (req, res) => {
  res.send("Article not found");
});

// Setup help page
app.get("/help", (req, res) => {
  res.render("help", {
    title: "THE page inutile",
    helpText: "Quand j'aurai trouvé quelqu'un chose d'intéressant pour cette page help, vous serez les premiers informés. En attendant, si ce n'était pas assez clair, ce site fournit des informations d'ordre météo pour la ville de votre choix (la classe !)",
    name: "Florent VICENTE (again)"
  });
});

// Setup weather page if json info
app.get("/weather", (req, res) => {
  if (req.query.address) {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }
          res.send({
            forecast: forecastData,
            location,
            address: req.query.address
          });
        });
      }
    );
  } else {
    res.send({
      error: "You must provide an address"
    });
  }
})

// Setup products page
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.send("Help article not found");
})

// Si on entre une url qui n'est pas prévue dans la liste au-dessus, elle rentre dans le cas ci-dessous qui accepte toutes les possibilités
app.get("*", (req, res) => {
  res.render("404", {
    title: "Page Not Found",
    name: "Florent VICENTE (again)",
    errMessage: "Page Not Found, try with another url or NOT"
  });
});

// We start the server
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
