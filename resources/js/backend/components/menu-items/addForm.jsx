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

export default function AddMenuItemForm({
    form = {},
    menus = [],
    parentItems = [],
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    errors = {},
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Menu Item</CardTitle>
                <CardDescription>
                    Create a new menu item, assign a component ID reference, and nest up to 5 steps deep.
                </CardDescription>
            </CardHeader>
            <Separator />

            <form onSubmit={onSubmit}>
                <CardContent className="space-y-6 pt-6">
                    {/* Menu Container */}
                    <div className="space-y-2">
                        <Label htmlFor="menu_id">Parent Menu Container</Label>
                        <select
                            id="menu_id"
                            name="menu_id"
                            value={form.menu_id || ''}
                            onChange={onChange}
                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={form.title || ''}
                            onChange={onChange}
                            placeholder="e.g. Getting Started"
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
                    </div>

                    {/* Component ID */}
                    <div className="space-y-2">
                        <Label htmlFor="component_id">Component ID Reference</Label>
                        <Input
                            id="component_id"
                            name="component_id"
                            value={form.component_id || ''}
                            onChange={onChange}
                            placeholder="e.g. HeroSection, DocContent"
                        />
                        {errors.component_id && <p className="text-xs text-destructive">{errors.component_id[0]}</p>}
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            value={form.url || ''}
                            onChange={onChange}
                            placeholder="e.g. /docs/getting-started"
                        />
                        {errors.url && <p className="text-xs text-destructive">{errors.url[0]}</p>}
                    </div>

                    {/* Parent Menu Item (Nesting up to 5 steps) */}
                    <div className="space-y-2">
                        <Label htmlFor="parent_id">Parent Menu Item (Max 5 Steps Deep)</Label>
                        <select
                            id="parent_id"
                            name="parent_id"
                            value={form.parent_id || ''}
                            onChange={onChange}
                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">None (Root Level Item)</option>
                            {parentItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                        {errors.parent_id && <p className="text-xs text-destructive">{errors.parent_id[0]}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            value={form.status || 'published'}
                            onChange={onChange}
                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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