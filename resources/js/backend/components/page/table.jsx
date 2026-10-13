import { LayoutTemplate, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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

export function PageTable({
  pages = [],
  onAdd,
  onEdit,
  onBuilder,
  onRequestDelete,
  deletingId = null,
  canCreate = false,
  canUpdate = false,
  canDelete = false,
}) {
  const showActionColumn = canUpdate || canDelete;
  const [search, setSearch] = useState('');

  const filtered = pages.filter((p) => {
    const q = search.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          {canCreate && (
            <Button onClick={onAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!search && pages.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No pages found.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No pages match your search.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                {showActionColumn && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  {showActionColumn && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canUpdate && onBuilder && (
                          <ActionButton label="Builder" onClick={() => onBuilder(page.id)}>
                            <LayoutTemplate />
                          </ActionButton>
                        )}
                        {canUpdate && (
                          <ActionButton label="Edit" onClick={() => onEdit?.(page.id)}>
                            <Pencil />
                          </ActionButton>
                        )}
                        {canDelete && (
                          <ActionButton
                            label="Delete"
                            onClick={() => onRequestDelete?.(page)}
                            disabled={deletingId === page.id}
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