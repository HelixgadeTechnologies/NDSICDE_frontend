
type EmptyStateProps = {
  hasSearchQuery: boolean;
  searchQuery: string;
  userType: string;
};

export default function EmptyState({
  hasSearchQuery,
  searchQuery,
  userType,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-2">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasSearchQuery ? "No results found" : "No team members yet"}
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        {hasSearchQuery ? (
          `No ${userType} match your search for "${searchQuery}". Try adjusting your search terms.`
        ) : (
          <span className="capitalize">
            {userType} will appear here once they are added to your
            organization.
          </span>
        )}
      </p>
    </div>
  );
}
