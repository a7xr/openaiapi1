const { sum, multiply, asyncMultiply, throwError, getArray } = require('./sum');
const { config, load_model, chat_completion, init_promptTemplateV1, answFromPromptTemplateV1, init_promptTemplateV2, answFromPromptTemplateV2 } = require('./openaiapi');



describe('Basic', () => {
  it('loading the configuration', () => {
    expect(config()).toBeTruthy();
  });
  it('loading the model', () => {
    expect(load_model()).toBeTruthy();
  });

  it('Chat completion', async () => {
    res = await chat_completion();
    console.log(res);
    expect(typeof res).toBe('string');
  });

});

describe("Prompt Template", () => {

  beforeEach(() => {
    config();
    load_model();
  })

  /*
    You have to understand the it("") inside describe("", ()=> {..})
    - are ran one after one
  */
  describe('Prompt Template V1', () => {
    it('Initialisation', async () => {
      p = await init_promptTemplateV1(    
        template = 'Tell a joke about {word}', 
        changeInTemplate = {
          word: "dog"
        }
      );
      expect(typeof p).toBe('string');
    });
    it('Get answer', async () => {
      const r = await answFromPromptTemplateV1();
      
      expect(typeof r).toBe('string');
    })
  });
  describe('Prompt Template V2', () => {
    it('Initialisation + Response', async () => {
      const r = await init_promptTemplateV2();
      expect(r).toBeTruthy();
    })
    it('Get answer', async () => {
      const r = await answFromPromptTemplateV2();
      
      expect(typeof r).toBe('string');
    })
  })
})



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









