
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { describe, it, expect } from 'vitest';

describe('Header', () => {
  it('should render the logo and social links', () => {
    render(<Header />);

    const logo = screen.getByAltText('Million Logo');
    expect(logo).toBeInTheDocument();

    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/StivenTC/million-property-technical-test');

    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/stiventc/');
  });
});
