/**
 * src/components/ErrorMessage.tsx
 */

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <h3>⚠ Error</h3>
      <p>{message}</p>
    </div>
  );
}
