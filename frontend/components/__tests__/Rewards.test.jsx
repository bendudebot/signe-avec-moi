import { render, screen } from '@testing-library/react';
import { StarCounter, ProgressBar } from '../Rewards';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn());

describe('StarCounter', () => {
  test('affiche le bon nombre d\'étoiles gagnées', () => {
    render(<StarCounter count={3} max={10} />);
    const stars = screen.getByTestId('star-counter');
    expect(stars).toBeInTheDocument();
    expect(stars.textContent).toContain('⭐');
  });

  test('affiche toutes les étoiles vides quand count=0', () => {
    render(<StarCounter count={0} max={5} />);
    const stars = screen.getByTestId('star-counter');
    expect(stars.querySelectorAll('.empty').length).toBe(5);
  });

  test('affiche toutes les étoiles pleines quand count=max', () => {
    render(<StarCounter count={5} max={5} />);
    const stars = screen.getByTestId('star-counter');
    expect(stars.querySelectorAll('.earned').length).toBe(5);
  });
});

describe('ProgressBar', () => {
  test('affiche la progression correcte', () => {
    render(<ProgressBar current={3} total={10} />);
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });

  test('affiche 0/10 au début', () => {
    render(<ProgressBar current={0} total={10} />);
    expect(screen.getByText('0 / 10')).toBeInTheDocument();
  });

  test('affiche 10/10 à la fin', () => {
    render(<ProgressBar current={10} total={10} />);
    expect(screen.getByText('10 / 10')).toBeInTheDocument();
  });
});
