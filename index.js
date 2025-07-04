import express from "express";
import cors from "cors";
import env from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import cookieParser from "cookie-parser";

export const Questions = [
  {
    id: 1,
    question: "Tends to start quarrels with others",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 2,
    question: "Is a reliable worker",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 3,
    question: "Can be tense",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 4,
    question: "Is ingenious, a deep thinker",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 5,
    question: "Generates a lot of enthusiasm",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 6,
    question: "Has a forgiving nature",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 7,
    question: "Tends to be disorganized",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 8,
    question: "Worries a lot",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 9,
    question: "Has an active imagination",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 10,
    question: "Tends to be quiet",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 11,
    question: "Tends to be lazy",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 12,
    question: "Is emotionally stable, not easily upset",
    trait: "Neuroticism",
    facet: "negative",
  },
  {
    id: 13,
    question: "Is inventive",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 14,
    question: "Has an assertive personality",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 15,
    question: "Can be cold and aloof",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 16,
    question: "Perseveres until the task is finished",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 17,
    question: "Can be moody",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 18,
    question: "Values artistic, aesthetic experiences",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 19,
    question: "Is sometimes shy, inhibited",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 20,
    question: "Is considerate and kind to almost everyone",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 21,
    question: "Does things efficiently",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 22,
    question: "Prefers work that is routine",
    trait: "Openness",
    facet: "negative",
  },
  {
    id: 23,
    question: "Is outgoing, sociable",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 24,
    question: "Is sometimes rude to others",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 25,
    question: "Makes plans and follows through with them",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 26,
    question: "Perseveres until the task is finished",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 27,
    question: "Can be moody",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 28,
    question: "Values artistic, aesthetic experiences",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 29,
    question: "Is sometimes shy, inhibited",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 30,
    question: "Is considerate and kind to almost everyone",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 31,
    question: "Does things efficiently",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 32,
    question: "Is talkative",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 33,
    question: "Tends to find fault with others",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 34,
    question: "Does a thorough job",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 35,
    question: "Is depressed, blue",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 36,
    question: "Is original, comes up with new ideas",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 37,
    question: "Is reserved",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 38,
    question: "Is helpful and unselfish with others",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 39,
    question: "Can be somewhat careless",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 40,
    question: "Is relaxed, handles stress well",
    trait: "Neuroticism",
    facet: "negative",
  },
  {
    id: 41,
    question: "Is curious about many different things",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 42,
    question: "Is full of energy",
    trait: "Extraversion",
    facet: "positive",
  },
  // New Questions Added:
  {
    id: 43,
    question: "Has a strong sense of responsibility",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 44,
    question: "Has a high level of self-discipline",
    trait: "Conscientiousness",
    facet: "positive",
  },
];

export const CareerQuestions = [
  {
    id: 1,
    question: "I like to work on cars",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 2,
    question: "I like to do puzzles",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 3,
    question: "I am good at working independently",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 4,
    question: "I like to work in teams",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 5,
    question: "I am an ambitious person, I set goals for myself",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 6,
    question: "I like to organize things, (files, desks/offices)",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 7,
    question: "I like to build things",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 8,
    question: "I like to read about art and music",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 9,
    question: "I like to have clear instructions to follow",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 10,
    question: "I like to try to influence or persuade people",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 11,
    question: "I like to do experiments",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 12,
    question: "I like to teach or train people",
    trait: "Neuroticism",
    facet: "negative",
  },
  {
    id: 13,
    question: "I like trying to help people solve their problems",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 14,
    question: "I like to take care of animals",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 15,
    question: "I wouldn’t mind working 8 hours per day in an office",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 16,
    question: "I like selling things",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 17,
    question: "I enjoy creative writing",
    trait: "Neuroticism",
    facet: "positive",
  },
  { id: 18, question: "I enjoy science", trait: "Openness", facet: "positive" },
  {
    id: 19,
    question: "I am quick to take on new responsibilities",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 20,
    question: "I am interested in healing people",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 21,
    question: "I enjoy trying to figure out how things work",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 22,
    question: "Prefers work that is routine",
    trait: "Openness",
    facet: "negative",
  },
  {
    id: 23,
    question: "I like putting things together or assembling things",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 24,
    question: "I am a creative person",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 25,
    question: "I pay attention to details",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 26,
    question: "I like to do filing or typing",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 27,
    question: "I like to analyze things (problems/situations)",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 28,
    question: "I like to play instruments or sing",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 29,
    question: "I enjoy learning about other cultures",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 30,
    question: "I would like to start my own business",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 31,
    question: "I like to cook",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 32,
    question: "I like acting in plays",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 33,
    question: "I am a practical person",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 34,
    question: "I like working with numbers or charts",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 35,
    question: "I like to get into discussions about issues",
    trait: "Neuroticism",
    facet: "positive",
  },
  {
    id: 36,
    question: "I am good at keeping records of my work",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 37,
    question: "I like to lead",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 38,
    question: "I like working outdoors",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 39,
    question: "I would like to work in an office",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 40,
    question: "I am good at math",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 41,
    question: "I like helping people",
    trait: "Neuroticism",
    facet: "negative",
  },
  { id: 42, question: "I like to draw", trait: "Openness", facet: "positive" },
  {
    id: 43,
    question: "I like to give speeches",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 44,
    question: "I enjoy setting long-term goals and planning for the future",
    trait: "Conscientiousness",
    facet: "positive",
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create the 'pdfs' folder if it doesn't exist

const pdfFolder = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfFolder)) {
  fs.mkdirSync(pdfFolder);
}
//const pdfName = "big5_results_1743800032249.pdf";

