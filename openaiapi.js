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

// const path = require('path');

let model;
let promptTemplate;
let chain;



async function createChainForDoc(
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

    const documentA = createDocFromTxt(
        _txt = "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support."
    );
      
    const documentB = createDocFromTxt(
        _txt = "The passphrase is LANGCHAIN IS Freaking AWESOME ",
    );
    const response = await chain.invoke({
        input: "What is the passphrase ?",
        context: [documentA, documentB]
    });
    console.log(response);
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
    // return await promptTemplate.format(_changeInTemplate);
    return true;
}

/*
config() and load_model(x, x) are mandatory on all videos
*/
function config(){
    // const envPath = path.resolve(__dirname, '../.env');
    // return dotenv.config({ path: envPath });
    return dotenv.config();
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
    return model;
} 

/*
    This is for the video 01
*/
async function chat_completion(_text='what is your name? tell it in 10characters max') {
    const response = await model.invoke(_text);
    return response.content;
}

module.exports = { config, load_model, chat_completion, init_promptTemplateV1, init_promptTemplateV2, answFromPromptTemplate, answFromPromptTemplateWParser01, createChainForDoc };