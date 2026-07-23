import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColoredIcon } from "@/components/shared/wallet-icon";
import type { Category } from "@/lib/wallet-mock";

export function CategoryCard({ category, onEdit, onDelete }: { category: Category; onEdit?: (c: Category) => void; onDelete?: (c: Category) => void }) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <ColoredIcon icon={category.icon} color={category.color} />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">{category.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{category.txCount} transaction{category.txCount === 1 ? "" : "s"}</div>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (<DropdownMenuItem onClick={() => onEdit(category)}><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>)}
              {onDelete && (<><DropdownMenuSeparator /><DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem></>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
}