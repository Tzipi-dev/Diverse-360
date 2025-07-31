// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import SignUpPage from '../SignUpPage';
// import { Provider } from 'react-redux';
// import store  from '../../../app/store';
// import { BrowserRouter } from 'react-router-dom';

// // מוּקינג של ה־API
// jest.mock('../authApi', () => ({
//   useRegisterMutation: () => [jest.fn().mockResolvedValue({})],
//   useLoginMutation: () => [jest.fn().mockResolvedValue({ unwrap: () => Promise.resolve({}) })],
// }));

// describe('SignUpPage', () => {
//   it('מציג פופאפ בעת הרשמה תקינה', async () => {
//     render(
//       <Provider store={store}>
//         <BrowserRouter>
//           <SignUpPage />
//         </BrowserRouter>
//       </Provider>
//     );

//     fireEvent.change(screen.getByPlaceholderText('שם פרטי'), { target: { value: 'יעל' } });
//     fireEvent.change(screen.getByPlaceholderText('שם משפחה'), { target: { value: 'כהן' } });
//     fireEvent.change(screen.getByPlaceholderText('דואר אלקטרוני'), { target: { value: 'yael@example.com' } });
//     fireEvent.change(screen.getByPlaceholderText('סיסמה'), { target: { value: 'Yael1234!' } });
//     fireEvent.change(screen.getByPlaceholderText('טלפון'), { target: { value: '0501234567' } });

//     fireEvent.click(screen.getByRole('button', { name: 'התחבר' }));

//     await waitFor(() =>
//       expect(screen.getByText('🎉 נוספה בהצלחה')).toBeInTheDocument()
//     );
//   });
// });
export {};