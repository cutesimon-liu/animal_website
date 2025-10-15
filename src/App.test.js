import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders main navigation bar brand', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const brandElement = screen.getByText(/動物介紹網站/i);
  expect(brandElement).toBeInTheDocument();
});
