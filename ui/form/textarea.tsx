type TextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  name: string;
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
};

export default function TextareaInput({
  value,
  onChange,
  label,
  name,
  placeholder,
  maxLength,
  showCharCount = true, // Changed default to true for better UX
}: TextareaProps) {
  const currentCharCount = value?.length || 0;
  const isNearLimit = maxLength ? currentCharCount >= maxLength * 0.9 : false; // 90% of limit
  const isOverLimit = maxLength ? currentCharCount > maxLength : false;
  const remainingChars = maxLength ? maxLength - currentCharCount : 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      return; // Don't update if over limit
    }
    onChange(e);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {label && (
          <label className="text-sm capitalize font-medium text-gray-900">
            {label}
          </label>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          name={name}
          placeholder={placeholder}
          rows={4}
          maxLength={maxLength}
          className={`w-full outline-none border border-gray-300 rounded-lg p-4 text-sm resize-none transition-colors ${
            isOverLimit 
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : isNearLimit
              ? 'border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
              : 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          }`}
        />
        
        {/* Progress indicator at bottom */}
        {maxLength && showCharCount && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isOverLimit 
                    ? 'bg-red-600' 
                    : isNearLimit 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((currentCharCount / maxLength) * 100, 100)}%` 
                }}
              />
            </div>
            
            {/* Remaining text */}
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {remainingChars >= 0 
                  ? `${remainingChars} character${remainingChars !== 1 ? 's' : ''} remaining`
                  : `${Math.abs(remainingChars)} character${Math.abs(remainingChars) !== 1 ? 's' : ''} over limit`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}