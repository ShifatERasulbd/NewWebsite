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

export default function AddForm({
    form = {},
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    errors = {},
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Page</CardTitle>
                <CardDescription>
                    Create a new page. You can design its content in the builder afterwards.
                </CardDescription>
            </CardHeader>
            <Separator />

            <form onSubmit={onSubmit}>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input
                            id="page-title"
                            name="title"
                            value={form.title || ''}
                            onChange={onChange}
                            placeholder="e.g. About Us"
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="page-slug">Slug (optional)</Label>
                        <Input
                            id="page-slug"
                            name="slug"
                            value={form.slug || ''}
                            onChange={onChange}
                            placeholder="auto-generated from title"
                        />
                        {errors.slug && <p className="text-xs text-destructive">{errors.slug[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="page-status">Status</Label>
                        <select
                            id="page-status"
                            name="status"
                            value={form.status || 'draft'}
                            onChange={onChange}
                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
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
                        {isSubmitting ? 'Creating...' : 'Create Page'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}