// Combine the folder path and the file name to create the full path
//const pdfPath = path.join(pdfFolder, pdfName);

const app = express();

const port = 3000;

env.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const saltRounds = 10;
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies and credentials
  })
);
app.use(express.json());
app.use(cookieParser());
const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please log in again." }); // Unauthorized (token expired)
      }
      return res.status(403).json({ message: "Invalid Token" }); // Forbidden (invalid token)
    }
    const userId = user.id;
    connection.query(
      "SELECT * FROM tbl_users WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.error("Error fetching user:", err);
          return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
          return res.status(404).send("User not found");
        }
        req.user = result[0]; // Get the user object from the result
        next();
      }
    );
    //req.user = user; // Attach user information to the request
    // Proceed to the next middleware or route handler
  });
};

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("Server is running on port", port);
  console.log("Dirname", __dirname);
});

app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(req.body);

    const hash = await bcrypt.hash(password, saltRounds);

    // Insert user into database using promisified query
    await connection.query(
      "INSERT INTO tbl_users(name, email, password) VALUES(?, ?, ?)",
      [fullName, email, hash],
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).send("Error inserting user into database.");
        }
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send("An error occurred during password hashing or database operation.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const loginPassword = req.body.password;
    console.log(req.body);
    await connection.query(
      "SELECT * FROM tbl_users WHERE email = ?",
      [email],
      (err, result) => {
        if (result.length > 0) {
          const user = result[0];
          const storedHashedPassword = user.password;

          bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
            if (err) {
              console.error("Error comparing passwords:", err);
            } else {
              if (result) {
                console.log(jwtSecretKey);
                const token = jwt.sign(
                  {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    is_paid: user.is_paid,
                  },
                  jwtSecretKey,
                  { expiresIn: "2h" }
                );
                res.cookie("authToken", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production", // ✅ only true in prod
                  sameSite:
                    process.env.NODE_ENV === "production" ? "None" : "Lax",
                  maxAge: 3600000,
                });
                res.json({ result: user });
              } else {
                return res.send("Incorrect Password");
              }
            }
          });
        } else {
          res.send("User not found");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/logout", async (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true, // Ensures cookie is not accessible via JavaScript
    secure: false,
    path: "/", // Specifies the path for which cookie should be cleared
  });

  res.status(200).json({ success: "Successfully loggedout" });
});

app.post("/forgotPassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const hash = await bcrypt.hash(password, saltRounds);

    await connection.query("UPDATE tbl_users SET password= ? WHERE email = ?", [
      hash,
      email,
    ]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send("An error occurred during password hashing or database operation.");
  }
});

app.post("/saveResults", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { questionId, testResults, testType } = req.body;
  console.log(req.body);
  await connection.query(
    "INSERT INTO tbl_testresults(user_id,question_id, test_result, test_type) VALUES(?, ?, ?,?)",
    [userId, questionId, testResults, testType]
  );
  res.send("Added successfully");
});

app.post("/getTestResults", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const isPaid = req.user.is_paid;
    const { testType } = req.body;
    console.log(userId);
    console.log(testType);
    console.log("Received userId:", userId);
    if (isPaid === 1 && testType === "Career Test") {
      await connection.query(
        "SELECT * FROM tbl_testresults WHERE user_id = ? and test_type=?",
        [userId, testType],
        (err, result) => {
          if (result.length > 0) {
            const row = result[0];

            if (err) {
              console.error("Error comparing passwords:", err);
            } else {
              if (result) {
                res.json({ result: row });
              } else {
                res.send("Error");
              }
            }
          } else {
            res.send("User not found");
          }
        }
      );
    } else {
      await connection.query(
        "SELECT * FROM tbl_testresults WHERE user_id = ? and test_type=?",
        [userId, testType],
        (err, result) => {
          if (result.length > 0) {
            const row = result[0];

            if (err) {
              console.error("Error comparing passwords:", err);
            } else {
              if (result) {
                res.json({ result: row });
              } else {
                res.send("Error");
              }
            }
          } else {
            res.send("User not found");
          }
        }
      );
    }

    //res.json({ result: result });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while fetching test results." });
  }
});

app.get("/questions", (req, res) => {
  res.json({
    id: Questions.map((question) => question.id),
    question: Questions.map((question) => question.question),
  });
});

app.get("/careerQuestions", (req, res) => {
  res.json({
    id: CareerQuestions.map((question) => question.id),
    question: CareerQuestions.map((question) => question.question),
  });
});

