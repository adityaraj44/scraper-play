const googlePlay = require("google-play-scraper");
const obtocsv = require("objects-to-csv");
const fs = require("fs");
const csv = require("csv-parser");

// input from csv
fs.createReadStream("./category.csv")
  .pipe(csv())
  .on("data", (column) => {
    console.log(column);
    const category = column.Category;
    console.log(category);
    googlePlay
      .search({
        term: `googlePlay.category.${category}`,
        num: 250,
        price: "all",
        fullDetail: false,
      })
      .then((app) => {
        if (app) {
          for (i = 0; i < app.length; i++) {
            console.log(`App name: ${app[i].title}`);
          }
          const transformed = new obtocsv(app);
          return transformed.toDisk(`./output${column.Category}.csv`);
        } else {
          console.log("Not found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .on("end", function () {
    console.log("done");
  });

// // take input app category from console
// const readline = require("readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// readline.question("Enter app category: ", (category) => {
//   googlePlay
//     .search({
//       term: `googlePlay.category.${category}`,
//       num: 250,
//       price: "all",
//       fullDetail: false,
//     })
//     .then((app) => {
//       if (app) {
//         for (i = 0; i < app.length; i++) {
//           console.log(
//             `App name: ${app[i].title} and App Details: ${app[i].summary}`
//           );
//         }
//         const transformed = new obtocsv(app);
//         return transformed.toDisk("./output.csv");
//       } else {
//         console.log("Not found");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   readline.close();
// });
