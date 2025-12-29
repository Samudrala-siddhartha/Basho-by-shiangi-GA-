import React, { useState, useRef } from 'react';
import { generatePoeticDescription } from '../services/gemini';
import { Sparkles, ArrowRight, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

const CustomOrder: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{haiku: string, brief: string} | null>(null);
  
  // Image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRefineWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !selectedImage) return;

    setIsGenerating(true);
    
    let base64Data: string | undefined = undefined;
    let mimeType: string | undefined = undefined;

    if (selectedImage && imageFile) {
        // Extract base64 data (remove "data:image/jpeg;base64," prefix)
        base64Data = selectedImage.split(',')[1];
        mimeType = imageFile.type;
    }

    const jsonStr = await generatePoeticDescription(description, base64Data, mimeType);
    
    try {
        // Clean JSON if necessary (sometimes models add markdown backticks)
        const cleanJson = jsonStr.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        setAiResult(data);
    } catch (e) {
        console.error("Failed to parse AI response", e);
        setAiResult({ haiku: "Nature's form is hard,\nTo capture in simple code,\nTry again later.", brief: description });
    }
    setIsGenerating(false);
  };

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-stone-800 mb-4">Custom Commission</h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto">
            Describe your vision or upload a sketch. Let our AI translate your inspiration into the language of clay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
          {/* Form Side */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 uppercase tracking-wide">
                What are you envisioning?
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., I want a large salad bowl that reminds me of a stormy ocean, dark blue and grey, with rough edges..."
                className="w-full p-4 border border-stone-300 rounded-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta bg-white resize-none"
              />
            </div>

            {/* Image Upload Area */}
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 uppercase tracking-wide">
                    Reference Image (Optional)
                </label>
                
                {!selectedImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer hover:border-terracotta hover:bg-stone-100 transition-colors"
                    >
                        <Upload size={24} className="text-stone-400 mb-2" />
                        <span className="text-stone-500 text-sm">Click to upload sketch or photo</span>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                ) : (
                    <div className="relative group rounded-sm overflow-hidden border border-stone-200">
                        <img src={selectedImage} alt="Reference" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={removeImage} className="text-white bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
              onClick={handleRefineWithAI}
              disabled={isGenerating || (!description && !selectedImage)}
              className="w-full flex items-center justify-center bg-stone-800 text-white px-6 py-4 text-sm uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 text-terracotta" />}
              {isGenerating ? "Analyzing..." : "Interpret with AI"}
            </button>
            
            {/* Standard inputs */}
            <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="p-3 border border-stone-300 w-full" />
                <input type="email" placeholder="Email" className="p-3 border border-stone-300 w-full" />
            </div>
            {aiResult && (
                <button className="w-full bg-terracotta text-white px-6 py-4 text-sm uppercase tracking-widest hover:bg-red-900 transition-colors">
                    Submit Request
                </button>
            )}
          </div>

          {/* AI Output Side */}
          <div className="bg-white border border-stone-200 p-8 flex flex-col justify-center min-h-[400px]">
            {!aiResult && !isGenerating && (
                <div className="text-center text-stone-400">
                    <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-serif italic">"Describe your dream piece,<br/>and the poetry will follow."</p>
                </div>
            )}

            {isGenerating && (
                 <div className="text-center text-stone-500 animate-pulse">
                    <Loader2 size={32} className="animate-spin mx-auto mb-4 text-terracotta" />
                    <p className="font-serif text-xl mb-2">Weaving words & vision...</p>
                 </div>
            )}

            {aiResult && (
                <div className="animate-fade-in">
                    <div className="mb-8 text-center">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-terracotta mb-4">The Essence</h3>
                        <p className="font-serif text-2xl italic text-stone-800 whitespace-pre-line leading-relaxed">
                            {aiResult.haiku}
                        </p>
                    </div>
                    <div className="border-t border-stone-100 pt-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-3">Artisan Brief</h3>
                        <p className="text-stone-600 text-sm leading-relaxed font-light">
                            {aiResult.brief}
                        </p>
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomOrder;