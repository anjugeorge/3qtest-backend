import express from "express";
import cors from "cors";
import env from "dotenv";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs, { unlink } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { type } from "os";
import { htmlToText } from "html-to-text";
import multer from "multer";
import { title } from "process";

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
    question: "Remains calm in tense situations",
    trait: "Neuroticism",
    facet: "negative",
  },
  {
    id: 27,
    question: "Prefers variety to routine",
    trait: "Openness",
    facet: "positive",
  },
  {
    id: 28,
    question: "Is full of life and vigor",
    trait: "Extraversion",
    facet: "positive",
  },
  {
    id: 29,
    question: "Is respectful, treats others with courtesy",
    trait: "Agreeableness",
    facet: "positive",
  },
  {
    id: 30,
    question: "Tends to be methodical and organized",
    trait: "Conscientiousness",
    facet: "positive",
  },
  {
    id: 31,
    question: "Gets nervous easily",
    trait: "Neuroticism",
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
    facet: "negative",
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

/*export const CareerQuestions = [
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
];*/

export const CareerQuestions = [
  // Realistic - 6 questions
  { id: 1, question: "I like to work on cars or machinery", type: "Realistic" },
  {
    id: 2,
    question: "I like building or assembling things",
    type: "Realistic",
  },
  { id: 3, question: "I enjoy working outdoors", type: "Realistic" },
  { id: 4, question: "I like to repair or fix things", type: "Realistic" },
  {
    id: 5,
    question: "I enjoy working with tools or equipment",
    type: "Realistic",
  },
  {
    id: 6,
    question: "I am a practical person who likes hands-on work",
    type: "Realistic",
  },

  // Investigative - 6 questions
  {
    id: 7,
    question: "I like to do puzzles or brainteasers",
    type: "Investigative",
  },
  {
    id: 8,
    question: "I enjoy solving complex problems",
    type: "Investigative",
  },
  {
    id: 9,
    question: "I like to analyze things logically",
    type: "Investigative",
  },
  {
    id: 10,
    question: "I enjoy studying science or technical subjects",
    type: "Investigative",
  },
  {
    id: 11,
    question: "I am curious about how things work",
    type: "Investigative",
  },
  {
    id: 12,
    question: "I enjoy researching and gathering information",
    type: "Investigative",
  },

  // Artistic - 6 questions
  {
    id: 13,
    question: "I like drawing, painting, or creating art",
    type: "Artistic",
  },
  {
    id: 14,
    question: "I enjoy creative writing or storytelling",
    type: "Artistic",
  },
  {
    id: 15,
    question: "I like music, singing, or playing instruments",
    type: "Artistic",
  },
  {
    id: 16,
    question: "I enjoy performing in plays or other performances",
    type: "Artistic",
  },
  {
    id: 17,
    question: "I like exploring new artistic techniques or styles",
    type: "Artistic",
  },
  { id: 18, question: "I enjoy expressing ideas creatively", type: "Artistic" },

  // Social - 6 questions
  { id: 19, question: "I like helping or teaching people", type: "Social" },
  { id: 20, question: "I enjoy working in teams or groups", type: "Social" },
  {
    id: 21,
    question: "I am interested in counseling or guiding others",
    type: "Social",
  },
  { id: 22, question: "I like volunteering to help people", type: "Social" },
  {
    id: 23,
    question: "I enjoy organizing social events or activities",
    type: "Social",
  },
  {
    id: 24,
    question: "I am empathetic and good at understanding others",
    type: "Social",
  },

  // Enterprising - 6 questions
  {
    id: 25,
    question: "I like leading or influencing people",
    type: "Enterprising",
  },
  {
    id: 26,
    question: "I enjoy starting projects or businesses",
    type: "Enterprising",
  },
  {
    id: 27,
    question: "I am ambitious and set goals for myself",
    type: "Enterprising",
  },
  {
    id: 28,
    question: "I like persuading others or selling ideas",
    type: "Enterprising",
  },
  {
    id: 29,
    question: "I enjoy taking risks to achieve success",
    type: "Enterprising",
  },
  {
    id: 30,
    question: "I am confident in decision-making and leadership",
    type: "Enterprising",
  },

  // Conventional - 6 questions
  {
    id: 31,
    question: "I like organizing files, data, or records",
    type: "Conventional",
  },
  {
    id: 32,
    question: "I enjoy working with numbers or spreadsheets",
    type: "Conventional",
  },
  {
    id: 33,
    question: "I prefer structured, routine tasks",
    type: "Conventional",
  },
  {
    id: 34,
    question: "I like following clear instructions",
    type: "Conventional",
  },
  {
    id: 35,
    question: "I pay attention to details and accuracy",
    type: "Conventional",
  },
  {
    id: 36,
    question: "I am comfortable with administrative or clerical work",
    type: "Conventional",
  },
];

/*export const careerMapping = [
  {
    name: "Technology & Engineering",
    fieldOfStudy: "Computer Science, Information Technology & Engineering",
    career:
      "Software development, systems architecture, cloud computing, AI/ML engineering, cybersecurity, data engineering, DevOps",
    traitScore: { O: 70, C: 85, E: 30, A: 50, N: 30 },
    careerDesc:
      "Individuals with high Conscientiousness and Openness excel in Technology & Engineering. Your analytical thinking, logical reasoning, and meticulous attention to detail make you well-suited for designing, implementing, and optimizing technical systems. Lower Extraversion indicates you may prefer independent problem-solving or small, focused teams rather than highly social roles. Moderate Agreeableness helps in collaborating on technical projects without being over-accommodating, while low Neuroticism supports calm and methodical handling of complex technical challenges.",
    actionPlan: [
      "1. Explore Courses & Skills: Take advanced programming courses (Python, Java, C++), study cloud computing platforms (AWS, Azure, GCP), learn AI/ML fundamentals, cybersecurity practices, systems design, and DevOps methodologies.",
      "2. Practical Experience: Build personal projects, contribute to open-source software, participate in internships or co-op programs, and engage in hackathons and coding competitions.",
      "3. Networking & Mentorship: Join professional networks such as IEEE, ACM, and local tech meetups; seek mentorship from experienced engineers; attend workshops and conferences on emerging technologies.",
      "4. Continuous Learning & Tracking: Keep up-to-date with new programming languages, frameworks, and tools; maintain a portfolio of completed projects; participate in coding challenges and tech certifications.",
    ],
    todayRelevance:
      "Tech and engineering skills are in high demand due to rapid digital transformation. Roles in software development, cloud architecture, AI, cybersecurity, and data management are critical across sectors such as IT, finance, healthcare, and manufacturing.",
    futureRelevance:
      "Automation, artificial intelligence, cybersecurity, and emerging technologies will increase demand for skilled engineers. Long-term opportunities include technical leadership, R&D, innovation management, and global technology projects. Professionals with strong analytical, problem-solving, and technical skills will remain highly sought-after.",
  },

  {
    name: "Design & Creative Arts",
    fieldOfStudy: "Visual Arts, Design, Multimedia & Human-Centered Design",
    career:
      "Graphic design, UX/UI design, multimedia production, animation, creative content strategy, AR/VR design",
    traitScore: { O: 85, C: 65, E: 50, A: 60, N: 40 },
    careerDesc:
      "Individuals with high Openness and moderate Conscientiousness excel in Design & Creative Arts. Your strong imagination, curiosity, and artistic sensibility allow you to generate innovative concepts and visual storytelling. Moderate Extraversion supports collaboration in creative teams, while moderate Agreeableness helps in balancing feedback and maintaining client relationships. Slightly higher Neuroticism may contribute to emotional sensitivity, often enhancing empathy in user-centered design.",
    actionPlan: [
      `1. Explore Courses & Skills: Study design principles, typography, UX/UI, Adobe Creative Suite, Figma, motion graphics, animation, and 2D/3D modeling.
      \n2. Practical Experience: Build personal projects, freelance for clients, participate in internships at creative agencies, or contribute to open-source design platforms.
      \n3. Networking & Mentorship: Join professional design communities, attend creative workshops and webinars, follow industry leaders, and seek mentorship opportunities.
    \n4. Continuous Portfolio Development: Maintain a diverse portfolio demonstrating different styles, tools, and design problem-solving abilities; regularly seek feedback to improve.`,
    ],
    todayRelevance:
      "Design and creative arts are crucial for brand identity, UX/UI, digital media, and marketing campaigns in the current digital and multimedia-driven economy.",
    futureRelevance:
      "With emerging technologies like AR/VR, immersive media, and AI-assisted design, creative professionals with strong visual and conceptual skills will continue to be in high demand across multiple industries.",
  },
  {
    name: "Business & Management",
    fieldOfStudy:
      "Business Administration, Management, Leadership & Strategic Studies",
    career:
      "Team leadership, operations management, project coordination, business strategy, organizational development",
    traitScore: { O: 55, C: 70, E: 85, A: 65, N: 45 },
    careerDesc:
      "Individuals with high Extraversion and moderate Conscientiousness excel in Business & Management. Your energy, sociability, and persuasive skills enable effective leadership, team collaboration, and relationship-building. Moderate Agreeableness supports negotiation and conflict resolution, while moderate Neuroticism can enhance sensitivity to team dynamics and risk awareness. Openness supports practical problem-solving and adaptability in dynamic business environments.",
    actionPlan: [
      "1. Explore Courses & Skills: Study business administration, project management, organizational behavior, leadership, strategy, operations, and financial fundamentals.",
      "2. Practical Experience: Engage in internships, co-op programs, case competitions, or lead volunteer and community projects to develop management skills.",
      "3. Networking & Mentorship: Join business associations, attend seminars, webinars, and industry conferences, and seek mentorship from experienced professionals.",
      "4. Continuous Evaluation: Regularly assess leadership effectiveness, project outcomes, team performance, and refine strategic planning skills.",
    ],
    todayRelevance:
      "Strong managers and business leaders are essential today as organizations face competitive markets, technological disruption, and rapidly changing consumer demands.",
    futureRelevance:
      "As global markets expand and digital transformation accelerates, expertise in business management, strategic leadership, and organizational development will remain highly valuable and in demand.",
  },
  {
    name: "Science & Research",
    fieldOfStudy: "Natural Sciences, Applied Sciences, Research & Innovation",
    career:
      "Scientific research, laboratory experimentation, data analysis, technological innovation, academic inquiry",
    traitScore: { O: 90, C: 85, E: 20, A: 40, N: 30 },
    careerDesc:
      "Individuals high in Openness and Conscientiousness excel in Science & Research. Your curiosity, analytical thinking, and precision make you adept at exploring complex problems, designing experiments, and contributing to scientific advancements. Low Extraversion suits independent and focused work, while moderate Agreeableness and Neuroticism support attention to detail and critical evaluation.",
    actionPlan: [
      "1. Explore Courses & Skills: Study scientific methodology, data analysis, laboratory techniques, programming for research (Python/R/Matlab), and domain-specific knowledge.",
      "2. Practical Experience: Participate in research internships, lab assistant roles, academic projects, or independent experiments.",
      "3. Networking & Mentorship: Attend conferences, workshops, webinars, join professional associations, and collaborate with researchers.",
      "4. Continuous Evaluation: Document experiments, publish findings, maintain a research portfolio, and stay updated with emerging scientific trends.",
    ],
    todayRelevance:
      "Scientific research is critical today for driving innovation in healthcare, technology, environmental studies, and policy-making, influencing global progress.",
    futureRelevance:
      "As technological complexity and global challenges increase, demand for interdisciplinary research, innovation in AI, biotechnology, environmental science, and advanced scientific problem-solving will grow substantially.",
  },
  {
    name: "Business Innovation & Leadership",
    fieldOfStudy: "Entrepreneurship, Business Strategy, Innovation Management",
    career:
      "Entrepreneurship, startup leadership, innovation strategy, business development",
    traitScore: { O: 75, C: 75, E: 75, A: 45, N: 40 },
    careerDesc:
      "High Openness and Extraversion, combined with Conscientiousness, suit innovation and leadership roles. You are driven by creativity, independent thinking, and risk-taking, ideal for founding businesses or leading strategic initiatives.",
    actionPlan: [
      "1. Explore Courses & Skills: Study entrepreneurship, business strategy, leadership, innovation management, and financial planning.",
      "2. Practical Experience: Launch small projects, participate in startup accelerators, or take internships in innovation-driven firms.",
      "3. Networking & Mentorship: Engage with entrepreneurs, attend innovation summits, join startup communities, and find mentors.",
      "4. Continuous Evaluation: Track business outcomes, refine strategies, and develop a personal portfolio of ventures.",
    ],
    todayRelevance:
      "Business innovation drives competitive advantage, product development, and growth in rapidly changing markets.",
    futureRelevance:
      "As global markets evolve, demand for entrepreneurial leaders and innovation specialists will expand across sectors.",
  },
  {
    name: "Social Sciences & Organizational Studies",
    fieldOfStudy:
      "Sociology, Human Resources, Organizational Behavior, Management Studies",
    career:
      "HR management, organizational development, workplace consultancy, policy planning",
    traitScore: { O: 60, C: 70, E: 60, A: 85, N: 35 },
    careerDesc:
      "High Agreeableness, moderate Conscientiousness and Extraversion suit roles that focus on human interactions, teamwork, and organizational well-being. You excel in fostering positive work environments, mediating conflicts, and improving organizational efficiency.",
    actionPlan: [
      "1. Explore Courses & Skills: Study organizational behavior, HR management, sociology, communication, and leadership.",
      "2. Practical Experience: Engage in HR internships, organizational consultancy projects, or volunteer for community development.",
      "3. Networking & Mentorship: Connect with HR and social science professionals, attend seminars, and seek mentorship.",
      "4. Continuous Evaluation: Track organizational performance, team engagement metrics, and implement improvement strategies.",
    ],
    todayRelevance:
      "Organizations rely on professionals who can manage talent, improve culture, and ensure productive workplaces.",
    futureRelevance:
      "As workplaces become more diverse and globalized, demand for organizational experts and social science professionals will increase.",
  },
  {
    name: "Education & Teaching",
    fieldOfStudy:
      "Education, Pedagogy, Curriculum Development, Instructional Design",
    career:
      "Teaching, curriculum design, educational consulting, e-learning development",
    traitScore: { O: 70, C: 75, E: 70, A: 80, N: 40 },
    careerDesc:
      "High Agreeableness, Extraversion, and Conscientiousness suit education careers. You are empathetic, organized, and effective in communicating knowledge, inspiring learners, and supporting personal growth.",
    actionPlan: [
      `1. Explore Courses & Skills: Study pedagogy, curriculum development, educational technology, and classroom management.
      \n2. Practical Experience: Undertake teaching internships, volunteer for educational programs, or develop e-learning content.
      \n3. Networking & Mentorship: Join teaching associations, attend workshops, and connect with experienced educators.
      \n4. Continuous Evaluation: Reflect on teaching practices, gather student feedback, and improve instructional methods.`,
    ],
    todayRelevance:
      "Education is foundational to societal development, workforce readiness, and knowledge dissemination.",
    futureRelevance:
      "Demand for skilled educators will continue to grow, including opportunities in e-learning, digital instruction, and lifelong learning platforms.",
  },
  {
    name: "Psychology, Counseling & Social Work",
    fieldOfStudy: "Psychology, Counseling, Social Work, Mental Health Studies",
    career:
      "Counseling, clinical psychology, therapy, social work, mental health advocacy",
    traitScore: { O: 85, C: 70, E: 50, A: 85, N: 30 },
    careerDesc:
      "High Agreeableness, Openness, and moderate Extraversion suit careers in counseling and social support. You are empathetic, insightful, and motivated to help others improve mental and emotional well-being.",
    actionPlan: [
      "1. Explore Courses & Skills: Study psychology, counseling techniques, social work, mental health practices, and research methods.",
      "2. Practical Experience: Intern in clinics, counseling centers, hospitals, or community organizations.",
      "3. Networking & Mentorship: Join psychology and social work associations, attend workshops, and seek guidance from professionals.",
      "4. Continuous Evaluation: Track client outcomes, stay updated with therapy techniques, and maintain ethical practice standards.",
    ],
    todayRelevance:
      "Mental health and social support are increasingly recognized as critical for personal, societal, and workplace well-being.",
    futureRelevance:
      "As awareness grows, demand for psychologists, counselors, and social workers is expected to rise globally, especially in digital therapy and community services.",
  },
  {
    name: "Finance, Economics & Investment",
    fieldOfStudy: "Finance, Economics, Investment Management, Accounting",
    career:
      "Financial analysis, investment banking, portfolio management, risk assessment",
    traitScore: { O: 60, C: 85, E: 35, A: 50, N: 25 },
    careerDesc:
      "High Conscientiousness and low Neuroticism suit finance careers. You are analytical, disciplined, and detail-oriented, able to assess risks, manage investments, and make informed financial decisions.",
    actionPlan: [
      "1. Explore Courses & Skills: Study finance, accounting, economics, investment analysis, and financial modeling.",
      "2. Practical Experience: Intern at banks, investment firms, or financial consultancies; manage small portfolios or simulation projects.",
      "3. Networking & Mentorship: Connect with finance professionals, attend workshops, and participate in professional associations.",
      "4. Continuous Evaluation: Track financial market trends, refine analytical skills, and obtain relevant certifications (CFA, CPA).",
    ],
    todayRelevance:
      "Financial expertise drives business strategy, investment planning, and economic stability in organizations and markets.",
    futureRelevance:
      "With globalization and digital finance evolution, demand for skilled financial analysts and investment specialists will grow significantly.",
  },
  {
    name: "Law, Governance & Compliance",
    fieldOfStudy: "Law, Political Science, Governance, Compliance Management",
    career:
      "Legal counsel, regulatory compliance, policy advisory, corporate governance",
    traitScore: { O: 55, C: 90, E: 60, A: 45, N: 35 },
    careerDesc:
      "High Conscientiousness and moderate Extraversion suit law and compliance roles. You are structured, detail-oriented, and persuasive, able to analyze regulations, ensure compliance, and advise organizations on governance matters.",
    actionPlan: [
      "1. Explore Courses & Skills: Study law, governance, compliance frameworks, corporate regulations, and legal writing.",
      "2. Practical Experience: Intern at law firms, compliance departments, or policy organizations.",
      "3. Networking & Mentorship: Connect with legal professionals, attend seminars, and join legal associations.",
      "4. Continuous Evaluation: Monitor legal updates, practice case studies, and refine advisory skills.",
    ],
    todayRelevance:
      "Legal expertise ensures regulatory compliance, protects organizations, and mitigates risk in complex business environments.",
    futureRelevance:
      "As governance standards and regulations evolve, demand for legal and compliance professionals will remain strong globally.",
  },
  {
    name: "Architecture, Design & Urban Planning",
    fieldOfStudy:
      "Architecture, Urban Planning, Interior Design, Landscape Design",
    career:
      "Architectural design, urban planning, landscape architecture, interior design",
    traitScore: { O: 80, C: 80, E: 45, A: 50, N: 30 },
    careerDesc:
      "High Openness and Conscientiousness suit architecture and planning roles. You combine creativity with structural understanding to design functional, sustainable, and aesthetically pleasing spaces.",
    actionPlan: [
      "1. Explore Courses & Skills: Study architecture, urban planning, CAD software, sustainable design, and landscape architecture.",
      "2. Practical Experience: Intern in architectural firms, participate in design projects, or contribute to urban development initiatives.",
      "3. Networking & Mentorship: Connect with architects and planners, attend design expos, and seek professional guidance.",
      "4. Continuous Evaluation: Develop project portfolios, refine design solutions, and stay updated with modern architectural trends.",
    ],
    todayRelevance:
      "Urbanization and sustainable development create a demand for architects and planners who balance creativity with functionality.",
    futureRelevance:
      "Future cities and infrastructures will require innovative designers and planners to address environmental, social, and technological challenges.",
  },
  {
    name: "Event Management & Hospitality",
    fieldOfStudy:
      "Hospitality Management, Event Planning, Tourism, Customer Service",
    career:
      "Event planning, hospitality management, tourism coordination, client relations",
    traitScore: { O: 60, C: 75, E: 80, A: 70, N: 35 },
    careerDesc:
      "High Extraversion and Agreeableness suit hospitality and event management roles. You excel at organizing, coordinating, and ensuring memorable experiences for clients and guests.",
    actionPlan: [
      "1. Explore Courses & Skills: Study hospitality management, event planning, tourism, customer service, and communication.",
      "2. Practical Experience: Intern at hotels, event management companies, or tourism organizations.",
      "3. Networking & Mentorship: Connect with hospitality professionals, attend industry conferences, and find mentors.",
      "4. Continuous Evaluation: Gather client feedback, refine service quality, and manage event portfolios.",
    ],
    todayRelevance:
      "Hospitality and event management are central to tourism, corporate events, and service industries globally.",
    futureRelevance:
      "As travel, tourism, and experiential events grow, skilled professionals in this sector will continue to be in demand.",
  },
  {
    name: "Data Science & Analytics",
    fieldOfStudy: "Data Science, Statistics, Machine Learning, Big Data",
    career:
      "Data analysis, machine learning, AI modeling, business intelligence, predictive analytics",
    traitScore: { O: 85, C: 80, E: 35, A: 50, N: 30 },
    careerDesc:
      "High Openness and Conscientiousness, combined with low Extraversion, suit data science roles. You are analytical, detail-oriented, and able to extract insights from complex datasets to guide decision-making.",
    actionPlan: [
      "1. Explore Courses & Skills: Learn Python/R, SQL, machine learning, data visualization, statistics, and big data tools.",
      "2. Practical Experience: Work on projects, Kaggle competitions, internships, or data analysis for organizations.",
      "3. Networking & Mentorship: Join data science communities, attend webinars, and seek guidance from experienced analysts.",
      "4. Continuous Evaluation: Build a portfolio of analyses, track performance metrics, and stay updated with AI/analytics trends.",
    ],
    todayRelevance:
      "Data-driven decision-making is critical across industries, making data science a highly sought-after skillset.",
    futureRelevance:
      "As organizations increasingly adopt AI, predictive modeling, and big data, demand for data science professionals will expand rapidly.",
  },
  {
    name: "Healthcare & Therapy",
    fieldOfStudy:
      "Medicine, Nursing, Physiotherapy, Occupational Therapy, Public Health",
    career:
      "Healthcare provision, clinical practice, therapy, medical research, patient care",
    traitScore: { O: 65, C: 85, E: 60, A: 85, N: 35 },
    careerDesc:
      "High Agreeableness and Conscientiousness, combined with moderate Extraversion, suit healthcare roles. You are compassionate, disciplined, and able to provide high-quality patient care, manage clinical responsibilities, and support well-being.",
    actionPlan: [
      "1. Explore Courses & Skills: Study medicine, nursing, therapy practices, public health, and patient care techniques.",
      "2. Practical Experience: Intern in hospitals, clinics, therapy centers, or community health programs.",
      "3. Networking & Mentorship: Connect with healthcare professionals, join associations, and attend workshops.",
      "4. Continuous Evaluation: Track patient outcomes, update skills, and maintain certifications.",
    ],
    todayRelevance:
      "Healthcare professionals are essential for patient care, disease prevention, and public health, especially in a globally aging population.",
    futureRelevance:
      "Healthcare demand will continue to rise due to aging populations, technological advancements in medicine, and global health challenges.",
  },
];*/

export const careerMapping = [
  {
    type: "R",
    title: "The Ultimate Doer",
    typeDesc:
      "When very upset, they can feel as if their control has been taken away from them and this triggers their fight-or-flight response. This occurs even with things such as a bad grade or losing an opportunity for advancement at work.",

    careerDesc:
      "They may keep it inside and slowly build resentment against those who had caused the problem. They are known as practical and diligent workers. If they are forced to change jobs or take on a new task, it will be approached with the same efficient manner as their current job duties. Because of this, they can be very easy to work with and usually do not require supervision. They may not recognize when to stop working, until they become completely exhausted.",
    powers: [
      {
        title: "Analytical",
        desc: "You have a great taste of analysing anything and everything that could range from research data to behaviour of people. This could make you discover unexpected patterns and connections that others might miss.",
      },
      {
        title: "Original",
        desc: "You could produce incredible innovations due to your creative ideas.",
      },
      {
        title: "Open-Minded",
        desc: "You are guided by curiosity and an immense drive to learn whatever possible.",
      },
      {
        title: "Curious",
        desc: "You try to pursue new interests and hobbies with the deep desire of learning.",
      },
      {
        title: "Objective",
        desc: "You thrive to be unbiased and stand against misinformation even when it isn’t easy to do so.",
      },
    ],
    weaknesses: [
      {
        title: "Disconnected",
        desc: "You might get lost in thoughts and when switch your mind back to the current context, the conversation might have moved on. This would make you feel disconnected.",
      },
      {
        title: "Insensitive",
        desc: "At times, you might feel rationality is the primary element to a better and happier world. Hence you might become insensitive to values as emotions, compassion and tradition.",
      },
      {
        title: "Dissatisfied",
        desc: "You are always on the search of improvements and new approaches. This could be overwhelming.",
      },
      {
        title: "Impatient",
        desc: "You might feel dismissive when your conversation partner do not follow you in your expected pace.",
      },
      {
        title: "Perfectionist",
        desc: "Your quest for perfection could drive you to give up on projects that don’t match the ideal vision in your mind.",
      },
    ],
    workplaceHabits: {
      title: "Workplace Habits",
      desc: "They may become overly involved with their work to the extent that they forget or ignore important things in their life, such as family, relationships and/or personal needs. They usually see these 'distractions' only when they are forced out of their normal routine. They can get very involved in projects that interest them, especially ones that reflect their personal interests. They can get so wrapped up in these projects that they isolate themselves from others and their other obligations to the point of neglecting them. They spend a lot of time trying to perfect their work, which makes it one of their main concerns. They usually do not try to rush through it just to get it done. They are known for being very thorough workers, but can be quite demanding on themselves and others if they are not careful.",
    },
    careerPaths: {
      title: "Career Paths",
      desc: "The main and most obvious career path is the military. Although very different from one another, all social types like to be in charge or at least feel important and necessary, making them well suited for this profession. There are other professions that could be suitable as well; however, since people of this type do get bored easily, it would be best if they were allowed to keep changing jobs or departments, so as to avoid any potential problems with stagnancy. Since people of this type are very independent and do not have any issues making decisions on their own, it should come as no surprise that managerial positions would suit them just fine. However, depending on the line of business one is in, it might be a bit more difficult to find positions where one has much freedom when it comes to decision making. In these cases, they should look for positions that involve communication with people.",
    },
    seekingNewChallenges: {
      title: "Seeking New Challenges",
      desc: "The Realistic personality type is known for their practicality and efficiency when it comes to problem solving. They may solve the problem quickly, probably without emotion or thinking of future consequences. If they are unable to solve the problems they usually put them off until something happens that forces them to deal with it. They are usually very practical, logical people. When faced with a problem or even everyday situations they tend to focus on the facts rather than being subjective. They are more concerned about finding practical solutions to problems, rather than trying to understand why something happened. They have no desire for change and this can cause them some issues when forced into new experiences that require them to try something new or spend money they hadn't planned to.",
    },
    whatToImprove: {
      title: "Ways to Enhance Your Strengths",
      desc: "You need to learn to accept routine in your home lives, which will enable you to spend time with your loved ones. You need to pay more attention to your family life as you need support from your loved ones just as much as the others do. At times, they may seem quiet or distant, but that’s not true. It is best if you aren’t allowed to keep changing jobs or departments too often because this could lead to stagnation or stagnation within a field.",
    },
  },
  {
    type: "I",
    title: "The Analytical Genius",

    typeDesc:
      "They prefer working alone, so they do not have to worry about pleasing anyone but themselves. They prize their autonomy and independence highly, while also needing little encouragement or support from others because of their self-sufficiency. Investigative personalities are very efficient individuals who focus on getting things done with speed and accuracy to meet their high standards. They are very good at acquiring knowledge and information, but not so skilled in applying it practically to real-life situations or understanding how other people may need to use that information. They tend to be better at the acquisition of facts than they are at getting along with people, though they can sometimes surprise others by being highly courteous and considerate. They prefer not to draw attention to themselves and so they will usually be low-key, reserved individuals who may live quietly without much fanfare. They do not like small talk or socializing for its own sake, as it feels too time-consuming and unnecessary to them.",

    careerDesc:
      "They tend to be good listeners but can be very private and reserved, though they can also be highly blunt and outspoken on the rare occasions that they choose to express themselves. They also do not like spending too much time in social circles where they feel no new information will be forthcoming; this is because the investigative personality is essentially a learning machine that needs to constantly acquire new information. If they are not making progress in their lives or learning anything new, they can easily become bored and restless, which leads them to begin looking for more stimulating opportunities elsewhere. They may be prone to excessive shyness or social anxiety at times because of their dislike of small talk, but they can also be very friendly and helpful if others approach them on a topic that genuinely interests them. However, they do not like general chit-chat and often find it a complete waste of their time because they would rather use those moments to think about something else or acquire new information from someone who is knowledgeable in one of their favorite subjects.",

    powers: [
      {
        title: "Perfectionism",
        desc: "Perfectionism is the primary goal for you in any aspect of life. You wouldn’t mind quitting projects that don’t match your ideal vision.",
      },
      {
        title: "Honest",
        desc: "You favor managing the reality of situations with simple honesty rather than reassuring lies.",
      },
      {
        title: "Strong Willed and Dutiful",
        desc: "You are focused on your goal and determined to accomplish it.",
      },
      {
        title: "Very Responsible",
        desc: "For you, promise is primary. You would go to any extent to deliver the committed results.",
      },
      {
        title: "Calm and Practical",
        desc: "You tend to take decisions effectively rather than mixing them with emotions or empathy.",
      },
      {
        title: "Create and Enforce Order",
        desc: "You don’t tolerate anything that disrupts the integrity of established guidelines and rules.",
      },
    ],
    weaknesses: [
      {
        title: "Stubborn",
        desc: "Your factual-based decision making leads to trouble in accepting any mistake from your side.",
      },
      {
        title: "Insensitive",
        desc: "Unintentionally you might hurt others in the path of establishing honesty to be the best policy.",
      },
      {
        title: "Always by the Book",
        desc: "You are reluctant to think differently from the already set rules and regulations even if the downside is minimal.",
      },
      {
        title: "Judgmental",
        desc: "You cannot respect people who do not agree with factual statements.",
      },
    ],
    workplaceHabits: {
      title: "Workplace Habits",
      desc: "These personalities tend to work better alone, where they can focus on their tasks without interruption. They do not like having to follow orders or instructions from others, as this limits their ability to perform efficiently since someone else may have a different way of doing things that may not be as good as the way an investigative personality would have done it. They are excellent at gathering facts, especially when they are personally interested in the topic. They are usually better at problem solving than they are at team work because investigative personalities prefer to concentrate on one task or project that they can focus all of their attention on. If an investigative personality is focused on something else, it means that there may be a problem with that project or that something else has failed.",
    },
    careerPaths: {
      title: "Career Paths",
      desc: "Investigative personalities are not naturally good at team work, so professions that require teamwork do not suit them well at all. They prefer jobs where they can focus on their own tasks and perform them independently. They are not naturally good at marketing, advertising or selling their work because they are more interested in the product itself rather than its outward appearance. Hence some of the ideal jobs for this personality type are scientist, researcher, investigator, accountant, librarian, detective, intelligence analyst, historian, journalist, and computational linguist.",
    },
    seekingNewChallenges: {
      title: "Seeking New Challenges",
      desc: "Some investigative personalities are satisfied with their jobs, while others are always looking for new projects or challenges to work on. If they have been working in a field for a long time, they may begin to lose interest because the excitement of learning something new is gone. If an investigative personality feels stuck at work or believes that he or she has exhausted all of the possibilities, they may begin to look for a new opportunity elsewhere. A fresh challenge will help them to stay motivated and focused on their work. You should try and learn how to socialize and talk more with others because this can be beneficial at work and in building professional relationships. You should seek out roles that allow you to complete tasks independently, and if you work in a team, you should try and overlook your dislike of teamwork and learn how to cooperate with others who will be depending on you.",
    },
  },
  {
    type: "A",
    title: "The Master Creator",
    careerDesc:
      "Entertainers possess a strong aesthetic style. They have an eye for fashion, that could range from outfits to a well-designed home. Being inherently curious, they love to explore new styles and exhibit their personal tastes around them. They appreciate beauty and enjoy variety. They like to discover interesting and unusual people, colors, textures, and sounds. It's never difficult for Entertainers to make new friends. They have an exceptional style of keeping things moving by a combination of blunt truth and disarming openness. They sincerely care about their friends and make efforts to create group experiences that everyone would enjoy. Consequently, they also get deeply distressed by conflicts that end these relationships. With age, they improve in respecting other personality types. They tend to go too far with risky and careless behavior and try to include others along this ride. They are quite sensitive, and rejecting their pastimes can be taken personally, ending friendships abruptly. They don’t give time for being lectured.",

    typeDesc:
      "Entertainers become so focused on immediate pleasures that they neglect duties and responsibilities that make these luxuries possible. Repetitive tasks and complex analysis are not their cup of tea. They would rather rely on their close ones to achieve these tasks. Hence, it is very important for Entertainers to challenge themselves to keep track of their long-term goals. Being poor planners, they are inclined to leap at opportunities rather than planning out long-term goals. This could mean they would discover certain activities to be unaffordable for them. Credit cards, therefore, can be a great source of danger for such a personality.",
    powers: [
      {
        title: "Bold",
        desc: "They possess the courage to step out of their comfort zone and discover every possible experience.",
      },
      {
        title: "Original",
        desc: "They love to experiment with new styles, standing out from the crowd and placing tradition and expectations second.",
      },
      {
        title: "Aesthetics and Showmanship",
        desc: "Entertainers inject artistic creativity into their words and actions. Every day is a performance, and Entertainers love to put on a show.",
      },
      {
        title: "Practical",
        desc: "They prefer to put their hands to work rather than thinking about endless 'what-ifs'.",
      },
      {
        title: "Observant",
        desc: "They are champions at noticing real, tangible things and subtle changes around them.",
      },
      {
        title: "Excellent People Skills",
        desc: "For people with this personality type, happiness and satisfaction come from the time they spend with people they enjoy being around.",
      },
    ],

    weaknesses: [
      {
        title: "Sensitive",
        desc: "They can be very vulnerable to criticism and may react in unexpectedly negative ways.",
      },
      {
        title: "Conflict-Averse",
        desc: "Entertainers often avoid conflict entirely, saying or doing whatever is needed to escape uncomfortable situations.",
      },
      {
        title: "Easily Bored",
        desc: "Risky behavior, self-indulgence, and prioritizing the pleasures of the moment over long-term plans are common tendencies.",
      },
      {
        title: "Poor Long-Term Planners",
        desc: "They live in the moment and seldom plan ahead, believing that things can change anytime.",
      },
      {
        title: "Unfocused",
        desc: "Anything requiring long-term dedication and consistency can be particularly challenging for Entertainers.",
      },
    ],

    careerPaths: {
      title: "Career Paths",
      desc: "These individuals prefer working in unstructured environments where they can use their creativity and imagination. They maintain focus and enthusiasm throughout their projects and solve problems by creating something new. They value novelty above all and enjoy engaging in intellectual and philosophical discussions that offer diverse perspectives. They do not get discouraged when others oppose their ideas. Activities that engage all five senses are their favorite zone.",
    },

    workplaceHabits: {
      title: "Workplace Habits",
      desc: "Entertainers strive to make the workplace engaging and enjoyable. They easily get their team on board with practical tasks using their relaxed and social attitude. This personality type performs best in dynamic and fast-paced environments. Their success depends greatly on the degree of freedom they are given. In subordinate roles, they love implementing new ideas and dislike repetitive work, which can make them prone to quitting if they lack independence. As managers, they enjoy conceptualizing and executing new methods. Their ability to relate to others and think on their feet makes them inspiring leaders.",
    },

    idealFuture: {
      title: "Ideal Future",
      desc: "Entertainers seek excitement, stimulation, and novelty. Some suitable professions include event planner, sales representative, trip planner, or tour guide. They can also excel as counselors, social workers, personal coaches, or consultants because they genuinely enjoy interacting with people. Their strength lies in making others happy even in stressful situations. Entertainers also make great medical professionals due to their passion and resourcefulness. Their creative energy can lead to success in music, fashion, photography, and interior design. While moving through life, it's important for them to maintain focus and plan for the long term. They should avoid overindulging in momentary pleasures that may lead to bad habits. Accepting constructive feedback and addressing conflicts openly can strengthen relationships. By recognizing their weaknesses and working to improve, Entertainers can fully capture the joy and happiness life offers.",
    },
  },

  {
    type: "S",
    title: "The Heartfelt Helper",
    careerDesc:
      "There are different types of social personalities, and each has its own interests and talents. For example, famous entertainers and politicians are often extroverted types — very expressive and good at communicating. On the other hand, some famous scientists are introverts who may prefer solitude but possess great curiosity and deep intellectual passion. They earn respect for their talents, even though they are not socially active. Interestingly, many entertainers and actors also possess introverted traits.",

    typeDesc:
      "Even though people with social personalities are caring and attentive to others, they often do not form deep relationships. If someone’s interest or talent differs from theirs, they may find it difficult to understand, despite their kind-heartedness. Since their close circle is limited, relationships can sometimes become more complicated. In everyday life, they appreciate elegance and beauty. They often dress stylishly, arrange their living spaces creatively, and have excellent taste. People of this type love novelty and uniqueness and often have a good sense of humor, making them pleasant company.",
    powers: [
      {
        title: "Supportive",
        desc: "You always share your knowledge, experience, time, and energy with anyone who needs it.",
      },
      {
        title: "Reliable and Patient",
        desc: "You use a steady approach to achieve goals and ensure the highest standards are met.",
      },
      {
        title: "Imaginative and Observant",
        desc: "You perform tasks in a fascinating and inspiring fashion while noticing important details others may miss.",
      },
      {
        title: "Enthusiastic",
        desc: "You go to great lengths to make a positive difference in other people’s lives.",
      },
      {
        title: "Loyal and Hardworking",
        desc: "You develop strong emotional attachments to the ideas and organizations you work with.",
      },
    ],

    weaknesses: [
      {
        title: "Humble and Shy",
        desc: "You tend to remain quiet about your thoughts and rarely seek credit for your contributions.",
      },
      {
        title: "Take Things Too Personally",
        desc: "You sometimes struggle to separate personal feelings from professional criticism, which can affect your attitude.",
      },
      {
        title: "Repress Their Feelings",
        desc: "You are very sensitive and may suppress emotions, leading to stress and frustration.",
      },
      {
        title: "Overload Yourself",
        desc: "You push yourself to meet perfectionist standards and strong duties, often leading to burnout.",
      },
      {
        title: "Reluctant to Change",
        desc: "You value tradition and history, making it hard to adapt to new situations or ideas.",
      },
      {
        title: "Altruistic",
        desc: "You tend to help others even when your own problems remain unresolved.",
      },
    ],

    workplaceHabits: {
      title: "Workplace Habits",
      desc: "A study from the University of Tartu in Estonia found that people with social personalities are more likely to work in office environments, while solitary individuals prefer independent, creative work such as writing or research. Extroverts thrive in group-oriented tasks and enjoy collaboration, while introverts are more reserved and thoughtful when evaluating opposing ideas. Introverts also prefer private, quiet workspaces that allow for deep concentration.",
    },

    careerPaths: {
      title: "Career Paths",
      desc: "People with social personalities are often described as 'trouble shooters' because they strive to take leadership roles and succeed where others have failed. They frequently pursue careers in business, management, or politics and can make successful entrepreneurs. They consider others’ feelings when making decisions, enabling them to cooperate well in teams. Many actors and entertainers also belong to this type — they enjoy connecting with others, fostering harmony, and avoiding unnecessary attention.",
    },
  },
  {
    type: "E",
    title: "The Charismatic Leader",
    careerDesc:
      "They are very particular about how things should be done and what people should do when faced with difficult decisions. They see things from a practical and pragmatic perspective, which can make them seem harsh or unemotional when others struggle to decide. They dislike inefficiency or delays and feel frustrated when things move too slowly.",

    typeDesc:
      "These individuals have a natural drive to motivate others into action and achieve tangible results. However, they may unintentionally hurt people’s feelings by being too direct or impatient. Despite these challenges, their leadership and determination often inspire those around them to perform at their best.",
    powers: [
      {
        title: "Bold",
        desc: "You are unafraid to push boundaries and turn bold ideas into reality.",
      },
      {
        title: "Rational and Practical",
        desc: "You focus on implementing effective ideas rather than getting stuck in endless discussions.",
      },
      {
        title: "Original",
        desc: "You bring unique and creative solutions into action, setting yourself apart from others.",
      },
      {
        title: "Perceptive",
        desc: "You keenly notice changes and use your observations to connect and collaborate effectively.",
      },
      {
        title: "Direct",
        desc: "You are frank and straightforward, preferring factual discussions over vague talk.",
      },
      {
        title: "Sociable",
        desc: "You naturally build strong connections and often emerge as a confident, charismatic leader.",
      },
    ],

    weaknesses: [
      {
        title: "Insensitive",
        desc: "You prioritize logic and results over emotions, which can make it hard to express or acknowledge feelings.",
      },
      {
        title: "Impatient",
        desc: "You dislike waiting for others to match your pace or efficiency, which can create friction.",
      },
      {
        title: "Risk-prone",
        desc: "You often dive into risky or challenging situations to combat boredom or stagnation.",
      },
      {
        title: "Unstructured",
        desc: "You may ignore formal rules or expectations in your rush to get results, sometimes leading to conflict.",
      },
      {
        title: "Might Miss the Bigger Picture",
        desc: "You can get caught up perfecting details, overlooking how parts fit into the larger goal.",
      },
      {
        title: "Defiant",
        desc: "You dislike restrictions and find it difficult to thrive in rigid or highly structured environments.",
      },
    ],

    workplaceHabits: {
      title: "Workplace Habits",
      desc: "They are flexible and highly driven workers who prefer efficiency and independence. They dislike wasting time on low-quality tasks and thrive when given creative freedom. Enterprising individuals perform best with clearly defined goals and deadlines. They delegate effectively, organize time well, and handle both complex and tedious work when necessary. They prefer direct, practical communication and autonomy over micromanagement.",
    },
    seekingNewChallenges: {
      title: "Seeking New Challenges",

      desc: "These individuals constantly seek new opportunities and challenges, finding fulfillment in achieving the seemingly impossible. They are motivated by ambition and innovation, preferring to surround themselves with equally driven people. A supportive network helps them maintain balance and confidence. Without it, they may hesitate to take risks or pursue major goals.",
    },
    whatYouCouldImprove: {
      title: "Ways to Enhance Your Strengths",

      desc: "Focus on developing empathy and emotional awareness. Understand that your directness may unintentionally hurt others, and try to approach sensitive situations with care. Avoid overloading yourself with multiple goals at once — prioritize and delegate effectively. Reflect regularly through journaling to clarify your thoughts and align your goals, helping you maintain both focus and emotional balance.",
    },
  },
  {
    type: "C",
    title: "The Chief Organizer",
    careerDesc:
      "They prefer to follow their own personal interests rather than work as part of a team; they would like others to be equally committed but usually lose interest quickly, which can lead to frustration with those who don't share their enthusiasm. They will often begin things enthusiastically with high expectations of others, but will lose motivation and enthusiasm just as quickly if they don't see a similar commitment from others. They can dismiss what they don't want to do - whether that's making the bed or paying bills - by pretending it isn't their responsibility or that they are too busy doing something else at the time; this tendency can lead to them being unreliable when it comes to their commitments or responsibilities. They have a hard time accepting responsibility for tasks which are dull, unpleasant or boring and would rather pass the buck onto someone else if they can get away with it. It is difficult to rely on them in areas where commitment is needed over an extended period of time.",

    typeDesc:
      "Their creativity and imagination allows Organisers to come up with new ways of doing things, however this can make them impatient with those less inventive or creative than they are; their need for independence means they don't like to be told what to do even when it's in their best interest. Organisers will happily try out many different ways of doing something and will feel undervalued if others don't recognise their creative input. They also need a good degree of independence and autonomy to be happy, and like to do things in their own way rather than someone else's. They can seem unpredictable; while they make many plans they may not follow through with them - for instance, making detailed arrangements to see someone or do something but then changing their plans for no apparent reason. They are quite open about how they feel and may say yes to things one minute and change their mind the next if they suddenly feel differently; this can leave others confused as to what Organisers really want.",
    powers: [
      {
        title: "Receptive",
        desc: "You accept that its equally important to listen to other’s emotions",
      },
      {
        title: "Reliable",
        desc: "You will encourage and stand by other’s dreams and responsibilities",
      },
      {
        title: "Passionate",
        desc: "You always find time in pursuing your interests and hobbies amidst any hectic situation",
      },
      {
        title: "Altruistic",
        desc: "You always thrive to bring a positive change  to the society",
      },
      {
        title: "Charismatic",
        desc: "You are always focused on your goal and be an idol of determination and inspiration",
      },
    ],

    weaknesses: [
      {
        title: "Unrealistic",
        desc: "You don’t consider the practicality of correcting every wrong to right",
      },
      {
        title: "Overly Idealistic",
        desc: "You expect others also to be aware and practice of fundamental moral principles",
      },
      {
        title: "Condescending",
        desc: "You try to spread values to people but not always end up convincing",
      },
      {
        title: "Intense",
        desc: "You try to forcefully implement improvements on others which they may not agree of",
      },
      {
        title: "Overly Empathetic",
        desc: "You might become emotionally exhausted as you are so compassionate and consider others problems as your own",
      },
    ],

    careerPaths: {
      title: "Career Paths",
      desc: "The Conventional personality type enjoys structure and order in their tasks. They are often drawn to working with others, and this means they may find satisfaction in roles such as: team manager, head of staff or section chief; customer service representative; warehouse operative; bookkeeper; accountant. People with Conventional personality type tend to enjoy the active and social atmosphere of bar, club and restaurant management; human resources; event planner; marketing manager; sports or fitness instructor.",
    },

    workplaceHabits: {
      title: "Workplace Habits",
      desc: "They may not be very concerned with the quality of their work or completing a task to a high level; they will do enough to ensure that the essential requirements are fulfilled, however Organisers often make careless mistakes and don't pay attention to detail which can frustrate others who need accuracy and precision. Organisers complete tasks at a reasonable standard but don't usually go the extra mile, which can lead to frustration in others who are more exacting. The Organiser's need for freedom means they are easily distracted or interrupted when working on something; they may be able to focus for a while before their mind starts to wander onto other things. Organisers find it difficult to work on routine, mundane tasks for long periods of time, which means they may be less productive than others who are willing to commit and persevere.",
    },

    seekingNewChallenges: {
      title: "Seeking New Challenges",
      desc: "Organisers like to be in control of themselves and any situation they are in; their fear of failure or making mistakes can lead them to procrastinate, avoid new experiences or simply refuse to do something unless someone else will do it with them. As a result they may miss out on opportunities for advancement. An Organiser's need for control and independence can lead them to become frustrated with those who don't seem as driven as they are, and to miss out on opportunities by holding back from trying new things. They may also make detailed plans for the future which they will easily abandon if something more exciting turns up; this tendency can be like a 'grass is greener on the other side' approach, where Organisers jump from one thing to another never quite satisfied with what they have or are doing.",
    },
  },
];

/*export const careerMapping = [
  {
    combination: "R",
    fieldOfStudy:
      "Engineering, Industrial Design, Product Development, Architecture, Applied Sciences",
    career:
      "Engineering Designer, Product Developer, Industrial Designer, Architect, Technical Innovator, Systems Analyst, CAD Specialist",
    careerDesc:
      "RIA individuals combine practical skills (Realistic), analytical and investigative thinking (Investigative), and creativity (Artistic). They thrive in roles where hands-on problem solving meets innovative design and technical application. Typical work settings include engineering firms, design studios, research labs, and technology companies.",
    actionPlan: [
      `1. Education: Obtain degrees or certifications in engineering, design, architecture, or applied sciences
2. Skill Development: Learn CAD, prototyping, 3D modeling, materials science, and technical analysis
3. Practical Experience: Engage in internships, co-op programs, or personal projects applying technical and creative skills
4. Networking: Join professional organizations, attend conferences, and connect with mentors in engineering/design fields
5. Continuous Learning: Keep up with technological and design innovations, attend workshops, and learn new tools`,
    ],
    todayRelevance:
      "High — demand in engineering, technology, and product design industries for individuals who combine practical, investigative, and creative skills.",
    futureRelevance:
      "Growing — emerging fields like sustainable engineering, robotics, and advanced manufacturing will value RIA skills highly.",
    strengths: [
      `1. Analytical problem solving
2. Technical proficiency
3. Creativity and innovation
4. Attention to detail
5. Practical execution`,
    ],
    weaknesses: [
      `1. Perfectionism may delay project completion
2. May neglect teamwork or communication
3. Can struggle with repetitive tasks
4. Risk aversion in decision-making
5. May focus more on technical than human aspects`,
    ],
  },
  {
    combination: "RIS",
    fieldOfStudy:
      "Computer Science, Data Analysis, Research, Mathematics, Applied Sciences",
    career:
      "Data Analyst, Research Scientist, Software Engineer, Systems Analyst, Statistician",
    careerDesc:
      "RIS individuals combine practical skills (Realistic), analytical investigation (Investigative), and social awareness (Social). They excel in problem-solving roles that require technical expertise and collaborative research.",
    actionPlan: [
      `1. Education: Obtain degrees in computer science, mathematics, or applied sciences
2. Skill Development: Learn programming, statistical modeling, and data visualization
3. Practical Experience: Engage in research projects or internships
4. Networking: Join professional research groups, attend conferences
5. Continuous Learning: Stay updated with new technologies and analytical tools`,
    ],
    todayRelevance:
      "High — demand for data-driven and research-focused professionals across industries.",
    futureRelevance:
      "Growing — increasing reliance on data and analytics ensures continued relevance.",
    strengths: [
      `1. Analytical thinking
2. Problem-solving
3. Technical proficiency
4. Research and investigation
5. Collaboration`,
    ],
    weaknesses: [
      `1. May struggle with ambiguous tasks
2. Can overanalyze problems
3. Communication of complex data can be challenging
4. May focus too much on technical details
5. Risk of isolation in highly technical work`,
    ],
  },
  {
    combination: "RIE",
    fieldOfStudy:
      "Engineering, Computer Science, Robotics, Electronics, Applied Technology",
    career:
      "Robotics Engineer, Software Developer, Systems Engineer, Automation Specialist",
    careerDesc:
      "RIE individuals combine practical skills (Realistic), investigative thinking (Investigative), and creativity (Artistic). They thrive in designing, building, and implementing innovative technical solutions.",
    actionPlan: [
      `1. Education: Degrees in robotics, engineering, or computer science
2. Skill Development: Learn programming, mechanical design, electronics, and AI
3. Practical Experience: Work on projects, labs, or internships
4. Networking: Engage with professional robotics communities
5. Continuous Learning: Stay updated with emerging technologies in AI and automation`,
    ],
    todayRelevance:
      "High — growing demand in robotics, AI, and engineering applications.",
    futureRelevance:
      "High — automation and robotics are expected to expand rapidly.",
    strengths: [
      `1. Technical problem-solving
2. Creativity in design
3. Analytical thinking
4. Precision and attention to detail
5. Innovative approach`,
    ],
    weaknesses: [
      `1. May overlook social or teamwork aspects
2. Can be perfectionist
3. May focus too much on technology over user needs
4. Stress under tight deadlines
5. Over-reliance on technical tools`,
    ],
  },
  {
    combination: "RIC",
    fieldOfStudy:
      "Construction, Civil Engineering, Project Management, Architecture, Applied Sciences",
    career:
      "Civil Engineer, Construction Manager, Project Planner, Architect, Technical Consultant",
    careerDesc:
      "RIC individuals blend practical skills (Realistic), investigative thinking (Investigative), and conventional organization (Conventional). They excel in structured technical environments requiring precision, planning, and problem-solving.",
    actionPlan: [
      `1. Education: Degrees in civil engineering, construction management, or architecture
2. Skill Development: Learn project planning, CAD, and construction techniques
3. Practical Experience: Engage in internships, site visits, and practical projects
4. Networking: Join professional construction and engineering associations
5. Continuous Learning: Stay updated with industry standards, sustainability practices, and new technologies`,
    ],
    todayRelevance:
      "High — demand in infrastructure, urban development, and technical consulting.",
    futureRelevance:
      "Stable — essential technical and planning roles continue to be needed.",
    strengths: [
      `1. Practical problem-solving
2. Analytical thinking
3. Organizational skills
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid with unconventional solutions
2. May underestimate creative alternatives
3. Focus on technical may neglect human aspects
4. Stress under deadlines
5. May resist rapid changes in methods`,
    ],
  },
  {
    combination: "RAI",
    fieldOfStudy:
      "Business Management, Entrepreneurship, Marketing, Product Development, Applied Sciences",
    career:
      "Entrepreneur, Product Manager, Business Analyst, Operations Manager, Marketing Strategist",
    careerDesc:
      "RAI individuals combine practical skills (Realistic), artistic creativity (Artistic), and investigative thinking (Investigative). They excel in roles bridging practical application, innovative design, and strategic problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, management, or applied sciences
2. Skill Development: Learn business strategy, marketing, and product design
3. Practical Experience: Internships, entrepreneurial projects, or case studies
4. Networking: Connect with mentors, business communities, and industry professionals
5. Continuous Learning: Attend workshops, seminars, and stay updated with market trends`,
    ],
    todayRelevance:
      "High — demand for strategic thinkers and innovators in business and product development.",
    futureRelevance: "High — innovation-driven roles are expected to grow.",
    strengths: [
      `1. Practical problem-solving
2. Creativity and innovation
3. Strategic thinking
4. Leadership and decision-making
5. Adaptability`,
    ],
    weaknesses: [
      `1. Risk of overextension
2. May struggle with routine tasks
3. Can underestimate operational details
4. Pressure under high responsibility
5. May overlook team dynamics`,
    ],
  },
  {
    combination: "RAS",
    fieldOfStudy:
      "Healthcare, Counseling, Social Work, Nursing, Human Services",
    career:
      "Nurse, Social Worker, Counselor, Rehabilitation Specialist, Occupational Therapist",
    careerDesc:
      "RAS individuals combine practical skills (Realistic), artistic empathy (Artistic), and social awareness (Social). They excel in caring professions requiring hands-on problem-solving and strong interpersonal skills.",
    actionPlan: [
      `1. Education: Degrees in nursing, social work, counseling, or human services
2. Skill Development: Learn patient care, counseling techniques, and therapeutic methods
3. Practical Experience: Clinical internships, volunteer work, or hands-on training
4. Networking: Join professional healthcare and social service associations
5. Continuous Learning: Stay updated with healthcare best practices, therapy methods, and regulations`,
    ],
    todayRelevance:
      "High — continuous demand in healthcare, rehabilitation, and social services.",
    futureRelevance:
      "High — aging population and mental health awareness will drive demand.",
    strengths: [
      `1. Empathy and compassion
2. Practical care skills
3. Communication and interpersonal skills
4. Problem-solving in real situations
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional stress in challenging cases
2. May overcommit to helping others
3. Risk of burnout
4. Can struggle with administrative tasks
5. Balancing personal and professional life`,
    ],
  },
  {
    combination: "RAE",
    fieldOfStudy:
      "Fine Arts, Design, Performing Arts, Creative Writing, Multimedia Arts",
    career:
      "Graphic Designer, Animator, Artist, Interior Designer, Multimedia Specialist, Art Director",
    careerDesc:
      "RAE individuals combine practical skills (Realistic), artistic creativity (Artistic), and investigative curiosity (Investigative). They thrive in hands-on creative roles that require both technical execution and innovative ideas.",
    actionPlan: [
      `1. Education: Degrees or certifications in fine arts, design, or multimedia
2. Skill Development: Learn design software, animation, visual arts techniques
3. Practical Experience: Build a portfolio, work on projects, internships
4. Networking: Engage with creative communities, attend exhibitions, join professional associations
5. Continuous Learning: Keep up with new artistic trends, technologies, and techniques`,
    ],
    todayRelevance:
      "High — creative industries demand technical and artistic skills.",
    futureRelevance:
      "High — digital media and design fields continue to expand.",
    strengths: [
      `1. Creativity and artistic vision
2. Technical execution in arts
3. Innovation
4. Attention to detail
5. Adaptability to trends`,
    ],
    weaknesses: [
      `1. Can struggle with routine or repetitive work
2. May over-focus on aesthetics
3. Risk of underestimating practical constraints
4. Time management challenges
5. Sensitivity to criticism`,
    ],
  },
  {
    combination: "RAC",
    fieldOfStudy:
      "Administration, Project Management, Technical Services, Applied Sciences",
    career:
      "Project Coordinator, Technical Administrator, Operations Analyst, Office Manager",
    careerDesc:
      "RAC individuals combine practical skills (Realistic), artistic problem-solving (Artistic), and conventional organization (Conventional). They excel in structured environments requiring precision, coordination, and creativity.",
    actionPlan: [
      `1. Education: Degrees in management, administration, or applied sciences
2. Skill Development: Learn project management tools, documentation, and technical processes
3. Practical Experience: Internships, administrative projects, or practical assignments
4. Networking: Connect with professional communities in administration and operations
5. Continuous Learning: Stay updated on best practices, tools, and management trends`,
    ],
    todayRelevance:
      "High — demand for organized, detail-oriented professionals in technical and administrative roles.",
    futureRelevance:
      "Stable — essential support and coordination roles remain relevant across industries.",
    strengths: [
      `1. Organizational skills
2. Attention to detail
3. Practical problem-solving
4. Coordination and planning
5. Reliability`,
    ],
    weaknesses: [
      `1. May lack creative risk-taking
2. Can be rigid in process
3. May underestimate innovation
4. Potential stress under multitasking
5. Focus on order over flexibility`,
    ],
  },
  {
    combination: "RSI",
    fieldOfStudy:
      "Healthcare, Education, Research, Counseling, Social Sciences",
    career:
      "Research Scientist, Counselor, Therapist, Educator, Human Services Specialist",
    careerDesc:
      "RSI individuals combine realistic problem-solving (Realistic), social awareness (Social), and investigative thinking (Investigative). They excel in research, education, and applied social sciences requiring both analysis and human interaction.",
    actionPlan: [
      `1. Education: Degrees in social sciences, psychology, healthcare, or education
2. Skill Development: Learn counseling, research methods, and data analysis
3. Practical Experience: Internships, fieldwork, or applied projects
4. Networking: Join professional associations, attend workshops and seminars
5. Continuous Learning: Stay current with research, therapeutic methods, and education best practices`,
    ],
    todayRelevance:
      "High — growing need for research-based social services, counseling, and education professionals.",
    futureRelevance:
      "High — continued demand in mental health, education, and applied research.",
    strengths: [
      `1. Analytical and investigative skills
2. Empathy and social awareness
3. Problem-solving
4. Communication skills
5. Collaboration`,
    ],
    weaknesses: [
      `1. May struggle with administrative tasks
2. Can overanalyze social problems
3. Emotional strain in sensitive cases
4. Risk of burnout
5. Balancing research with applied work`,
    ],
  },
  {
    combination: "RSA",
    fieldOfStudy:
      "Healthcare, Social Work, Nursing, Rehabilitation Sciences, Human Services",
    career:
      "Nurse, Social Worker, Rehabilitation Specialist, Occupational Therapist, Counselor",
    careerDesc:
      "RSA individuals combine realistic problem-solving (Realistic), social awareness (Social), and artistic creativity (Artistic). They thrive in hands-on caring roles that require empathy, coordination, and practical solutions.",
    actionPlan: [
      `1. Education: Degrees or certifications in nursing, social work, or human services
2. Skill Development: Learn patient care, therapy methods, and interpersonal skills
3. Practical Experience: Clinical internships, volunteering, or applied projects
4. Networking: Join professional healthcare and social service organizations
5. Continuous Learning: Stay updated with healthcare techniques, therapy innovations, and regulations`,
    ],
    todayRelevance:
      "High — demand for professionals in healthcare, rehabilitation, and social services.",
    futureRelevance:
      "High — aging population and mental health awareness will continue to drive demand.",
    strengths: [
      `1. Empathy and compassion
2. Practical care skills
3. Interpersonal communication
4. Problem-solving in real situations
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in challenging cases
2. Risk of burnout
3. May overcommit to helping others
4. Can struggle with administrative tasks
5. Balancing personal and professional life`,
    ],
  },
  {
    combination: "RSE",
    fieldOfStudy:
      "Education, Counseling, Social Work, Psychology, Human Services",
    career: "Teacher, Counselor, Social Worker, Training Specialist, Educator",
    careerDesc:
      "RSE individuals combine realistic skills (Realistic), social aptitude (Social), and investigative curiosity (Investigative). They excel in roles that require practical guidance, analysis, and interpersonal interaction.",
    actionPlan: [
      `1. Education: Degrees in education, counseling, social sciences, or psychology
2. Skill Development: Learn counseling techniques, research methods, and teaching strategies
3. Practical Experience: Internships, classroom experience, or fieldwork
4. Networking: Join professional associations and attend workshops
5. Continuous Learning: Stay current with pedagogical methods and social research`,
    ],
    todayRelevance:
      "High — demand for educators, counselors, and social service professionals.",
    futureRelevance:
      "Growing — emphasis on mental health, training, and human services is increasing.",
    strengths: [
      `1. Social awareness
2. Analytical thinking
3. Practical problem-solving
4. Communication skills
5. Empathy`,
    ],
    weaknesses: [
      `1. Can overanalyze human behavior
2. Emotional strain in sensitive situations
3. Risk of burnout
4. Administrative tasks may be challenging
5. Balancing research with applied practice`,
    ],
  },
  {
    combination: "RSC",
    fieldOfStudy:
      "Healthcare, Nursing, Therapy, Social Services, Rehabilitation",
    career:
      "Nurse, Therapist, Rehabilitation Specialist, Counselor, Health Coordinator",
    careerDesc:
      "RSC individuals combine realistic skills (Realistic), social aptitude (Social), and conventional organization (Conventional). They excel in structured caring roles requiring precision, empathy, and adherence to protocols.",
    actionPlan: [
      `1. Education: Degrees in nursing, healthcare, or social services
2. Skill Development: Learn therapy techniques, patient care, and administrative skills
3. Practical Experience: Clinical internships, volunteer programs, or hands-on projects
4. Networking: Connect with professional healthcare associations
5. Continuous Learning: Stay updated with healthcare protocols, rehabilitation methods, and regulations`,
    ],
    todayRelevance:
      "High — structured healthcare and social service roles are continuously needed.",
    futureRelevance:
      "Stable — healthcare and rehabilitation demand remains strong.",
    strengths: [
      `1. Empathy and compassion
2. Organizational skills
3. Practical problem-solving
4. Attention to detail
5. Communication skills`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk of burnout
3. May underestimate creative solutions
4. Emotional strain in sensitive cases
5. Balancing care and administrative duties`,
    ],
  },
  {
    combination: "REI",
    fieldOfStudy:
      "Science, Engineering, Research, Computer Science, Applied Technology",
    career:
      "Research Scientist, Software Engineer, Data Analyst, Systems Developer, Technical Innovator",
    careerDesc:
      "REI individuals combine realistic skills (Realistic), investigative thinking (Investigative), and artistic creativity (Artistic). They excel in innovative technical and scientific roles requiring both practical implementation and creative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in science, engineering, computer science, or applied technology
2. Skill Development: Learn programming, research methods, data analysis, and design thinking
3. Practical Experience: Engage in labs, projects, or internships
4. Networking: Connect with professional and research communities
5. Continuous Learning: Keep updated with technological advancements, innovations, and emerging research`,
    ],
    todayRelevance:
      "High — demand for technically skilled and research-oriented professionals continues to grow.",
    futureRelevance:
      "High — innovation-driven roles in tech and science are expanding rapidly.",
    strengths: [
      `1. Analytical problem-solving
2. Creativity and innovation
3. Technical proficiency
4. Research skills
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can neglect teamwork
2. May over-focus on technical aspects
3. Risk of perfectionism
4. Communication of complex ideas may be challenging
5. Time management under projects`,
    ],
  },
  {
    combination: "REA",
    fieldOfStudy: "Science, Design, Research, Arts, Applied Technology",
    career:
      "Researcher, Scientific Illustrator, Technical Designer, Product Developer, Innovator",
    careerDesc:
      "REA individuals combine realistic skills (Realistic), investigative thinking (Investigative), and artistic creativity (Artistic). They thrive in roles that blend scientific analysis, technical implementation, and creative design.",
    actionPlan: [
      `1. Education: Degrees in science, applied technology, or design
2. Skill Development: Learn research methods, CAD, 3D modeling, and design principles
3. Practical Experience: Projects, internships, or lab work
4. Networking: Engage with research, design, and innovation communities
5. Continuous Learning: Keep up with emerging technologies, design trends, and research advancements`,
    ],
    todayRelevance:
      "High — multidisciplinary technical and creative skills are highly valued.",
    futureRelevance:
      "Growing — demand for innovation combining science and design is increasing.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Technical proficiency
4. Problem-solving
5. Innovation`,
    ],
    weaknesses: [
      `1. Can focus too much on technical detail
2. May struggle with routine tasks
3. Overemphasis on creativity vs practicality
4. Risk of perfectionism
5. Communication may be challenging`,
    ],
  },
  {
    combination: "RES",
    fieldOfStudy:
      "Education, Counseling, Social Sciences, Healthcare, Human Services",
    career: "Counselor, Educator, Social Worker, Therapist, Trainer",
    careerDesc:
      "RES individuals combine realistic skills (Realistic), investigative thinking (Investigative), and social awareness (Social). They excel in roles requiring practical problem-solving, human interaction, and analytical thinking.",
    actionPlan: [
      `1. Education: Degrees in social sciences, counseling, healthcare, or education
2. Skill Development: Learn research, counseling, teaching, and interpersonal techniques
3. Practical Experience: Internships, fieldwork, and applied projects
4. Networking: Join professional associations and attend seminars
5. Continuous Learning: Stay updated with research, therapeutic methods, and teaching strategies`,
    ],
    todayRelevance:
      "High — demand for professionals bridging research and social services remains strong.",
    futureRelevance:
      "High — roles combining analytical and human skills continue to grow.",
    strengths: [
      `1. Analytical skills
2. Interpersonal awareness
3. Practical problem-solving
4. Communication
5. Empathy`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive cases
2. Administrative work may be challenging
3. Risk of overcommitting
4. Can overanalyze social problems
5. Balancing research and practice`,
    ],
  },
  {
    combination: "REC",
    fieldOfStudy:
      "Engineering, Applied Sciences, Project Management, Technical Services",
    career:
      "Project Engineer, Systems Analyst, Technical Consultant, Operations Manager",
    careerDesc:
      "REC individuals combine realistic skills (Realistic), investigative thinking (Investigative), and conventional organization (Conventional). They thrive in structured technical roles requiring precision, analysis, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or management
2. Skill Development: Learn project management, technical analysis, and documentation
3. Practical Experience: Internships, projects, or applied assignments
4. Networking: Connect with professional technical and engineering communities
5. Continuous Learning: Stay updated with standards, tools, and innovations`,
    ],
    todayRelevance:
      "High — structured technical and project roles are widely needed.",
    futureRelevance:
      "Stable — demand for analytical and execution-focused professionals continues.",
    strengths: [
      `1. Analytical problem-solving
2. Organizational skills
3. Practical execution
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in methods
2. May underestimate creative alternatives
3. Risk aversion in decision-making
4. Focus on technical over human aspects
5. Stress under deadlines`,
    ],
  },
  {
    combination: "RCI",
    fieldOfStudy:
      "Construction, Civil Engineering, Architecture, Project Management, Applied Sciences",
    career: "Civil Engineer, Architect, Project Planner, Construction Manager",
    careerDesc:
      "RCI individuals combine realistic skills (Realistic), conventional organization (Conventional), and investigative thinking (Investigative). They excel in structured technical environments that require analysis, planning, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in civil engineering, architecture, or applied sciences
2. Skill Development: Learn project planning, CAD, and construction techniques
3. Practical Experience: Internships, site visits, or practical projects
4. Networking: Join professional construction and engineering associations
5. Continuous Learning: Stay updated with standards, technology, and sustainable practices`,
    ],
    todayRelevance:
      "High — demand for infrastructure and structured technical roles remains strong.",
    futureRelevance:
      "Stable — essential roles in construction and civil engineering will continue.",
    strengths: [
      `1. Practical problem-solving
2. Analytical thinking
3. Organizational skills
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in methods
2. May overlook creative solutions
3. Focus on technical may neglect human aspects
4. Stress under tight deadlines
5. Resistance to rapid change`,
    ],
  },
  {
    combination: "RCA",
    fieldOfStudy:
      "Administration, Project Management, Operations, Applied Sciences, Technical Services",
    career:
      "Project Coordinator, Operations Analyst, Technical Administrator, Office Manager",
    careerDesc:
      "RCA individuals combine realistic skills (Realistic), conventional organization (Conventional), and artistic problem-solving (Artistic). They excel in structured, organized roles requiring coordination, precision, and creative thinking within technical frameworks.",
    actionPlan: [
      `1. Education: Degrees in administration, project management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and management tools
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional management and technical communities
5. Continuous Learning: Stay updated with best practices, tools, and emerging trends`,
    ],
    todayRelevance:
      "High — organized and detail-oriented professionals are required across industries.",
    futureRelevance:
      "Stable — administrative and coordination roles will remain essential.",
    strengths: [
      `1. Organizational skills
2. Attention to detail
3. Coordination and planning
4. Practical problem-solving
5. Reliability`,
    ],
    weaknesses: [
      `1. May lack creative risk-taking
2. Can be rigid in process
3. Focus on order over flexibility
4. Potential stress under multitasking
5. May underestimate innovation`,
    ],
  },
  {
    combination: "RCS",
    fieldOfStudy:
      "Healthcare, Social Work, Rehabilitation, Nursing, Human Services",
    career:
      "Nurse, Therapist, Rehabilitation Specialist, Social Worker, Healthcare Coordinator",
    careerDesc:
      "RCS individuals combine realistic skills (Realistic), conventional organization (Conventional), and social awareness (Social). They thrive in structured helping professions requiring both practical execution and coordination in social or healthcare settings.",
    actionPlan: [
      `1. Education: Degrees or certifications in nursing, social work, or human services
2. Skill Development: Learn therapy techniques, patient care, and administrative skills
3. Practical Experience: Internships, clinical placements, or volunteer programs
4. Networking: Join professional healthcare and social service associations
5. Continuous Learning: Stay current with healthcare protocols, rehabilitation methods, and regulations`,
    ],
    todayRelevance:
      "High — structured roles in healthcare and social services are continuously in demand.",
    futureRelevance:
      "Stable — demand for organized, practical, and social skills remains steady.",
    strengths: [
      `1. Practical problem-solving
2. Organizational skills
3. Empathy and social awareness
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Emotional strain in sensitive roles
3. Risk of burnout
4. May underestimate creative solutions
5. Balancing administrative and care duties`,
    ],
  },
  {
    combination: "RCE",
    fieldOfStudy:
      "Engineering, Applied Sciences, Project Management, Technical Services",
    career:
      "Project Engineer, Systems Analyst, Technical Consultant, Operations Manager",
    careerDesc:
      "RCE individuals combine realistic skills (Realistic), conventional organization (Conventional), and investigative thinking (Investigative). They excel in structured technical roles requiring precision, analysis, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or management
2. Skill Development: Learn project management, technical analysis, and documentation
3. Practical Experience: Internships, projects, or applied assignments
4. Networking: Connect with professional technical and engineering communities
5. Continuous Learning: Stay updated with standards, tools, and innovations`,
    ],
    todayRelevance:
      "High — structured technical and project roles are widely needed.",
    futureRelevance:
      "Stable — demand for analytical and execution-focused professionals continues.",
    strengths: [
      `1. Analytical problem-solving
2. Organizational skills
3. Practical execution
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in methods
2. May underestimate creative alternatives
3. Risk aversion in decision-making
4. Focus on technical over human aspects
5. Stress under deadlines`,
    ],
  },
  {
    combination: "IRA",
    fieldOfStudy:
      "Business Administration, Marketing, Communication, Management",
    career:
      "Marketing Manager, Business Strategist, Operations Manager, Product Developer",
    careerDesc:
      "IRA individuals combine investigative thinking (Investigative), realistic skills (Realistic), and artistic creativity (Artistic). They excel in analytical and strategic roles that also require hands-on practical problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, marketing, or applied sciences
2. Skill Development: Learn data analysis, strategy, and project implementation
3. Practical Experience: Internships, case studies, or business projects
4. Networking: Connect with industry professionals and mentors
5. Continuous Learning: Stay updated with market trends, analytics tools, and strategic methods`,
    ],
    todayRelevance:
      "High — demand for analytical and practical strategic roles in business is strong.",
    futureRelevance:
      "High — strategic business skills combined with practical execution will continue to be valuable.",
    strengths: [
      `1. Analytical thinking
2. Practical problem-solving
3. Strategic vision
4. Creativity
5. Leadership`,
    ],
    weaknesses: [
      `1. May overanalyze situations
2. Can focus more on strategy than implementation
3. Risk of perfectionism
4. May overlook teamwork aspects
5. Pressure under deadlines`,
    ],
  },
  {
    combination: "IRS",
    fieldOfStudy:
      "Research, Science, Data Analysis, Social Sciences, Healthcare",
    career:
      "Research Scientist, Data Analyst, Social Researcher, Healthcare Analyst",
    careerDesc:
      "IRS individuals combine investigative thinking (Investigative), realistic skills (Realistic), and social awareness (Social). They excel in research roles requiring both technical precision and understanding of human or social factors.",
    actionPlan: [
      `1. Education: Degrees in science, research, data analysis, or social sciences
2. Skill Development: Learn research methodology, data analysis, and statistical tools
3. Practical Experience: Internships, field studies, or lab projects
4. Networking: Join research and professional associations
5. Continuous Learning: Stay current with methods, technologies, and trends in research`,
    ],
    todayRelevance:
      "High — research and data-driven roles in science and social sectors are in demand.",
    futureRelevance:
      "Growing — reliance on data and research insights will expand across industries.",
    strengths: [
      `1. Analytical skills
2. Investigative thinking
3. Practical application
4. Social awareness
5. Problem-solving`,
    ],
    weaknesses: [
      `1. Can over-focus on technical or social details
2. Risk of isolation in research
3. May struggle with communication of results
4. Stress under tight deadlines
5. May overanalyze data`,
    ],
  },
  {
    combination: "IRE",
    fieldOfStudy:
      "Science, Engineering, Research, Applied Technology, Data Analysis",
    career:
      "Research Scientist, Software Engineer, Technical Innovator, Systems Analyst",
    careerDesc:
      "IRE individuals combine investigative thinking (Investigative), realistic skills (Realistic), and artistic creativity (Artistic). They excel in technical and research roles that require both analytical rigor and innovative solutions.",
    actionPlan: [
      `1. Education: Degrees in science, engineering, or applied technology
2. Skill Development: Learn programming, research, data analysis, and creative problem-solving
3. Practical Experience: Internships, lab work, or applied projects
4. Networking: Connect with research and technical communities
5. Continuous Learning: Keep up-to-date with technological and research advancements`,
    ],
    todayRelevance:
      "High — growing demand in technology, engineering, and research industries.",
    futureRelevance:
      "High — innovation-driven roles and research positions will expand.",
    strengths: [
      `1. Analytical problem-solving
2. Creative innovation
3. Technical proficiency
4. Research skills
5. Attention to detail`,
    ],
    weaknesses: [
      `1. May overlook social or team aspects
2. Risk of over-perfectionism
3. Communication of complex ideas can be challenging
4. Can focus too heavily on technical details
5. Stress under project deadlines`,
    ],
  },
  {
    combination: "IRC",
    fieldOfStudy:
      "Engineering, Applied Sciences, Project Management, Technical Services",
    career:
      "Project Engineer, Technical Consultant, Systems Analyst, Operations Manager",
    careerDesc:
      "IRC individuals combine investigative thinking (Investigative), realistic skills (Realistic), and conventional organization (Conventional). They thrive in structured technical roles requiring analytical thinking, precision, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or management
2. Skill Development: Learn project management, documentation, and technical analysis
3. Practical Experience: Internships, applied projects, or co-op programs
4. Networking: Engage with professional communities and associations
5. Continuous Learning: Stay current with technical standards, tools, and innovations`,
    ],
    todayRelevance:
      "High — structured technical roles are in demand across industries.",
    futureRelevance:
      "Stable — demand for analytical and execution-focused professionals continues.",
    strengths: [
      `1. Analytical problem-solving
2. Organizational skills
3. Technical proficiency
4. Practical execution
5. Attention to detail`,
    ],
    weaknesses: [
      `1. May be rigid in approach
2. Can underestimate creative solutions
3. Risk aversion in decision-making
4. Focus on technical aspects over human factors
5. Stress under tight deadlines`,
    ],
  },
  {
    combination: "IAR",
    fieldOfStudy: "Arts, Design, Communication, Business, Marketing",
    career:
      "Graphic Designer, Marketing Strategist, Product Designer, Art Director",
    careerDesc:
      "IAR individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and realistic application (Realistic). They excel in creative roles requiring both practical execution and innovative design.",
    actionPlan: [
      `1. Education: Degrees in arts, design, or marketing
2. Skill Development: Learn design software, creative problem-solving, and project execution
3. Practical Experience: Build a portfolio, internships, or applied projects
4. Networking: Join creative communities and industry associations
5. Continuous Learning: Keep updated with trends, technologies, and best practices in design`,
    ],
    todayRelevance:
      "High — demand for creative professionals with practical execution skills remains strong.",
    futureRelevance:
      "Growing — digital media and design industries continue to expand.",
    strengths: [
      `1. Creativity and artistic vision
2. Analytical thinking
3. Practical problem-solving
4. Innovation
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can struggle with routine tasks
2. May over-focus on aesthetics
3. Risk of perfectionism
4. Time management challenges
5. Sensitivity to criticism`,
    ],
  },
  {
    combination: "IAS",
    fieldOfStudy:
      "Healthcare, Counseling, Social Work, Education, Human Services",
    career: "Counselor, Social Worker, Nurse, Educator, Therapist",
    careerDesc:
      "IAS individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and social awareness (Social). They excel in roles requiring empathy, creative problem-solving, and interpersonal interaction.",
    actionPlan: [
      `1. Education: Degrees in social sciences, counseling, healthcare, or education
2. Skill Development: Learn therapy, counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical work, or applied projects
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with techniques, best practices, and research`,
    ],
    todayRelevance:
      "High — demand for healthcare, counseling, and education professionals is strong.",
    futureRelevance:
      "High — continued need for human-centric services and creative problem-solving.",
    strengths: [
      `1. Empathy and compassion
2. Creativity in problem-solving
3. Interpersonal communication
4. Analytical thinking
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in challenging cases
2. Risk of burnout
3. May overcommit to helping others
4. Administrative tasks can be challenging
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "IAE",
    fieldOfStudy: "Arts, Design, Research, Multimedia, Applied Technology",
    career:
      "Graphic Designer, Animator, Technical Artist, Multimedia Specialist, Product Designer",
    careerDesc:
      "IAE individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and exploratory problem-solving (Explorative/Realistic). They thrive in roles blending technical, artistic, and research skills.",
    actionPlan: [
      `1. Education: Degrees in arts, multimedia, or applied technology
2. Skill Development: Learn design software, animation, 3D modeling, and technical art skills
3. Practical Experience: Build portfolio, work on projects or internships
4. Networking: Join creative and technical communities
5. Continuous Learning: Keep updated with tools, trends, and techniques`,
    ],
    todayRelevance:
      "High — creative and technical roles in media and design are in demand.",
    futureRelevance:
      "Growing — digital and multimedia industries continue to expand.",
    strengths: [
      `1. Creativity and artistic vision
2. Technical proficiency
3. Analytical thinking
4. Innovation
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can over-focus on aesthetics
2. Time management challenges
3. Risk of perfectionism
4. May struggle with repetitive tasks
5. Sensitivity to criticism`,
    ],
  },
  {
    combination: "IAC",
    fieldOfStudy:
      "Administration, Project Management, Technical Services, Business",
    career:
      "Project Coordinator, Technical Administrator, Operations Analyst, Office Manager",
    careerDesc:
      "IAC individuals combine investigative thinking (Investigative), artistic problem-solving (Artistic), and conventional organization (Conventional). They excel in structured, yet creative, administrative or technical roles requiring coordination and innovation.",
    actionPlan: [
      `1. Education: Degrees in administration, project management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and creative problem-solving
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities
5. Continuous Learning: Stay updated with management trends, tools, and innovations`,
    ],
    todayRelevance:
      "High — demand for organized professionals with creative problem-solving continues.",
    futureRelevance:
      "Stable — administrative and coordination roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Creative problem-solving
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in process
2. May underestimate innovation
3. Focus on order over flexibility
4. Stress under multitasking
5. Risk aversion`,
    ],
  },

  {
    combination: "ISR",
    fieldOfStudy:
      "Research, Data Analysis, Science, Healthcare, Social Sciences",
    career:
      "Research Analyst, Data Scientist, Clinical Researcher, Social Researcher",
    careerDesc:
      "ISR individuals combine investigative thinking (Investigative), social awareness (Social), and realistic skills (Realistic). They excel in analytical and research roles that require both data precision and understanding of human or social factors.",
    actionPlan: [
      `1. Education: Degrees in research, data analysis, science, or social sciences
2. Skill Development: Learn statistical tools, research methods, and data interpretation
3. Practical Experience: Internships, fieldwork, or lab projects
4. Networking: Join research associations and attend workshops
5. Continuous Learning: Stay current with research methodologies, technologies, and social trends`,
    ],
    todayRelevance:
      "High — demand for data-driven and research-oriented professionals remains strong.",
    futureRelevance:
      "Growing — reliance on research insights and data analysis will expand across industries.",
    strengths: [
      `1. Analytical skills
2. Investigative thinking
3. Social awareness
4. Data interpretation
5. Problem-solving`,
    ],
    weaknesses: [
      `1. May over-focus on technical or social details
2. Can risk isolation in research
3. Communication of results may be challenging
4. Stress under deadlines
5. Overanalyzing data or social situations`,
    ],
  },
  {
    combination: "ISA",
    fieldOfStudy:
      "Healthcare, Counseling, Social Work, Education, Human Services",
    career: "Counselor, Nurse, Therapist, Social Worker, Educator",
    careerDesc:
      "ISA individuals combine investigative thinking (Investigative), social awareness (Social), and artistic creativity (Artistic). They thrive in roles requiring empathy, creativity, and human-centered problem-solving.",
    actionPlan: [
      `1. Education: Degrees in social sciences, counseling, healthcare, or education
2. Skill Development: Learn therapy, counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical work, or applied projects
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with techniques, best practices, and research`,
    ],
    todayRelevance:
      "High — healthcare, counseling, and education roles are in demand.",
    futureRelevance: "High — human-centered professions will continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creative problem-solving
3. Interpersonal communication
4. Analytical thinking
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in challenging situations
2. Risk of burnout
3. May overcommit to helping others
4. Administrative tasks can be challenging
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "ISE",
    fieldOfStudy: "Education, Counseling, Social Work, Human Services",
    career: "Educator, Counselor, Trainer, Social Worker, Mentor",
    careerDesc:
      "ISE individuals combine investigative thinking (Investigative), social awareness (Social), and realistic problem-solving (Realistic). They excel in structured roles where human interaction and analytical problem-solving intersect.",
    actionPlan: [
      `1. Education: Degrees in education, counseling, or social sciences
2. Skill Development: Learn teaching strategies, counseling techniques, and practical solutions
3. Practical Experience: Internships, teaching practice, or fieldwork
4. Networking: Join professional organizations and workshops
5. Continuous Learning: Stay updated with pedagogy, research, and counseling methods`,
    ],
    todayRelevance:
      "High — roles combining education, counseling, and social services are sought after.",
    futureRelevance:
      "High — continued need for structured, analytical, and socially aware professionals.",
    strengths: [
      `1. Analytical thinking
2. Social awareness
3. Practical problem-solving
4. Communication
5. Empathy`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive cases
2. Administrative workload can be challenging
3. Overcommitment to others
4. Can overanalyze situations
5. Balancing practice and research`,
    ],
  },
  {
    combination: "ISC",
    fieldOfStudy:
      "Healthcare, Social Work, Rehabilitation, Nursing, Human Services",
    career:
      "Nurse, Therapist, Rehabilitation Specialist, Social Worker, Healthcare Coordinator",
    careerDesc:
      "ISC individuals combine investigative thinking (Investigative), social awareness (Social), and conventional organization (Conventional). They thrive in structured helping professions requiring practical execution, coordination, and empathy.",
    actionPlan: [
      `1. Education: Degrees or certifications in healthcare, nursing, or social services
2. Skill Development: Learn therapy techniques, patient care, and administrative skills
3. Practical Experience: Internships, clinical placements, or volunteer programs
4. Networking: Join professional healthcare and social service associations
5. Continuous Learning: Stay current with protocols, rehabilitation methods, and regulations`,
    ],
    todayRelevance:
      "High — structured healthcare and social services roles are continuously in demand.",
    futureRelevance:
      "Stable — demand for organized, practical, and socially skilled professionals remains strong.",
    strengths: [
      `1. Practical problem-solving
2. Organizational skills
3. Empathy and social awareness
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Emotional strain in sensitive roles
3. Risk of burnout
4. May underestimate creative solutions
5. Balancing administrative and care duties`,
    ],
  },
  {
    combination: "IER",
    fieldOfStudy: "Science, Engineering, Research, Applied Technology",
    career:
      "Research Scientist, Software Engineer, Data Analyst, Technical Innovator",
    careerDesc:
      "IER individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and realistic skills (Realistic). They excel in innovative technical and scientific roles requiring both practical application and creative solutions.",
    actionPlan: [
      `1. Education: Degrees in science, engineering, or applied technology
2. Skill Development: Learn programming, research methods, data analysis, and design thinking
3. Practical Experience: Labs, projects, or internships
4. Networking: Join research and professional communities
5. Continuous Learning: Stay updated with technological advancements, innovations, and emerging research`,
    ],
    todayRelevance:
      "High — demand for technically skilled and research-oriented professionals continues to grow.",
    futureRelevance:
      "High — innovation-driven roles in tech and science are expanding rapidly.",
    strengths: [
      `1. Analytical problem-solving
2. Creativity and innovation
3. Technical proficiency
4. Research skills
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can neglect teamwork
2. Risk of over-perfectionism
3. Communication of complex ideas may be challenging
4. Can focus too much on technical details
5. Time management under projects`,
    ],
  },
  {
    combination: "IEA",
    fieldOfStudy: "Arts, Design, Research, Multimedia",
    career:
      "Graphic Designer, Animator, Multimedia Specialist, Product Designer",
    careerDesc:
      "IEA individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and realistic problem-solving (Realistic). They thrive in roles blending creative, technical, and practical skills.",
    actionPlan: [
      `1. Education: Degrees in arts, design, or multimedia
2. Skill Development: Learn design software, animation, 3D modeling, and creative techniques
3. Practical Experience: Build portfolio, internships, or applied projects
4. Networking: Join creative and technical communities
5. Continuous Learning: Keep updated with tools, trends, and techniques`,
    ],
    todayRelevance:
      "High — creative and technical roles in media and design are in demand.",
    futureRelevance:
      "Growing — digital and multimedia industries continue to expand.",
    strengths: [
      `1. Creativity and artistic vision
2. Technical proficiency
3. Analytical thinking
4. Innovation
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can over-focus on aesthetics
2. Time management challenges
3. Risk of perfectionism
4. May struggle with repetitive tasks
5. Sensitivity to criticism`,
    ],
  },
  {
    combination: "IES",
    fieldOfStudy: "Education, Counseling, Social Work, Human Services",
    career: "Educator, Counselor, Social Worker, Mentor, Trainer",
    careerDesc:
      "IES individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and social awareness (Social). They excel in roles requiring empathy, creativity, and structured guidance.",
    actionPlan: [
      `1. Education: Degrees in education, counseling, or social sciences
2. Skill Development: Learn teaching, counseling, and interpersonal skills
3. Practical Experience: Internships, classroom practice, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with teaching methods, research, and counseling techniques`,
    ],
    todayRelevance:
      "High — demand for human-centered creative roles is strong.",
    futureRelevance:
      "High — education, counseling, and mentorship needs remain significant.",
    strengths: [
      `1. Empathy and compassion
2. Creativity in problem-solving
3. Interpersonal communication
4. Analytical thinking
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive cases
2. Risk of burnout
3. May overcommit to others
4. Administrative tasks can be challenging
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "IEC",
    fieldOfStudy: "Administration, Project Management, Technical Services",
    career:
      "Project Coordinator, Operations Analyst, Technical Administrator, Office Manager",
    careerDesc:
      "IEC individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and conventional organization (Conventional). They thrive in structured yet creative administrative or technical roles requiring coordination and problem-solving.",
    actionPlan: [
      `1. Education: Degrees in administration, project management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and creative problem-solving
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities
5. Continuous Learning: Stay updated with management trends, tools, and innovations`,
    ],
    todayRelevance:
      "High — organized professionals with creative problem-solving skills are in demand.",
    futureRelevance:
      "Stable — administrative and coordination roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Creative problem-solving
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in process
2. May underestimate innovation
3. Focus on order over flexibility
4. Stress under multitasking
5. Risk aversion`,
    ],
  },
  {
    combination: "ICR",
    fieldOfStudy:
      "Construction, Civil Engineering, Architecture, Project Management",
    career: "Civil Engineer, Architect, Project Planner, Construction Manager",
    careerDesc:
      "ICR individuals combine investigative thinking (Investigative), conventional organization (Conventional), and realistic skills (Realistic). They excel in structured technical roles that require planning, analysis, and practical implementation.",
    actionPlan: [
      `1. Education: Degrees in civil engineering, architecture, or applied sciences
2. Skill Development: Learn project planning, CAD, construction techniques
3. Practical Experience: Internships, site projects, or practical assignments
4. Networking: Join engineering and construction associations
5. Continuous Learning: Stay updated with standards, technology, and sustainable practices`,
    ],
    todayRelevance:
      "High — demand for infrastructure and technical planning roles remains strong.",
    futureRelevance:
      "Stable — essential roles in civil engineering and construction will continue.",
    strengths: [
      `1. Practical problem-solving
2. Analytical thinking
3. Organizational skills
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in methods
2. May overlook creative solutions
3. Focus on technical over human aspects
4. Stress under tight deadlines
5. Resistance to rapid change`,
    ],
  },
  {
    combination: "ICA",
    fieldOfStudy:
      "Administration, Project Management, Operations, Technical Services",
    career:
      "Project Coordinator, Operations Analyst, Technical Administrator, Office Manager",
    careerDesc:
      "ICA individuals combine investigative thinking (Investigative), conventional organization (Conventional), and artistic creativity (Artistic). They excel in structured roles requiring coordination, practical problem-solving, and innovative solutions.",
    actionPlan: [
      `1. Education: Degrees in administration, project management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and creative problem-solving
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities
5. Continuous Learning: Stay updated with management trends, tools, and innovations`,
    ],
    todayRelevance:
      "High — demand for organized and creative professionals is strong.",
    futureRelevance:
      "Stable — coordination and administration roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Creative problem-solving
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in process
2. May underestimate innovation
3. Focus on order over flexibility
4. Stress under multitasking
5. Risk aversion`,
    ],
  },
  {
    combination: "ICS",
    fieldOfStudy:
      "Healthcare, Social Work, Rehabilitation, Nursing, Human Services",
    career:
      "Nurse, Therapist, Rehabilitation Specialist, Social Worker, Healthcare Coordinator",
    careerDesc:
      "ICS individuals combine investigative thinking (Investigative), conventional organization (Conventional), and social awareness (Social). They excel in structured helping professions requiring coordination, practical execution, and empathy.",
    actionPlan: [
      `1. Education: Degrees or certifications in nursing, healthcare, or social services
2. Skill Development: Learn therapy techniques, patient care, and administrative skills
3. Practical Experience: Internships, clinical placements, or volunteer programs
4. Networking: Join professional healthcare and social service associations
5. Continuous Learning: Stay current with healthcare protocols, rehabilitation methods, and regulations`,
    ],
    todayRelevance:
      "High — structured healthcare and social services roles are continuously in demand.",
    futureRelevance:
      "Stable — demand for organized, practical, and socially skilled professionals remains strong.",
    strengths: [
      `1. Practical problem-solving
2. Organizational skills
3. Empathy and social awareness
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Emotional strain in sensitive roles
3. Risk of burnout
4. May underestimate creative solutions
5. Balancing administrative and care duties`,
    ],
  },
  {
    combination: "ICE",
    fieldOfStudy: "Engineering, Applied Sciences, Project Management",
    career:
      "Project Engineer, Technical Consultant, Systems Analyst, Operations Manager",
    careerDesc:
      "ICE individuals combine investigative thinking (Investigative), conventional organization (Conventional), and realistic skills (Realistic). They excel in structured technical roles requiring analysis, planning, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or management
2. Skill Development: Learn project management, technical documentation, and analytical tools
3. Practical Experience: Internships, applied projects, or co-op programs
4. Networking: Engage with professional technical communities
5. Continuous Learning: Stay current with standards, tools, and innovations`,
    ],
    todayRelevance:
      "High — demand for analytical and technically organized professionals remains strong.",
    futureRelevance:
      "Stable — structured technical roles will continue to be essential.",
    strengths: [
      `1. Analytical problem-solving
2. Organizational skills
3. Practical execution
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in approach
2. May overlook creative alternatives
3. Risk aversion in decision-making
4. Focus on technical aspects over human factors
5. Stress under tight deadlines`,
    ],
  },
  {
    combination: "ARI",
    fieldOfStudy: "Business, Management, Marketing, Entrepreneurship",
    career:
      "Business Strategist, Marketing Manager, Entrepreneur, Product Developer",
    careerDesc:
      "ARI individuals combine artistic creativity (Artistic), realistic problem-solving (Realistic), and investigative thinking (Investigative). They thrive in roles requiring innovation, strategy, and hands-on problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, marketing, or applied sciences
2. Skill Development: Learn data analysis, strategy, and project implementation
3. Practical Experience: Internships, case studies, or entrepreneurial projects
4. Networking: Connect with industry professionals and mentors
5. Continuous Learning: Stay updated with market trends, analytics tools, and innovative approaches`,
    ],
    todayRelevance:
      "High — demand for creative business problem-solvers is strong.",
    futureRelevance:
      "Growing — entrepreneurship and innovation-driven roles continue to expand.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Practical problem-solving
4. Strategic vision
5. Leadership`,
    ],
    weaknesses: [
      `1. May overanalyze situations
2. Can focus more on strategy than execution
3. Risk of perfectionism
4. May overlook teamwork aspects
5. Pressure under deadlines`,
    ],
  },
  {
    combination: "ARS",
    fieldOfStudy: "Arts, Communication, Social Work, Education",
    career: "Educator, Social Worker, Counselor, Designer, Mentor",
    careerDesc:
      "ARS individuals combine artistic creativity (Artistic), realistic skills (Realistic), and social awareness (Social). They excel in roles requiring human interaction, creativity, and practical problem-solving.",
    actionPlan: [
      `1. Education: Degrees in social sciences, arts, or education
2. Skill Development: Learn teaching, counseling, and creative problem-solving
3. Practical Experience: Internships, classroom practice, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, trends, and creative techniques`,
    ],
    todayRelevance:
      "High — human-centered creative and practical roles are in demand.",
    futureRelevance:
      "High — education, counseling, and social services will continue to grow.",
    strengths: [
      `1. Creativity and artistic skills
2. Practical problem-solving
3. Empathy and social awareness
4. Communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive roles
2. Risk of burnout
3. May overcommit to others
4. Administrative tasks can be challenging
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "ARE",
    fieldOfStudy: "Business, Marketing, Media, Communication",
    career: "Marketing Strategist, Advertiser, Media Planner, Content Creator",
    careerDesc:
      "ARE individuals combine artistic creativity (Artistic), realistic skills (Realistic), and investigative thinking (Investigative). They excel in business and marketing roles requiring creativity, analysis, and practical implementation.",
    actionPlan: [
      `1. Education: Degrees in business, marketing, or media
2. Skill Development: Learn marketing analytics, strategy, and content creation
3. Practical Experience: Internships, campaigns, or project work
4. Networking: Connect with industry professionals and creative communities
5. Continuous Learning: Stay updated with marketing trends, tools, and media platforms`,
    ],
    todayRelevance:
      "High — demand for creative marketing and practical problem-solving is strong.",
    futureRelevance:
      "Growing — digital marketing and media roles continue to expand.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Practical execution
4. Strategic vision
5. Communication skills`,
    ],
    weaknesses: [
      `1. Can over-focus on strategy over execution
2. Risk of perfectionism
3. Time management challenges
4. May overlook teamwork
5. Pressure under deadlines`,
    ],
  },
  {
    combination: "ARC",
    fieldOfStudy: "Architecture, Engineering, Design, Project Management",
    career: "Architect, Interior Designer, Project Planner, CAD Specialist",
    careerDesc:
      "ARC individuals combine artistic creativity (Artistic), realistic problem-solving (Realistic), and conventional organization (Conventional). They excel in structured creative and technical roles.",
    actionPlan: [
      `1. Education: Degrees in architecture, design, or applied sciences
2. Skill Development: Learn CAD, design software, project management
3. Practical Experience: Internships, practical projects, or applied assignments
4. Networking: Join design and architecture associations
5. Continuous Learning: Keep updated with design trends, technologies, and sustainable practices`,
    ],
    todayRelevance:
      "High — structured creative roles in design and architecture are needed.",
    futureRelevance:
      "Stable — demand for architectural and design skills remains.",
    strengths: [
      `1. Creativity and innovation
2. Practical problem-solving
3. Organizational skills
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in methods
2. May underestimate innovative alternatives
3. Focus on technical aspects over human factors
4. Stress under tight deadlines
5. Risk aversion`,
    ],
  },
  {
    combination: "AIR",
    fieldOfStudy: "Business, Marketing, Entrepreneurship, Innovation",
    career:
      "Entrepreneur, Product Developer, Marketing Manager, Business Strategist",
    careerDesc:
      "AIR individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and realistic skills (Realistic). They thrive in innovative and practical business roles requiring problem-solving and strategic vision.",
    actionPlan: [
      `1. Education: Degrees in business, marketing, or entrepreneurship
2. Skill Development: Learn data analysis, strategy, and practical implementation
3. Practical Experience: Internships, entrepreneurial projects, or product development
4. Networking: Connect with mentors and professional communities
5. Continuous Learning: Stay updated with business trends and innovative approaches`,
    ],
    todayRelevance:
      "High — creative problem-solving in business is in strong demand.",
    futureRelevance:
      "Growing — entrepreneurship and innovation-driven roles continue to expand.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Strategic vision
4. Practical problem-solving
5. Leadership`,
    ],
    weaknesses: [
      `1. May overanalyze situations
2. Can focus on strategy over execution
3. Risk of perfectionism
4. May overlook teamwork
5. Pressure under deadlines`,
    ],
  },
  {
    combination: "AIS",
    fieldOfStudy: "Education, Counseling, Healthcare, Social Work",
    career: "Counselor, Nurse, Social Worker, Educator, Therapist",
    careerDesc:
      "AIS individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and social awareness (Social). They excel in roles requiring empathy, creative problem-solving, and structured guidance.",
    actionPlan: [
      `1. Education: Degrees in social sciences, healthcare, or education
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical placements, or teaching practice
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with techniques, research, and best practices`,
    ],
    todayRelevance:
      "High — demand for human-centered creative and analytical roles is strong.",
    futureRelevance:
      "High — education, counseling, and social services continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity in problem-solving
3. Interpersonal communication
4. Analytical thinking
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive situations
2. Risk of burnout
3. May overcommit to others
4. Administrative tasks can be challenging
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "AIE",
    fieldOfStudy: "Arts, Design, Multimedia, Applied Technology",
    career:
      "Graphic Designer, Animator, Multimedia Specialist, Product Designer",
    careerDesc:
      "AIE individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and realistic problem-solving (Realistic). They thrive in roles blending creative, technical, and practical skills.",
    actionPlan: [
      `1. Education: Degrees in arts, design, or multimedia
2. Skill Development: Learn design software, animation, 3D modeling, and technical art skills
3. Practical Experience: Build a portfolio, internships, or applied projects
4. Networking: Join creative and technical communities
5. Continuous Learning: Keep updated with tools, trends, and techniques`,
    ],
    todayRelevance:
      "High — demand for multimedia, design, and applied creative roles is strong.",
    futureRelevance:
      "Growing — digital and creative industries continue to expand.",
    strengths: [
      `1. Creativity and artistic vision
2. Technical proficiency
3. Analytical thinking
4. Innovation
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can over-focus on aesthetics
2. Time management challenges
3. Risk of perfectionism
4. May struggle with repetitive tasks
5. Sensitivity to criticism`,
    ],
  },
  {
    combination: "AIC",
    fieldOfStudy: "Administration, Project Management, Technical Services",
    career:
      "Project Coordinator, Operations Analyst, Technical Administrator, Office Manager",
    careerDesc:
      "AIC individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and conventional organization (Conventional). They excel in structured yet creative administrative or technical roles requiring coordination and problem-solving.",
    actionPlan: [
      `1. Education: Degrees in administration, project management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and creative problem-solving
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities
5. Continuous Learning: Stay updated with management trends, tools, and innovations`,
    ],
    todayRelevance:
      "High — organized professionals with creative problem-solving skills are in demand.",
    futureRelevance:
      "Stable — administrative and coordination roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Creative problem-solving
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in process
2. May underestimate innovation
3. Focus on order over flexibility
4. Stress under multitasking
5. Risk aversion`,
    ],
  },
  {
    combination: "ASR",
    fieldOfStudy: "Education, Social Work, Counseling, Human Services",
    career: "Counselor, Social Worker, Educator, Nurse, Therapist",
    careerDesc:
      "ASR individuals combine artistic creativity (Artistic), social awareness (Social), and realistic problem-solving (Realistic). They excel in human-centered roles requiring empathy, creativity, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in social sciences, healthcare, or education
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, fieldwork, or clinical practice
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with techniques, research, and best practices`,
    ],
    todayRelevance:
      "High — demand for human-centered creative and practical roles is strong.",
    futureRelevance:
      "High — social services, education, and counseling continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity in problem-solving
3. Practical execution
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive cases
2. Risk of burnout
3. May overcommit to others
4. Administrative workload
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "ASI",
    fieldOfStudy: "Healthcare, Social Work, Education, Counseling",
    career: "Counselor, Nurse, Educator, Social Worker, Therapist",
    careerDesc:
      "ASI individuals combine artistic creativity (Artistic), social awareness (Social), and investigative thinking (Investigative). They excel in roles requiring empathy, analytical problem-solving, and human-centered guidance.",
    actionPlan: [
      `1. Education: Degrees in social sciences, healthcare, or education
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical placements, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with techniques, research, and methods`,
    ],
    todayRelevance:
      "High — demand for analytical, empathetic, and creative professionals is strong.",
    futureRelevance:
      "High — education, healthcare, and counseling will continue to require skilled individuals.",
    strengths: [
      `1. Empathy and compassion
2. Analytical problem-solving
3. Creativity
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative challenges
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "ASE",
    fieldOfStudy: "Education, Counseling, Social Work, Human Services",
    career: "Educator, Counselor, Trainer, Social Worker, Mentor",
    careerDesc:
      "ASE individuals combine artistic creativity (Artistic), social awareness (Social), and investigative thinking (Investigative). They excel in roles requiring empathy, creativity, and structured guidance.",
    actionPlan: [
      `1. Education: Degrees in social sciences, education, or counseling
2. Skill Development: Learn teaching, counseling, and interpersonal skills
3. Practical Experience: Internships, fieldwork, or teaching practice
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, trends, and techniques`,
    ],
    todayRelevance:
      "High — demand for creative, analytical, and empathetic roles remains strong.",
    futureRelevance:
      "High — education, counseling, and social services continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity in problem-solving
3. Analytical thinking
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Administrative workload
4. Overcommitment to others
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "ASC",
    fieldOfStudy:
      "Administration, Project Management, Social Services, Human Resources",
    career:
      "Project Coordinator, HR Specialist, Social Services Administrator, Office Manager",
    careerDesc:
      "ASC individuals combine artistic creativity (Artistic), social awareness (Social), and conventional organization (Conventional). They thrive in structured roles requiring coordination, practical execution, and human-centered planning.",
    actionPlan: [
      `1. Education: Degrees in administration, management, or social services
2. Skill Development: Learn project coordination, documentation, and human-centered planning
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities and associations
5. Continuous Learning: Stay updated with management trends and tools`,
    ],
    todayRelevance:
      "High — structured administrative and human services roles are in demand.",
    futureRelevance:
      "Stable — demand for coordinated, empathetic, and organized professionals remains.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Empathy and social awareness
4. Practical problem-solving
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. May underestimate innovation
3. Balancing administrative and human aspects
4. Stress under multitasking
5. Risk aversion`,
    ],
  },
  {
    combination: "AER",
    fieldOfStudy: "Business, Management, Entrepreneurship, Marketing",
    career:
      "Business Strategist, Entrepreneur, Product Developer, Marketing Manager",
    careerDesc:
      "AER individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and realistic problem-solving (Realistic). They excel in innovative and strategic business roles requiring practical execution and leadership.",
    actionPlan: [
      `1. Education: Degrees in business, marketing, or entrepreneurship
2. Skill Development: Learn strategy, analysis, and project implementation
3. Practical Experience: Internships, entrepreneurial projects, or product development
4. Networking: Connect with mentors and professional communities
5. Continuous Learning: Stay updated with business trends and innovative approaches`,
    ],
    todayRelevance:
      "High — demand for creative strategic problem-solvers is strong.",
    futureRelevance:
      "Growing — entrepreneurship and innovation-driven business roles continue to expand.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Practical problem-solving
4. Strategic vision
5. Leadership`,
    ],
    weaknesses: [
      `1. May overanalyze
2. Risk of perfectionism
3. Can overlook teamwork
4. Pressure under deadlines
5. Time management challenges`,
    ],
  },
  {
    combination: "AEI",
    fieldOfStudy: "Arts, Research, Design, Applied Sciences",
    career:
      "Graphic Designer, Animator, Technical Artist, Product Designer, Researcher",
    careerDesc:
      "AEI individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and realistic problem-solving (Realistic). They thrive in creative roles requiring both technical and practical application.",
    actionPlan: [
      `1. Education: Degrees in arts, design, or applied sciences
2. Skill Development: Learn design software, research, 3D modeling, and creative problem-solving
3. Practical Experience: Build portfolio, internships, or applied projects
4. Networking: Join professional and creative communities
5. Continuous Learning: Stay updated with tools, trends, and techniques`,
    ],
    todayRelevance: "High — creative and applied roles are in demand.",
    futureRelevance:
      "Growing — multimedia, design, and technical creative industries expand.",
    strengths: [
      `1. Creativity and artistic vision
2. Analytical thinking
3. Practical problem-solving
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can over-focus on aesthetics
2. Time management challenges
3. Risk of perfectionism
4. May struggle with repetitive tasks
5. Sensitivity to criticism`,
    ],
  },

  {
    combination: "AES",
    fieldOfStudy: "Education, Counseling, Social Work, Human Services",
    career: "Educator, Counselor, Trainer, Social Worker, Mentor",
    careerDesc:
      "AES individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and social awareness (Social). They excel in roles requiring empathy, creativity, and structured guidance.",
    actionPlan: [
      `1. Education: Degrees in social sciences, education, or counseling
2. Skill Development: Learn teaching, counseling, and interpersonal skills
3. Practical Experience: Internships, fieldwork, or teaching practice
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, trends, and techniques`,
    ],
    todayRelevance:
      "High — demand for creative, analytical, and empathetic professionals remains strong.",
    futureRelevance:
      "High — education, counseling, and social services continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity in problem-solving
3. Analytical thinking
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Administrative workload
4. Overcommitment to others
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "AEC",
    fieldOfStudy:
      "Administration, Project Management, Human Resources, Operations",
    career:
      "Project Coordinator, Operations Analyst, HR Specialist, Office Manager",
    careerDesc:
      "AEC individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and conventional organization (Conventional). They thrive in structured administrative roles requiring coordination, planning, and practical problem-solving.",
    actionPlan: [
      `1. Education: Degrees in administration, management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and creative problem-solving
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities and associations
5. Continuous Learning: Stay updated with management trends, tools, and techniques`,
    ],
    todayRelevance:
      "High — demand for organized, creative, and analytical professionals is strong.",
    futureRelevance:
      "Stable — administrative and coordination roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Creative problem-solving
4. Analytical thinking
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. May underestimate innovation
3. Stress under multitasking
4. Risk aversion
5. Balancing creativity with structure`,
    ],
  },
  {
    combination: "ACR",
    fieldOfStudy: "Business, Marketing, Entrepreneurship, Applied Arts",
    career:
      "Entrepreneur, Business Strategist, Product Developer, Marketing Manager",
    careerDesc:
      "ACR individuals combine artistic creativity (Artistic), conventional organization (Conventional), and realistic problem-solving (Realistic). They excel in roles requiring creative strategy, practical execution, and structured planning.",
    actionPlan: [
      `1. Education: Degrees in business, marketing, or entrepreneurship
2. Skill Development: Learn project execution, strategic planning, and innovation
3. Practical Experience: Internships, entrepreneurial projects, or product development
4. Networking: Engage with mentors and professional communities
5. Continuous Learning: Stay updated with business trends, tools, and best practices`,
    ],
    todayRelevance:
      "High — demand for structured creative problem-solvers in business is strong.",
    futureRelevance:
      "Growing — entrepreneurship and strategic innovation roles continue to expand.",
    strengths: [
      `1. Creativity and innovation
2. Organizational skills
3. Practical execution
4. Strategic thinking
5. Leadership`,
    ],
    weaknesses: [
      `1. May overanalyze
2. Risk of perfectionism
3. Pressure under deadlines
4. Balancing creativity and structure
5. Time management challenges`,
    ],
  },
  {
    combination: "ACI",
    fieldOfStudy: "Administration, Project Management, Technical Services",
    career:
      "Project Coordinator, Technical Administrator, Operations Analyst, Office Manager",
    careerDesc:
      "ACI individuals combine artistic creativity (Artistic), conventional organization (Conventional), and investigative thinking (Investigative). They thrive in structured, creative administrative or technical roles requiring planning, analysis, and problem-solving.",
    actionPlan: [
      `1. Education: Degrees in administration, project management, or applied sciences
2. Skill Development: Learn project coordination, documentation, and problem-solving
3. Practical Experience: Internships, applied assignments, or administrative projects
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with management and technical tools`,
    ],
    todayRelevance:
      "High — demand for analytical and organized professionals is strong.",
    futureRelevance:
      "Stable — structured administrative and technical roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Analytical thinking
4. Creative problem-solving
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. May underestimate innovation
3. Stress under multitasking
4. Risk aversion
5. Balancing creativity with structure`,
    ],
  },
  {
    combination: "ACS",
    fieldOfStudy: "Healthcare, Social Work, Education, Human Services",
    career: "Nurse, Social Worker, Educator, Healthcare Coordinator, Therapist",
    careerDesc:
      "ACS individuals combine artistic creativity (Artistic), conventional organization (Conventional), and social awareness (Social). They excel in structured helping professions requiring empathy, coordination, and practical execution.",
    actionPlan: [
      `1. Education: Degrees or certifications in healthcare, social work, or education
2. Skill Development: Learn therapy techniques, patient care, and administrative skills
3. Practical Experience: Internships, clinical placements, or volunteer programs
4. Networking: Join professional healthcare and social service associations
5. Continuous Learning: Stay current with protocols, methods, and regulations`,
    ],
    todayRelevance:
      "High — structured healthcare and social service roles are continuously in demand.",
    futureRelevance:
      "Stable — demand for organized, empathetic, and skilled professionals remains strong.",
    strengths: [
      `1. Practical problem-solving
2. Organizational skills
3. Empathy and social awareness
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Emotional strain in sensitive roles
3. Risk of burnout
4. Balancing administrative and care duties
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "ACE",
    fieldOfStudy: "Administration, Business, Project Management",
    career:
      "Project Coordinator, Operations Analyst, Office Manager, Administrator",
    careerDesc:
      "ACE individuals combine artistic creativity (Artistic), conventional organization (Conventional), and realistic problem-solving (Realistic). They excel in structured roles requiring planning, coordination, and practical implementation.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or project management
2. Skill Development: Learn documentation, project coordination, and creative problem-solving
3. Practical Experience: Internships, applied projects, or administrative assignments
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with tools, processes, and trends`,
    ],
    todayRelevance:
      "High — structured administrative roles with practical execution are in demand.",
    futureRelevance: "Stable — such roles remain essential across industries.",
    strengths: [
      `1. Organizational skills
2. Practical problem-solving
3. Coordination and planning
4. Reliability
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. May underestimate creative alternatives
3. Stress under multitasking
4. Risk aversion
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "SRI",
    fieldOfStudy: "Science, Research, Engineering, Technology",
    career:
      "Research Scientist, Laboratory Technician, Systems Analyst, Engineer",
    careerDesc:
      "SRI individuals combine social awareness (Social), realistic skills (Realistic), and investigative thinking (Investigative). They excel in roles requiring collaboration, analytical skills, and practical problem-solving.",
    actionPlan: [
      `1. Education: Degrees in science, engineering, or applied research
2. Skill Development: Learn analytical techniques, lab skills, and teamwork
3. Practical Experience: Research projects, internships, or lab work
4. Networking: Connect with professional and academic communities
5. Continuous Learning: Keep up with research methods, innovations, and best practices`,
    ],
    todayRelevance:
      "High — demand for analytical and collaborative problem-solvers in technical fields is strong.",
    futureRelevance:
      "Growing — STEM fields increasingly value practical and social skills.",
    strengths: [
      `1. Analytical thinking
2. Practical problem-solving
3. Collaboration
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be overly cautious
2. May struggle with ambiguity
3. Risk of perfectionism
4. Focus on tasks over people
5. Time management under complex projects`,
    ],
  },
  {
    combination: "SRA",
    fieldOfStudy: "Education, Social Work, Counseling, Healthcare",
    career: "Counselor, Educator, Social Worker, Nurse, Therapist",
    careerDesc:
      "SRA individuals combine social awareness (Social), realistic skills (Realistic), and artistic creativity (Artistic). They thrive in human-centered roles requiring practical application and empathy.",
    actionPlan: [
      `1. Education: Degrees in social sciences, healthcare, or education
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, fieldwork, or clinical placements
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with techniques, methods, and best practices`,
    ],
    todayRelevance:
      "High — demand for practical and empathetic human services professionals remains strong.",
    futureRelevance:
      "High — roles in social work, education, and healthcare continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Practical problem-solving
3. Creativity
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain in sensitive cases
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "SRE",
    fieldOfStudy: "Education, Social Services, Counseling, Healthcare",
    career: "Educator, Counselor, Trainer, Social Worker, Therapist",
    careerDesc:
      "SRE individuals combine social awareness (Social), realistic skills (Realistic), and investigative thinking (Investigative). They excel in structured human-centered roles requiring analytical thinking and practical solutions.",
    actionPlan: [
      `1. Education: Degrees in social sciences, education, or healthcare
2. Skill Development: Learn counseling, teaching, and problem-solving skills
3. Practical Experience: Internships, clinical placements, or fieldwork
4. Networking: Join professional communities and workshops
5. Continuous Learning: Stay updated with research methods, best practices, and techniques`,
    ],
    todayRelevance:
      "High — demand for analytical and practical human services professionals is strong.",
    futureRelevance:
      "High — structured roles in social work and education will continue to grow.",
    strengths: [
      `1. Practical problem-solving
2. Empathy and compassion
3. Analytical thinking
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. May overcommit to others
4. Administrative workload
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "SRC",
    fieldOfStudy: "Healthcare, Administration, Social Services",
    career:
      "Healthcare Administrator, Social Services Coordinator, Office Manager",
    careerDesc:
      "SRC individuals combine social awareness (Social), realistic skills (Realistic), and conventional organization (Conventional). They excel in structured roles requiring coordination, practical execution, and human-centered planning.",
    actionPlan: [
      `1. Education: Degrees in administration, healthcare, or social services
2. Skill Development: Learn project coordination, documentation, and human-centered planning
3. Practical Experience: Internships, administrative projects, or fieldwork
4. Networking: Join professional communities and associations
5. Continuous Learning: Stay updated with management trends and tools`,
    ],
    todayRelevance:
      "High — structured administrative and human service roles are in demand.",
    futureRelevance:
      "Stable — demand for organized and empathetic professionals continues.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Practical execution
4. Empathy and social awareness
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Balancing administrative and human-centered work
3. Stress under multitasking
4. Risk aversion
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "SIR",
    fieldOfStudy: "Science, Research, Engineering, Technology",
    career: "Research Scientist, Lab Technician, Systems Analyst, Engineer",
    careerDesc:
      "SIR individuals combine social awareness (Social), investigative thinking (Investigative), and realistic problem-solving (Realistic). They thrive in analytical and practical roles that involve collaboration and research.",
    actionPlan: [
      `1. Education: Degrees in science, engineering, or research
2. Skill Development: Learn analytical techniques, lab skills, and collaborative methods
3. Practical Experience: Internships, lab work, or research projects
4. Networking: Join professional and academic communities
5. Continuous Learning: Keep up with innovations, research trends, and best practices`,
    ],
    todayRelevance:
      "High — analytical and collaborative technical skills are in demand.",
    futureRelevance:
      "Growing — STEM fields increasingly value practical, social, and investigative skills.",
    strengths: [
      `1. Analytical thinking
2. Collaboration
3. Practical problem-solving
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be overly cautious
2. Focus on tasks over people
3. Risk of perfectionism
4. Time management under complex projects
5. May struggle with ambiguity`,
    ],
  },
  {
    combination: "SIA",
    fieldOfStudy: "Healthcare, Education, Counseling, Social Work",
    career: "Counselor, Nurse, Educator, Social Worker, Therapist",
    careerDesc:
      "SIA individuals combine social awareness (Social), investigative thinking (Investigative), and artistic creativity (Artistic). They excel in human-centered roles requiring empathy, creative problem-solving, and analytical thinking.",
    actionPlan: [
      `1. Education: Degrees in healthcare, education, or social sciences
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical placements, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, research, and techniques`,
    ],
    todayRelevance:
      "High — demand for analytical, empathetic, and creative professionals is strong.",
    futureRelevance:
      "High — healthcare, education, and counseling roles continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Analytical thinking
3. Creativity
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "SIE",
    fieldOfStudy: "Healthcare, Counseling, Education, Social Services",
    career: "Educator, Counselor, Social Worker, Trainer, Therapist",
    careerDesc:
      "SIE individuals combine social awareness (Social), investigative thinking (Investigative), and artistic creativity (Artistic). They excel in structured human-centered roles requiring empathy, analytical thinking, and creativity.",
    actionPlan: [
      `1. Education: Degrees in social sciences, education, or healthcare
2. Skill Development: Learn counseling, teaching, and problem-solving
3. Practical Experience: Internships, clinical placements, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and research`,
    ],
    todayRelevance:
      "High — analytical, empathetic, and creative professionals are in demand.",
    futureRelevance:
      "High — human services, education, and healthcare continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Analytical thinking
3. Creativity
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "SIC",
    fieldOfStudy: "Administration, Healthcare, Social Work, Human Services",
    career:
      "Healthcare Administrator, Project Coordinator, Social Services Manager, Office Manager",
    careerDesc:
      "SIC individuals combine social awareness (Social), investigative thinking (Investigative), and conventional organization (Conventional). They thrive in structured, analytical, and human-centered roles requiring coordination and planning.",
    actionPlan: [
      `1. Education: Degrees in administration, healthcare, or social services
2. Skill Development: Learn project coordination, documentation, and analytical methods
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with trends, tools, and best practices`,
    ],
    todayRelevance:
      "High — structured analytical and human-centered roles are in demand.",
    futureRelevance:
      "Stable — such positions remain essential in healthcare and social services.",
    strengths: [
      `1. Organizational skills
2. Analytical thinking
3. Coordination and planning
4. Empathy and social awareness
5. Practical problem-solving`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Balancing administrative and human-centered tasks
3. Stress under multitasking
4. Risk aversion
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "SAR",
    fieldOfStudy: "Education, Counseling, Social Work, Healthcare",
    career: "Educator, Counselor, Social Worker, Nurse, Therapist",
    careerDesc:
      "SAR individuals combine social awareness (Social), artistic creativity (Artistic), and realistic problem-solving (Realistic). They excel in human-centered roles requiring empathy, creativity, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in education, healthcare, or social sciences
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, fieldwork, or clinical placements
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and best practices`,
    ],
    todayRelevance:
      "High — practical and empathetic human services roles remain in demand.",
    futureRelevance:
      "High — social work, counseling, and education continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity
3. Practical problem-solving
4. Interpersonal communication
5. Adaptability`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "SAI",
    fieldOfStudy: "Healthcare, Counseling, Education, Social Work",
    career: "Counselor, Nurse, Educator, Social Worker, Therapist",
    careerDesc:
      "SAI individuals combine social awareness (Social), artistic creativity (Artistic), and investigative thinking (Investigative). They excel in human-centered roles requiring empathy, analytical thinking, and creativity.",
    actionPlan: [
      `1. Education: Degrees in healthcare, education, or social sciences
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical placements, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, research, and techniques`,
    ],
    todayRelevance:
      "High — demand for empathetic and creative professionals in human services is strong.",
    futureRelevance:
      "High — healthcare, counseling, and education roles continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity
3. Analytical thinking
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "SAE",
    fieldOfStudy: "Education, Counseling, Social Work, Human Services",
    career: "Educator, Counselor, Social Worker, Trainer, Mentor",
    careerDesc:
      "SAE individuals combine social awareness (Social), artistic creativity (Artistic), and investigative thinking (Investigative). They thrive in structured human-centered roles requiring empathy, creative problem-solving, and analytical thinking.",
    actionPlan: [
      `1. Education: Degrees in social sciences, education, or counseling
2. Skill Development: Learn teaching, counseling, and analytical skills
3. Practical Experience: Internships, fieldwork, or clinical placements
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with best practices, methods, and techniques`,
    ],
    todayRelevance:
      "High — structured and empathetic human services roles are in demand.",
    futureRelevance:
      "High — education, counseling, and social work will continue to expand.",
    strengths: [
      `1. Empathy and compassion
2. Analytical thinking
3. Creativity
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "SAC",
    fieldOfStudy: "Administration, Social Services, Healthcare, Education",
    career:
      "Project Coordinator, Healthcare Administrator, Office Manager, Social Services Manager",
    careerDesc:
      "SAC individuals combine social awareness (Social), artistic creativity (Artistic), and conventional organization (Conventional). They excel in structured, human-centered administrative roles requiring planning, coordination, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or healthcare
2. Skill Development: Learn project coordination, documentation, and management
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with management tools, trends, and techniques`,
    ],
    todayRelevance:
      "High — structured administrative roles in human services are in demand.",
    futureRelevance:
      "Stable — organized and empathetic professionals continue to be valued.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Practical execution
4. Empathy and social awareness
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Balancing administrative and human-centered tasks
3. Stress under multitasking
4. Risk aversion
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "SER",
    fieldOfStudy: "Science, Research, Healthcare, Social Services",
    career:
      "Research Scientist, Laboratory Technician, Systems Analyst, Healthcare Researcher",
    careerDesc:
      "SER individuals combine social awareness (Social), investigative thinking (Investigative), and realistic problem-solving (Realistic). They thrive in analytical roles requiring practical application, research, and collaboration.",
    actionPlan: [
      `1. Education: Degrees in science, healthcare, or research
2. Skill Development: Learn lab skills, analytical techniques, and teamwork
3. Practical Experience: Internships, lab work, or research projects
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with research innovations and trends`,
    ],
    todayRelevance:
      "High — analytical and collaborative technical skills are in demand.",
    futureRelevance:
      "Growing — research and applied STEM roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Practical problem-solving
3. Collaboration
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be overly cautious
2. Focus on tasks over people
3. Risk of perfectionism
4. Time management under complex projects
5. May struggle with ambiguity`,
    ],
  },
  {
    combination: "SEI",
    fieldOfStudy: "Healthcare, Research, Education, Social Services",
    career: "Researcher, Analyst, Educator, Counselor, Social Worker",
    careerDesc:
      "SEI individuals combine social awareness (Social), investigative thinking (Investigative), and artistic creativity (Artistic). They excel in analytical, empathetic, and creative roles requiring both research and practical human-centered application.",
    actionPlan: [
      `1. Education: Degrees in social sciences, healthcare, or research
2. Skill Development: Learn analytical, counseling, and teaching skills
3. Practical Experience: Internships, fieldwork, or research projects
4. Networking: Join professional associations and academic communities
5. Continuous Learning: Stay updated with methods, techniques, and innovations`,
    ],
    todayRelevance:
      "High — analytical, creative, and empathetic professionals are in demand.",
    futureRelevance:
      "High — research, healthcare, and social service roles continue to grow.",
    strengths: [
      `1. Analytical thinking
2. Empathy and compassion
3. Creativity
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing multiple responsibilities`,
    ],
  },
  {
    combination: "SEA",
    fieldOfStudy: "Education, Healthcare, Social Work, Counseling",
    career: "Educator, Counselor, Social Worker, Nurse, Therapist",
    careerDesc:
      "SEA individuals combine social awareness (Social), investigative thinking (Investigative), and artistic creativity (Artistic). They excel in structured human-centered roles requiring empathy, analytical thinking, and creativity.",
    actionPlan: [
      `1. Education: Degrees in education, social sciences, or healthcare
2. Skill Development: Learn counseling, teaching, and interpersonal skills
3. Practical Experience: Internships, clinical placements, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and research`,
    ],
    todayRelevance:
      "High — structured and empathetic human services roles are in demand.",
    futureRelevance:
      "High — healthcare, counseling, and education continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Analytical thinking
3. Creativity
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "SEC",
    fieldOfStudy: "Administration, Social Services, Education, Healthcare",
    career:
      "Project Coordinator, Social Services Administrator, Healthcare Manager, Office Manager",
    careerDesc:
      "SEC individuals combine social awareness (Social), investigative thinking (Investigative), and conventional organization (Conventional). They excel in structured administrative roles requiring analytical thinking, coordination, and human-centered execution.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or healthcare
2. Skill Development: Learn project coordination, documentation, and management
3. Practical Experience: Internships, applied projects, or administrative assignments
4. Networking: Join professional communities and associations
5. Continuous Learning: Stay updated with management trends, tools, and techniques`,
    ],
    todayRelevance:
      "High — structured administrative and human-centered roles are in demand.",
    futureRelevance: "Stable — such positions continue to be essential.",
    strengths: [
      `1. Organizational skills
2. Analytical thinking
3. Coordination and planning
4. Empathy and social awareness
5. Practical problem-solving`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Balancing administrative and human-centered tasks
3. Stress under multitasking
4. Risk aversion
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "SCR",
    fieldOfStudy: "Healthcare, Social Work, Administration, Project Management",
    career:
      "Healthcare Administrator, Project Coordinator, Social Services Manager, Office Manager",
    careerDesc:
      "SCR individuals combine social awareness (Social), conventional organization (Conventional), and realistic problem-solving (Realistic). They excel in structured, human-centered administrative roles requiring practical execution and coordination.",
    actionPlan: [
      `1. Education: Degrees in healthcare, administration, or social work
2. Skill Development: Learn project coordination, documentation, and management
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities and workshops
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured administrative and human services roles are in demand.",
    futureRelevance:
      "Stable — demand for organized and empathetic professionals continues.",
    strengths: [
      `1. Organizational skills
2. Practical problem-solving
3. Coordination and planning
4. Empathy and social awareness
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Stress under multitasking
3. Risk aversion
4. Balancing administrative and human-centered tasks
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "SCI",
    fieldOfStudy: "Science, Research, Healthcare, Education",
    career: "Research Scientist, Analyst, Educator, Healthcare Researcher",
    careerDesc:
      "SCI individuals combine social awareness (Social), conventional organization (Conventional), and investigative thinking (Investigative). They excel in analytical and structured roles requiring collaboration and practical execution.",
    actionPlan: [
      `1. Education: Degrees in science, healthcare, or social research
2. Skill Development: Learn analytical techniques, documentation, and research methods
3. Practical Experience: Internships, lab work, or field research
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with innovations, research trends, and best practices`,
    ],
    todayRelevance:
      "High — analytical and structured professionals are in demand.",
    futureRelevance:
      "Growing — research and applied STEM roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Collaboration
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Focus on tasks over people
3. Risk of perfectionism
4. Time management under complex projects
5. May struggle with ambiguity`,
    ],
  },
  {
    combination: "SCA",
    fieldOfStudy: "Education, Social Work, Healthcare, Human Services",
    career: "Educator, Counselor, Social Worker, Nurse, Therapist",
    careerDesc:
      "SCA individuals combine social awareness (Social), conventional organization (Conventional), and artistic creativity (Artistic). They excel in structured human-centered roles requiring empathy, practical execution, and coordination.",
    actionPlan: [
      `1. Education: Degrees in education, social work, or healthcare
2. Skill Development: Learn counseling, teaching, and administrative skills
3. Practical Experience: Internships, fieldwork, or clinical placements
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and best practices`,
    ],
    todayRelevance: "High — structured human services roles are in demand.",
    futureRelevance:
      "High — education, social work, and healthcare continue to grow.",
    strengths: [
      `1. Organizational skills
2. Empathy and compassion
3. Practical problem-solving
4. Coordination and planning
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Balancing administrative and human-centered tasks
3. Stress under multitasking
4. Risk of burnout
5. May underestimate creative solutions`,
    ],
  },

  {
    combination: "SCE",
    fieldOfStudy: "Administration, Social Services, Healthcare",
    career:
      "Project Coordinator, Social Services Administrator, Office Manager",
    careerDesc:
      "SCE individuals combine social awareness (Social), conventional organization (Conventional), and artistic creativity (Artistic). They excel in structured, human-centered administrative roles requiring coordination, planning, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or healthcare
2. Skill Development: Learn project coordination, documentation, and management
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities and associations
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured administrative and human services roles are in demand.",
    futureRelevance:
      "Stable — demand for organized and empathetic professionals continues.",
    strengths: [
      `1. Organizational skills
2. Coordination and planning
3. Practical execution
4. Empathy and social awareness
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Balancing administrative and human-centered tasks
3. Stress under multitasking
4. Risk aversion
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "ERI",
    fieldOfStudy: "Engineering, Research, Science, Technology",
    career:
      "Research Scientist, Engineer, Systems Analyst, Laboratory Technician",
    careerDesc:
      "ERI individuals combine investigative thinking (Investigative), realistic problem-solving (Realistic), and artistic creativity (Artistic). They thrive in analytical and practical roles requiring research, innovation, and technical application.",
    actionPlan: [
      `1. Education: Degrees in engineering, science, or research
2. Skill Development: Learn lab techniques, technical skills, and analytical methods
3. Practical Experience: Internships, research projects, or technical assignments
4. Networking: Join professional communities and conferences
5. Continuous Learning: Stay updated with technological and scientific developments`,
    ],
    todayRelevance:
      "High — demand for analytical and innovative technical professionals is strong.",
    futureRelevance:
      "Growing — STEM and research-intensive fields value these skills highly.",
    strengths: [
      `1. Analytical thinking
2. Technical proficiency
3. Creativity in problem-solving
4. Attention to detail
5. Practical execution`,
    ],
    weaknesses: [
      `1. May focus excessively on detail
2. Risk of perfectionism
3. Can struggle with teamwork
4. May neglect communication
5. Time management under complex tasks`,
    ],
  },
  {
    combination: "ERA",
    fieldOfStudy: "Engineering, Design, Applied Sciences, Architecture",
    career: "Engineer, Architect, Product Designer, Technical Innovator",
    careerDesc:
      "ERA individuals combine investigative thinking (Investigative), realistic problem-solving (Realistic), and artistic creativity (Artistic). They excel in roles where practical problem-solving meets design and innovation.",
    actionPlan: [
      `1. Education: Degrees in engineering, architecture, or design
2. Skill Development: Learn CAD, prototyping, and technical design
3. Practical Experience: Internships, projects, or co-op programs
4. Networking: Join professional organizations and conferences
5. Continuous Learning: Stay updated with design and engineering innovations`,
    ],
    todayRelevance:
      "High — demand in engineering and design industries is strong.",
    futureRelevance:
      "Growing — emerging fields like sustainable design and advanced manufacturing value ERA skills highly.",
    strengths: [
      `1. Technical proficiency
2. Analytical thinking
3. Creativity and innovation
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can focus too much on perfection
2. May neglect teamwork
3. Risk of overengineering
4. Time management challenges
5. May prioritize technical over human factors`,
    ],
  },
  {
    combination: "ERS",
    fieldOfStudy: "Engineering, Science, Social Services, Applied Research",
    career:
      "Research Scientist, Technical Analyst, Social Researcher, Engineer",
    careerDesc:
      "ERS individuals combine investigative thinking (Investigative), realistic problem-solving (Realistic), and social awareness (Social). They thrive in roles requiring analytical skills, practical execution, and collaboration.",
    actionPlan: [
      `1. Education: Degrees in engineering, science, or social research
2. Skill Development: Learn analytical techniques, lab methods, and teamwork
3. Practical Experience: Internships, research projects, or applied assignments
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with technological and scientific trends`,
    ],
    todayRelevance:
      "High — analytical, practical, and collaborative professionals are in demand.",
    futureRelevance:
      "Growing — STEM and applied social research fields value these skills highly.",
    strengths: [
      `1. Analytical thinking
2. Practical problem-solving
3. Collaboration
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Risk of over-cautiousness
2. May struggle with ambiguity
3. Focus on tasks over people
4. Time management under complex projects
5. Can be perfectionist`,
    ],
  },
  {
    combination: "ERC",
    fieldOfStudy: "Engineering, Project Management, Applied Sciences",
    career:
      "Project Engineer, Technical Coordinator, Systems Analyst, Product Developer",
    careerDesc:
      "ERC individuals combine investigative thinking (Investigative), realistic problem-solving (Realistic), and conventional organization (Conventional). They excel in structured technical roles requiring planning, practical execution, and analytical thinking.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or project management
2. Skill Development: Learn technical planning, documentation, and analysis
3. Practical Experience: Internships, projects, or applied assignments
4. Networking: Join professional organizations and communities
5. Continuous Learning: Stay updated with technical tools and best practices`,
    ],
    todayRelevance:
      "High — structured and technical professionals are in demand.",
    futureRelevance: "Stable — such roles remain essential across industries.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Technical proficiency
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. May underestimate creative alternatives
3. Stress under multitasking
4. Risk aversion
5. Balancing technical and human considerations`,
    ],
  },
  {
    combination: "EIR",
    fieldOfStudy: "Engineering, Research, Science, Applied Technology",
    career:
      "Research Scientist, Engineer, Systems Analyst, Technical Innovator",
    careerDesc:
      "EIR individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and realistic problem-solving (Realistic). They thrive in roles requiring technical innovation, creative solutions, and practical implementation.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or research
2. Skill Development: Learn CAD, prototyping, and analytical techniques
3. Practical Experience: Internships, applied projects, or research
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with technological and design innovations`,
    ],
    todayRelevance:
      "High — demand for technically skilled and innovative professionals is strong.",
    futureRelevance:
      "Growing — fields like robotics, sustainable engineering, and product design value these skills highly.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Technical proficiency
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Perfectionism
2. May struggle with teamwork
3. Time management under complex projects
4. Risk of overengineering
5. May prioritize technical over human factors`,
    ],
  },
  {
    combination: "EIA",
    fieldOfStudy: "Engineering, Research, Applied Sciences, Education",
    career: "Engineer, Researcher, Technical Innovator, Product Developer",
    careerDesc:
      "EIA individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and social awareness (Social). They excel in innovative, human-centered technical roles requiring analytical thinking and practical implementation.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or research
2. Skill Development: Learn analytical techniques, design tools, and collaboration
3. Practical Experience: Internships, projects, or applied research
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with innovations, design, and research methods`,
    ],
    todayRelevance:
      "High — demand for analytical, creative, and collaborative technical professionals is strong.",
    futureRelevance:
      "Growing — applied STEM and design fields continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity and innovation
3. Collaboration
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be perfectionist
2. May struggle with communication
3. Risk of over-engineering
4. Balancing creativity and structure
5. Time management under complex tasks`,
    ],
  },
  {
    combination: "EIS",
    fieldOfStudy: "Science, Research, Healthcare, Social Services",
    career:
      "Research Scientist, Analyst, Healthcare Researcher, Social Researcher",
    careerDesc:
      "EIS individuals combine investigative thinking (Investigative), social awareness (Social), and realistic problem-solving (Realistic). They excel in analytical, human-centered roles requiring practical execution and collaboration.",
    actionPlan: [
      `1. Education: Degrees in science, research, or healthcare
2. Skill Development: Learn lab techniques, analytical skills, and teamwork
3. Practical Experience: Internships, applied research, or projects
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with innovations and research trends`,
    ],
    todayRelevance:
      "High — demand for analytical and collaborative professionals is strong.",
    futureRelevance:
      "Growing — STEM and applied social research roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Practical problem-solving
3. Collaboration
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Focus on tasks over people
3. Risk of perfectionism
4. Time management under complex tasks
5. May struggle with ambiguity`,
    ],
  },
  {
    combination: "EIC",
    fieldOfStudy: "Engineering, Applied Sciences, Administration",
    career:
      "Project Engineer, Technical Coordinator, Systems Analyst, Product Developer",
    careerDesc:
      "EIC individuals combine investigative thinking (Investigative), artistic creativity (Artistic), and conventional organization (Conventional). They excel in structured, innovative technical roles requiring planning, practical execution, and analytical thinking.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or project management
2. Skill Development: Learn analytical techniques, project coordination, and technical tools
3. Practical Experience: Internships, applied projects, or research
4. Networking: Join professional organizations and communities
5. Continuous Learning: Stay updated with technical trends, design, and best practices`,
    ],
    todayRelevance:
      "High — demand for structured and innovative technical professionals is strong.",
    futureRelevance:
      "Growing — STEM and applied design roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity and innovation
3. Organizational skills
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be perfectionist
2. Risk of over-engineering
3. Time management challenges
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "EAR",
    fieldOfStudy: "Engineering, Design, Applied Sciences",
    career: "Engineer, Architect, Product Developer, Technical Innovator",
    careerDesc:
      "EAR individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and realistic problem-solving (Realistic). They excel in innovative, practical roles requiring design, analysis, and technical application.",
    actionPlan: [
      `1. Education: Degrees in engineering, design, or applied sciences
2. Skill Development: Learn CAD, prototyping, and technical design
3. Practical Experience: Internships, applied projects, or co-op programs
4. Networking: Join professional organizations and conferences
5. Continuous Learning: Stay updated with innovations in engineering and design`,
    ],
    todayRelevance:
      "High — demand in engineering and design industries is strong.",
    futureRelevance:
      "Growing — emerging fields like robotics and sustainable engineering value EAR skills highly.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Technical proficiency
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Perfectionism
2. Can neglect teamwork
3. Time management under complex projects
4. Risk of overengineering
5. Focus on technical over human aspects`,
    ],
  },
  {
    combination: "EAI",
    fieldOfStudy: "Engineering, Research, Design, Applied Sciences",
    career: "Researcher, Engineer, Product Developer, Technical Innovator",
    careerDesc:
      "EAI individuals combine artistic creativity (Artistic), investigative thinking (Investigative), and realistic problem-solving (Realistic). They thrive in analytical, innovative, and practical technical roles.",
    actionPlan: [
      `1. Education: Degrees in engineering, design, or applied sciences
2. Skill Development: Learn technical and design tools, analytical skills
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with design, engineering, and technological trends`,
    ],
    todayRelevance:
      "High — demand for analytical, creative, and practical professionals is strong.",
    futureRelevance: "Growing — STEM and design fields continue to expand.",
    strengths: [
      `1. Creativity and innovation
2. Analytical thinking
3. Practical problem-solving
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Perfectionism
2. May struggle with teamwork
3. Risk of overengineering
4. Time management challenges
5. May focus more on technical than human aspects`,
    ],
  },
  {
    combination: "EAS",
    fieldOfStudy: "Education, Social Work, Counseling, Human Services",
    career: "Educator, Counselor, Social Worker, Trainer",
    careerDesc:
      "EAS individuals combine artistic creativity (Artistic), social awareness (Social), and investigative thinking (Investigative). They excel in creative and human-centered roles requiring empathy, analytical skills, and practical application.",
    actionPlan: [
      `1. Education: Degrees in education, social work, or counseling
2. Skill Development: Learn teaching, counseling, and analytical skills
3. Practical Experience: Internships, fieldwork, or applied projects
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and best practices`,
    ],
    todayRelevance:
      "High — demand for creative and empathetic professionals in education and social services is strong.",
    futureRelevance:
      "High — education, counseling, and social services continue to grow.",
    strengths: [
      `1. Creativity
2. Empathy and compassion
3. Analytical thinking
4. Practical problem-solving
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Overcommitment
4. Administrative workload
5. Balancing responsibilities`,
    ],
  },
  {
    combination: "EAC",
    fieldOfStudy: "Administration, Social Work, Education, Healthcare",
    career:
      "Project Coordinator, Office Manager, Social Services Administrator",
    careerDesc:
      "EAC individuals combine artistic creativity (Artistic), social awareness (Social), and conventional organization (Conventional). They excel in structured human-centered administrative roles requiring planning, coordination, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or healthcare
2. Skill Development: Learn project coordination, documentation, and management
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities and workshops
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured administrative and human services roles are in demand.",
    futureRelevance: "Stable — demand for organized professionals continues.",
    strengths: [
      `1. Organizational skills
2. Creativity
3. Empathy and compassion
4. Practical problem-solving
5. Coordination and planning`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Stress under multitasking
3. Balancing administrative and creative tasks
4. Risk aversion
5. May underestimate innovative solutions`,
    ],
  },

  {
    combination: "ESR",
    fieldOfStudy: "Social Work, Healthcare, Education, Research",
    career: "Social Worker, Counselor, Healthcare Researcher, Educator",
    careerDesc:
      "ESR individuals combine social awareness (Social), conventional organization (Conventional), and realistic problem-solving (Realistic). They excel in structured human-centered roles requiring practical execution, empathy, and analytical thinking.",
    actionPlan: [
      `1. Education: Degrees in social work, healthcare, or education
2. Skill Development: Learn counseling, teaching, and practical skills
3. Practical Experience: Internships, fieldwork, or applied projects
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and best practices`,
    ],
    todayRelevance:
      "High — demand for organized and empathetic professionals is strong.",
    futureRelevance:
      "Stable — structured human services and education roles continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Organizational skills
3. Practical problem-solving
4. Analytical thinking
5. Interpersonal communication`,
    ],
    weaknesses: [
      `1. Risk of burnout
2. Emotional strain
3. Balancing multiple responsibilities
4. Stress under multitasking
5. Can be rigid in processes`,
    ],
  },
  {
    combination: "ESI",
    fieldOfStudy: "Healthcare, Research, Social Work, Education",
    career: "Researcher, Analyst, Healthcare Specialist, Social Researcher",
    careerDesc:
      "ESI individuals combine social awareness (Social), conventional organization (Conventional), and investigative thinking (Investigative). They thrive in analytical, structured, and human-centered roles requiring collaboration and practical problem-solving.",
    actionPlan: [
      `1. Education: Degrees in social sciences, healthcare, or research
2. Skill Development: Learn analytical techniques, documentation, and teamwork
3. Practical Experience: Internships, research projects, or applied work
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with methods, research, and best practices`,
    ],
    todayRelevance:
      "High — demand for analytical, organized, and collaborative professionals is strong.",
    futureRelevance:
      "Growing — research, healthcare, and applied social science roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Organization and planning
3. Collaboration
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can focus too much on procedures
2. Risk of perfectionism
3. May struggle with flexibility
4. Time management under complex projects
5. Focus on tasks over people`,
    ],
  },
  {
    combination: "ESA",
    fieldOfStudy: "Education, Social Work, Counseling, Human Services",
    career: "Educator, Counselor, Social Worker, Trainer",
    careerDesc:
      "ESA individuals combine social awareness (Social), conventional organization (Conventional), and artistic creativity (Artistic). They excel in structured, human-centered roles requiring empathy, creative problem-solving, and coordination.",
    actionPlan: [
      `1. Education: Degrees in education, counseling, or social work
2. Skill Development: Learn teaching, counseling, and organizational skills
3. Practical Experience: Internships, fieldwork, or applied projects
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with methods, techniques, and innovations`,
    ],
    todayRelevance:
      "High — structured, creative, and empathetic human services roles are in demand.",
    futureRelevance:
      "High — education, social work, and counseling roles continue to grow.",
    strengths: [
      `1. Empathy and compassion
2. Creativity
3. Organizational skills
4. Coordination and planning
5. Practical problem-solving`,
    ],
    weaknesses: [
      `1. Emotional strain
2. Risk of burnout
3. Balancing administrative and creative tasks
4. Overcommitment
5. Can be rigid in processes`,
    ],
  },
  {
    combination: "ESC",
    fieldOfStudy: "Administration, Social Work, Education, Healthcare",
    career:
      "Project Coordinator, Office Manager, Social Services Administrator",
    careerDesc:
      "ESC individuals combine social awareness (Social), conventional organization (Conventional), and investigative thinking (Investigative). They excel in structured, analytical, human-centered roles requiring coordination, planning, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or healthcare
2. Skill Development: Learn project coordination, documentation, and management
3. Practical Experience: Internships, administrative projects, or applied assignments
4. Networking: Join professional communities and workshops
5. Continuous Learning: Stay updated with management tools, techniques, and best practices`,
    ],
    todayRelevance:
      "High — structured administrative and human services roles are in demand.",
    futureRelevance:
      "Stable — organized professionals continue to be essential.",
    strengths: [
      `1. Organizational skills
2. Analytical thinking
3. Practical problem-solving
4. Coordination and planning
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk of over-reliance on procedures
3. Stress under multitasking
4. Balancing analytical and human-centered tasks
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "ECR",
    fieldOfStudy: "Engineering, Research, Applied Sciences, Administration",
    career: "Project Engineer, Technical Coordinator, Research Analyst",
    careerDesc:
      "ECR individuals combine investigative thinking (Investigative), conventional organization (Conventional), and realistic problem-solving (Realistic). They thrive in structured, analytical, and technical roles requiring planning, practical execution, and coordination.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or research
2. Skill Development: Learn analytical techniques, project coordination, and technical skills
3. Practical Experience: Internships, applied projects, or research
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured analytical and technical professionals are in demand.",
    futureRelevance:
      "Growing — STEM and applied research roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Technical proficiency
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk of perfectionism
3. Time management under complex tasks
4. May underestimate creative alternatives
5. Balancing analytical and human-centered tasks`,
    ],
  },
  {
    combination: "ECI",
    fieldOfStudy: "Engineering, Applied Sciences, Research, Administration",
    career: "Engineer, Researcher, Technical Analyst, Systems Coordinator",
    careerDesc:
      "ECI individuals combine investigative thinking (Investigative), conventional organization (Conventional), and artistic creativity (Artistic). They excel in structured, analytical, and innovative technical roles requiring planning, execution, and creative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or research
2. Skill Development: Learn analytical techniques, creative tools, and project coordination
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and academic communities
5. Continuous Learning: Stay updated with innovations, design, and analytical methods`,
    ],
    todayRelevance:
      "High — structured, analytical, and creative technical professionals are in demand.",
    futureRelevance:
      "Growing — STEM and applied research roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be perfectionist
2. Risk of overengineering
3. Time management challenges
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "ECA",
    fieldOfStudy: "Engineering, Design, Applied Sciences, Administration",
    career: "Engineer, Designer, Project Coordinator, Technical Manager",
    careerDesc:
      "ECA individuals combine investigative thinking (Investigative), conventional organization (Conventional), and artistic creativity (Artistic). They excel in structured, innovative, and practical roles requiring planning, analytical skills, and coordination.",
    actionPlan: [
      `1. Education: Degrees in engineering, design, or applied sciences
2. Skill Development: Learn analytical techniques, project coordination, and creative tools
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with innovations, design, and management methods`,
    ],
    todayRelevance:
      "High — demand for analytical, creative, and organized professionals is strong.",
    futureRelevance:
      "Growing — STEM and applied design fields continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Coordination and planning`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk of overengineering
3. Time management challenges
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },

  {
    combination: "ECS",
    fieldOfStudy: "Education, Administration, Social Services",
    career: "Educator, Administrator, Social Worker, Program Coordinator",
    careerDesc:
      "ECS individuals combine investigative thinking (Investigative), conventional organization (Conventional), and social awareness (Social). They excel in structured, analytical, and human-centered roles requiring planning, practical execution, and collaboration.",
    actionPlan: [
      `1. Education: Degrees in education, administration, or social work
2. Skill Development: Learn analytical, planning, and organizational skills
3. Practical Experience: Internships, projects, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with management, research, and education best practices`,
    ],
    todayRelevance:
      "High — structured, analytical, and human-centered roles are in demand.",
    futureRelevance:
      "Stable — education and social services require organized and analytical professionals.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Collaboration
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Emotional strain in human-centered tasks
4. Multitasking stress
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "CRI",
    fieldOfStudy: "Business, Finance, Administration, Research",
    career: "Financial Analyst, Business Researcher, Accountant, Consultant",
    careerDesc:
      "CRI individuals combine conventional organization (Conventional), realistic problem-solving (Realistic), and investigative thinking (Investigative). They excel in structured, analytical, and practical roles requiring planning, accuracy, and research.",
    actionPlan: [
      `1. Education: Degrees in business, finance, or administration
2. Skill Development: Learn accounting, data analysis, and research skills
3. Practical Experience: Internships, financial projects, or applied assignments
4. Networking: Join professional and business associations
5. Continuous Learning: Stay updated with financial tools, trends, and regulations`,
    ],
    todayRelevance:
      "High — demand for analytical, organized, and practical professionals in business and finance is strong.",
    futureRelevance:
      "Growing — finance, consulting, and business analysis continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Attention to detail
3. Organizational skills
4. Practical problem-solving
5. Accuracy and reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. May focus too much on data over people
3. Risk aversion
4. Time management under multiple deadlines
5. Limited creativity in structured roles`,
    ],
  },
  {
    combination: "CRA",
    fieldOfStudy: "Business, Finance, Marketing, Administration",
    career: "Accountant, Auditor, Business Analyst, Project Manager",
    careerDesc:
      "CRA individuals combine conventional organization (Conventional), realistic problem-solving (Realistic), and artistic creativity (Artistic). They thrive in structured business and administrative roles requiring analytical skills, planning, and innovative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, finance, or administration
2. Skill Development: Learn accounting, data analysis, and project coordination
3. Practical Experience: Internships, business projects, or applied assignments
4. Networking: Join professional associations and business communities
5. Continuous Learning: Stay updated with business trends, analytical tools, and innovations`,
    ],
    todayRelevance:
      "High — structured business and finance professionals are in demand.",
    futureRelevance:
      "Growing — finance, business analysis, and project management roles continue to expand.",
    strengths: [
      `1. Organizational skills
2. Analytical thinking
3. Practical problem-solving
4. Creativity in process optimization
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of overemphasis on rules
3. Time management under complex projects
4. Limited flexibility
5. May underestimate human factors`,
    ],
  },
  {
    combination: "CRS",
    fieldOfStudy: "Business, Administration, Social Services",
    career:
      "Office Manager, Project Coordinator, Social Services Administrator",
    careerDesc:
      "CRS individuals combine conventional organization (Conventional), realistic problem-solving (Realistic), and social awareness (Social). They excel in structured, human-centered roles requiring planning, practical execution, and collaboration.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or social work
2. Skill Development: Learn planning, coordination, and organizational skills
3. Practical Experience: Internships, administrative projects, or fieldwork
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with management and best practices`,
    ],
    todayRelevance:
      "High — structured administrative and social services roles are in demand.",
    futureRelevance:
      "Stable — organized professionals are always needed in human-centered services.",
    strengths: [
      `1. Organizational skills
2. Practical problem-solving
3. Collaboration
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Stress under multitasking
3. Risk of over-reliance on rules
4. May underestimate creativity
5. Balancing analytical and social tasks`,
    ],
  },
  {
    combination: "CRE",
    fieldOfStudy: "Business, Finance, Administration, Creative Management",
    career:
      "Business Analyst, Project Manager, Financial Consultant, Process Designer",
    careerDesc:
      "CRE individuals combine conventional organization (Conventional), realistic problem-solving (Realistic), and artistic creativity (Artistic). They thrive in structured roles where analytical thinking and innovation intersect.",
    actionPlan: [
      `1. Education: Degrees in business, finance, or administration
2. Skill Development: Learn analysis, project management, and creative problem-solving
3. Practical Experience: Internships, applied projects, or consulting assignments
4. Networking: Join professional associations and business networks
5. Continuous Learning: Stay updated with business trends and analytical tools`,
    ],
    todayRelevance:
      "High — structured business professionals with analytical and creative skills are in demand.",
    futureRelevance:
      "Growing — finance, consulting, and management roles require these skills.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Creativity
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk aversion
3. Limited flexibility in structured roles
4. Time management under complex projects
5. May underestimate interpersonal factors`,
    ],
  },
  {
    combination: "CIR",
    fieldOfStudy: "Business, Finance, Administration, Research",
    career: "Financial Analyst, Accountant, Business Researcher, Consultant",
    careerDesc:
      "CIR individuals combine conventional organization (Conventional), investigative thinking (Investigative), and realistic problem-solving (Realistic). They excel in structured, analytical, and practical roles requiring precision, research, and planning.",
    actionPlan: [
      `1. Education: Degrees in business, finance, or administration
2. Skill Development: Learn accounting, data analysis, and research techniques
3. Practical Experience: Internships, financial projects, or applied assignments
4. Networking: Join professional and business communities
5. Continuous Learning: Stay updated with tools, regulations, and trends`,
    ],
    todayRelevance:
      "High — structured analytical professionals are in demand in business and finance.",
    futureRelevance:
      "Growing — finance, consulting, and research roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Attention to detail
3. Organizational skills
4. Practical problem-solving
5. Research skills`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk of overemphasis on rules
3. Time management under multiple tasks
4. Limited flexibility
5. May focus more on data than people`,
    ],
  },
  {
    combination: "CIA",
    fieldOfStudy: "Business, Administration, Creative Management",
    career: "Project Manager, Business Analyst, Consultant, Process Designer",
    careerDesc:
      "CIA individuals combine conventional organization (Conventional), investigative thinking (Investigative), and artistic creativity (Artistic). They thrive in structured roles where research, planning, and innovation intersect.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or management
2. Skill Development: Learn analysis, project coordination, and creative problem-solving
3. Practical Experience: Internships, applied projects, or consulting assignments
4. Networking: Join professional associations and business networks
5. Continuous Learning: Stay updated with business trends and analytical tools`,
    ],
    todayRelevance:
      "High — structured, analytical, and creative professionals are in demand.",
    futureRelevance:
      "Growing — business, consulting, and project management fields value these skills.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Planning and coordination`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk aversion
3. Time management challenges
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },

  {
    combination: "CIS",
    fieldOfStudy: "Business, Administration, Social Sciences",
    career:
      "Business Analyst, Administrator, Social Researcher, Project Coordinator",
    careerDesc:
      "CIS individuals combine conventional organization (Conventional), investigative thinking (Investigative), and social awareness (Social). They excel in structured, analytical, and human-centered roles requiring research, planning, and coordination.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or social sciences
2. Skill Development: Learn research, analysis, and organizational skills
3. Practical Experience: Internships, applied projects, or fieldwork
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with trends, tools, and best practices`,
    ],
    todayRelevance:
      "High — analytical, organized, and socially aware professionals are in demand.",
    futureRelevance:
      "Growing — structured human-centered roles in business and social services remain essential.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Collaboration
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Balancing analytical and human tasks
4. Stress under multitasking
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "CIE",
    fieldOfStudy: "Business, Administration, Finance, Creative Management",
    career: "Business Analyst, Project Manager, Consultant, Process Designer",
    careerDesc:
      "CIE individuals combine conventional organization (Conventional), investigative thinking (Investigative), and artistic creativity (Artistic). They thrive in structured roles that combine analysis, planning, and innovative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or management
2. Skill Development: Learn analysis, project coordination, and creative skills
3. Practical Experience: Internships, applied projects, or consulting assignments
4. Networking: Join professional associations and business networks
5. Continuous Learning: Stay updated with business trends and analytical tools`,
    ],
    todayRelevance:
      "High — structured analytical and creative professionals are in demand.",
    futureRelevance:
      "Growing — business, consulting, and management fields value these skills.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Planning and coordination`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk aversion
3. Time management challenges
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "CAR",
    fieldOfStudy: "Business, Finance, Administration, Arts",
    career: "Accountant, Auditor, Business Analyst, Project Manager",
    careerDesc:
      "CAR individuals combine conventional organization (Conventional), artistic creativity (Artistic), and realistic problem-solving (Realistic). They excel in structured and analytical roles requiring innovation, precision, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in business, finance, or administration
2. Skill Development: Learn accounting, analysis, and creative problem-solving
3. Practical Experience: Internships, projects, or applied assignments
4. Networking: Join professional communities and associations
5. Continuous Learning: Stay updated with tools, trends, and innovations`,
    ],
    todayRelevance:
      "High — structured, analytical, and creative professionals are in demand.",
    futureRelevance:
      "Growing — finance, business, and project management roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk aversion
3. Time management under complex projects
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "CAI",
    fieldOfStudy: "Business, Finance, Arts, Administration",
    career: "Business Analyst, Accountant, Project Manager, Consultant",
    careerDesc:
      "CAI individuals combine conventional organization (Conventional), artistic creativity (Artistic), and investigative thinking (Investigative). They thrive in structured, analytical, and innovative roles requiring planning, research, and creative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, finance, or administration
2. Skill Development: Learn accounting, analysis, and creative techniques
3. Practical Experience: Internships, applied projects, or consulting assignments
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with tools, trends, and analytical methods`,
    ],
    todayRelevance:
      "High — analytical, creative, and organized professionals are in demand.",
    futureRelevance:
      "Growing — structured business and finance roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Planning and coordination`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk aversion
3. Time management challenges
4. May underestimate collaboration
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "CAS",
    fieldOfStudy: "Business, Administration, Social Services",
    career:
      "Project Coordinator, Social Services Administrator, Office Manager",
    careerDesc:
      "CAS individuals combine conventional organization (Conventional), artistic creativity (Artistic), and social awareness (Social). They excel in structured human-centered roles requiring coordination, planning, and creative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or management
2. Skill Development: Learn project coordination, planning, and creative skills
3. Practical Experience: Internships, applied projects, or administrative work
4. Networking: Join professional associations and workshops
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured, creative, and human-centered professionals are in demand.",
    futureRelevance:
      "Stable — organized professionals in human services remain essential.",
    strengths: [
      `1. Organizational skills
2. Creativity
3. Collaboration
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Balancing creative and administrative tasks
4. Stress under multitasking
5. May underestimate innovative solutions`,
    ],
  },
  {
    combination: "CAE",
    fieldOfStudy: "Business, Administration, Arts, Creative Management",
    career: "Project Manager, Business Analyst, Consultant, Process Designer",
    careerDesc:
      "CAE individuals combine conventional organization (Conventional), artistic creativity (Artistic), and investigative thinking (Investigative). They thrive in structured, innovative, and analytical roles requiring planning, research, and creative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or management
2. Skill Development: Learn analysis, planning, and creative problem-solving
3. Practical Experience: Internships, applied projects, or consulting assignments
4. Networking: Join professional associations and business networks
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured, analytical, and creative professionals are in demand.",
    futureRelevance:
      "Growing — business, consulting, and project management roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Planning and coordination`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk aversion
3. Time management challenges
4. May underestimate collaboration
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "CSR",
    fieldOfStudy: "Social Services, Administration, Business",
    career:
      "Social Services Administrator, Project Coordinator, Office Manager",
    careerDesc:
      "CSR individuals combine conventional organization (Conventional), social awareness (Social), and realistic problem-solving (Realistic). They excel in structured human-centered roles requiring planning, coordination, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or management
2. Skill Development: Learn planning, coordination, and organizational skills
3. Practical Experience: Internships, applied projects, or fieldwork
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured and organized human-centered roles are in demand.",
    futureRelevance:
      "Stable — social services and administrative roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Practical problem-solving
3. Collaboration
4. Attention to detail
5. Reliability`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Stress under multitasking
3. Balancing analytical and social tasks
4. Risk of over-reliance on structure
5. May underestimate creative solutions`,
    ],
  },

  {
    combination: "CSI",
    fieldOfStudy: "Business, Social Services, Administration, Research",
    career:
      "Business Analyst, Social Researcher, Project Coordinator, Administrator",
    careerDesc:
      "CSI individuals combine conventional organization (Conventional), social awareness (Social), and investigative thinking (Investigative). They excel in structured, analytical, and human-centered roles requiring research, planning, and collaboration.",
    actionPlan: [
      `1. Education: Degrees in business, administration, or social sciences
2. Skill Development: Learn research, analytical, and organizational skills
3. Practical Experience: Internships, fieldwork, or applied projects
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with trends, tools, and best practices`,
    ],
    todayRelevance:
      "High — analytical, organized, and socially aware professionals are in demand.",
    futureRelevance:
      "Growing — structured human-centered roles continue to be essential.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Collaboration
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Balancing analytical and social tasks
4. Stress under multitasking
5. May underestimate creative solutions`,
    ],
  },
  {
    combination: "CSA",
    fieldOfStudy: "Business, Administration, Social Services, Arts",
    career:
      "Project Coordinator, Social Services Administrator, Office Manager, Program Designer",
    careerDesc:
      "CSA individuals combine conventional organization (Conventional), social awareness (Social), and artistic creativity (Artistic). They excel in structured, human-centered, and creative roles requiring planning, coordination, and problem-solving.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or management
2. Skill Development: Learn coordination, planning, and creative problem-solving
3. Practical Experience: Internships, applied projects, or fieldwork
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured, creative, and human-centered professionals are in demand.",
    futureRelevance:
      "Stable — organized human services roles remain essential.",
    strengths: [
      `1. Organizational skills
2. Creativity
3. Collaboration
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Balancing creative and administrative tasks
4. Stress under multitasking
5. May underestimate innovative solutions`,
    ],
  },
  {
    combination: "CSE",
    fieldOfStudy:
      "Business, Administration, Social Services, Creative Management",
    career:
      "Project Manager, Social Services Administrator, Business Analyst, Consultant",
    careerDesc:
      "CSE individuals combine conventional organization (Conventional), social awareness (Social), and investigative thinking (Investigative/Creative). They excel in structured, analytical, and creative human-centered roles requiring planning, problem-solving, and innovation.",
    actionPlan: [
      `1. Education: Degrees in administration, social work, or management
2. Skill Development: Learn planning, analytical, and creative skills
3. Practical Experience: Internships, applied projects, or fieldwork
4. Networking: Join professional associations and communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured, analytical, and creative professionals are in demand.",
    futureRelevance:
      "Growing — human-centered and creative roles in administration and social services remain relevant.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Creativity
4. Collaboration
5. Practical problem-solving`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Balancing analytical and creative tasks
4. Stress under multitasking
5. May underestimate innovative solutions`,
    ],
  },
  {
    combination: "CER",
    fieldOfStudy: "Engineering, Applied Sciences, Business, Research",
    career:
      "Engineer, Research Analyst, Technical Coordinator, Project Manager",
    careerDesc:
      "CER individuals combine conventional organization (Conventional), investigative thinking (Investigative), and realistic problem-solving (Realistic). They excel in structured, analytical, and technical roles requiring planning, research, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or business
2. Skill Development: Learn research, technical, and project management skills
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured analytical and technical professionals are in demand.",
    futureRelevance:
      "Growing — STEM, applied research, and technical roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Attention to detail
5. Technical proficiency`,
    ],
    weaknesses: [
      `1. Can be rigid in processes
2. Risk of overemphasis on rules
3. Time management under complex projects
4. May underestimate creative solutions
5. Balancing technical and human aspects`,
    ],
  },
  {
    combination: "CEI",
    fieldOfStudy:
      "Engineering, Applied Sciences, Research, Creative Management",
    career: "Engineer, Technical Analyst, Researcher, Project Manager",
    careerDesc:
      "CEI individuals combine conventional organization (Conventional), investigative thinking (Investigative), and artistic creativity (Artistic). They thrive in structured, analytical, and innovative roles requiring research, planning, and creative problem-solving.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or management
2. Skill Development: Learn research, analytical, and creative skills
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured analytical and creative technical professionals are in demand.",
    futureRelevance:
      "Growing — STEM and applied research fields continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be perfectionist
2. Risk of overengineering
3. Time management challenges
4. May underestimate collaboration
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "CEA",
    fieldOfStudy:
      "Engineering, Applied Sciences, Administration, Creative Management",
    career: "Engineer, Project Manager, Technical Coordinator, Consultant",
    careerDesc:
      "CEA individuals combine conventional organization (Conventional), investigative thinking (Investigative), and artistic creativity (Artistic). They excel in structured, analytical, and innovative roles requiring planning, research, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or management
2. Skill Development: Learn project coordination, analytical, and creative skills
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured analytical and creative professionals are in demand.",
    futureRelevance:
      "Growing — STEM, applied research, and technical management roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Creativity
3. Organizational skills
4. Practical problem-solving
5. Planning and coordination`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk aversion
3. Time management under complex projects
4. May underestimate teamwork
5. Balancing creativity and structure`,
    ],
  },
  {
    combination: "CES",
    fieldOfStudy:
      "Engineering, Applied Sciences, Social Services, Administration",
    career:
      "Project Manager, Technical Coordinator, Social Researcher, Engineer",
    careerDesc:
      "CES individuals combine conventional organization (Conventional), investigative thinking (Investigative), and social awareness (Social). They excel in structured, analytical, and human-centered roles requiring research, planning, and practical execution.",
    actionPlan: [
      `1. Education: Degrees in engineering, applied sciences, or social sciences
2. Skill Development: Learn research, project management, and organizational skills
3. Practical Experience: Internships, applied projects, or research assignments
4. Networking: Join professional and technical communities
5. Continuous Learning: Stay updated with tools, trends, and best practices`,
    ],
    todayRelevance:
      "High — structured analytical and human-centered professionals are in demand.",
    futureRelevance:
      "Growing — STEM, applied research, and human services roles continue to expand.",
    strengths: [
      `1. Analytical thinking
2. Organizational skills
3. Practical problem-solving
4. Collaboration
5. Attention to detail`,
    ],
    weaknesses: [
      `1. Can be rigid in procedures
2. Risk of over-reliance on structure
3. Balancing analytical and social tasks
4. Stress under multitasking
5. May underestimate creative solutions`,
    ],
  },
];*/

export const careerDescriptions = [
  {
    type: "R",
    fullName: "Realistic",
    careerDesc:
      "You are an efficient and practical problem solver. You tend to be very hardworking. You are very generous especially when someone very close to you needs your help. You save money and don’t like to spend it carelessly on things they don’t need. You are reliable, responsible, patient and calm under pressure. Your strongest trait is your perseverance that comes very natural to you. You are punctual, plan ahead and stick with plans you make for yourself. Furthermore, you are very good at following through with things you have started no matter what obstacles may come your way.",
  },
  {
    type: "I",
    fullName: "Investigative",
    careerDesc:
      "You are intensely interested in knowing how and why things work, develop and change. You love to learn and acquire new skills and knowledge, which you use to find innovative solutions to difficult problems and also approaches that can be applied practically to your lives or work. Most probably you could be gifted with a talent to be a great writer or public speaker. You can become deeply affected by social causes and humanitarian issues, which you like to investigate and help resolve.",
  },
  {
    type: "A",
    fullName: "Artistic",
    careerDesc:
      "You are a person that always perceive life with an artistic perspective. You tend to be creative, impulsive, sensitive and possess a visionary style. You would love to have vibrant experiences in life and find pleasure in discovering the unknown. People with these characteristics seem to be more creative that is not limited to only paint and canvas. It could even mean implementing creativity to data and systems. You prefer to work independently rather than as part of a team. This is because you are not interested to work aligning to a set of rules.",
  },
  {
    type: "S",
    fullName: "Social",
    careerDesc:
      "You are good at good at making others happy, good at harmony, good at maintaining one sided relationship. You can be considered as a Jack of all trades rather than a master in something specific. You like working and living with lots of people and in a set structure. You cooperate well with others and is always considerate of other’s feelings or their needs while making decisions. You are less likely to behave selfishly.",
  },
  {
    type: "E",
    fullName: "Enterprising",
    careerDesc:
      "You have a natural predisposition to being entrepreneurial, being driven by their motivation and determination. You are hardworking and ambitious. You have an enterprising spirit with soft spot to have authority over people. You are able to express yourself openly and confidently and try to be as realistic as possible. Your self-confidence, courage and belief in human nature will help you to reach out to others when times get tough. You achieve to your goals in a different way than most people: in addition to using objectivity and impartiality, you use emotions and intuition when dealing with situations so as not to miss any opportunities that may arise.",
  },
  {
    type: "C",
    fullName: "Conventional",
    careerDesc:
      "You are thoughtful and idealistic and strive to have a positive impact on other people and the world around them. You rarely shy away from an opportunity to do the right thing, even when doing so is far from easy. Your passion and charisma will inspire others not just in their careers but in every arena of their lives, including their relationships. You like to be engaged in a variety of activities and tend not to focus on one particular area for too long.",
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create the 'pdfs' folder if it doesn't exist

const pdfFolder = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfFolder)) {
  fs.mkdirSync(pdfFolder);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });
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

