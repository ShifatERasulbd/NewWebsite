import { GripVertical, ListPlus, Paintbrush, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/backend/components/ui/button';
import { Card, CardContent, CardHeader } from '@/backend/components/ui/card';
import { Input } from '@/backend/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/backend/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/backend/components/ui/tooltip';

function ActionButton({ label, onClick, disabled, children }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MenuItemTable({
  items = [], // flat rows with `depth`
  onAdd,
  onAddChild,
  onEdit,
  onRequestDelete,
  onReorder, // (draggedId, targetId, deltaX)
  onDesign,
  deletingId = null,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}) {
  const showActionColumn = canUpdate || canDelete;
  const [search, setSearch] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  const [startX, setStartX] = useState(0);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.page?.title?.toLowerCase().includes(q) ||
      item.url?.toLowerCase().includes(q)
    );
  });

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId === null) return;

    const deltaX = e.clientX - startX;
    onReorder?.(draggedId, targetId, deltaX);
    setDraggedId(null);
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9"
            />
          </div>

          <Button variant="outline" size="sm" onClick={() => onDesign?.()}>
            <Paintbrush className="mr-2 h-4 w-4" />
            Design
          </Button>

          {canCreate && (
            <Button onClick={() => onAdd?.()} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Drag a row up/down to reorder. Drag it right to nest under the item above (or drop it on
          another row while dragging right). Drag it left to move it out one level.
        </p>
      </CardHeader>

      <CardContent>
        {!search && items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No menu items found.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No menu items match your search.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                {showActionColumn && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  draggable={!search}
                  onDragStart={(e) => {
                    setDraggedId(item.id);
                    setStartX(e.clientX);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => handleDrop(e, item.id)}
                  onDragEnd={() => setDraggedId(null)}
                  className={!search ? 'cursor-grab active:cursor-grabbing' : ''}
                >
                  <TableCell className="w-10 text-muted-foreground">
                    {!search && <GripVertical className="h-4 w-4" />}
                  </TableCell>
                  <TableCell className="font-medium">
                    <span
                      style={{ paddingLeft: `${(item.depth || 0) * 24}px` }}
                      className="inline-flex items-center gap-1"
                    >
                      {item.depth > 0 && <span className="text-muted-foreground">↳</span>}
                      {item.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.page?.title || '—'}
                  </TableCell>
                  <TableCell>
                    {item.url ? (
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.url}</code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  {showActionColumn && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canCreate && (
                          <ActionButton label="Add child" onClick={() => onAddChild?.(item.id)}>
                            <ListPlus />
                          </ActionButton>
                        )}
                        {canUpdate && (
                          <ActionButton label="Edit" onClick={() => onEdit?.(item.id)}>
                            <Pencil />
                          </ActionButton>
                        )}
                        {canDelete && (
                          <ActionButton
                            label="Delete"
                            onClick={() => onRequestDelete?.(item)}
                            disabled={deletingId === item.id}
                          >
                            <Trash2 className="text-destructive" />
                          </ActionButton>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}