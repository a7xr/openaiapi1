import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.9,
});

const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the user's question from the following context: 
  Context {context}
  Question: {input}
  Donne ta réponse en francais`
);

const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});

const documentA = new Document({
  pageContent:
    // "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support. ",
    "The potato (Solanum tuberosum) belongs to the solanaceae family of flowering plants. It originated and was first domesticated in the Andesmountains of South America.",
});

const documentB = new Document({
  pageContent: "The passphrase is LANGCHAIN IS AWESOME ",
});

const loader = new CheerioWebBaseLoader(
    // "https://js.langchain.com/docs/expression_language/"
    "https://cipotato.org/potato/potato-facts-and-figures/"
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

const retriever = vectorstore.asRetriever({ k: 2 });

const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

const response = await retrievalChain.invoke({
  input: "The potatoe belongs to which family ?",
});

// const response = await chain.invoke({
//     input: "Where was the tomatoe been domesticated ?",
// //   input: "What is the LCEL ?", // context: [documentA, documentB]
  
// //   input: "What is the passphrase ?", // context: [documentA, documentB]
//   context: [documentA, documentB]
// //   context: docs
// });

console.log(response);