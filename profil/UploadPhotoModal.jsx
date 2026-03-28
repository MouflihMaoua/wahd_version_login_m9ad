import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { supabase } from '../../core/services/supabaseClient';

export default function UploadPhotoModal({
  onUploadSuccess,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024,
  bucket = 'profiles',
  folder = 'uploads',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!acceptedFileTypes.includes(file.type)) {
      setError('Type de fichier non supporté');
      return;
    }
    if (file.size > maxFileSize) {
      setError(`Fichier trop volumineux (max ${Math.round(maxFileSize / 1024 / 1024)} MB)`);
      return;
    }

    setError('');
    setUploading(true);
    setDone(false);

    try {
      const ext      = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error("Impossible de récupérer l'URL.");

      setDone(true);
      setTimeout(() => onUploadSuccess(publicUrl), 300);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop      = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleFileInput = (e) => handleFileSelect(e.target.files[0]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragging ? 'border-blue-500 bg-blue-50'   :
        done       ? 'border-green-400 bg-green-50'  :
        uploading  ? 'border-gray-300 bg-gray-50'    :
        error      ? 'border-red-300 bg-red-50'      :
                     'border-gray-300 hover:border-blue-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !uploading && !done && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {done ? (
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
      ) : (
        <UploadCloud className={`mx-auto h-12 w-12 mb-4 ${uploading ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
      )}

      {done && (
        <p className="text-green-600 font-medium">Fichier uploadé avec succès ✓</p>
      )}

      {uploading && (
        <div>
          <p className="text-gray-600 mb-3">Upload en cours...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {!uploading && !done && (
        <>
          <p className="text-gray-600 mb-2">
            Glissez-déposez un fichier ici ou{' '}
            <span className="text-blue-600 font-medium">parcourez</span>
          </p>
          <p className="text-sm text-gray-500">
            Formats: {acceptedFileTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            Max {Math.round(maxFileSize / 1024 / 1024)} MB
          </p>
        </>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-3">{error}</p>
      )}
    </div>
  );
}