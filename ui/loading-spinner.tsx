type LoadingSpinnerProps = {
  className?: string;
};

/** Uniform loading indicator used across all pages. */
export default function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`dots my-20 mx-auto ${className}`}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