const SMTPUser = process.env.SMTP_USER;
const SMTPPass = process.env.SMTP_PASS;
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies and credentials
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({
      TokenExpired: true,
      message: "Session expired. Please log in again.",
    });
  }
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          TokenExpired: true,
          message: "Session expired. Please log in again.",
        }); // Unauthorized (token expired)
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
    user: { name: req.user.name },
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

    connection.query(
      "SELECT * FROM tbl_users WHERE email = ?",
      [email],
      (err, results) => {
        if (results.length > 0) {
          return res.status(400).json({ error: "Email already registered" });
        }

        connection.query(
          "INSERT INTO tbl_users(name, email, password) VALUES(?, ?, ?)",
          [fullName, email, hash],
          (err2, result) => {
            if (err2) {
              console.error("Error inserting user:", err2);

              return res
                .status(500)
                .json({ error: "Server error while inserting user" });
            }

            return res
              .status(201)
              .json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error hashing password:", err);
    return res
      .status(500)
      .json({ error: "Server error: " + (err.message || "Please try again") });
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
                    has_completed_career_test: user.has_completed_career_test,
                  },
                  jwtSecretKey,
                  { expiresIn: "1h" }
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
    httpOnly: true,
    secure: false,
    path: "/",
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
  const { questionId, testResults, testType } = req.body;
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
    const hasCompletedCareerTest = req.user.has_completed_career_test;
    const { testType } = req.body;
    if (
      testType === "Career Test" &&
      hasCompletedCareerTest === 0 &&
      isPaid === 0
    ) {
      return res
        .status(403)
        .json({ message: "Payment req after test completion" });
    } else if (
      testType === "Career Test" &&
      hasCompletedCareerTest === 1 &&
      isPaid === 0
    ) {
      return res.json({ showPaymentModal: true });
    }

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

app.get("/calculateCareerScore", authMiddleware, (req, res) => {
  const userName = req.user.name;
  const { id, result } = req.query;
  const questionIds = id ? id.split(",").map(Number) : []; // Split by commas if `id` is a comma-separated string
  const selectedValues = result ? result.split(",") : [];
  console.log(questionIds);
  console.log(selectedValues);
  let realisticResult = [];
  let investigativeResult = [];
  let artisticResult = [];
  let socialResult = [];
  let enterprisingResult = [];
  let conventionalResult = [];

  // Define a trait count for each trait to normalize the score
  const typeCounts = {
    realistic: CareerQuestions.filter(
      (question) => question.type === "Realistic"
    ).length,
    investigative: CareerQuestions.filter(
      (question) => question.type === "Investigative"
    ).length,
    artistic: CareerQuestions.filter((question) => question.type === "Artistic")
      .length,
    social: CareerQuestions.filter((question) => question.type === "Social")
      .length,
    enterprising: CareerQuestions.filter(
      (question) => question.type === "Enterprising"
    ).length,
    conventional: CareerQuestions.filter(
      (question) => question.type === "Conventional"
    ).length,
  };

  console.log(typeCounts);

  questionIds.forEach((id, index) => {
    const question = CareerQuestions.find((q) => q.id === id);
    if (question) {
      const selectedValue = selectedValues[index];

      let newScore = 0;
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

      switch (question.type.toLowerCase()) {
        case "realistic":
          realisticResult.push(newScore);
          break;
        case "investigative":
          investigativeResult.push(newScore);
          break;
        case "artistic":
          artisticResult.push(newScore);
          break;
        case "social":
          socialResult.push(newScore);

          break;
        case "enterprising":
          enterprisingResult.push(newScore);
          break;
        case "conventional":
          conventionalResult.push(newScore);
          break;
        default:
          throw res.status(400).json({ error: "Error" });
      }
    }
  });

  const realisticScore = calculateResult(
    realisticResult,
    typeCounts.realistic,
    "realistic"
  );
  const investigateScore = calculateResult(
    investigativeResult,
    typeCounts.investigative,
    "investigative"
  );
  const artisticScore = calculateResult(
    artisticResult,
    typeCounts.artistic,
    "artistic"
  );
  const socialScore = calculateResult(
    socialResult,
    typeCounts.social,
    "social"
  );
  const enterprisingScore = calculateResult(
    enterprisingResult,
    typeCounts.enterprising,
    "enterprising"
  );
  const conventionalScore = calculateResult(
    conventionalResult,
    typeCounts.conventional,
    "conventional"
  );

  function calculateResult(resultArray, typeCounts, type) {
    const totalScore = resultArray.reduce(
      (accumulator, newScore) => accumulator + newScore,
      0
    );

    console.log("totalScore", `${type}`, totalScore);
    const percentage = Math.round((totalScore / (typeCounts * 5)) * 100);
    return {
      totalScore: totalScore,
      //desc: generateDescription(percentage, type),
    };
  }

  /*function generateDescription(percentage, type) {
    let description = "";
    let templatePath = "";
    switch (type) {
      case "realistic":
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
      case "investigative":
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
      case "artistic":
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
      case "social":
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
      case "enterprising":
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
      case "conventional":
        if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conventional-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 60) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conventional-60.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 40) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conventional-40.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else if (percentage >= 20) {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conventional-20.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        } else {
          templatePath = path.join(
            __dirname,
            "career-descriptions/conventional-10.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
        }
        break;
      default:
        description = "Invalid";
    }
    return description;
  }*/

  const scores = [
    { type: "R", score: realisticScore },
    { type: "I", score: investigateScore },
    { type: "A", score: artisticScore },
    { type: "S", score: socialScore },
    { type: "E", score: enterprisingScore },
    { type: "C", score: conventionalScore },
  ];

  const newSortedScores = scores.sort(
    (a, b) => b.score.totalScore - a.score.totalScore
  );
  console.log("newSortedScores", newSortedScores);

  const topThreeTypes = newSortedScores.slice(0, 3);
  console.log("topThreeTypes:", topThreeTypes);

  const match = careerDescriptions.filter((item) =>
    topThreeTypes.map((t) => t.type).includes(item.type)
  );
  console.log("match:", match);

  const topThreeCombination = topThreeTypes.map((item) => item.type).join("");
  console.log(topThreeCombination);

  const typeNames = {
    R: "Realistic",
    I: "Investigative",
    A: "Artistic",
    S: "Social",
    E: "Enterprising",
    C: "Conventional",
  };

  const fullName = topThreeCombination
    .split("")
    .map((code) => typeNames[code])
    .join(", ");

  console.log(fullName);

  const primaryCareerMatch = careerMapping.find(
    (item) => item.type === topThreeTypes[0].type
  );

  /* function generatePdf(percentageAll, match) {
    const doc = new PDFDocument();
    const fileName = `careerAssessment_results_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "pdfs", fileName);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add content to PDF
    doc
      .fontSize(18)
      .text("Career Assessment Test Results", { align: "center" });
    doc.moveDown();

    // Add results
    doc.fontSize(12).text(`Hi, ${userName}`);
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        `Based on your assessment, you are {match[0].fullName}, {match[1].fullName}, {match[2].fullName}.`,
        { lineGap: 6 }
      );

    doc.end();
    writeStream.on("finish", function () {
      callback(null, filePath);
    });

    writeStream.on("error", function (err) {
      callback(err, null);
    });
  }*/

  if (match && primaryCareerMatch) {
    const percentageAll = {
      realistic: {
        percentage: Math.round(
          (realisticScore.totalScore / (typeCounts.realistic * 5)) * 100
        ),
        type: "realistic",
      },
      investigative: {
        percentage: Math.round(
          (investigateScore.totalScore / (typeCounts.investigative * 5)) * 100
        ),
        type: "investigative",
      },
      artistic: {
        percentage: Math.round(
          (artisticScore.totalScore / (typeCounts.artistic * 5)) * 100
        ),
        type: "artistic",
      },
      social: {
        percentage: Math.round(
          (socialScore.totalScore / (typeCounts.social * 5)) * 100
        ),
        type: "social",
      },
      enterprising: {
        percentage: Math.round(
          (enterprisingScore.totalScore / (typeCounts.enterprising * 5)) * 100
        ),
        type: "enterprising",
      },
      conventional: {
        percentage: Math.round(
          (conventionalScore.totalScore / (typeCounts.conventional * 5)) * 100
        ),
        type: "conventional",
      },
    };
    //const pdf = generatePdf(percentageAll, match);
    console.log("match", match);
    console.log("percentageAll", percentageAll);
    return res.json({
      bestCareer: {
        realistic: {
          percentage: percentageAll.realistic.percentage,
          //description: realisticScore.desc,
        },
        investigative: {
          percentage: percentageAll.investigative.percentage,
          //description: investigateScore.desc,
        },
        artistic: {
          percentage: percentageAll.artistic.percentage,
          //description: artisticScore.desc,
        },
        social: {
          percentage: percentageAll.social.percentage,
          // description: socialScore.desc,
        },

        enterprising: {
          percentage: percentageAll.enterprising.percentage,
          //description: enterprisingScore.desc,
        },
        conventional: {
          percentage: percentageAll.conventional.percentage,
          //description: conventionalScore.desc,
        },

        fullName: fullName,
        //fieldOfStudy: match.fieldOfStudy,
        //career: match.career,
        matchedCareers: match,
        primaryCareerMatch: primaryCareerMatch,
        //actionPlan: match.actionPlan,
        //todayRelevance: match.todayRelevance,
        //futureRelevance: match.futureRelevance,
        //strength: match.strengths,
        //weaknesses: match.weaknesses,
      },
    });
  }
});

/*app.get("/calculateCareerScore", (req, res) => {
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
});*/

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
        if (percentage >= 50) {
          description =
            "You are more likely to have a high intelligence. You tend to be more curious and imaginative. You like complexity and can handle situations that require imagination. You are open to emotion, sensitive to beauty and willing to try new things. You would perform better in academic settings; this is because you are more creative and curious about problems.";
        } else {
          description =
            "You prefer familiar routines and surroundings, where you do well in because you are comfortable with them. You may find it difficult to solve abstract problems, especially those that are challenging and involve a lot of reasoning. You may feel less enthusiastic about learning new things, such as doing research or trying out novel activities.";
        }

        /*if (percentage >= 80) {
          templatePath = path.join(
            __dirname,
            "personality-descriptions/openness-80.html"
          );
          description = fs.readFileSync(templatePath, "utf8");
          //description = `A score above 80 signifies a strong preference for intellectual exploration, creative thinking, and a willingness to embrace novel ideas and unconventional experiences. You are drawn to abstract concepts, aesthetics, and new challenges, and likely thrive in environments that reward curiosity and innovation.You may excel in careers that involve creativity, innovation, and intellectual exploration, such as UX/UI design, research, architecture, or roles in the arts and creative consulting.`;
        }
         else if (percentage >= 60) {
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
        }*/

        break;
      case "conscientiousness":
        if (percentage >= 50) {
          description =
            "You always like to finish work on time, even if this means working late. This is because you have a strong sense of responsibility and feel as if it's your duty to complete work in a given period. Also, you might not take lunch breaks or a lot of sick days. You feel as if everything should be done in a specific order and that there is no point in doing anything out of sequence. You believe it's your duty to help those around you. You may often go beyond what is required so that you can make sure that other people are safe and happy. This quality can also make you a good leader, since you are able to push your team towards what is right.";
        } else {
          description =
            'You strive harder to achieve your goals. You are more spontaneous and fun loving.  You are known as "doer" because you prefer doing over reflecting. While this is good for getting stuff done, it could cause to act on impulse or out of restlessness. Stress can cause your performance to drop considerably. You are less able to control impulses and are more apt to seek stimulation. You are more likely to be disorganized, negligent, and prone to having addiction problems.';
        }
        /*if (percentage >= 80) {
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
        }*/
        break;
      case "extraversion":
        if (percentage >= 50) {
          description =
            'You are more sociable and enjoy social settings. You make friends easily, express yourself freely in groups, and enjoy conversing with large groups of people. You are inclined to initiate contacts with others, rather than waiting to be approached. You tend to be energized and "revved up" by social interaction, and less so by spending time alone or in quiet reflection. You like working with people more than working alone; You get energized being around other people. You are fun-loving, action-oriented individuals who are risk takers and are willing to try just about anything at least once. You have an optimistic outlook on life';
        } else {
          description =
            "You are usually shy, reserved, quiet, and introverted. However, you are more likely to be put under stress due to your perceived external overstimulation or social demands. This can cause you to feel uncomfortable in public situations and long for the comfort and tranquility of your private homes and family. You often feel that you do not have enough time to take care of daily tasks. You prefer solitary work and enjoy spending  free time alone as well. You tend to be more passive than active, and follow the leads set by others rather than setting it yourself.";
        }

        /*if (percentage >= 80) {
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
        }*/
        break;
      case "agreeableness":
        if (percentage >= 50) {
          description =
            "You tend to avoid situations that might cause conflict or negative feelings with others. You also try hard to avoid saying anything that might offend someone else, which sometimes results in them holding back your true thoughts and feelings. You might keep their unrefined opinions and behaviours to themselves, which can have a negative impact on your relationships. In the workplace, you might do more harm than good if you fail to speak up about important issues or problems that needs to be addressed.";
        } else {
          description =
            "Your personality reflect the independent pursuit of personal goals. You are willing to say no and take risk causing trouble if it gets you what you want. You might seem to be less concerned with how their behavior affects others. You might say or do things that are likely to upset people without worrying about the consequences of doing so, which can result in more open and honest discussions and greater group cohesion in some cases. You would have a tough time influencing others and their careers will suffer as a result";
        }
        /*if (percentage >= 80) {
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
        }*/
        break;
      case "neuroticism":
        if (percentage >= 50) {
          description =
            "You tend to be moody and worry a lot over minor things. You may perceive ordinary situations as threatening and minor frustrations as difficult. You might become angry very quickly and be upset at the slightest provocation. It's not a good idea for you to work in high-stress jobs because you might become stressed easily and find it difficult to cope with the pressure. Studies have shown that neuroticism is linked to a strong heart, so you might live longer than those who don't feel as much stress.";
        } else {
          description =
            "You display positive emotions such as happiness often and tend not to show emotions such as anger";
        }

        /*if (percentage >= 80) {
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
        }*/
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

app.post(
  "/sendResultsAsEmail",
  authMiddleware,
  upload.single("pdfFile"),
  (req, res) => {
    const email = req.user.email;
    const pdfPath = req.file.path;
    const userName = req.user.name;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // secure port
      secure: true,
      auth: {
        user: SMTPUser,
        pass: SMTPPass,
      },
    });

    const mailOptions = {
      from: SMTPUser,
      to: email,
      subject: "3QTest - Career Assessment Result",
      text: `Hi ${userName},\n\nPlease find your career assessment test report attached.`,
      attachments: [
        {
          path: pdfPath,
        },
      ],
    };
    console.log("mailOptions", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: error.message });
      fs.unlink(pdfPath, (unlinkError) => {
        if (unlinkError) {
          return res.json({ message: "Error deleting pdf file." });
        }
        res.json({ message: "File deleted" });
      });
    });
  }
);

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
