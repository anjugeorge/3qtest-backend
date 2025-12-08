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
import crypto from "crypto";
import multer from "multer";
import nocache from "nocache";

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

const pdfFolder = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfFolder)) {
  fs.mkdirSync(pdfFolder);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
const stripe_price_id = process.env.STRIPE_PRICE_ID;
const stripe_coupon_id = process.env.STRIPE_COUPON_ID;
const stripe_event_id = process.env.STRIPE_EVENT_ID;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const SMTPUser = process.env.SMTP_USER;
const SMTPPass = process.env.SMTP_PASS;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;

    if (endpointSecret) {
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log(`Checkout Completed`, session.id);

        if (session.payment_status === "paid") {
          const userId = session.metadata.user_id;
          const sessionId = session.id;
          const amountPaid = session.amount_total / 100;

          connection.query(
            `UPDATE tbl_users 
             SET is_paid = 1, 
                 stripe_session_id = ?, 
                 payment_date = NOW(),
                 amount_paid = ?
             WHERE id = ?`,
            [sessionId, amountPaid, userId],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating user payment status:", updateErr);
              } else {
                console.log("User payment status updated successfully.");
              }
            }
          );
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    response.json({ received: true });
  }
);

app.listen(4242, () => console.log("Running on port 4242"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(nocache());

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
    const { fullName, email, password, confirmPassword } = req.body;
    console.log(req.body);
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

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

app.post("/forgotPassword", (req, res) => {
  const email = req.body.email;
  // const userName = req.user.name;
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  connection.query(
    "SELECT * FROM tbl_users WHERE email = ?",
    [email],
    (err, users) => {
      if (users.length === 0) {
        return res.status(404).send("User not found");
      }

      const user = users[0];
    }
  );
  connection.query(
    `UPDATE tbl_users 
             SET reset_Token = ?, 
                reset_token_expiry = ?
                
             WHERE email = ?`,
    [hashedToken, new Date(Date.now() + 900000), email]
  );
  const resetLink = `http://localhost:5173/resetPassword?resetToken=${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTPUser,
      pass: SMTPPass,
    },
  });

  const mailOptions = {
    from: SMTPUser,
    to: email,
    subject: "Your 3QTest Career Assessment Report",
    html: `
    <p style="font-size:14px; line-height:1.8; ">
      Hi ,
    </p>

    <p style="font-size:14px; line-height:1.8;">
      We received a request to reset your password.
    </p>

    <p style="font-size:14px; line-height:1.8;">
     Click the link below to create a new password:
    </p>
${resetLink}
    <p style="font-size:14px; line-height:1.8;">
      Wishing you all the best in your career journey!
    </p>



    <p style="font-size:14px; line-height:1.8;">
      Warm regards,<br>The 3QTests by APSS Team
    </p>
  `,
  };

  console.log("mailOptions", mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ error: error.message });
  });
});

app.post("/resetPassword", async (req, res) => {
  try {
    const { token, newPassword } = req.body; // Changed from 'password' to 'newPassword'

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    connection.query(
      `SELECT * FROM tbl_users 
       WHERE reset_Token = ? 
       AND reset_token_expiry > NOW()`,
      [hashedToken],
      async (err, users) => {
        // Check for database error
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Check if token is valid
        if (users.length === 0) {
          return res.status(400).json({
            error: "Invalid or expired reset token",
          });
        }

        const user = users[0];

        try {
          // Hash the new password
          const saltRounds = 10;
          const hash = await bcrypt.hash(newPassword, saltRounds); // Use newPassword here

          // Update password and clear token
          connection.query(
            `UPDATE tbl_users 
             SET password = ?, 
                 reset_Token = NULL, 
                 reset_token_expiry = NULL 
             WHERE id = ?`,
            [hash, user.id],
            (updateErr, result) => {
              if (updateErr) {
                console.error("Update error:", updateErr);
                return res
                  .status(500)
                  .json({ error: "Failed to update password" });
              }

              return res.status(200).json({
                message: "Password reset successful",
              });
            }
          );
        } catch (hashErr) {
          console.error("Hashing error:", hashErr);
          return res.status(500).json({
            error: "Failed to hash password",
          });
        }
      }
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: "An error occurred during password reset",
    });
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
    };
  }

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
        matchedCareers: match,
        primaryCareerMatch: primaryCareerMatch,
      },
    });
  }
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
        if (percentage >= 50) {
          description =
            "You are more likely to have a high intelligence. You tend to be more curious and imaginative. You like complexity and can handle situations that require imagination. You are open to emotion, sensitive to beauty and willing to try new things. You would perform better in academic settings; this is because you are more creative and curious about problems.";
        } else {
          description =
            "You prefer familiar routines and surroundings, where you do well in because you are comfortable with them. You may find it difficult to solve abstract problems, especially those that are challenging and involve a lot of reasoning. You may feel less enthusiastic about learning new things, such as doing research or trying out novel activities.";
        }

        break;
      case "conscientiousness":
        if (percentage >= 50) {
          description =
            "You always like to finish work on time, even if this means working late. This is because you have a strong sense of responsibility and feel as if it's your duty to complete work in a given period. Also, you might not take lunch breaks or a lot of sick days. You feel as if everything should be done in a specific order and that there is no point in doing anything out of sequence. You believe it's your duty to help those around you. You may often go beyond what is required so that you can make sure that other people are safe and happy. This quality can also make you a good leader, since you are able to push your team towards what is right.";
        } else {
          description =
            'You strive harder to achieve your goals. You are more spontaneous and fun loving.  You are known as "doer" because you prefer doing over reflecting. While this is good for getting stuff done, it could cause to act on impulse or out of restlessness. Stress can cause your performance to drop considerably. You are less able to control impulses and are more apt to seek stimulation. You are more likely to be disorganized, negligent, and prone to having addiction problems.';
        }

        break;
      case "extraversion":
        if (percentage >= 50) {
          description =
            'You are more sociable and enjoy social settings. You make friends easily, express yourself freely in groups, and enjoy conversing with large groups of people. You are inclined to initiate contacts with others, rather than waiting to be approached. You tend to be energized and "revved up" by social interaction, and less so by spending time alone or in quiet reflection. You like working with people more than working alone; You get energized being around other people. You are fun-loving, action-oriented individuals who are risk takers and are willing to try just about anything at least once. You have an optimistic outlook on life';
        } else {
          description =
            "You are usually shy, reserved, quiet, and introverted. However, you are more likely to be put under stress due to your perceived external overstimulation or social demands. This can cause you to feel uncomfortable in public situations and long for the comfort and tranquility of your private homes and family. You often feel that you do not have enough time to take care of daily tasks. You prefer solitary work and enjoy spending  free time alone as well. You tend to be more passive than active, and follow the leads set by others rather than setting it yourself.";
        }

        break;
      case "agreeableness":
        if (percentage >= 50) {
          description =
            "You tend to avoid situations that might cause conflict or negative feelings with others. You also try hard to avoid saying anything that might offend someone else, which sometimes results in them holding back your true thoughts and feelings. You might keep their unrefined opinions and behaviours to themselves, which can have a negative impact on your relationships. In the workplace, you might do more harm than good if you fail to speak up about important issues or problems that needs to be addressed.";
        } else {
          description =
            "Your personality reflect the independent pursuit of personal goals. You are willing to say no and take risk causing trouble if it gets you what you want. You might seem to be less concerned with how their behavior affects others. You might say or do things that are likely to upset people without worrying about the consequences of doing so, which can result in more open and honest discussions and greater group cohesion in some cases. You would have a tough time influencing others and their careers will suffer as a result";
        }

        break;
      case "neuroticism":
        if (percentage >= 50) {
          description =
            "You tend to be moody and worry a lot over minor things. You may perceive ordinary situations as threatening and minor frustrations as difficult. You might become angry very quickly and be upset at the slightest provocation. It's not a good idea for you to work in high-stress jobs because you might become stressed easily and find it difficult to cope with the pressure. Studies have shown that neuroticism is linked to a strong heart, so you might live longer than those who don't feel as much stress.";
        } else {
          description =
            "You display positive emotions such as happiness often and tend not to show emotions such as anger";
        }

        break;
      default:
        description = "Invalid";
        care = "";
    }
    return description;
  }

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
      port: 587,
      secure: true,
      auth: {
        user: SMTPUser,
        pass: SMTPPass,
      },
    });

    const mailOptions = {
      from: SMTPUser,
      to: email,
      subject: "Your 3QTest Career Assessment Report",
      html: `
    <p style="font-size:14px; line-height:1.8; ">
      Hi ${userName},
    </p>

    <p style="font-size:14px; line-height:1.8;">
      Thank you for completing your Career Assessment Test!
    </p>

    <p style="font-size:14px; line-height:1.8;">
      Attached is your personalized career report, crafted to help you better understand your strengths, interests, and potential career paths. We hope this report provides valuable insights and guidance as you explore opportunities that best match your unique profile.
    </p>

    <p style="font-size:14px; line-height:1.8;">
      Wishing you all the best in your career journey!
    </p>

    <p style="font-size:14px; line-height:1.8;">
      Warm regards,<br>The 3QTests by APSS Team
    </p>
  `,
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
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!result || !result[0]) {
        return res.status(404).json({ error: "User not found" });
      }
      if (result[0].has_completed_career_test === 0) {
        return res.status(403).json({
          message: "Please complete the Career Test before making a payment.",
        });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
          //cancel_url: `https://3qtests.com/cancel`,
          line_items: [
            {
              price: stripe_price_id,
              quantity: 1,
            },
          ],
          mode: "payment",
          customer_email: email,
          payment_method_types: ["card"],

          ...(stripe_coupon_id && {
            discounts: [
              {
                coupon: stripe_coupon_id,
              },
            ],
          }),

          metadata: {
            user_id: userId.toString(),
            event_id: stripe_event_id,
          },
        });

        console.log(session);

        return res.json({ url: session.url });
      } catch (err) {
        console.error("Stripe Error", err.message);
        console.error(" Error Type", err.type);
        console.error(" Error Code", err.code);
        return res
          .status(500)
          .json({ error: "Failed to create checkout session" });
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
