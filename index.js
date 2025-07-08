import express from "express";
import cors from "cors";
import env from "dotenv";
import nodemailer from "nodemailer";
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

export const careerMapping = [
  {
    name: "Software & Technology",
    traitScore: { O: 70, C: 85, E: 30, A: 50, N: 30 },
    careerDesc:
      "You excel in designing and building logical systems. Your strengths in problem-solving and precision make you well-suited for roles that demand technical thinking and innovation in the digital world.",
  },
  {
    name: "User Experience & Creative Design",
    traitScore: { O: 85, C: 65, E: 50, A: 60, N: 40 },
    careerDesc:
      "You thrive in creative environments that focus on human-centered design. Your blend of imagination and empathy suits careers where visual storytelling and usability go hand in hand.",
  },
  {
    name: "Sales & Business Development",
    traitScore: { O: 55, C: 70, E: 85, A: 65, N: 45 },
    careerDesc:
      "You’re naturally persuasive and energetic. You excel in dynamic, people-facing roles that involve building relationships, negotiating, and driving business success.",
  },
  {
    name: "Scientific Research & Innovation",
    traitScore: { O: 90, C: 85, E: 20, A: 40, N: 30 },
    careerDesc:
      "You’re curious and analytical, often diving deep into complex problems. You enjoy careers focused on discovering new knowledge and contributing to scientific or technical advancement.",
  },
  {
    name: "Human Resources & Employee Relations",
    traitScore: { O: 60, C: 70, E: 60, A: 85, N: 35 },
    careerDesc:
      "You are supportive and organized, making you ideal for careers that involve managing people, resolving workplace issues, and fostering positive company culture.",
  },
  {
    name: "Entrepreneurship & Startups",
    traitScore: { O: 75, C: 75, E: 75, A: 45, N: 40 },
    careerDesc:
      "You’re driven by innovation and independence. You’re well-suited for paths where risk-taking, leadership, and self-motivation lead to creating and scaling new ventures.",
  },
  {
    name: "Marketing & Strategy",
    traitScore: { O: 80, C: 70, E: 65, A: 55, N: 40 },
    careerDesc:
      "You combine creativity with strategic thinking. This career path involves analyzing markets, building brand identity, and crafting persuasive messages to engage audiences.",
  },
  {
    name: "Visual Arts & Multimedia",
    traitScore: { O: 90, C: 60, E: 40, A: 60, N: 35 },
    careerDesc:
      "Your artistic talent and eye for aesthetics make you a strong fit for careers that involve visual storytelling, creative expression, and digital media design.",
  },
  {
    name: "Data & Analytics",
    traitScore: { O: 65, C: 80, E: 30, A: 45, N: 30 },
    careerDesc:
      "You are detail-oriented and logical. This path suits those who enjoy working with numbers and trends to support data-driven decisions and strategic planning.",
  },
  {
    name: "Project & Operations Management",
    traitScore: { O: 65, C: 90, E: 55, A: 55, N: 35 },
    careerDesc:
      "You’re a natural organizer who ensures things get done efficiently. This path involves coordinating teams, meeting deadlines, and delivering successful outcomes.",
  },
  {
    name: "Education & Teaching",
    traitScore: { O: 70, C: 75, E: 70, A: 80, N: 40 },
    careerDesc:
      "You are empathetic, organized, and a clear communicator. You thrive in roles that allow you to share knowledge, support growth, and inspire others.",
  },
  {
    name: "Mental Health & Counseling",
    traitScore: { O: 85, C: 70, E: 50, A: 85, N: 30 },
    careerDesc:
      "You’re empathetic and insightful, with a strong desire to help others. Careers in this path focus on improving emotional well-being and supporting personal growth.",
  },
  {
    name: "Finance & Investment Analysis",
    traitScore: { O: 60, C: 85, E: 35, A: 50, N: 25 },
    careerDesc:
      "You are analytical and risk-aware, suited for careers that involve evaluating data and offering financial guidance to support smart investment and budgeting decisions.",
  },
  {
    name: "Corporate Law & Compliance",
    traitScore: { O: 55, C: 90, E: 60, A: 45, N: 35 },
    careerDesc:
      "You are structured and persuasive, well-suited for roles that require understanding legal frameworks, ensuring compliance, and protecting business interests.",
  },
  {
    name: "Client Relations & Customer Experience",
    traitScore: { O: 60, C: 65, E: 75, A: 80, N: 40 },
    careerDesc:
      "You’re personable and attentive, excelling in roles where building trust and maintaining positive client relationships are key to business success.",
  },
  {
    name: "Architecture & Environmental Design",
    traitScore: { O: 80, C: 80, E: 45, A: 50, N: 30 },
    careerDesc:
      "You blend creativity with structural understanding. This path is ideal for those passionate about designing functional and visually striking spaces.",
  },
  {
    name: "Media & Journalism",
    traitScore: { O: 85, C: 70, E: 70, A: 55, N: 40 },
    careerDesc:
      "You are inquisitive and articulate, thriving in roles that involve storytelling, investigation, and keeping the public informed through diverse media platforms.",
  },
  {
    name: "Therapy & Rehabilitation",
    traitScore: { O: 65, C: 75, E: 55, A: 90, N: 30 },
    careerDesc:
      "You are nurturing and practical, ideal for paths that focus on helping individuals regain independence and improve their daily quality of life.",
  },
  {
    name: "Event & Experience Planning",
    traitScore: { O: 60, C: 70, E: 85, A: 65, N: 45 },
    careerDesc:
      "You’re detail-oriented and socially confident. This path fits those who enjoy organizing, coordinating, and ensuring seamless and memorable experiences.",
  },
  {
    name: "Digital Marketing & Content Creation",
    traitScore: { O: 75, C: 70, E: 60, A: 60, N: 35 },
    careerDesc:
      "You thrive at the intersection of creativity and strategy. This path involves engaging audiences, building brand loyalty, and driving online growth through digital platforms.",
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create the 'pdfs' folder if it doesn't exist

const pdfFolder = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfFolder)) {
  fs.mkdirSync(pdfFolder);
}

