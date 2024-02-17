const { CheerioWebBaseLoader } = require ("langchain/document_loaders/web/cheerio");
// import * as dotenv from "dotenv";
const dotenv = require('dotenv');
const ChatOpenAI = require('@langchain/openai').ChatOpenAI;
const {ChatPromptTemplate} = require("@langchain/core/prompts") ;
// const { StructuredOutputParser } = require ("langchain/output_parsers");
const {
    CommaSeparatedListOutputParser,
    StringOutputParser,
    BaseOutputParser,
  } = require("@langchain/core/output_parsers");
const { createStuffDocumentsChain } = require ("langchain/chains/combine_documents");
const {z} = require("zod");
const { Document } = require ("@langchain/core/documents");
const { RecursiveCharacterTextSplitter } = require ("langchain/text_splitter");
const { OpenAIEmbeddings } = require ("@langchain/openai");
const { MemoryVectorStore } = require ("langchain/vectorstores/memory");
const { createRetrievalChain } = require ("langchain/chains/retrieval");

// const path = require('path');

let model;
let promptTemplate;
let chain;

async function createToolsToSplitWebContent(
        _input = "Where should I check if I'm looking for a good place to get started ?", 
        _docs
) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });
    console.log('qmsdlkfjzaeoiru')
    const splitDocs = await splitter.splitDocuments(_docs);
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
    let response = await retrievalChain.invoke({
        input: _input,
        context: _docs
    });
    const outputParser = new StringOutputParser();
    let rawResponse = await retrievalChain.invoke({
        input: _input,
        context: _docs
    });
    try {
        console.log('RawResponse: ', rawResponse)
        console.log('--------------------------------------------------------------')
        response = outputParser.parse(rawResponse);
        console.log('Response: ', response)
        console.log('--------------------------------------------------------------')
        
        let strLet;
        response.then(res => {
            // Ici, 'response' est l'objet résolu de la promesse
            strLet = res.answer
            console.log(typeof strLet); // Affiche la section 'answer' de l'objet
        }).catch(error => {
            // Gérer les erreurs ici
            console.error("Une erreur s'est produite :", error);
        });
        return response
        console.log(typeof response)
    }catch(error){
        console.error('Erreur lors du traitement de la réponse:', error);
    }
}

async function createDocFromUrl(
    _url = "https://js.langchain.com/docs/expression_language/"
) {
    const loader = new CheerioWebBaseLoader(
        _url
    );
    const docs = await loader.load();
    return docs;
}

async function createChainForDocFromTemplV1(
    _template = `
        Answer the user's question from the following context: 
        Context {context}
        Question: {input}
    `
){
    const prompt = ChatPromptTemplate.fromTemplate(
        _template
    );

    // console.log("prompt: ", prompt)
    // console.log("promptTemplate: ", promptTemplate)

    chain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });
    return true;
}

async function applyInputForChain(_input, ... _docs) {
    return await chain.invoke({
        input: _input,
        context: _docs
    });
}

function createDocFromTxt(
        _txt = "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support."
) {
    return new Document({
        pageContent:  _txt,
    });
}

async function answFromPromptTemplateWParser01(
    _word = 'dog',
    _parser = new StringOutputParser(),
    _dataToTreat = {
        phrase: "Max is 30 years old.",
        format_instructions: _parser.getFormatInstructions()
    }
){
    chain = promptTemplate.pipe(model).pipe(_parser);

    if ((_parser instanceof StringOutputParser) | (_parser instanceof CommaSeparatedListOutputParser)) {
        
        const response = await chain.invoke(
            {
                word: _word
            }
        );
        console.log("typeof response");
        console.log(typeof response);
        return response;
    } 
    else if (_parser.constructor.name == "StructuredOutputParser") {
        console.log("Heeeeeeeeeeeeeere")
        const res = await chain.invoke(_dataToTreat);
        console.log("res", res);
        return res;
    }
    else {
        // console.log("from StructuredOutputParser")
        // console.log(Object.prototype.toString.call(_parser))
        // console.log('Le type de _parser est ', _parser.constructor.name);
    }
}

async function answFromPromptTemplate(
    _word = 'dog',
    // _parser = new StringOutputParser()
){
    // chain = promptTemplate.pipe(model).pipe(_parser);
    chain = promptTemplate.pipe(model);
    const response = await chain.invoke(
        {
            word: _word
        }
    );
    return response.content;
}
/*
this is part 3/4 of the video 02
*/
async function init_promptTemplateV2(
        _template = "You are a talented chef.  Create a recipe based on a main ingredient provided by the user."
){
    promptTemplate = ChatPromptTemplate.fromMessages([
        [
          "system",
          _template,
        ],
        ["human", "{word}"],
    ]);
    return true;
}

/*
this is part 1/4 of the video 02
*/
async function init_promptTemplateV1(
    _template = 'Tell a joke about {word}', 
) {
    promptTemplate = ChatPromptTemplate.fromTemplate(_template);
    return true;
}

/*
config() and load_model(x, x) are mandatory on all videos
*/
function config(){
    // const envPath = path.resolve(__dirname, '../.env');
    // return dotenv.config({ path: envPath });
    dotenv.config();
    return true;
}

/*
config() and load_model(x, x) are mandatory on all videos
*/
function load_model(
    _temperature = 0.9, 
    _modelName = "gpt-3.5-turbo"
) {
    model = new ChatOpenAI({
      modelName: _modelName,
      temperature: _temperature,
    });
    return true;
} 

/*
    This is for the video 01
*/
async function chat_completion(_text='what is your name? tell it in 10characters max') {
    const response = await model.invoke(_text);
    return response.content;
}

module.exports = { createToolsToSplitWebContent, config, load_model, chat_completion, init_promptTemplateV1, init_promptTemplateV2, answFromPromptTemplate, applyInputForChain, answFromPromptTemplateWParser01, createChainForDocFromTemplV1, createDocFromTxt, createDocFromUrl };