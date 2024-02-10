import { ChatOpenAI } from "@langchain/openai";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";

import {AIMessage, HumanMessage} from '@langchain/core/messages';
import {MessagesPlaceholder} from '@langchain/core/prompts';

import * as dotenv from "dotenv";
dotenv.config();

const createChain = async (vectorStore) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });
  
  // const prompt = ChatPromptTemplate.fromTemplate(
  //   `Answer the user's question from the following context: 
  //   {context}
  //   Chat History: {chat_history}
  //   Question: {input}`
  // );

  const prompt = ChatPromptTemplate.fromMessages(
    ["system", 	"Answer the user's questions based on the following context: {context}", ],
    new MessagesPlaceholder("chat_history"),
    ["user", 	"{input}"]
  );
  
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const retriever = vectorStore.asRetriever({ k: 2 });
  
  const conversationChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever,
  });

  return conversationChain;
}

const createVectorStore = async () => {
  const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/docs/expression_language/"
  );
  const docs = await loader.load();
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  
  const embeddings = new OpenAIEmbeddings();
  
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  return vectorstore;
}

const vectorStore = await createVectorStore();
// console.log(vectorStore);
const chain = await createChain(vectorStore);

const chatHistory =  [
  new HumanMessage("Hello"),
  new AIMessage("Hi, How can I help you ?"),
  new HumanMessage("My name is Leon"),
  new AIMessage("Hi Leon, how can I help you ?"),
  new HumanMessage("What is LCEL ?"),
  new AIMessage("LCEL stands for Langchain Expression Language ?"),
  new HumanMessage("What is the color of the sky today ?"),
  new AIMessage("Today, the sky is very gray"),
]

const response = await chain.invoke({
  // input: "What is the color of the sky today ?",
  input: 'What is my name ?',
  chat_history: chatHistory
});

console.log(response);