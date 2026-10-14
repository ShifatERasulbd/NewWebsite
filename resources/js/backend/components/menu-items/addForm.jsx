import { Button } from '@/backend/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/backend/components/ui/card';
import { Input } from '@/backend/components/ui/input';
import { Label } from '@/backend/components/ui/label';
import { Separator } from '@/backend/components/ui/separator';

const selectClass =
    'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60';

export default function AddMenuItemForm({
    form = {},
    menus = [],
    pages = [],
    parentItems = [],
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    errors = {},
}) {
    const hasPage = Boolean(form.page_id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Menu Item</CardTitle>
                <CardDescription>
                    Create a new menu item linked to a page. The URL is taken from the page slug.
                </CardDescription>
            </CardHeader>
            <Separator />

            <form onSubmit={onSubmit}>
                <CardContent className="space-y-6 pt-6">
                    {/* Menu (fixed by the route) */}
                    <div className="space-y-2">
                        <Label htmlFor="menu_id">Menu</Label>
                        <select
                            id="menu_id"
                            name="menu_id"
                            value={form.menu_id || ''}
                            onChange={onChange}
                            disabled
                            className={selectClass}
                        >
                            <option value="">Select Menu</option>
                            {menus.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                        {errors.menu_id && <p className="text-xs text-destructive">{errors.menu_id[0]}</p>}
                    </div>

                    {/* Parent item */}
                    <div className="space-y-2">
                        <Label htmlFor="parent_id">Parent Item</Label>
                        <select
                            id="parent_id"
                            name="parent_id"
                            value={form.parent_id || ''}
                            onChange={onChange}
                            className={selectClass}
                        >
                            <option value="">None (top level)</option>
                            {parentItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                        {errors.parent_id && <p className="text-xs text-destructive">{errors.parent_id[0]}</p>}
                    </div>

                    {/* Page */}
                    <div className="space-y-2">
                        <Label htmlFor="page_id">Page</Label>
                        <select
                            id="page_id"
                            name="page_id"
                            value={form.page_id || ''}
                            onChange={onChange}
                            className={selectClass}
                        >
                            <option value="">None (custom URL)</option>
                            {pages.map((page) => (
                                <option key={page.id} value={page.id}>
                                    {page.title}
                                </option>
                            ))}
                        </select>
                        {errors.page_id && <p className="text-xs text-destructive">{errors.page_id[0]}</p>}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={form.title || ''}
                            onChange={onChange}
                            placeholder="e.g. About Us"
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">{hasPage ? 'URL (from page slug)' : 'URL'}</Label>
                        <Input
                            id="url"
                            name="url"
                            value={form.url || ''}
                            onChange={onChange}
                            readOnly={hasPage}
                            placeholder={hasPage ? '' : 'e.g. /contact or https://example.com'}
                        />
                        {errors.url && <p className="text-xs text-destructive">{errors.url[0]}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            value={form.status || 'published'}
                            onChange={onChange}
                            className={selectClass}
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                        {errors.status && <p className="text-xs text-destructive">{errors.status[0]}</p>}
                    </div>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-end gap-3 pt-6">
                    <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Menu Item'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}