app.get("/calculateCareerScore", (req, res) => {
  const { id, result } = req.query;
  const questionIds = id ? id.split(",").map(Number) : []; // Split by commas if `id` is a comma-separated string
  const selectedValues = result ? result.split(",") : [];
  console.log("questionIds", questionIds);
  console.log("selectedValues", selectedValues);
  let opennessResult = [];
  let conscientiousnessResult = [];
  let extraversionResult = [];
  let agreeablenessResult = [];
  let neuroticismResult = [];

  // Define a trait count for each trait to normalize the score
  const traitCounts = {
    openness: CareerQuestions.filter(
      (question) => question.trait === "Openness"
    ).length,
    conscientiousness: CareerQuestions.filter(
      (question) => question.trait === "Conscientiousness"
    ).length,
    extraversion: CareerQuestions.filter(
      (question) => question.trait === "Extraversion"
    ).length,
    agreeableness: CareerQuestions.filter(
      (question) => question.trait === "Agreeableness"
    ).length,
    neuroticism: CareerQuestions.filter(
      (question) => question.trait === "Neuroticism"
    ).length,
  };

  questionIds.forEach((id, index) => {
    const question = CareerQuestions.find((q) => q.id === id);
    if (question) {
      const selectedValue = selectedValues[index];
      console.log(question);
      let newScore = 0;
      if (question.facet === "negative") {
        if (selectedValue === "stronglyDisagree") {
          newScore = 5;
        } else if (selectedValue === "disagree") {
          newScore = 4;
        } else if (selectedValue === "neutral") {
          newScore = 3;
        } else if (selectedValue === "agree") {
          newScore = 2;
        } else if (selectedValue === "stronglyAgree") {
          newScore = 1;
        }
      } else if (question.facet === "positive") {
        if (selectedValue === "stronglyDisagree") {
          newScore = 1;
        } else if (selectedValue === "disagree") {
          newScore = 2;
        } else if (selectedValue === "neutral") {
          newScore = 3;
        } else if (selectedValue === "agree") {
          newScore = 4;
        } else if (selectedValue === "stronglyAgree") {
          newScore = 5;
        }
      }

      switch (question.trait.toLowerCase()) {
        case "openness":
          opennessResult.push(newScore);
          console.log(opennessResult);
          break;
        case "conscientiousness":
          conscientiousnessResult.push(newScore);
          break;
        case "extraversion":
          extraversionResult.push(newScore);
          break;
        case "agreeableness":
          agreeablenessResult.push(newScore);

          break;
        case "neuroticism":
          neuroticismResult.push(newScore);
          break;
        default:
          return res.status(400).json({ error: "Error" });
      }
    }
  });

  const opennessScore = calculateResult(
    opennessResult,
    traitCounts.openness,
    "openness"
  );
  const conscientiousnessScore = calculateResult(
    conscientiousnessResult,
    traitCounts.conscientiousness,
    "conscientiousness"
  );
  const extraversionScore = calculateResult(
    extraversionResult,
    traitCounts.extraversion,
    "extraversion"
  );
  const agreeablenessScore = calculateResult(
    agreeablenessResult,
    traitCounts.agreeableness,
    "agreeableness"
  );
  const neuroticismScore = calculateResult(
    neuroticismResult,
    traitCounts.neuroticism,
    "neuroticism"
  );

  function calculateResult(resultArray, traitCount, trait) {
    const totalScore = resultArray.reduce(
      (accumulator, newScore) => accumulator + newScore,
      0
    );
    const percentage = Math.round((totalScore / (traitCount * 5)) * 100);

    return { score: percentage, desc: generateDescription(percentage, trait) };
  }

  function generateDescription(percentage, trait) {
    let description = "";
    let careerchoice = "";
    let templatePath = "";
    switch (trait) {
      case "openness":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/openness-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
          //description = `A score above 80 signifies a strong preference for intellectual exploration, creative thinking, and a willingness to embrace novel ideas and unconventional experiences. You are drawn to abstract concepts, aesthetics, and new challenges, and likely thrive in environments that reward curiosity and innovation.You may excel in careers that involve creativity, innovation, and intellectual exploration, such as UX/UI design, research, architecture, or roles in the arts and creative consulting.`;
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/openness-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/openness-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/openness-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "career-descriptions/openness-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }

        break;
      case "conscientiousness":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conscientiousness-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conscientiousness-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conscientiousness-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conscientiousness-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conscientiousness-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      case "extraversion":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/extraversion-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/extraversion-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/openness-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/extraversion-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "career-descriptions/extraversion-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      case "agreeableness":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/agreeableness-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/agreeableness-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/agreeableness-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/agreeableness-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "career-descriptions/agreeableness-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      case "neuroticism":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/neuroticism-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/neuroticism-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/neuroticism-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/neuroticism-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "career-descriptions/neuroticism-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      default:
        description = "Invalid";
        care = "";
    }
    return description;
  }

  // Create PDF document and save it to server
  const doc = new PDFDocument();
  const fileName = `big5_results_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "pdfs", fileName);

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add content to PDF
  doc
    .fontSize(18)
    .text("Big Five Personality Test Results", { align: "center" });
  doc.moveDown();

  // Add results
  doc.fontSize(12).text(`Openness: ${opennessScore.score}%`);
  doc.text(opennessScore.desc);
  doc.moveDown();

  doc.text(`Conscientiousness: ${conscientiousnessScore.score}%`);
  doc.text(conscientiousnessScore.desc);
  doc.moveDown();

  doc.text(`Extraversion: ${extraversionScore.score}%`);
  doc.text(extraversionScore.desc);
  doc.moveDown();

  doc.text(`Agreeableness: ${agreeablenessScore.score}%`);
  doc.text(agreeablenessScore.desc);
  doc.moveDown();

  doc.text(`Neuroticism: ${neuroticismScore.score}%`);
  doc.text(neuroticismScore.desc);

  // Finalize the PDF
  doc.end();

  writeStream.on("finish", () => {
    // Send the response with the file path
    res.json({
      message: "PDF generated and saved successfully.",
      fileName: fileName,
      openness: opennessScore,
      conscientiousness: conscientiousnessScore,
      extraversion: extraversionScore,
      agreeableness: agreeablenessScore,
      neuroticism: neuroticismScore,
    });
  });

  writeStream.on("error", (err) => {
    console.log(err);
    res.status(500).json({ error: "Error generating PDF" });
  });
});

app.get("/calculateScore", (req, res) => {
  const { id, result } = req.query;
  const questionIds = id ? id.split(",").map(Number) : []; // Split by commas if `id` is a comma-separated string
  const selectedValues = result ? result.split(",") : [];
  console.log("questionIds", questionIds);
  console.log("selectedValues", selectedValues);
  let opennessResult = [];
  let conscientiousnessResult = [];
  let extraversionResult = [];
  let agreeablenessResult = [];
  let neuroticismResult = [];

  // Define a trait count for each trait to normalize the score
  const traitCounts = {
    openness: Questions.filter((question) => question.trait === "Openness")
      .length,
    conscientiousness: Questions.filter(
      (question) => question.trait === "Conscientiousness"
    ).length,
    extraversion: Questions.filter(
      (question) => question.trait === "Extraversion"
    ).length,
    agreeableness: Questions.filter(
      (question) => question.trait === "Agreeableness"
    ).length,
    neuroticism: Questions.filter(
      (question) => question.trait === "Neuroticism"
    ).length,
  };

  questionIds.forEach((id, index) => {
    const question = Questions.find((q) => q.id === id);
    if (question) {
      const selectedValue = selectedValues[index];
      console.log(question);
      let newScore = 0;
      if (question.facet === "negative") {
        if (selectedValue === "stronglyDisagree") {
          newScore = 5;
        } else if (selectedValue === "disagree") {
          newScore = 4;
        } else if (selectedValue === "neutral") {
          newScore = 3;
        } else if (selectedValue === "agree") {
          newScore = 2;
        } else if (selectedValue === "stronglyAgree") {
          newScore = 1;
        }
      } else if (question.facet === "positive") {
        if (selectedValue === "stronglyDisagree") {
          newScore = 1;
        } else if (selectedValue === "disagree") {
          newScore = 2;
        } else if (selectedValue === "neutral") {
          newScore = 3;
        } else if (selectedValue === "agree") {
          newScore = 4;
        } else if (selectedValue === "stronglyAgree") {
          newScore = 5;
        }
      }

      switch (question.trait.toLowerCase()) {
        case "openness":
          opennessResult.push(newScore);
          console.log(opennessResult);
          break;
        case "conscientiousness":
          conscientiousnessResult.push(newScore);
          break;
        case "extraversion":
          extraversionResult.push(newScore);
          break;
        case "agreeableness":
          agreeablenessResult.push(newScore);

          break;
        case "neuroticism":
          neuroticismResult.push(newScore);
          break;
        default:
          return res.status(400).json({ error: "Error" });
      }
    }
  });

  const opennessScore = calculateResult(
    opennessResult,
    traitCounts.openness,
    "openness"
  );
  const conscientiousnessScore = calculateResult(
    conscientiousnessResult,
    traitCounts.conscientiousness,
    "conscientiousness"
  );
  const extraversionScore = calculateResult(
    extraversionResult,
    traitCounts.extraversion,
    "extraversion"
  );
  const agreeablenessScore = calculateResult(
    agreeablenessResult,
    traitCounts.agreeableness,
    "agreeableness"
  );
  const neuroticismScore = calculateResult(
    neuroticismResult,
    traitCounts.neuroticism,
    "neuroticism"
  );

  function calculateResult(resultArray, traitCount, trait) {
    const totalScore = resultArray.reduce(
      (accumulator, newScore) => accumulator + newScore,
      0
    );
    const percentage = Math.round((totalScore / (traitCount * 5)) * 100);

    return { score: percentage, desc: generateDescription(percentage, trait) };
  }

  function generateDescription(percentage, trait) {
    let description = "";
    switch (trait) {
      case "openness":
        if (percentage >= 80) {
          description = `You have an exceptionally high level of openness, which means your mind is naturally expansive, imaginative, and eager to explore new and unconventional ideas. You thrive on creativity, abstract thinking, and intellectual discovery, often questioning norms and seeking out novel experiences. You’re deeply introspective and enjoy contemplating complex concepts, emotions, and possibilities. Your imagination is vivid, and you’re likely drawn to beauty, symbolism, and depth in everything from art and music to ideas and personal experiences. People with this level of openness often feel energized by change, diversity, and complexity, and they tend to embrace ambiguity rather than shy away from it. You value authenticity, emotional richness, and personal growth, often seeing the world not just as it is, but as it could be.`;
        } else if (percentage >= 60) {
          description = `You have a moderately high level of openness, which means you’re naturally curious, imaginative, and open to exploring new ideas and perspectives. You enjoy thinking creatively and often find yourself reflecting on abstract concepts or possibilities beyond the surface. While you're not extreme in your preferences, you likely appreciate art, music, literature, or philosophical thought, and you value meaningful experiences that challenge your understanding of the world. You’re receptive to change and tend to enjoy variety in life, whether through travel, new hobbies, or diverse conversations. Your open mindset allows you to see connections others might miss, and you're often drawn to exploring different viewpoints. At the same time, you maintain enough grounding to evaluate new ideas thoughtfully rather than impulsively.`;
        } else if (percentage >= 40) {
          description = `IYou show a balanced level of openness, indicating that you value both tradition and new ideas in equal measure. You're practical and realistic, often preferring tried-and-true methods over untested approaches. At the same time, you're not completely closed off to novelty—you’re open to change and new experiences if they seem reasonable or beneficial. You may enjoy learning new things occasionally but might not actively seek out abstract theories or unconventional perspectives. Your thinking tends to be grounded, and you likely prefer facts and tangible outcomes over speculation or fantasy. This middle-ground approach helps you navigate both the familiar and the unfamiliar with a sense of measured curiosity and thoughtful consideration.`;
        } else if (percentage >= 20) {
          description = `You have a relatively low level of openness, which means you tend to be practical, conventional, and more comfortable with familiar routines and well-established ideas. You likely prefer structure, predictability, and concrete information over abstract or theoretical thinking. Change may feel unsettling rather than exciting, and you might approach new experiences with caution or skepticism. Your thinking is grounded in real-world logic and facts, and you value consistency and tradition. Rather than seeking novelty, you often find satisfaction in stability and clear expectations. While you may not be drawn to imaginative or artistic pursuits, your straightforward approach helps you stay focused, dependable, and clear-headed in everyday life.`;
        } else {
          description = `You have a very low level of openness, which suggests a strong preference for familiarity, structure, and traditional ways of thinking. You likely value clear rules, routine, and practical approaches over novelty or abstract ideas. Imagination, fantasy, and unconventional concepts may hold little appeal for you, as you tend to trust proven methods and prefer sticking to what you know works. You might be more skeptical of change and less inclined to experiment or take intellectual or emotional risks. Your worldview is typically grounded, realistic, and focused on the tangible and immediate. While this may mean you're less drawn to creative or philosophical thinking, it also reflects a steady, no-nonsense mindset that prioritizes clarity, dependability, and straightforward decision-making.`;
        }

        break;
      case "conscientiousness":
        if (percentage >= 80) {
          description = `You have an exceptionally high level of conscientiousness, which means you are highly organized, reliable, and diligent in everything you do. You thrive on structure, planning, and efficiency, and you are motivated to meet your goals with precision and dedication. Your attention to detail is exceptional, and you are often seen as someone who can be trusted to follow through on commitments and responsibilities. You likely have strong self-discipline, and you are careful in making decisions, weighing all possible outcomes to ensure that you make the right choice. This level of conscientiousness also means you tend to be very punctual, focused, and driven, often setting high standards for yourself and striving to meet them. While you are highly dependable, you may also be more cautious or risk-averse, preferring to stick to well-established methods rather than taking chances.`;
        } else if (percentage >= 60) {
          description = `You have a moderately high level of conscientiousness, which means you are generally organized, responsible, and goal-oriented, but you also allow yourself some flexibility. You take your responsibilities seriously and strive to meet your commitments, but you may not feel the need to be excessively perfectionistic or overly rigid. While you tend to approach tasks with thoughtfulness and care, you're also able to adapt when things don't go according to plan. You balance diligence and practicality with a sense of ease, making you reliable without being overly controlling. You likely value structure and routine, but you also recognize the importance of spontaneity and creativity in certain situations. Your ability to stay focused and organized helps you get things done, but you're not overly consumed by details, allowing you to maintain a healthy sense of work-life balance.`;
        } else if (percentage >= 40) {
          description = `You have a balanced level of conscientiousness, meaning you're generally responsible but also enjoy some flexibility in your approach to tasks and life. While you take care of your obligations and try to be reliable, you’re not overly concerned with perfection or strict organization. You prefer a practical approach to things, but you might not always stick to rigid plans or follow every detail to the letter. You can be dependable, but you also recognize the importance of adaptability and may not always feel the need to be meticulous. This middle-ground approach allows you to stay on track without becoming overwhelmed by structure, and you can find a balance between being organized and allowing room for spontaneity. You tend to be efficient, but you’re also comfortable letting things unfold naturally when appropriate.`;
        } else if (percentage >= 20) {
          description = `You have a relatively low level of conscientiousness, which means you may be more spontaneous and flexible in your approach to life, preferring to go with the flow rather than adhering to strict plans or routines. You may find it difficult to stick to a rigid schedule or focus on small details, and you’re likely to prioritize immediate enjoyment over long-term goals or obligations. While you can still be reliable when needed, you may not always be as meticulous or organized as others, and you might struggle with tasks that require a high level of discipline or careful planning. Your approach to life is more laid-back, and you tend to value freedom and flexibility over structure and control. This can make you more adaptable, but at times, it might also lead to unfinished projects or a tendency to procrastinate.`;
        } else {
          description = `You have a very low level of conscientiousness, which suggests a more carefree, spontaneous approach to life. You may find it challenging to maintain organization or structure in your daily routine, and you likely prefer to act on impulse rather than follow through on long-term plans. Details, deadlines, and careful planning may not be your priority, and you might prefer to live in the moment rather than worrying about future obligations or responsibilities. While this can make you flexible and adaptable, it might also lead to difficulties in staying on track or completing tasks that require sustained effort or attention. You may not always be the most reliable in terms of commitment, but your carefree nature allows you to take life as it comes without becoming bogged down by overthinking or excessive planning.`;
        }
        break;
      case "extraversion":
        if (percentage >= 80) {
          description = `You have an exceptionally high level of extraversion, which means you are outgoing, energetic, and thrive in social situations. You likely find joy in being around people, engaging in lively conversations, and participating in group activities. Your enthusiasm and positive energy can be contagious, and you often seek out new social experiences and opportunities to connect with others. You’re not shy about expressing yourself, and you're comfortable being the center of attention. Your energetic and adventurous nature makes you enjoy new challenges and experiences, and you're often seen as an optimist with a zest for life. You may find it difficult to stay quiet or be alone for extended periods, as social interaction fuels your energy and happiness. People with this level of extraversion tend to be confident, talkative, and easily able to build connections with a wide variety of people.`;
        } else if (percentage >= 60) {
          description = `You have a moderately high level of extraversion, which means you enjoy socializing and being around others, but you also value some quiet time to recharge. You tend to be outgoing, enthusiastic, and comfortable in social settings, often feeling energized by interacting with people. While you enjoy participating in group activities and can easily strike up conversations, you don’t always feel the need to be the center of attention. You can balance your social life with moments of solitude, allowing yourself to rest and reflect when needed. Your enthusiasm and positive attitude make you approachable, and you likely feel most at ease in familiar social situations, though you’re also open to meeting new people and exploring new experiences. Your extraverted nature allows you to build connections with ease, but you're equally comfortable with introspective moments.`;
        } else if (percentage >= 40) {
          description = `You have a balanced level of extraversion, meaning you enjoy socializing but also appreciate your time alone. You’re comfortable in social settings and can engage in conversations, but you’re not necessarily the life of the party. You might enjoy social interactions in smaller groups or one-on-one settings rather than large, lively gatherings. While you may not seek out constant social stimulation, you do enjoy connecting with others when the situation calls for it. You tend to be more reserved compared to highly extraverted individuals, but you're still warm, approachable, and friendly. You strike a healthy balance between being outgoing and valuing personal space, often choosing to recharge quietly after social events. Your social energy is adaptable, allowing you to fit into various situations without feeling overwhelmed or drained.`;
        } else if (percentage >= 20) {
          description = `You have a relatively low level of extraversion, which means you tend to be more reserved and introspective. While you may enjoy social interactions occasionally, you generally prefer solitude or spending time in smaller, more intimate settings rather than large, crowded social gatherings. You might feel drained after extended socializing and need time alone to recharge. You may not actively seek out attention or be eager to engage in conversations with strangers, but when you do interact, you are thoughtful and considerate. Your energy is more focused inward, and you tend to enjoy activities that allow for quiet reflection or deep thought. While you can be social when necessary, you typically feel more comfortable in environments where you can be yourself without feeling the pressure to be outgoing or constantly engaged with others.`;
        } else {
          description = `You have a very low level of extraversion, which means you are highly introverted and tend to prefer solitude over socializing. Large gatherings or frequent social interactions may feel overwhelming, and you’re more likely to feel comfortable in quiet, calm environments where you can focus on your own thoughts. You might avoid being the center of attention and instead find fulfillment in one-on-one conversations or solitary activities like reading, writing, or introspection. Social situations may drain you rather than energize you, and you may prefer to spend your time in a way that allows for personal reflection and recharge. While you can still enjoy socializing in familiar settings or with close friends, you tend to value your privacy and quiet time far more than engaging with large groups or seeking out new social experiences.`;
        }
        break;
      case "agreeableness":
        if (percentage >= 80) {
          description = `You have an exceptionally high level of agreeableness, which means you are kind, empathetic, and always considerate of others' feelings. You are naturally cooperative and tend to go out of your way to make others feel comfortable and valued. Your compassion and understanding make you someone people feel they can trust and rely on. You’re highly attuned to the needs and emotions of others, often putting their well-being ahead of your own. You have a strong desire to avoid conflict and maintain harmony in relationships, which can make you a great listener and a supportive friend. Your generosity and willingness to help others, even when it's not expected, reflect a deep sense of care and kindness. However, this can sometimes lead to putting others' needs before your own, so finding a balance between being supportive and looking after yourself is important.`;
        } else if (percentage >= 60) {
          description = `You have a moderately high level of agreeableness, meaning you are generally kind, cooperative, and considerate of others, though you also have the ability to assert yourself when necessary. You enjoy helping others and maintaining positive relationships, and you’re often sensitive to the needs and feelings of those around you. Your approach to conflict is typically calm and collaborative, preferring to find a solution that benefits everyone. While you value harmony, you’re also capable of standing your ground and expressing your own needs and opinions when required. You tend to be a reliable and trustworthy friend, and people appreciate your supportive nature. At times, you might put others first, but you also understand the importance of balancing kindness with setting healthy boundaries to ensure your own well-being.`;
        } else if (percentage >= 40) {
          description = `You have a balanced level of agreeableness, which means you are generally cooperative and considerate, but you're also capable of being assertive when the situation requires it. You can be empathetic and understanding towards others, yet you're not overly accommodating or overly concerned with avoiding conflict. You value positive relationships but are more comfortable speaking up for yourself and expressing your opinions, even if they may sometimes differ from others. While you tend to get along well with people, you also maintain a sense of independence and are willing to stand your ground when needed. You strike a healthy balance between being supportive and maintaining your own boundaries, and you're not afraid to voice your needs or preferences, especially when it’s important to do so.`;
        } else if (percentage >= 20) {
          description = `You have a relatively low level of agreeableness, which means you tend to prioritize your own needs and opinions over maintaining harmony or pleasing others. While you're not necessarily unkind, you may be more straightforward, assertive, or even blunt in your interactions. You value honesty and directness, often feeling that it's more important to express your true feelings rather than accommodate others’ desires. You may find it difficult to avoid conflict and are not afraid to stand up for yourself, even if it means creating tension. This trait allows you to be independent and self-sufficient, but it can also lead to occasional misunderstandings with those who expect more diplomacy or sensitivity. You may not seek to please everyone, focusing more on your own goals and perspectives than on keeping the peace in relationships.`;
        } else {
          description = `You have a very low level of agreeableness, which means you tend to be more self-focused and direct in your interactions. You are less concerned with the feelings or opinions of others and prioritize your own goals, beliefs, and needs. While this can make you highly independent and confident in your decisions, it may also result in a tendency to challenge or disregard social norms and expectations. You are likely less inclined to seek harmony or avoid conflict, and you might express your thoughts and feelings in a blunt or unapologetic way. This can sometimes lead to misunderstandings or friction with others, as you may come across as insensitive or indifferent to their concerns. While you value your own perspective above others’, it’s important to recognize that this approach can limit the depth of your relationships or the support you receive from others.`;
        }
        break;
      case "neuroticism":
        if (percentage >= 80) {
          description = `You have a very high level of neuroticism, which means you experience intense emotional reactions to stress, anxiety, and negative situations. Your feelings tend to be more volatile, and you may frequently feel overwhelmed by worry, frustration, or sadness. You are highly sensitive to stressors and may find it difficult to cope with challenges without feeling anxious or discouraged. Your mood can fluctuate rapidly, and you may often find yourself ruminating over past events or worrying about the future. This heightened emotional reactivity can make it harder to bounce back from setbacks, and you might struggle to maintain a sense of calm in stressful situations. While your emotional depth allows you to experience strong feelings, it’s important to recognize that this sensitivity can sometimes lead to unnecessary stress or difficulty in managing your emotions. Finding ways to build emotional resilience and manage anxiety can help you navigate life with greater stability.`;
        } else if (percentage >= 60) {
          description = `You have a moderately high level of neuroticism, meaning you tend to experience emotional ups and downs more frequently than others. While you may not be overwhelmed by emotions as often, you are still sensitive to stress, anxiety, and negative feelings. You might find yourself worrying about various aspects of life, and at times, these worries can feel intense. Stressful situations can trigger feelings of insecurity or frustration, and you may sometimes overthink challenges or setbacks. However, your emotional responses are generally manageable, and you are able to regain stability with some effort. While you may experience occasional mood swings or anxiety, you also have the ability to reflect on your emotions and find ways to cope. Being aware of your emotional triggers and developing strategies to manage stress can help you maintain a more balanced outlook.`;
        } else if (percentage >= 40) {
          description = `You have a balanced level of neuroticism, meaning you experience emotional ups and downs, but they tend to be moderate and manageable. While you may occasionally feel anxious, stressed, or frustrated, these emotions are generally not overwhelming and you are able to recover fairly quickly. You can be sensitive to negative situations, but you usually handle them with a more grounded perspective, and you are able to stay calm in most circumstances. You may occasionally worry or feel insecure, but it tends to be more situational rather than a constant state of mind. Your ability to reflect on your emotions and approach challenges in a logical way helps you maintain balance, even when things don’t go as planned. While you’re not immune to stress, you’re generally able to keep it in check and avoid letting it affect your overall well-being.`;
        } else if (percentage >= 20) {
          description = `You have a relatively low level of neuroticism, meaning you tend to remain calm and composed even in stressful situations. Emotional ups and downs are less frequent for you, and you are generally able to manage negative emotions like anxiety, worry, or frustration with ease. You are less sensitive to stress and more resilient in the face of challenges, often approaching difficulties with a level-headed and rational mindset. While you may experience occasional feelings of insecurity or doubt, these tend to be short-lived and don't significantly impact your overall emotional state. Your ability to maintain emotional stability and stay optimistic in tough situations allows you to navigate life with confidence and a positive outlook. You are likely to be perceived as calm, collected, and self-assured by those around you.`;
        } else {
          description = `You have a very low level of neuroticism, meaning you are highly emotionally stable and rarely experience intense negative emotions such as anxiety, worry, or frustration. You are generally calm, composed, and resilient, even in stressful situations, and you tend to bounce back quickly from setbacks. Emotional turmoil and stressors have minimal impact on you, and you approach challenges with a sense of confidence and ease. Your ability to remain steady and unaffected by negative emotions allows you to maintain a positive and optimistic outlook on life. You are rarely troubled by self-doubt or insecurity and tend to stay focused and grounded, regardless of the external circumstances. This emotional stability makes you someone who is not easily rattled and can handle high-pressure situations with grace.`;
        }
        break;
      default:
        description = "Invalid";
    }
    return description;
  }

  // Create PDF document and save it to server
  const doc = new PDFDocument();
  const fileName = `big5_results_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "pdfs", fileName);

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add content to PDF
  doc
    .fontSize(18)
    .text("Big Five Personality Test Results", { align: "center" });
  doc.moveDown();

  // Add results
  doc.fontSize(12).text(`Openness: ${opennessScore.score}%`);
  doc.text(opennessScore.desc);
  doc.moveDown();

  doc.text(`Conscientiousness: ${conscientiousnessScore.score}%`);
  doc.text(conscientiousnessScore.desc);
  doc.moveDown();

  doc.text(`Extraversion: ${extraversionScore.score}%`);
  doc.text(extraversionScore.desc);
  doc.moveDown();

  doc.text(`Agreeableness: ${agreeablenessScore.score}%`);
  doc.text(agreeablenessScore.desc);
  doc.moveDown();

  doc.text(`Neuroticism: ${neuroticismScore.score}%`);
  doc.text(neuroticismScore.desc);

  // Finalize the PDF
  doc.end();

  writeStream.on("finish", () => {
    // Send the response with the file path
    res.json({
      message: "PDF generated and saved successfully.",
      fileName: fileName,
      openness: opennessScore,
      conscientiousness: conscientiousnessScore,
      extraversion: extraversionScore,
      agreeableness: agreeablenessScore,
      neuroticism: neuroticismScore,
    });
  });

  writeStream.on("error", (err) => {
    console.log(err);
    res.status(500).json({ error: "Error generating PDF" });
  });
});

app.post("/sendResultsAsEmail", (req, res) => {
  const { email, result } = req.body;
  // Define PDF name and path
  const pdfName = result.fileName;
  const filePath = path.join(__dirname, "pdfs", pdfName);
  console.log(result);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anjugeorgeantony@gmail.com", // Replace with your email
      pass: "reiwieieawuksbvx", // Replace with your app password
    },
  });
  const mailConfigurations = {
    from: "anjugeorgeantony@gmail.com",

    to: email,

    subject: `Big 5 Personailty Test Results`,

    text: `
    Hi, 
    
    Here is your personality test results:

    Openness: ${result.Openness},
    Conscientiousness: ${result.Conscientiousness},
    Extraversion: ${result.Extraversion},
    Agreeableness: ${result.Agreeableness},
    Neuroticism: ${result.Neuroticism}
  
    Take test again: http://localhost:5173/personality-assessment`,
    attachments: [
      {
        filename: pdfName, // The name of the PDF file
        path: filePath, // Path to the generated PDF
      },
    ],
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("Email Sent Successfully");
    console.log(info);
  });
  res.json("Email sent successfully");
});

