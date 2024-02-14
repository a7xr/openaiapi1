// import * as dotenv from "dotenv";
const dotenv = require('dotenv');
const ChatOpenAI = require('@langchain/openai').ChatOpenAI;
const {ChatPromptTemplate} = require("@langchain/core/prompts") ;

// const path = require('path');

let model;
let promptTemplate;
let chain;

async function answFromPromptTemplate(
    _word = 'dog'
){
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
    _changeInTemplate = {
        word: "dog"
    }
) {
    promptTemplate = ChatPromptTemplate.fromTemplate(_template);
    return await promptTemplate.format(_changeInTemplate);
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
async function chat_completion(text='what is your name? tell it in 10characters max') {
    const response = await model.invoke(text);
    // console.log(response.content);
    return response.content;
}

module.exports = { config, load_model, chat_completion, init_promptTemplateV1, init_promptTemplateV2, answFromPromptTemplate };