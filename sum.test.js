const { sum, multiply, asyncMultiply, throwError, getArray } = require('./sum');
const { config, load_model, chat_completion, init_promptTemplateV1, init_promptTemplateV2, answFromPromptTemplate } = require('./openaiapi');

/*
Video 02
*/
describe('Mixing', () => {
  beforeEach(() => {
    config();
    load_model();
  })
  describe('init_promptTemplateV1, answFromTemplate', () => {
    it('Initialisation template from v1', async () => {
      p = await init_promptTemplateV1(    
        _template = 'Tell a joke about {word}',
        _changeInTemplate = {
          word: "dog"
        }
      );
      expect(typeof p).toBe('string');
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
      expect(typeof p).toBe('boolean');
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









