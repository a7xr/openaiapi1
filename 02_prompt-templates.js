import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.9,
});

const prompt = ChatPromptTemplate.fromTemplate('Tell a joke about {word}');
console.log(await prompt.format({word: "chicken"}))

const chain = prompt.pipe(model);

const response = await chain.invoke({
  word: "dog",
});

console.log(response.content)