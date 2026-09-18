import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import getCroppedImg from '@/lib/cropImage';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { type Area } from 'react-easy-crop';

interface ImageCropperProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onCropCompleteAction: (croppedFile: File) => void;
}

export function ImageCropper({ isOpen, onClose, imageSrc, onCropCompleteAction }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels_: Area) => {
        setCroppedAreaPixels(croppedAreaPixels_);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;

        try {
            setIsSaving(true);
            const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
            
            if (croppedImageFile) {
                onCropCompleteAction(croppedImageFile);
            }
        } catch (e) {
            console.error('Failed to crop image', e);
        } finally {
            setIsSaving(false);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sesuaikan Foto</DialogTitle>
                </DialogHeader>
                <div className="relative mt-2 flex h-80 w-full items-center justify-center bg-black/5 rounded-md overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                        <label className="text-muted-foreground w-12 shrink-0">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            className="w-full accent-primary"
                            onChange={(e) => setZoom(Number(e.target.value))}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-end gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                        Batal
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Menyimpan...' : 'Terapkan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