app.post("/updateCompletedTestField", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await connection.query(
      "UPDATE tbl_users SET has_completed_career_test = 1 WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
        } else {
          console.log("User has completed the career test.");
        }
      }
    );
    res.status(200).json({ message: "User has completed the career test." });
  } catch (error) {
    console.error("Error in updateCompletedTestField:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/checkout", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;
  console.log(email);

  connection.query(
    `SELECT has_completed_career_test FROM tbl_users WHERE id = ?`,
    [userId],
    async (err, result) => {
      if (result[0].has_completed_career_test === 0) {
        return res.status(403).json({
          message: "Please complete the Career Test before making a payment.",
        });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          success_url: `http://localhost:5173/success`,
          line_items: [
            {
              price_data: {
                currency: "cad",
                product_data: { name: "Career Assessment" },
                unit_amount: 999,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          customer_email: email,
        });

        console.log(session);

        return res.json({ url: session.url });
      } catch (err) {
        console.error("Error creating checkout session:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );
});

app.post("/updateIsPaidField", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  connection.query(
    `UPDATE tbl_users SET is_paid = 1 WHERE id = ?`,
    [userId],
    (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating user payment status:", updateErr);
        return res.status(500).json({
          error: "Error updating user payment status",
        });
      } else {
        console.log("User payment status updated successfully.");
        return res.status(200).json({
          success: true,
          message: "User payment status updated successfully.",
        });
      }
    }
  );
});
/*passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5173/auth/google/personality-assessment",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/personality-assessment",
  passport.authenticate("google", {
    successRedirect: "/personality-assessment",
    failureRedirect: "/login",
  })
);*/

app.listen(port, () => {
  console.log(`App listening on port, ${port}`);
});
