import express from "express";
import cors from "cors";
import env from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import mysql from "mysql";
import session from "express-session";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Stripe from "stripe";

import bodyParser from "body-parser";

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
    question: "Generates a lot of enthusiasm ",
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
    question: "Worries a lot ",
    trait: "Neuroticism",
    facet: "positive",
  },

  {
    id: 9,
    question: "Has an active imagination ",
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
    question: "Is inventive ",
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
    question: "Can be cold and aloof ",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 16,
    question: "Perseveres until the task is finished ",
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
    question: "Is sometimes shy, inhibited ",
    trait: "Extraversion",
    facet: "negative",
  },

  {
    id: 20,
    question: "Is considerate and kind to almost everyone ",
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
    question: "Prefers work that is routine ",
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
    question: "Is sometimes rude to others ",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 25,
    question: "Makes plans and follows through with them ",
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
    question: "Values artistic, aesthetic experiences ",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 29,
    question: "Is sometimes shy, inhibited ",
    trait: "Extraversion",
    facet: "negative",
  },
  {
    id: 30,
    question: "Is considerate and kind to almost everyone ",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 31,
    question: "Does things efficiently ",
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
    question: "Tends to find fault with others ",
    trait: "Agreeableness",
    facet: "negative",
  },
  {
    id: 34,
    question: "Does a thorough job ",
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
    question: "Is original, comes up with new ideas ",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 37,
    question: "Is reserved ",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 38,
    question: "Is reserved ",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 39,
    question: "Is helpful and unselfish with others ",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 40,
    question: "Can be somewhat careless ",
    trait: "Conscientiousness",
    facet: "negative",
  },
  {
    id: 41,
    question: "Is relaxed, handles stress well  ",
    trait: "Neuroticism",
    facet: "negative",
  },
  {
    id: 42,
    question: "Is curious about many different things",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 43,
    question: "Is full of energy ",
    trait: "Extraversion",
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
console.log(__dirname);
const app = express();

const port = 3000;

env.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const saltRounds = 10;
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
/*app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);*/

//app.use(passport.initialize());
//app.use(passport.session());

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
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
                const jwtSecretKey = crypto.randomBytes(32).toString("hex");
                console.log(jwtSecretKey);
                const token = jwt.sign(
                  { id: user.id, email: user.email },
                  jwtSecretKey,
                  { expiresIn: "1h" }
                );
                console.log(user);
                res.json({ result: user, authToken: token });
              } else {
                res.send("Incorrect Password");
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

app.post("/saveResults", async (req, res) => {
  const { userId, questionId, testResults, testType } = req.body;
  console.log(req.body);
  await connection.query(
    "INSERT INTO tbl_testresults(user_id,question_id, test_result, test_type) VALUES(?, ?, ?,?)",
    [userId, questionId, testResults, testType]
  );
  res.send("Added successfully");
});

app.get("/getTestResults", async (req, res) => {
  try {
    const { userId, testType } = req.query;
    console.log(userId);
    console.log(testType);
    console.log("Received userId:", userId);
    await connection.query(
      "SELECT * FROM tbl_testresults WHERE user_id = ? and test_type=?",
      [Number(userId), testType],
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
    switch (trait) {
      case "openness":
        if (percentage > 80) {
          description = `A score above 80 signifies a strong preference for intellectual exploration, creative thinking, and a willingness to embrace novel ideas and unconventional experiences. You are drawn to abstract concepts, aesthetics, and new challenges, and likely thrive in environments that reward curiosity and innovation.You may excel in careers that involve creativity, innovation, and intellectual exploration, such as UX/UI design, research, architecture, or roles in the arts and creative consulting.`;
        } else if (percentage > 60) {
          description = `A score around 60 indicates moderate openness. You enjoy new experiences and ideas but appreciate structure and practicality. You’re open-minded but may lean toward realism, preferring ideas that are both imaginative and applicable.You may excel in careers like marketing, education, product management, or business analysis, where a balance of creativity and practicality is valued.`;
        } else if (percentage > 40) {
          description = `A score around 40 suggests a preference for familiar ideas and methods. You may be pragmatic, valuing tested approaches over novelty. While capable of adapting, you feel most comfortable with clear, concrete systems.You may excel in more structured and familiar environments such as project coordination, operations management, or financial advising, where tested methods are preferred.`;
        } else if (percentage > 20) {
          description = `A score around 20 signifies a strong preference for routine, tradition, and practical outcomes. Abstract ideas or creative risks are less appealing. You prefer clarity, predictability, and step-by-step processes.You may excel in careers requiring stability and routine, like administration, law enforcement, or supply chain management.`;
        } else {
          description = `A score below 20 reflects very low openness. You strongly prefer facts over theories, stability over experimentation, and routine over exploration. You likely excel in rule-based, highly structured environments.You may excel in highly rule-bound and fact-focused careers such as auditing, banking, or compliance, where tradition and accuracy are key.`;
        }

        break;
      case "conscientiousness":
        if (percentage > 80) {
          description = `A score above 80 indicates you are highly organized, disciplined, and goal-oriented. You thrive in structured environments, plan meticulously, and are extremely reliable. You prefer clear goals, deadlines, and routines, and take pride in achieving high standards.You may excel in highly structured and demanding careers such as surgery, law, engineering, or finance, which require strong organization and reliability.`;
        } else if (percentage > 60) {
          description = `A score around 60 reflects a healthy balance between structure and flexibility. You’re dependable and efficient but not rigid. You plan ahead, stay focused, and can adapt when necessary. Ideal for roles that need responsibility without excessive rigidity.You may excel in careers like project management, marketing, or healthcare administration, where dependability and flexibility are both important.`;
        } else if (percentage > 40) {
          description = `A score around 40 suggests a casual, flexible approach to work. You’re spontaneous and adaptable, but may struggle with long-term planning or organization. You work best in dynamic, fast-changing environments without strict routines.You may excel in dynamic and flexible roles such as creative design, journalism, or event planning, which allow for spontaneity and adaptability.`;
        } else if (percentage > 20) {
          description = `With scores between 20 and 40, individuals may be more spontaneous and less concerned with order and structure. They may find it difficult to plan ahead or stay organized but often thrive in more unstructured environments.You may excel in informal or freelance careers like music, content creation, or gig work, where routine and strict schedules are less important.`;
        } else {
          description = `A score below 20 reflects very low conscientiousness. You resist external control, rules, or structure and work best when free from deadlines. Routine and discipline may feel stifling.You may excel in highly independent and unstructured creative roles such as visual arts or filmmaking.`;
        }
        break;
      case "extraversion":
        if (percentage > 80) {
          description = `A score above 80 indicates you're highly outgoing, energetic, and socially confident. You thrive in fast-paced, high-energy environments with lots of interaction and stimulation. You draw energy from others and enjoy being in the spotlight.You may excel in high-energy, social careers like sales, public relations, acting, or politics, which require outgoing and assertive interaction.`;
        } else if (percentage > 60) {
          description = `A score around 60 means you’re socially comfortable but not dependent on constant interaction. You enjoy people and conversation but also value time alone. You balance team engagement with focused work well.You may excel in socially balanced careers such as teaching, consulting, or human resources, where interaction and independent work are both valued.`;
        } else if (percentage > 40) {
          description = `A score around 40 suggests you lean toward introversion. You may enjoy social contact in small doses, but prefer working independently or in quiet environments. You're thoughtful, reflective, and tend to listen more than speak.You may excel in quieter, more introspective roles such as software development, research, or technical writing.`;
        } else if (percentage > 20) {
          description = `A score around 20 reflects strong introversion. You prefer quiet, solitary work and avoid high social demands. Large groups and noisy environments drain you. You excel in deep, focused work.You may excel in solitary and focused careers like library science, data analysis, or lab work, where limited social interaction is preferred.`;
        } else {
          description = `A score below 20 shows extreme introversion. You prefer working entirely alone, often in slow-paced, highly independent settings. Minimal interaction is ideal.You may excel in very independent, low-interaction careers such as night security, forest ranger, or solo artistic work.`;
        }
        break;
      case "agreeableness":
        if (percentage > 80) {
          description = `A score above 80 means you are deeply compassionate, empathetic, and cooperative. You’re highly attuned to others’ needs, avoid conflict, and are motivated by helping people and promoting harmony.You may excel in careers centered on helping others, like nursing, social work, teaching, or counseling.`;
        } else if (percentage > 60) {
          description = `A score around 60 suggests you are generally warm and friendly, but also able to be assertive when needed. You work well with others and are trusted, but you can set boundaries and make hard decisions when required.You may excel in roles that balance cooperation with assertiveness, such as customer service management, team leadership, or corporate training.`;
        } else if (percentage > 40) {
          description = `A score around 40 suggests a pragmatic and assertive approach to relationships. You value fairness over niceness and may challenge ideas directly. You’re more task-focused than people-pleasing.You may excel in pragmatic, task-focused careers like business consulting, logistics, or software engineering.`;
        } else if (percentage > 20) {
          description = `A score around 20 reflects low agreeableness. You are highly independent, skeptical, and assertive. You question authority and dislike being told what to do. You thrive in debate-heavy or competitive environments.You may excel in competitive, independent roles like law, entrepreneurship, trading, or intelligence analysis.`;
        } else {
          description = `A score below 20 suggests very low agreeableness. You are blunt, critical, and highly autonomous. You prefer facts over feelings and can handle conflict with ease. You’re effective in roles requiring hard truths and strategic decisions.You may excel in highly analytical and strategic careers requiring blunt honesty and independence, like litigation, security consulting, or investigative journalism.`;
        }
        break;
      case "neuroticism":
        if (percentage > 80) {
          description = ` A score above 80 suggests high emotional sensitivity. You may struggle with stress, self-doubt, or mood swings. You likely do best in supportive, low-pressure environments that allow emotional expression.You may excel in careers that allow emotional expression and sensitivity, such as art, counseling, or animal care.`;
        } else if (percentage > 60) {
          description = `A score around 60 indicates moderate emotional reactivity. You may experience stress and anxiety but can usually manage it. You benefit from structured, empathetic environments.You may excel in careers that require managing some emotional stress with support, like graphic design, customer service, or teaching.`;
        } else if (percentage > 40) {
          description = `A score around 40 reflects emotional balance. You’re calm under normal stress but may feel pressure in extreme cases. You’re stable and realistic, with a healthy level of sensitivity.You may excel in balanced roles requiring calmness and focus, such as engineering, finance, or nursing.`;
        } else if (percentage > 20) {
          description = `A score around 20 means you're emotionally stable and resilient. You handle stress calmly and recover quickly from setbacks. You work well in challenging or unpredictable environments.You may excel in high-pressure careers like emergency medicine, law, firefighting, or piloting.`;
        } else {
          description = `A score below 20 reflects exceptional emotional stability. You are nearly unshakable in the face of chaos, pressure, or crisis. You stay focused, rational, and calm when others panic.You may excel in extreme-stress or crisis leadership roles like trauma surgery, military leadership, or crisis negotiation.`;
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
        if (percentage > 80) {
          description = `A score greater than 80 indicates a highly open individual who is exceptionally creative, imaginative, and curious, often drawn to abstract concepts, art, and unconventional ideas.`;
        } else if (percentage > 60) {
          description = `Those scoring above 60 still exhibit a strong inclination toward learning and novelty but maintain a balance between practicality and curiosity.`;
        } else if (percentage > 40) {
          description = `Individuals with a score above 40 tend to be moderately open, appreciating new experiences while also valuing familiarity and structure.`;
        } else if (percentage > 20) {
          description = `If the score falls above 20 but below 40, the person may prefer routine and practicality, showing limited interest in abstract thinking or change.`;
        } else {
          description = `A score below 20 signifies a strong preference for stability and tradition, with a reluctance to embrace new ideas or unconventional experiences, favoring the familiar and concrete over novelty and abstraction.`;
        }

        break;
      case "conscientiousness":
        if (percentage > 80) {
          description = `A score greater than 80 indicates a highly conscientious individual who is organized, responsible, and efficient. They excel at managing tasks, keeping track of details, and planning ahead. They are disciplined, dependable, and goal-oriented, often striving for perfection in everything they do.`;
        } else if (percentage > 60) {
          description = `Individuals scoring above 60 are still highly organized and responsible, with a strong work ethic and attention to detail. While they may not always be perfectionists, they are typically reliable and committed to their goals.`;
        } else if (percentage > 40) {
          description = `A score above 40 indicates a moderate level of conscientiousness. These individuals are generally dependable but may struggle with organization and following through on every task. They are more flexible and spontaneous in their approach.`;
        } else if (percentage > 20) {
          description = `With scores between 20 and 40, individuals may be more spontaneous and less concerned with order and structure. They may find it difficult to plan ahead or stay organized but often thrive in more unstructured environments.`;
        } else {
          description = `A score below 20 reflects a tendency towards disorganization and lack of follow-through. These individuals are often more relaxed about their responsibilities, may procrastinate, and are less likely to focus on long-term goals. They may prefer flexibility over structure.`;
        }
        break;
      case "extraversion":
        if (percentage > 80) {
          description = `A score greater than 80 indicates a highly extroverted individual who is outgoing, energetic, and thrives in social settings. They are talkative, enjoy being the center of attention, and seek excitement and stimulation in their environment. Extraverts often feel energized when interacting with others and prefer lively, dynamic situations.`;
        } else if (percentage > 60) {
          description = `Individuals scoring above 60 are still social and energetic, but may occasionally enjoy time alone to recharge. They tend to engage in social activities and are comfortable in group settings but do not always require constant interaction to feel fulfilled.`;
        } else if (percentage > 40) {
          description = `A score above 40 reflects a more balanced approach to social interaction. These individuals are neither excessively introverted nor extroverted and enjoy socializing in moderation. They may sometimes prefer quieter, more intimate settings but are capable of engaging in larger social events when needed.`;
        } else if (percentage > 20) {
          description = `With a score between 20 and 40, individuals may prefer solitude and quiet environments. They are less likely to seek out social situations and may feel drained by prolonged social interaction. They are more introverted and comfortable with smaller, close-knit groups.`;
        } else {
          description = `A score below 20 reflects a strong preference for solitude and introspection. Individuals with this score tend to avoid large groups, enjoy spending time alone, and may feel overwhelmed or exhausted in social situations. They are highly introverted and find fulfillment in quieter, solitary activities.`;
        }
        break;
      case "agreeableness":
        if (percentage > 80) {
          description = `A score greater than 80 indicates a highly agreeable individual who is compassionate, empathetic, and cooperative. They value harmony in relationships and are typically kind, considerate, and willing to go out of their way to help others. These individuals are often seen as friendly and supportive.`;
        } else if (percentage > 60) {
          description = `Individuals scoring above 60 are generally kind, helpful, and cooperative. They are considerate of others’ feelings and try to avoid conflict, although they may occasionally assert their own views when necessary. They value positive relationships but can be more assertive when the situation calls for it.`;
        } else if (percentage > 40) {
          description = `A score above 40 reflects a moderate level of agreeableness. These individuals may be cooperative but are also more likely to stand their ground when needed. They are willing to help others but may not always go out of their way to avoid conflict or prioritize others' needs over their own.`;
        } else if (percentage > 20) {
          description = `With scores between 20 and 40, individuals may be more competitive, independent, or critical. They are less likely to prioritize others' feelings or harmony in relationships, and may not always be inclined to help others unless it benefits them directly.`;
        } else {
          description = `A score below 20 suggests low agreeableness, with individuals who may be blunt, skeptical, and less concerned with others' emotions or needs. They are more likely to challenge authority, question others’ motives, and prioritize their own interests over maintaining harmony in relationships.`;
        }
        break;
      case "neuroticism":
        if (percentage > 80) {
          description = ` A score greater than 80 indicates a highly neurotic individual who is prone to experiencing strong negative emotions such as anxiety, fear, and sadness. They may be highly sensitive to stress, easily overwhelmed by challenges, and prone to emotional instability. These individuals often worry excessively about potential problems.`;
        } else if (percentage > 60) {
          description = `Individuals scoring above 60 may experience anxiety, stress, and mood swings more frequently than others. While they may not be constantly anxious, they are more sensitive to stress and may react strongly to negative events. They are prone to occasional emotional ups and downs.`;
        } else if (percentage > 40) {
          description = `A score above 40 indicates a moderate level of neuroticism. These individuals may experience negative emotions from time to time, but they generally cope well with stress and are more emotionally stable compared to those with higher scores. They may experience anxiety in stressful situations but can usually manage it.`;
        } else if (percentage > 20) {
          description = `With scores between 20 and 40, individuals are generally emotionally stable, experiencing negative emotions less frequently and being more resilient to stress. They are able to handle challenges without becoming overly anxious or upset.`;
        } else {
          description = `A score below 20 reflects a high level of emotional stability. These individuals tend to stay calm and composed under pressure, rarely experiencing intense negative emotions. They are less likely to get anxious, stressed, or upset and are generally able to handle adversity with ease.`;
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

app.post("/updateCompletedTestField", async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log("User ID:", userId);
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

app.post("/checkout", async (req, res) => {
  const userId = req.body.userId;
  const email = req.body.email;
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

        if (session.id) {
          connection.query(
            `UPDATE tbl_users SET is_paid = 1 WHERE id = ?`,
            [userId],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating user payment status:", updateErr);
              } else {
                console.log("User payment status updated successfully.");
              }
            }
          );
        }

        return res.json({ url: session.url });
      } catch (err) {
        console.error("Error creating checkout session:", err);
        return res.status(500).json({ error: "Internal Server Error" });
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
