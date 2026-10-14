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

export default function AddMenuForm({
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
                <CardTitle>Add Menu Item</CardTitle>
                <CardDescription>Create a new navigation link or menu item.</CardDescription>
            </CardHeader>
            <Separator />

            <form onSubmit={onSubmit}>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="menu-title">Title</Label>
                        <Input
                            id="menu-title"
                            name="title"
                            value={form.title || ''}
                            onChange={onChange}
                            placeholder="e.g. Header Menu"
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
                    </div>

                    

                    <div className="space-y-2">
                        <Label htmlFor="menu-status">Status</Label>
                        <select
                            id="menu-status"
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
                        {isSubmitting ? 'Creating...' : 'Create Menu'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}