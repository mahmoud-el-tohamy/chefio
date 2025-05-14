import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

const mockOnSearch = jest.fn();
const mockOnChange = jest.fn();
const mockOnFilter = jest.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnChange.mockClear();
    mockOnFilter.mockClear();
  });

  it('renders search input and button', () => {
    render(
      <SearchBar 
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onFilter={mockOnFilter}
      />
    );
    
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with input value when search button is clicked', () => {
    render(
      <SearchBar 
        value="pasta"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onFilter={mockOnFilter}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(mockOnSearch).toHaveBeenCalledWith('pasta');
  });

  it('calls onSearch when Enter key is pressed', () => {
    render(
      <SearchBar 
        value="pasta"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onFilter={mockOnFilter}
      />
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'pasta' } });
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      throw new Error('Form not found');
    }
    expect(mockOnSearch).toHaveBeenCalledWith('pasta');
  });

  it('calls onChange when input value changes', () => {
    render(
      <SearchBar 
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onFilter={mockOnFilter}
      />
    );
    
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'pasta' } });
    expect(mockOnChange).toHaveBeenCalledWith('pasta');
  });

  it('opens filter modal when filter button is clicked', () => {
    render(
      <SearchBar 
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onFilter={mockOnFilter}
      />
    );
    const filterButton = screen.getByRole('button', { name: /open filters/i });
    fireEvent.click(filterButton);
    expect(screen.getByText('Add a Filter')).toBeInTheDocument();
  });
}); 