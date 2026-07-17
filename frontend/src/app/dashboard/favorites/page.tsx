import { Star } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="text-muted-foreground">Your bookmarked and favorite question sets.</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Star className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
        <p className="text-muted-foreground max-w-sm">
          You haven&apos;t bookmarked any question banks yet. Star a question bank to see it here!
        </p>
      </div>
    </div>
  );
}
