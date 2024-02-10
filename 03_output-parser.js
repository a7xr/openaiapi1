import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
  BaseOutputParser,
} from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";

import {z} from "zod";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.9,
});

// in drawio _ not explained
async function callStringOutputParserWFromPromptMessage () {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Tell me a funny joke about based on the input of the user",
    ],
    ["human", "{word}"],
  ]);
  const parser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(parser);

  return await chain.invoke({
    word: "chicken",
  });
}

// in drawio _ not explained
async function callStringOutputParserWPromptTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate("Tell a joke about {word}.");
  const outputParser = new StringOutputParser();

  // Create the Chain
  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({ word: "dog" });
}

// in drawio
async function callListOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
      Provide 5 synonyms, separated by commas, for the following word {word}
  `);

  const outputParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({
      word: "happy"
  });
}

// in drawio
async function callStructuredParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract infromation from the following phrase. 
    Formatting Instructions: {format_instructions}
    Phrase: {phrase}
  `);
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "The name of the person",
    age: "The name of the age"
  });
  // const chain = prompt.pipe(model).pipe(outputParser);
  const chain = prompt.pipe(model);
  return await chain.invoke({
    phrase: "Max is 30 years old.",
    format_instructions: outputParser.getFormatInstructions()
  });
}

async function callZodStructuredParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Extract information from the following phrase.\n{format_instructions}\n{phrase}"
  );
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      recipe: z.string().describe("name of recipe"),
      ingredients: z.array(z.string()).describe("ingredients"),
    })
  );

  // Create the Chain
  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({
    phrase:
      "The ingredients for a Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs.",
    format_instructions: outputParser.getFormatInstructions(),
  });
}

// const response = await callStringOutputParserWFromPromptMessage();
// const response = await callStringOutputParserWPromptTemplate();
// const response = await callListOutputParser();
// const response = await callStructuredParser();
const response = await callZodStructuredParser();
console.log(response);
