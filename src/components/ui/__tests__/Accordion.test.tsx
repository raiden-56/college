import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from '../Accordion';

const items = [
  { id: 'one', title: 'First question', content: 'First answer' },
  { id: 'two', title: 'Second question', content: 'Second answer' },
];

describe('Accordion', () => {
  it('toggles panels with aria-expanded and opens one at a time by default', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: 'First question' });
    const second = screen.getByRole('button', { name: 'Second question' });
    expect(first).toHaveAttribute('aria-expanded', 'false');

    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'First question' })).toHaveTextContent('First answer');

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('is operable with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} multiple />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'First question' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Second question' })).toHaveAttribute('aria-expanded', 'true');
  });
});
