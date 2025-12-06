import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Input } from '../Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Email" name="email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('handles input change', () => {
    const handleChange = jest.fn();
    render(<Input label="Email" name="email" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies error styling when error is present', () => {
    render(<Input label="Email" name="email" error="Error message" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-500');
  });
});