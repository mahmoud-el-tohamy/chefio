import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that will throw an error
const ConditionalError: React.FC<{shouldThrow: boolean}> = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>Test content</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    render(
      <ErrorBoundary>
        <ConditionalError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('resets error state when try again is clicked', () => {
    let key = 0;
    const { rerender } = render(
      <ErrorBoundary key={key}>
        <ConditionalError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Click try again button
    fireEvent.click(screen.getByText('Try again'));
    
    // Rerender with shouldThrow=false and a new key to force remount
    key++;
    rerender(
      <ErrorBoundary key={key}>
        <ConditionalError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
}); 