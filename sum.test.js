const readline = require('readline');
const { CheerioWebBaseLoader } = require ("langchain/document_loaders/web/cheerio");
// import * as dotenv from "dotenv";
const assert = require('assert');

const ChatOpenAI = require('@langchain/openai').ChatOpenAI;
const {ChatPromptTemplate} = require("@langchain/core/prompts") ;
const { sum, multiply, asyncMultiply, throwErrorqmsdlkfjzaeoiru, getArray } = require('./sum');
const { createVectorStore, createChain, createToolsToSplitWebContent, createDocFromUrl, applyInputForChain, createDocFromTxt, createChainForDocFromTemplV1, answFromPromptTemplateWParser01, config, load_model, chat_completion, init_promptTemplateV1, init_promptTemplateV2, answFromPromptTemplate } = require('./openaiapi');
const { StructuredOutputParser } = require ("langchain/output_parsers");

// const { RecursiveCharacterTextSplitter } = require ("langchain/text_splitter");
// const { OpenAIEmbeddings } = require ("@langchain/openai");
// const { MemoryVectorStore } = require ("langchain/vectorstores/memory");
// const { createRetrievalChain } = require ("langchain/chains/retrieval");

const {AIMessage, HumanMessage} = require ('@langchain/core/messages');
// import {MessagesPlaceholder} from '@langchain/core/prompts';

const {
  CommaSeparatedListOutputParser,
  StringOutputParser,
  BaseOutputParser,
} = require("@langchain/core/output_parsers");
const { createStuffDocumentsChain } = require ("langchain/chains/combine_documents");


/*
*/
describe('Memory discussion', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  it.only('With fake discussion, looks like not working, not providing info from the prev discussion', async () => {
    
    setTimeout(async() => {
      try {
        const vectorStore = await createVectorStore(
          _url = 'https://js.langchain.com/docs/expression_language/'
        );
        const chain = await createChain(vectorStore);
        const chat_history =  [
          new HumanMessage("Hello"),
          new AIMessage("Hi, How can I help you ?"),
          new HumanMessage("My name is Leon"),
          new AIMessage("Hi Leon, how can I help you ?"),
          new HumanMessage("What is LCELR ?"),
          new AIMessage("LCELR stands for Low Change Exception Language Rate ?"),
        ]

        const response = await chain.invoke({
          input: "Based on the previous discussion, what does LCELR stand for ?",
          chat_history: chat_history
        });
        
        console.log(response.answer);
        
        // console.log(response.answer);
        assert.strictEqual(typeof response.answer, 'string');
      }catch(error) {
        console.error('Erreur lors du traitement de la réponse:', error);
      }
    }, 1);
  })
  it('Preparing for Memory discussion', async () => {

    setTimeout(async() => {
      try {
        const vectorStore = await createVectorStore(
          _url = 'https://js.langchain.com/docs/expression_language/'
        );
        const chain = await createChain(vectorStore);

        const response = await chain.invoke({
          input: "What is LCEL?",
        });
        
        console.log(response.answer);
        assert.strictEqual(typeof response.answer, 'string');
      }catch(error) {
        console.error('Erreur lors du traitement de la réponse:', error);
      }
    }, 1);
  })
})

