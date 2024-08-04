const fs = require("node:fs");
const http = require("node:http");
const url = require("node:url");
const replaceTemplate = require("./modules/replaceTemplate");

//////////////// FILES

// Blocking - synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", {
//   encoding: "utf-8",
// });
// const textOut = `This is what we know about the avocado ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written!");

// Non-Blocking - asynchronous way
// fs.readFile(
//   "./txt/start.txt",
//   { encoding: "utf-8" },
//   (err, data1) => {
//     if (err) console.log("ERROR!", err.message);
//
//     fs.readFile(
//       `./txt/${data1}.txt`,
//       { encoding: "utf-8" },
//       (err, data2) => {
//         console.log(data2);
//
//         fs.readFile(
//           "./txt/append.txt",
//           { encoding: "utf-8" },
//           (err, data3) => {
//             console.log(data3);
//
//             fs.writeFile(
//               "./txt/final.txt",
//               `${data2}\n${data3}`,
//               { encoding: "utf-8" },
//               err => {
//                 console.log("File has been written!");
//               },
//             );
//           },
//         );
//       },
//     );
//   },
// console.log("Will read file");
// );

//////////////// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, {
  encoding: "utf-8",
});

const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  {
    encoding: "utf-8",
  },
);

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, {
  encoding: "utf-8",
});

const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, {
  encoding: "utf-8",
});

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

    return res.end(output);
  }

  // Product Page
  if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    return res.end(output);
  }

  // API
  if (pathname === "/api") {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    return res.end(data);
  }

  // Not Found
  res.writeHead(404, {
    "Content-Type": "text/html",
    "my-own-header": "hello-world",
  });

  return res.end("<h1>This page could not be found!<h1/>");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening to request on port 3000");
});
