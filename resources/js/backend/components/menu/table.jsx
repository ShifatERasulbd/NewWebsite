import { GripVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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

export function MenuTable({
  menus = [],
  onAdd,
  onEdit,
  onRequestDelete,
  onReorder,
  deletingId = null,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}) {
  const showActionColumn = canUpdate || canDelete;
  const [search, setSearch] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const filtered = menus.filter((m) => {
    const q = search.toLowerCase();
    return m.title?.toLowerCase().includes(q);
  });

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedMenus = [...menus];
    const [movedItem] = updatedMenus.splice(draggedIndex, 1);
    updatedMenus.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    if (onReorder) {
      onReorder(updatedMenus);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          {canCreate && (
            <Button onClick={onAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!search && menus.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No menus found.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No menus match your search.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                {showActionColumn && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((menu, index) => (
                <TableRow
                  key={menu.id}
                  draggable={!search} // Disable drag when searching to avoid index mismatch
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={!search ? 'cursor-grab active:cursor-grabbing' : ''}
                >
                  <TableCell className="w-10 text-muted-foreground">
                    {!search && <GripVertical className="h-4 w-4" />}
                  </TableCell>
                  <TableCell className="font-medium">{menu.title}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        menu.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {menu.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  {showActionColumn && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <ActionButton label="Edit" onClick={() => onEdit?.(menu.id)}>
                            <Pencil />
                          </ActionButton>
                        )}
                        {canDelete && (
                          <ActionButton
                            label="Delete"
                            onClick={() => onRequestDelete?.(menu)}
                            disabled={deletingId === menu.id}
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