import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { UserPlus, UserMinus, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Division {
    id: number;
    name: string;
    foto: string | null;
    keterangan: string | null;
    users: User[];
}

interface Props {
    division: Division;
    availableUsers: User[];
}

export default function DivisionShow({ division, availableUsers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Divisions',
            href: '/dashboard/divisions',
        },
        {
            title: division.name,
            href: `/dashboard/divisions/${division.id}`,
        },
    ];

    const { data, setData, post, processing, reset } = useForm({
        user_id: '',
    });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('divisions.assign-user', division.id), {
            onSuccess: () => reset('user_id'),
        });
    };

    const handleRemoveUser = (userId: number) => {
        if (confirm('Are you sure you want to remove this user from the division?')) {
            const removeForm = useForm({ user_id: userId });
            post(route('divisions.remove-user', division.id));
        }
    };

    // Separate form for removal to avoid hook issues in loop
    const RemoveUserButton = ({ userId }: { userId: number }) => {
        const { post: removePost, processing: removing } = useForm({ user_id: userId });
        return (
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive"
                disabled={removing}
                onClick={() => {
                    if (confirm('Are you sure?')) {
                        removePost(route('divisions.remove-user', division.id));
                    }
                }}
            >
                <UserMinus className="h-4 w-4" />
            </Button>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={division.name} />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <div className="aspect-video bg-muted relative">
                            {division.foto ? (
                                <img 
                                    src={`/storage/${division.foto}`} 
                                    alt={division.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle>{division.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {division.keterangan || 'No description provided.'}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Division Members</span>
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {division.users.length} Total
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="w-[100px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {division.users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <RemoveUserButton userId={user.id} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {division.users.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                    No members assigned yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Add Member</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddUser} className="flex gap-4">
                                    <div className="flex-1">
                                        <Select 
                                            value={data.user_id.toString()} 
                                            onValueChange={(value) => setData('user_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a user to add..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableUsers.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name} ({user.email})
                                                    </SelectItem>
                                                ))}
                                                {availableUsers.length === 0 && (
                                                    <SelectItem value="none" disabled>No available users found</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" disabled={processing || !data.user_id}>
                                        <UserPlus className="mr-2 h-4 w-4" /> Add to Division
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
