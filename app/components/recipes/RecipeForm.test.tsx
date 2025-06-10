import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import RecipeForm from '@/components/recipes/RecipeForm';

describe('RecipeForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields', () => {
    render(<RecipeForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cooking time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submits form with values', async () => {
    render(<RecipeForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText(/title/i), 'Test Recipe');
      await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
      await userEvent.type(screen.getByLabelText(/cooking time/i), '30');
      await userEvent.selectOptions(screen.getByLabelText(/difficulty/i), 'Medium');
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Recipe',
      description: 'Test Description',
      cookingTime: '30',
      difficulty: 'Medium'
    });
  });

  it('validates required fields', async () => {
    render(<RecipeForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(screen.getByLabelText(/title/i)).toBeInvalid();
    expect(screen.getByLabelText(/description/i)).toBeInvalid();
    expect(screen.getByLabelText(/cooking time/i)).toBeInvalid();
    expect(screen.getByLabelText(/difficulty/i)).toBeInvalid();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 