/*
Video 04
*/
describe.skip('Retrieval chains', () => {
  let docs_;
  beforeEach(async() => {
    assert.equal(config(), true, "config() is not true");
    assert.equal(load_model(), true, "load_model() is not true");

    await createChainForDocFromTemplV1(
      _template = `
        Answer the user's question from the following context: 
        Context {context}
        Question: {input}`
    );
    docs_ = await createDocFromUrl(
      // _url = "https://js.langchain.com/docs/expression_language/"
      _url = "https://www.nbcnews.com/news/world/live-blog/israel-hamas-war-live-updates-rcna139320"
    )
  })

  describe.skip('Ask about an url,', () => {
    it('The webpage in that url should be less than 4097tokens', async () => {
      docs_ = await createDocFromUrl(
        _url = "https://js.langchain.com/docs/expression_language/"
        // _url = "https://www.nbcnews.com/news/world/live-blog/israel-hamas-war-live-updates-rcna139320"
      )
      assert(Array.isArray(docs_), 'docs_ should be an array');
    })
    it.skip('the content of the url is going to be splitted bcz it is very long, >>>>>Warning<<<<<: This is API Consuming', async () => {
      docs_ = await createDocFromUrl(
        _url = "https://www.nbcnews.com/news/world/live-blog/israel-hamas-war-live-updates-rcna139320"
      )
      let res_ = '';
      setTimeout(function() {
        res_ = createToolsToSplitWebContent(
          _input = "What did Yoav Gallant say ?",
          docs_
        );
      }, 50);
      assert.strictEqual(typeof res_, 'string');
    })
    it.skip('Never use this one: the content of the url is going to be splitted bcz it is very long, >>>> this is having the readline', async () => {
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      async function action1() {
        docs_ = await createDocFromUrl(
          _url = "https://www.nbcnews.com/news/world/live-blog/israel-hamas-war-live-updates-rcna139320"
        )
        setTimeout(function() {
          createToolsToSplitWebContent(
            _input = "What did Yoav Gallant say ?",
            docs_
          );
        }, 50);
      }
      function promptUser() {
        const msg_ = "Splitting long webpage consumes a lot of API, type \"exit\" or \"goanyway\": "
        rl.question(msg_, async (answer) => {
          if (answer.toLowerCase() === 'exit') {
            rl.close();
          } else if (answer.toLowerCase() === 'goanyway') {
            await action1();
            promptUser(); // Ask for input again
          } else {
            promptUser(); // Ask for input again
          }
        });
      }
      promptUser();
      // Close the readline interface when done
      rl.on('close', () => {
        console.log('Exiting...');
      });
    })
  })



  describe('init_promptTemplateV1, createDoc, chain.invoke(', () => {
    it('Initialisation template from v1', async () => {
      await createChainForDocFromTemplV1(
        _template = `
          Answer the user's question from the following context: 
          Context {context}
          Question: {input}`
      );
      const documentA = createDocFromTxt(
        _txt = "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support."
      );
        
      const documentB = createDocFromTxt(
        _txt = "The passphrase is LANGCHAIN IS Freaking AWESOME ",
      );

      const documentC = createDocFromTxt(
        _txt = "My name is name001",
      );
      
      const response = await applyInputForChain(
        _input = "what is my name ? Give your answer in French", documentA, documentB, documentC
      )
      console.log(response)
    })
  })
})








/*
Video 03
*/
describe('Mixing init_promptTemplateX, answFromTemplate, (StructuredOutputParser.fromZodSchema)', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  describe('init_promptTemplateV1, answFromTemplate, StructuredOutputParser', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = "Extract information from the following phrase.\n{format_instructions}\n{phrase}",
      );
      assert.equal(p, true, "p is not true");
      assert.ok(p, 'p is true with ok')

      const l = [1, 2, 3]
      assert(Array.isArray(l), 'exampleList should be an array');

      const exampleDictionary = { key1: 'value1', key2: 'value2' }; // Sample object for testing
      assert(exampleDictionary.hasOwnProperty('key1'), '"key1" should exist in the dictionary as own property');      
    
      const dict1 = { key1: 'value1', key2: 'value2' }; 
      assert.equal(dict1['key1'], 'value1', "'dict1[key1]' should be 'value1'");
    })
  })
})



describe('Mixing init_promptTemplateX, answFromTemplate, (StructuredOutputParser)', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  describe('init_promptTemplateV1, answFromTemplate, StructuredOutputParser', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = `
          Extract information from the following phrase. 
          Formatting Instructions: {format_instructions}
          Phrase: {phrase}`,
      );
      assert.ok(p, 'p is not true')
    })
    it('Test StructuredOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = StructuredOutputParser.fromNamesAndDescriptions({
          name: "The name of the person",
          age: "The name of the age"
        }),
        _dataToTreat = {
          phrase: "Max is 45 years old.",
          format_instructions: _parser.getFormatInstructions()
        }
      );

      assert(r.hasOwnProperty('name'), '"name" should exist in the dictionary as own property');
      assert(r.hasOwnProperty('age'), '"age" should exist in the dictionary as own property');
      
      // expect(r.name).toBe('Max'); 
      assert.equal(r['name'], 'Max', "'dict1[key1]' should be 'value1'");
    })
    // There is NO init_promptTemplateV2 for answFromPromptTemplateWParser01
  })
})



