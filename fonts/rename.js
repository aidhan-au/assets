const fs = require("fs");
const path = require("path");

// directory containing the font files
const directory = "./inter";
const outputFilePath = "inter.css";

const weights = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
};

tab = "    ";

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  files.forEach((file) => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);

    if (!name.includes(" ")) {
      console.log(`Skipping file ${file}`);
      return;
    }

    let parts = name.split(/[\s-]/);

    let style = "normal";
    if (parts[parts.length - 1] === "Italic") {
      style = "italic";
      parts.pop();
    }

    let weight = weights[parts[parts.length - 1]];
    if (!weight) {
      weight = 400;
    } else {
      parts.pop();
    }

    const font = parts.join("-");
    const newName = `${font.toLowerCase()}.${weight}.${style}`;

    if (ext.includes(".woff")) {
      fs.rename(
        path.join(directory, file),
        path.join(directory, newName + ext),
        (err) => {
          if (err) {
            console.error(`Error renaming file ${file}: ${err}`);
          } else {
            console.log(`Renamed file ${file} to ${newName}${ext}`);
          }
        },
      );
    }

    if (ext.includes("woff2")) {
      let fontPath = path.join(directory, newName);
      let css = "";
      try {
        css = fs.readFileSync(outputFilePath, { encoding: "utf-8" });
      } catch (e) {
        if (e.message.includes("no such file")) {
          console.log(`Creating new CSS file: ${outputFilePath}`);
        } else {
          console.error(`Error reading CSS file: ${e}`);
          return;
        }
      }

      fontPath = fontPath.replace(/\\/g, "/");
      css += `@font-face {\n`;
      css += tab + `font-family: "${font}";\n`;
      css += tab + `src: url('${fontPath}.woff2') format('woff2'),\n`;
      css += tab + tab + `url('${fontPath}.woff') format('woff');\n`;
      css += tab + `font-weight: ${weight};\n`;
      css += tab + `font-style: ${style};\n`;
      css += tab + `font-display: swap;\n`;
      css += `}\n\n`;

      fs.writeFileSync(outputFilePath, css);
      console.log("CSS file appended successfully!");
    }
  });
});
