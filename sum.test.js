const { sum, multiply, asyncMultiply, throwError, getArray } = require('./sum');
const { applyDocsForChain, createDocFromTxt, createChainForDoc, answFromPromptTemplateWParser01, config, load_model, chat_completion, init_promptTemplateV1, init_promptTemplateV2, answFromPromptTemplate } = require('./openaiapi');
const { StructuredOutputParser } = require ("langchain/output_parsers");
const {
  CommaSeparatedListOutputParser,
  StringOutputParser,
  BaseOutputParser,
} = require("@langchain/core/output_parsers");
const {z} = require("zod");
const { Document } = require ("@langchain/core/documents");

/*
Video 04
*/
describe.only('Retrieval chains', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  describe('init_promptTemplateV1, createDoc, chain.invoke(', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template =   
          `Answer the user's question from the following context: 
          Context {context}
          Question: {input}`,
      );
      expect(p).toBe(true);

      await createChainForDoc(
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

      const response = await applyDocsForChain(documentA, documentB)
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
      expect(p).toBeTruthy();
    })
    it('Test StructuredOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "notUSedHere",
        _parser = StructuredOutputParser.fromZodSchema(    
          z.object({
            recipe: z.string().describe("name of recipe"),
            ingredients: z.array(z.string()).describe("ingredients"),
          })
        ),_dataToTreat = {
          phrase: 			"The ingredients for a Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs.",
          format_instructions: _parser.getFormatInstructions(),
        }
      );
      
      expect(r).toHaveProperty('recipe');
      expect(r).toHaveProperty('ingredients');
    })
    // There is NO init_promptTemplateV2 for answFromPromptTemplateWParser01
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
      expect(p).toBe(true);
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
      expect(r).toHaveProperty('name');
      expect(r).toHaveProperty('age');
      expect(r.name).toBe('Max'); 
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
      expect(p).toBe(true);
    })
    it('Test CommaSeparatedListOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = new CommaSeparatedListOutputParser()
      );
      console.log("from Test CommaSeparatedListOutputParser");
      console.log(r);
      expect(Array.isArray(r)).toBeTruthy();
    })
  })
  // describe('init_promptTemplateV2, answFromTemplate, StringOutputParser', () => {
    
  // })
  describe('init_promptTemplateV1, answFromTemplate, StringOutputParser', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = 'Tell a joke about {word}',
      );
      expect(p).toBe(true);
    })
    it('Test StringOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = new StringOutputParser()
      );
      console.log("from Test StringOutputParser");
      console.log(r);
      expect(typeof r).toBe('string');
    })
  })
  describe('init_promptTemplateV2, answFromTemplate, StringOutputParser', () => {
    it('Initialisation template from v2', async () => {
      p = await init_promptTemplateV2(    
        _template = "You are a talented chef.  Create a recipe based on a main ingredient provided by the user in 25words."
      );
      expect(p).toBe(true);
    })
    it('Test StringOutputParser', async () => {
      const r = await answFromPromptTemplateWParser01(
        _word = "dinosaurs",
        _parser = new StringOutputParser()
      );
      console.log("from Test StringOutputParser");
      console.log(r);
      expect(typeof r).toBe('string');
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
      expect(p).toBe(true);
    });
    it('Get answer', async () => {
      const r = await answFromPromptTemplate(_word = "dinosaurs");
      console.log("from init_promptTemplateV1");
      console.log(r);
      expect(typeof r).toBe('string');
    })
  })
  describe('init_promptTemplateV2, answFromTemplate', () => {

    it('Initialisation template from v2', async () => {
      p = await init_promptTemplateV2( 
        _template = "You are a talented chef.  Create a recipe based on a main ingredient provided by the user in 25words."
      );
      expect(p).toBe(true);
    });
    it('Get answer', async () => {
      const r = await answFromPromptTemplate(word = "mangoes");
      console.log("from init_promptTemplateV2");
      console.log(r);
      expect(typeof r).toBe('string');
    })
  })
})

describe('Basic', () => {
  it('loading the configuration', () => {
    expect(config()).toBeTruthy();
  });
  it('loading the model', () => {
    expect(load_model()).toBeTruthy();
  });

  it('Chat completion', async () => {
    res = await chat_completion(_text='tell me a joke about cat? tell it in 10characters max');
    console.log('From Chat Completion')
    console.log(res);
    expect(typeof res).toBe('string');
  });

});


// // const { config } = require('./openaiapi');

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









