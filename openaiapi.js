// import * as dotenv from "dotenv";
const dotenv = require('dotenv');
const ChatOpenAI = require('@langchain/openai').ChatOpenAI;
const {ChatPromptTemplate} = require("@langchain/core/prompts") ;

// const path = require('path');

let model;
let promptTemplate;
let chain;


/*
this is part 1/4 of the video 02
*/
// async function init_promptTemplateV2(
//     template = "You are a talented chef.  Create a recipe based on a main ingredient provided by the user.",
//     changeInTemplate = {
//         word: "dog"
//     }
// ){
//     promptTemplate = ChatPromptTemplate.fromMessages([
//         [
//           "system",
//           template,
//         ],
//         ["human", "{word}"],
//     ]);
//     chain = prompt.pipe(model);
//     const response = await chain.invoke(
//         changeInTemplate
//     );
//     return response.content;
// }

/*
this is part 2/4 of the video 02
*/
async function answFromPromptTemplateV1(
    change = {
        word: "dog",
    }
) {
    chain = promptTemplate.pipe(model);
    const response = await chain.invoke(change);
    return response.content;
}

/*
this is part 1/4 of the video 02
*/
async function init_promptTemplateV1(
    template = 'Tell a joke about {word}', 
    changeInTemplate = {
        word: "dog"
    }
) {
    promptTemplate = ChatPromptTemplate.fromTemplate(template);
    return await promptTemplate.format(changeInTemplate);
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
    temperature = 0.9, 
    modelName = "gpt-3.5-turbo"
) {
    model = new ChatOpenAI({
      modelName: modelName,
      temperature: temperature,
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

module.exports = { config, load_model, chat_completion, init_promptTemplateV1, answFromPromptTemplateV1 };