const app = express();

const port = 3000;

env.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const saltRounds = process.env.SALTROUNDS;

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
  });
};

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: { name: req.user.name, is_paid: req.user.is_paid },
  });
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

                const userDetails = {
                  name: user.name,
                  is_paid: user.is_paid,
                };
                res.json({ result: userDetails });
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
    if (isPaid === 1 && testType === "Career Test") {
      await connection.query(
        "SELECT * FROM tbl_testresults WHERE user_id = ? and test_type=?",
        [userId, testType],
        (err, result) => {
          if (result.length > 0) {
            const row = result[0];
            const resultDetails = {
              question_id: row.question_id,
              test_result: row.test_result,
            };
            if (err) {
              console.error("Error comparing passwords:", err);
            } else {
              if (result) {
                res.json({ result: resultDetails });
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
            const resultDetails = {
              question_id: row.question_id,
              test_result: row.test_result,
            };
            if (err) {
              console.error("Error comparing passwords:", err);
            } else {
              if (result) {
                res.json({ result: resultDetails });
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

    return {
      score: percentage,
      desc: generateDescription(percentage, trait),
    };
  }

  function generateDescription(percentage, trait) {
    let description = "";
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
            "career-descriptions/extraversion-40.html"
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

  const userTraitResults = {
    O: opennessScore.score,
    C: conscientiousnessScore.score,
    E: extraversionScore.score,
    A: agreeablenessScore.score,
    N: neuroticismScore.score,
  };

  const bestCareer = getCareerSuggestion(userTraitResults, careerMapping);

  function getCareerSuggestion(userTraitResults, careerMapping) {
    let traitArr = [];
    careerMapping.forEach((career) => {
      const totalDifference = calculateDifference(
        userTraitResults,
        career.traitScore
      );
      traitArr.push(totalDifference);
    });

    const minimumTraitScore = Math.min(...traitArr);
    const indexOfTraitScore = traitArr.indexOf(minimumTraitScore);
    const bestCareer = careerMapping[indexOfTraitScore];

    return bestCareer;
  }

  function calculateDifference(userTraitResults, careerMappingTraits) {
    let totalDifferenceScore = 0;
    for (let trait in userTraitResults) {
      totalDifferenceScore += Math.abs(
        userTraitResults[trait] - careerMappingTraits[trait]
      );
    }
    return totalDifferenceScore;
  }

  res.json({
    message: "PDF generated and saved successfully.",
    openness: opennessScore,
    conscientiousness: conscientiousnessScore,
    extraversion: extraversionScore,
    agreeableness: agreeablenessScore,
    neuroticism: neuroticismScore,
    bestCareer: bestCareer,
  });
});

app.get("/calculateScore", (req, res) => {
  const { id, result } = req.query;
  const questionIds = id ? id.split(",").map(Number) : []; // Split by commas if `id` is a comma-separated string
  const selectedValues = result ? result.split(",") : [];

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
    let templatePath = "";
    switch (trait) {
      case "openness":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/openness-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
          //description = `A score above 80 signifies a strong preference for intellectual exploration, creative thinking, and a willingness to embrace novel ideas and unconventional experiences. You are drawn to abstract concepts, aesthetics, and new challenges, and likely thrive in environments that reward curiosity and innovation.You may excel in careers that involve creativity, innovation, and intellectual exploration, such as UX/UI design, research, architecture, or roles in the arts and creative consulting.`;
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/openness-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/openness-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/openness-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/openness-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }

        break;
      case "conscientiousness":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/c-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/c-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/c-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/c-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/c-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      case "extraversion":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/e-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/e-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/e-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/e-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/e-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      case "agreeableness":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/a-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/a-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/a-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/a-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(__dirname, "career-descriptions/a-10.html");
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      case "neuroticism":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/n-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/n-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/n-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/n-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/n-10.html"
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
  /*const doc = new PDFDocument();
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
  });*/

  res.json({
    message: "PDF generated and saved successfully.",
    openness: opennessScore,
    conscientiousness: conscientiousnessScore,
    extraversion: extraversionScore,
    agreeableness: agreeablenessScore,
    neuroticism: neuroticismScore,
  });
});

app.post("/sendResultsAsEmail", (req, res) => {
  const { email, result } = req.body;
  // Define PDF name and path
  const pdfName = result.fileName;
  const filePath = path.join(__dirname, "pdfs", pdfName);

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
