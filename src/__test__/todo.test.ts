// import { getTodo } from './../controllers/todos.js';
// import Todo from './../models/todo.js';

// //clear mocks manually
// // beforeEach(() => {
// //   jest.clearAllMocks();
// // });

// const mockRequest = {
//   params: {
//     id: '661c004f4da41723b2ddf23',
//   },
// };

// const mockResponse = {
//   render: jest.fn(),
// };

// const next = jest.fn();

// //? Mocked out Todo model
// jest.mock('./../models/todo.js', () => ({
//   findById: jest.fn(id => ({
//     id: '661c004f4da41723b2ddf237',
//     text: 'Learn testing',
//     completed: true,
//     user: '661c00464da41723b2ddf230',
//   })),
// }));

// describe('get a todo', () => {
//   it('Get todo by id', async () => {
//     await getTodo(mockRequest, mockResponse, next);
//     expect(Todo.findById).toHaveBeenCalled();
//     expect(Todo.findById).toHaveBeenCalledWith(mockRequest.params.id);
//     expect(Todo.findById).toHaveBeenCalledTimes(1);
//     expect(Todo.findById).toHaveReturnedWith({
//       id: '661c004f4da41723b2ddf237',
//       text: 'Learn testing',
//       completed: true,
//       user: '661c00464da41723b2ddf230',
//     });
//     expect(mockResponse.render).toHaveBeenCalled();
//     expect(mockResponse.render).toHaveBeenCalledWith('todos/show', {
//       todo: {
//         id: '661c004f4da41723b2ddf237',
//         text: 'Learn testing',
//         completed: true,
//         user: '661c00464da41723b2ddf230',
//       },
//     });
//     expect(next).not.toHaveBeenCalled();
//   });

//   it('Should call the next function', async () => {
//     const mockRequestCopy = {
//       params: {
//         id: '1',
//       },
//     };
//     await getTodo(mockRequestCopy, mockResponse, next);
//     expect(Todo.findById).toHaveBeenCalled();
//     expect(Todo.findById).toHaveBeenCalledTimes(1);
//     expect(next).toHaveBeenCalled();
//   });
// });

// describe('');