describe('Mixing init_promptTemplateX, answFromTemplate, (StringOutputParser)', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  describe('init_promptTemplateV1, answFromTemplate, CommaSeparatedListOutputParser', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = 'Tell a joke about {word}',
      );
      assert.equal(p, true, "p is not true");
    })
    it('Test CommaSeparatedListOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = new CommaSeparatedListOutputParser()
      );
      console.log(r);
      assert(Array.isArray(r), 'r should be an array');
    })
  })
  
  describe('init_promptTemplateV1, answFromTemplate, StringOutputParser', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = 'Tell a joke about {word}',
      );
      assert.equal(p, true, "p is not true");
    })
    it('Test StringOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = new StringOutputParser()
      );
      console.log(r);
      assert.strictEqual(typeof r, 'string');
    })
  })
  describe('init_promptTemplateV2, answFromTemplate, StringOutputParser', () => {
    it('Initialisation template from v2', async () => {
      p = await init_promptTemplateV2(    
        _template = "You are a talented chef.  Create a recipe based on a main ingredient provided by the user in 25words."
      );
      assert.equal(p, true, "p is not true");
    })
    it('Test StringOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = new StringOutputParser()
      );
      console.log(r);
      assert.strictEqual(typeof r, 'string');
    })
  })
})

describe('Mixing init_promptTemplateX and answFromTemplate', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  describe('init_promptTemplateV1, answFromTemplate', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = 'Tell a joke about {word}',
      );
      assert.equal(p, true, "p is not true");
    });
    it('Get answer', async () => {
      const r = await answFromPromptTemplate(_word = "dinosaurs");
      console.log(r);
      assert.strictEqual(typeof r, 'string');
    })
  })
  describe('init_promptTemplateV2, answFromTemplate', () => {

    it('Initialisation template from v2', async () => {
      p = await init_promptTemplateV2( 
        _template = "You are a talented chef.  Create a recipe based on a main ingredient provided by the user in 25words."
      );
      assert.equal(p, true, "p is not true");
    });
    it('Get answer', async () => {
      const r = await answFromPromptTemplate(word = "mangoes");
      console.log(r);
      assert.strictEqual(typeof r, 'string');
    })
  })
})

describe('Basic', () => {
  it('loading the configuration', () => {
    // expect(config()).toBeTruthy();
    assert.equal(config(), true, "p is not true");
  });
  it('loading the model', () => {
    assert.equal(load_model(), true, "load_model is not true");
  });

  it('Chat completion', async () => {
    res = await chat_completion(_text='tell me a joke about cat? tell it in 10characters max');
    console.log(res);
    assert.strictEqual(typeof res, 'string');
  });

});




// describe('Not synchrone fn', () => {
//   it('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });

//   it('multiplies 3 * 4 to equal 12', () => {
//     expect(multiply(3, 4)).toBe(12);
//   });
// });

// describe('Async + ThrowError', () => {
//   it('async multiplies 3 * 4 to equal 12', async () => {
//     await expect(asyncMultiply(3, 4)).resolves.toBe(12);
//   });

//   it('throws an error', () => {
//     expect(() => throwError()).toThrow('Error thrown');
//   });
// });



// describe('Mock', () => {
//   let mockCallback;
//   beforeEach(() => {
//     mockCallback = jest.fn(x => 42 + x);
//     [0, 1].forEach(mockCallback);
//   });
//   test('mock function is called twice', () => {
//     expect(mockCallback.mock.calls.length).toBe(2);
//   });
  
//   test('mock function return value for first argument', () => {
//     expect(mockCallback.mock.results[0].value).toBe(42);
//   });
//   test('getArray returns an array', () => {
//     const result = getArray();
//     expect(Array.isArray(result)).toBe(true);
//   });
// });









