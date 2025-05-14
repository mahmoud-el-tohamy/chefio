import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner', 'medium');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="large" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner', 'large');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="blue" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ borderColor: 'blue' });
  });

  it('has accessible name', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading text..." />);
    expect(screen.getByText('Custom loading text...')).toBeInTheDocument();
  });

  it('renders with default text when text prop is not provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
}); 