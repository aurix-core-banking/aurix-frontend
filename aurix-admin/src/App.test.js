import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza o login ou titulo do admin', () => {
    render(<App />);
    // O React Admin geralmente renderiza um título ou botão de login
    const linkElement = screen.getByText(/AUREUS/i);
    expect(linkElement).toBeInTheDocument();
});
