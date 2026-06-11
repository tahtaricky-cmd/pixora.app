import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, Wand2, Download, Upload, X, Loader2, Eye, History, Sparkles, ImagePlus, RefreshCcw, Megaphone, Type, LogOut, Mail, Lock, Crown, CreditCard, ArrowLeft, AlertTriangle, CheckSquare, Square, Camera, Share2, Clipboard, Check } from 'lucide-react';

const API_URL = "https://script.google.com/macros/s/AKfycbyo_fMVgWgKgKkclbISjTzVgvdYGKdLNadp66t7mIy3sz9G0Ym5Jx2z1RCSj5SaqB5NMA/exec";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  // --- MEMBERSHIP STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPlan, setUserPlan] = useState('');
  const [userExpiry, setUserExpiry] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // --- TERMS & CONDITIONS STATES ---
  const [checkedTerms, setTermsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // --- EXISTING STATES ---
  const [productDescription, setProductDescription] = useState('');
  const [properties, setProperties] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('random');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [referenceImages, setReferenceImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // --- PROMO STUDIO STATES ---
  const [selectedPromoImage, setSelectedPromoImage] = useState(null);
  const [promoDetails, setPromoDetails] = useState('');
  const [promoStyle, setPromoStyle] = useState('random');
  const [promoAspectRatio, setPromoAspectRatio] = useState('1:1');
  const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);
  const [generatedPromoImages, setGeneratedPromoImages] = useState([]);
  const [promoError, setPromoError] = useState(null);

  // --- SHARE STATES ---
  const [shareImage, setShareImage] = useState(null);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [isSharingProcess, setIsSharingPromo] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const themes = [
    { id: 'random', name: 'Random', prompt: '' },
    { id: 'clean', name: 'Clean Studio', prompt: 'clean studio setting, high-key lighting, solid neutral background, professional product photography, 8k resolution' },
    { id: 'minimalist', name: 'Minimalist', prompt: 'minimalist aesthetic, soft shadows, clean composition, neutral color palette, hyper-realistic, 8k resolution' },
    { id: 'luxury', name: 'Premium Luxury', prompt: 'premium luxury studio lighting, dramatic shadows, deep elegant colors, gold accents, cinematic quality, 8k resolution' },
    { id: 'natural', name: 'Natural Organic', prompt: 'natural sunlight, soft dappled shadows, wooden textures, organic elements, warm atmosphere, photorealistic, 8k resolution' },
    { id: 'modern', name: 'Modern Lifestyle', prompt: 'modern lifestyle setting, bright apartment background, blurred soft bokeh, trendy home interior, high quality, 8k resolution' },
    { id: 'editorial', name: 'Editorial Magazine', prompt: 'editorial magazine style, sharp high-fashion lighting, bold typography spacing, clean composition, artistic, 8k resolution' },
    { id: 'moody', name: 'Moody Dark', prompt: 'moody dark studio lighting, dramatic low-key shadows, elegant noir atmosphere, premium, 8k resolution' },
    { id: 'botanical', name: 'Botanical Garden', prompt: 'botanical garden setting, lush green foliage, soft natural light, vibrant plants, organic, 8k resolution' },
    { id: 'spa', name: 'Spa & Wellness', prompt: 'spa and wellness center, serene atmosphere, soft warm towels, zen stones, natural bamboo wood, calm, 8k resolution' },
    { id: 'neo', name: 'Neo Deco', prompt: 'neo art deco, geometric patterns, gold metallic accents, lavish interior, sophisticated, 8k resolution' },
    { id: 'celestial', name: 'Celestial', prompt: 'celestial dreamy atmosphere, soft purple and blue nebulas, sparkling dust, mystical, 8k resolution' },
    { id: 'scandinavian', name: 'Scandinavian Home', prompt: 'bright scandinavian home interior, light wood tones, airy, minimalist furniture, soft natural light, 8k resolution' },
    { id: 'coffee', name: 'Coffee Table', prompt: 'aesthetic coffee table setting, lifestyle photography, blurred living room background, inviting atmosphere, 8k resolution' },
    { id: 'architecture', name: 'Modern Architecture', prompt: 'modern architectural background, sleek concrete and glass, geometric lines, dramatic angles, professional quality, 8k resolution' },
    { id: 'glass', name: 'Glass & Reflection', prompt: 'glass and reflection focused shot, sharp refraction, clean studio setup, luxury feel, 8k resolution' },
    { id: 'floating', name: 'Floating Product', prompt: 'floating product shot, anti-gravity effect, suspended in mid-air, studio lighting, clean background, 8k resolution' },
    { id: 'pure_aqua', name: 'Pure Aqua Dynamics', prompt: 'high-speed product photography, hyper-realistic water physics, crystal clear water splashes and natural ripples, accurate light refraction and physical reflection on water surface, realistic water droplets on product, perfect glass transparency retention, 8k resolution' },
    { id: 'water', name: 'Water Splash', prompt: 'dynamic water splash, high-speed photography, refreshing, crystal clear water droplets, studio lighting, 8k resolution' },
    { id: 'smoke', name: 'Smoke & Mist', prompt: 'mysterious smoke and mist, soft hazy atmosphere, dramatic backlighting, cinematic, 8k resolution' },
    { id: 'golden', name: 'Golden Hour', prompt: 'warm golden hour sunlight, soft glows, long shadows, summer vibe, photorealistic, 8k resolution' },
    { id: 'moonlight', name: 'Moonlight', prompt: 'cool moonlight ambience, soft blue and silver tones, dreamy night atmosphere, cinematic, 8k resolution' },
    { id: 'vintage', name: 'Vintage Film', prompt: 'vintage film aesthetic, retro grain, texturized, nostalgic, 35mm photography style, 8k resolution' },
    { id: 'futuristic', name: 'Futuristic Neon', prompt: 'futuristic neon lighting, glowing cybernetic lines, dark environment, high contrast, 8k resolution' },
    { id: 'retro', name: 'Retro 90s', prompt: 'retro 90s style, vibrant colors, vintage tech aesthetic, nostalgic, 8k resolution' },
    { id: 'chrome', name: 'Chrome & Metal', prompt: 'chrome and metal surfaces, industrial chic, sharp reflections, high-end studio, 8k resolution' },
    { id: 'desk', name: 'Work Desk Setup', prompt: 'productive work desk setup, organized gadgets, aesthetic stationery, cozy home office, 8k resolution' },
    { id: 'cafe', name: 'Cafe Lifestyle', prompt: 'aesthetic cafe lifestyle, warm wood tones, coffee steam, blurred cafe background, inviting, 8k resolution' },
    { id: 'nature', name: 'Wild Nature', prompt: 'wild nature setting, majestic mountains, deep forest, natural sunlight, rugged terrain, outdoor adventure vibe, photorealistic, 8k resolution' },
    { id: 'underwater', name: 'Deep Underwater', prompt: 'deep underwater environment, beautiful coral reef, rays of light piercing through water, floating bubbles, ethereal aquatic atmosphere, 8k resolution' },
    { id: 'desert', name: 'Sahara Desert', prompt: 'vast sahara desert dunes, golden sand, clear blue sky, harsh sunlight, dramatic shadows, arid landscape, 8k resolution' },
    { id: 'holographic', name: 'Holographic Studio', prompt: 'holographic studio, iridescent colors, glowing neon pastels, surreal vaporwave aesthetic, floating geometric shapes, highly aesthetic, 8k resolution' },
    { id: 'ancient_ruins', name: 'Ancient Ruins', prompt: 'ancient stone ruins, overgrown with moss and vines, mysterious historical atmosphere, soft moody lighting, cinematic fantasy setting, 8k resolution' },
    { id: 'candy_pop', name: 'Candy Pop Art', prompt: 'vibrant candy pop art style, bright pastel colors, playful surreal environment, glossy plastic textures, cheerful and fun atmosphere, 8k resolution' }
  ];

  // Helper function to calculate remaining days
  const calculateRemainingDays = (expiryString) => {
    if (!expiryString) return -1;
    const expiryDate = new Date(expiryString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check Web Share API Capability on Mount
  useEffect(() => {
    if (navigator.share && navigator.canShare) {
      setIsShareSupported(true);
    }
  }, []);

  // --- MEMBERSHIP & SESSION LOGIC ---
  useEffect(() => {
    const initAuth = async () => {
      const savedEmail = localStorage.getItem('pixora_email');
      const savedStatus = localStorage.getItem('pixora_logged_in');
      const savedExpiry = localStorage.getItem('pixora_expiry');
     
      if (savedEmail && savedStatus === 'true') {
        const remainingDays = calculateRemainingDays(savedExpiry);

        if (remainingDays >= 0) {
          setIsLoggedIn(true);
          setUserEmail(savedEmail);
          setUserPlan(localStorage.getItem('pixora_plan') || '');
          setUserExpiry(savedExpiry);

          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              body: JSON.stringify({ email: savedEmail })
            });
            const data = await response.json();
           
            if (data.success && calculateRemainingDays(data.expiry_date) >= 0) {
              localStorage.setItem('pixora_plan', data.plan);
              localStorage.setItem('pixora_expiry', data.expiry_date);
              setUserPlan(data.plan);
              setUserExpiry(data.expiry_date);
            } else {
              handleLogout();
            }
          } catch (err) {
            console.error("Gagal sinkronisasi data sesi latar belakang:", err);
          }
        } else {
          handleLogout();
        }
      }
      setIsCheckingAuth(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    if (!checkedTerms) {
      setLoginError("Harap centang kotak persetujuan syarat & ketentuan terlebih dahulu.");
      return;
    }
   
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await response.json();

      if (data.success) {
        const remaining = calculateRemainingDays(data.expiry_date);
        
        if (remaining >= 0) {
          localStorage.setItem('pixora_email', data.email);
          localStorage.setItem('pixora_logged_in', 'true');
          localStorage.setItem('pixora_plan', data.plan);
          localStorage.setItem('pixora_expiry', data.expiry_date);
          localStorage.setItem('pixora_terms_accepted', 'true');
         
          setUserEmail(data.email);
          setUserPlan(data.plan);
          setUserExpiry(data.expiry_date);
          setIsLoggedIn(true);
        } else {
          setLoginError("Masa langganan untuk email ini telah berakhir.");
        }
      } else {
        setLoginError(data.message || "Email belum terdaftar");
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan jaringan, tidak dapat menghubungi server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pixora_email');
    localStorage.removeItem('pixora_logged_in');
    localStorage.removeItem('pixora_plan');
    localStorage.removeItem('pixora_expiry');
    localStorage.removeItem('pixora_terms_accepted');
   
    setIsLoggedIn(false);
    setTermsChecked(false);
    setUserEmail('');
    setUserPlan('');
    setUserExpiry('');
    setLoginEmail('');
    setCurrentView('dashboard');
  };

  // --- APP GENERATION LOGIC ---
  const handleReferenceUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
   
    const newImages = [];
    for (const file of files) {
      if (referenceImages.length + newImages.length < 4) {
        const reader = await new Promise((resolve) => {
          const r = new FileReader();
          r.onloadend = () => resolve(r.result);
          r.readAsDataURL(file);
        });
        newImages.push({
          preview: reader,
          mimeType: "image/jpeg",
          data: photoData.includes(',') ? photoData.split(',')[1] : photoData
        });
      }
    }
   
    setReferenceImages(prev => [...prev, ...newImages].slice(0, 4));
    setShowWarning(false);
  };

  const removeReferenceImage = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePromoImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPromoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (dataUrl, filename = `pixora-creative-${Date.now()}.png`) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const extractBase64Data = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const b64 = arr[1];
    return { mimeType: mime, data: b64 };
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
   
    if (referenceImages.length === 0) {
      setShowWarning(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedPromoImage(null);

    try {
      let themeToUse = themes.find(t => t.id === selectedTheme);
      if (selectedTheme === 'random') {
        themeToUse = { prompt: "Apply a professional, high-quality real-world product photography theme. Choose a realistic setting such as a modern home, a professional studio, a bright kitchen, a retail display, or an elegant lifestyle environment. The setting must be photorealistic, high-end, and suitable for commercial product presentation. 8k resolution." };
      }
     
      const themePrompt = themeToUse?.prompt || '';
      const customPropsPrompt = properties ? ` Additionally, strictly include these specific items in the scene: ${properties}.` : '';
      const userDescPrompt = productDescription ? ` Product context/concept: ${productDescription}.` : '';
     
      const autoPropsInstruction = "Critically analyze the reference product. Automatically add highly relevant, natural-looking contextual props that perfectly match the product's category. Ensure these automatic props enhance the scene organically without overpowering the main product.";

      const scenarios = [
        "Maintain the exact same angle and perspective as the provided reference image",
        "Strict top-down flat lay perspective, captured directly from above at a 90-degree angle, clean background, no overlaps or tilted elements",
        "Lifestyle usage demo: Show a person interacting with or wearing the product from the reference image in a natural, real-life scenario. The product must be clearly visible and the focus of the demo.",
        "Macro close-up shot focusing on material, texture, and intricate details"
      ];

      // ATURAN REALISME KETAT BERDASARKAN ANALISA FOTO REFERENSI
      const realismConstraints = "CRITICAL REALISM RULES: 1. LIGHTING: Must use hyper-realistic professional studio lighting or natural crisp light. Strictly AVOID artificial, over-processed, or yellowish AI glows. 2. PRODUCT DETAIL: The product must be 100% visible, absolutely NO cropping. Maintain exact original textures without any over-polishing. Text, branding, and labels on the product MUST remain perfectly sharp and legible, letter-by-letter, exactly matching the reference. 3. PROP TEXTURE: All background and contextual props must possess natural, raw, real-world textures (e.g., sand must look like individual real grains, fruits must have natural pores, rocks must be rugged). Zero AI smoothing or plastic-like rendering on props. 4. WATER PHYSICS: If water is present, it MUST feature hyper-realistic surface tension, natural ripples, accurate light refractions, and physically correct reflections of the product/props on the surface. High-speed splash effects must look frozen and dynamic, not AI-generated blobs. 5. TRANSPARENCY: Perfectly preserve the exact shape, clarity, and text legibility of transparent/glass products without any edge distortion from water or background.";

      const generationPromises = scenarios.map(async (scenario) => {
        const payload = {
          contents: [{
            role: 'user',
            parts: [
              { text: `Create a professional high-quality product photo. Theme: ${themePrompt}. ${userDescPrompt} ${autoPropsInstruction} ${customPropsPrompt} Composition/Scenario: ${scenario}. ${realismConstraints} Ensure the main product is perfectly lit, clearly visible, and remains the absolute focus of the image. Generate in high resolution (1080px).` },
              ...referenceImages.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.base64 } }))
            ]
          }],
          generationConfig: {
            role: 'user',
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: aspectRatio }
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Gagal memproses salah satu sudut pandang.");
        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!part?.inlineData?.data) throw new Error("Gagal menghasilkan gambar.");
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      });

      const results = await Promise.all(generationPromises);
      setGeneratedImages(results);
      if (results.length > 0) setSelectedPromoImage(results[0]);
      setHistory(prev => [{ id: Date.now(), images: results, prompt: productDescription || "Custom Product" }, ...prev].slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePromo = async () => {
    if (!selectedPromoImage) return;
   
    setIsGeneratingPromo(true);
    setPromoError(null);
    setGeneratedPromoImages([]);

    try {
      const { mimeType, data } = extractBase64Data(selectedPromoImage);
      const detailsText = promoDetails ? `INFORMASI PRODUK DARI USER: "${promoDetails}"\nATURAN COPYWRITING (SANGAT PENTING): JANGAN pernah menyalin teks ini secara persis (word-for-word) ke dalam gambar! Jadikan teks tersebut HANYA sebagai konteks/referensi info produk. Anda harus bertindak sebagai Expert Copywriter: Cerna informasi tersebut, lalu tulislah ulang menjadi naskah promosi (Headline, Subheadline, Poin Fitur) buatan Anda sendiri yang jauh lebih menarik, persuasif, elegan, dan profesional. Seluruh teks dalam desain WAJIB berbahasa Indonesia.` : '';
     
      const promoScenarios = [
        "Focus: Foto 1 - Utama Marketplace (Hero Image Premium). Analisis gambar referensi untuk mengidentifikasi PRODUK UTAMA secara akurat. Abaikan properti tambahan. Buat desain poster utama e-commerce bertaraf premium layaknya iklan brand ternama. ATURAN TATA LETAK WAJIB: 1. Posisikan produk utama secara menonjol berukuran besar dan realistis (bisa di tengah, atau disesuaikan untuk memberi ruang pada teks secara elegan). Bebas gunakan angle kamera yang paling berkonversi tinggi. 2. Tambahkan Judul (Headline) teks promosi yang besar, tebal, dan memikat perhatian. 3. Tambahkan 3 hingga 4 lencana fitur (feature badges/callouts) yang terdiri dari ikon minimalis beserta teks penjelasan singkat (highlight spesifikasi) di sekitar produk (bisa di samping atau berjejer di bawah). Semua teks WAJIB menggunakan Bahasa Indonesia yang profesional dan menjual.",
        "Focus: Foto 2 - Skenario Produk & Soft Selling. Menjelaskan skenario penggunaan PRODUK UTAMA atau konteks gaya hidup (lifestyle context) yang relevan dan estetik dalam Bahasa Indonesia. Tambahkan narasi soft-selling yang elegan dan persuasif untuk menonjolkan nilai atau manfaat emosional dari produk. Pastikan penjelasan dan visual hanya fokus pada produk utama, bukan properti di sekitarnya. Jangan gunakan kata-kata hard-selling yang terlalu agresif. Angle bebas disesuaikan dengan konteks lifestyle yang paling epik.",
        "Focus: Foto 3 - Panduan Pemakaian ATAU Fitur Utama. Analisis PRODUK UTAMA terlebih dahulu secara mendalam berdasarkan gambar referensi (abaikan properti dekorasi): (1) JIKA produk utama membutuhkan edukasi pemakaian khusus (seperti skincare, serum rambut, sampo, produk kecantikan, herbal, atau produk pembersih), buat gambar panduan edukatif 'Langkah Penggunaan' yang sangat jelas. Tampilkan produk utama dan cantumkan 3 langkah penggunaan sederhana terstruktur secara berurutan: 'Langkah 1', 'Langkah 2', dan 'Langkah 3' dengan judul ringkas, teks petunjuk pendek, serta ikon minimalis atau ilustrasi kecil yang sangat mudah dipahami. (2) JIKA produk utama tidak memerlukan edukasi pemakaian khusus (seperti baju, kaos, jam tangan, kacamata, sepatu, tas, dll), ganti fokus desain Foto 3 menjadi sekadar menjelaskan detail visual produk utama, kenyamanan, atau keunggulan estetika produk tersebut dengan callout teks elegan tanpa menggunakan langkah pemakaian. Sajikan seluruh teks dalam Bahasa Indonesia. Gunakan angle produk terbaik.",
        "Focus: Foto 4 - Detail Produk (Rincian Teknis). Buat tata letak grid/panel terstruktur layaknya brosur katalog premium. Tampilkan PRODUK UTAMA dengan porsi besar (angle terbaik), lalu dampingi dengan beberapa foto *close-up* detail spesifik produk utama di dalam kotak-kotak terpisah. Abaikan properti latar belakang. Tambahkan ikon minimalis, spesifikasi teknis, dan deskripsi fitur pada setiap kotak *close-up* tersebut secara rapi dalam Bahasa Indonesia."
      ];

      // ATURAN REALISME KETAT UNTUK MEDIA PROMOSI
      const realismConstraints = "CRITICAL REALISM RULES: 1. LIGHTING: Must use hyper-realistic professional studio lighting or natural crisp light. Strictly AVOID artificial, over-processed, or yellowish AI glows. 2. PRODUCT DETAIL: The product must be 100% visible, absolutely NO cropping. Maintain exact original textures without any over-polishing. Text, branding, and labels on the product MUST remain perfectly sharp and legible, letter-by-letter, exactly matching the reference. 3. PROP TEXTURE: All background and contextual props must possess natural, raw, real-world textures. Zero AI smoothing or plastic-like rendering on props. 4. WATER PHYSICS: If water is present, it MUST feature hyper-realistic surface tension, natural ripples, accurate light refractions, and physically correct reflections. 5. TRANSPARENCY: Perfectly preserve the exact shape, clarity, and text legibility of transparent/glass products without any edge distortion.";

      const promoPromises = promoScenarios.map(async (scenario, index) => {
        let activePromoStyle = promoStyle;
        if (promoStyle === 'random') {
          activePromoStyle = "Let your AI creativity decide the best, most stunning professional design style that perfectly suits the product's vibe and category.";
        }

        let promptText = `Transform this product photo into a high-quality professional promotional poster or social media ad.
        ${scenario}
        
        ${detailsText} 
        
        Overall design style: ${activePromoStyle}.
        CRITICAL INSTRUCTION: Focus EXCLUSIVELY on the main product. IGNORE all background props, decorations, or staging elements (e.g., if it's a watch with coffee, focus only on the watch). Do not describe or highlight the props in the promotional text or design.
        ANGLE FREEDOM: Anda SANGAT DIIZINKAN dan DIREKOMENDASIKAN untuk mengubah angle/sudut pandang kamera dari produk (misal: top-down, side angle, low angle, dll) menyesuaikan dengan kebutuhan komposisi desain yang paling profesional. JANGAN kaku terpaku pada angle foto referensi. NAMUN, bentuk asli, warna, dan tulisan pada produk tidak boleh berubah sama sekali.
        DYNAMIC LAYOUT & SCALING FREEDOM: Tata letak teks (Headline, Subheadline, dan Detail) sangat fleksibel. JANGAN kaku menempatkan judul selalu di atas produk. Anda diizinkan meletakkan teks di samping kiri, kanan, bawah, atau membaur dengan objek, asalkan komposisi desain grafisnya tetap seimbang, estetis, dan profesional. Sesuaikan ukuran font secara dinamis (buat headline sangat mencolok dan besar, subheadline sedang, dan teks detail lebih kecil) agar hierarki visual jelas dan memandu mata audiens.
        TYPOGRAPHY & COLOR FREEDOM: Eksplorasi berbagai jenis font (serif, sans-serif, script, display, dll.) yang paling cocok, elegan, dan harmonis dengan gaya desain yang dipilih. Jangan hanya menggunakan font standar. Selain warna solid, Anda SANGAT DIREKOMENDASIKAN untuk menerapkan efek GRADASI WARNA (Color Gradients) pada Judul (Headline), subheadline, maupun teks lainnya agar terlihat lebih dinamis dan premium. Pastikan warna gradasi tersebut sangat cocok dan MENYATU dengan palet warna produk serta pencahayaan foto secara keseluruhan (tidak norak atau bertabrakan). Pastikan tipografi terlihat memukau dan meningkatkan daya tarik produk.
        STRICT NEGATIVE CONSTRAINT: Do NOT include any 'buy now', 'shop now', 'checkout', 'add to cart', 'beli sekarang', 'tambah ke keranjang', or any direct transactional sales call-to-action buttons or text.
        Make sure the typography is stunning, fits the product perfectly, creates a compelling advertisement, and highlights the product features provided. Generate in high-resolution.
        
        ${realismConstraints}`;

        // Aturan ketat tambahan khusus untuk gambar ke-4 agar formatnya sesuai referensi gambar yang diupload
        if (index === 3) {
          promptText += `\nATURAN TATA LETAK WAJIB: Gunakan layout "Grid Fitur Close-up". Harus ada kombinasi antara gambar produk utuh dengan sekumpulan foto detail close-up (menyoroti material, tekstur, atau komponen spesifik) yang disusun rapi dalam grid/kolom, persis seperti halaman infografis katalog spesifikasi produk premium tingkat tinggi.`;
        }

        const payload = {
          contents: [{
            role: 'user',
            parts: [
              { text: promptText },
              { inlineData: { mimeType, data } }
            ]
          }],
          generationConfig: {
            role: 'user',
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: promoAspectRatio }
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Gagal menghasilkan media promosi.");
        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!part?.inlineData?.data) throw new Error("Gagal merender teks pada gambar.");
       
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      });

      const results = await Promise.all(promoPromises);
      setGeneratedPromoImages(results);
    } catch (err) {
      setPromoError(err.message);
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  // --- SOCIAL MEDIA DIRECT FILE SHARING LOGIC ---
  const handleShareClick = async (imageDataUrl) => {
    try {
      setIsSharingPromo(true);
      setError(null);

      // Program mengonversi Base64 Data URL menjadi Objek File biner nyata
      const arr = imageDataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      const fileExt = mime.split('/')[1] || 'png';
      const file = new File([u8arr], `pixora-${Date.now()}.${fileExt}`, { type: mime });

      // Cek apakah Web Share API mendukung pengiriman file
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Hasil Kreasi Pixora',
          text: 'Lihat kreasi foto produk premium yang dibuat secara otomatis dengan Pixora!'
        });
      } else {
        // Fallback: Jika tidak didukung browser (misal desktop), munculkan pop-up opsi download & salin
        setShareImage(imageDataUrl);
      }
    } catch (err) {
      console.warn("Proses berbagi dibatalkan atau tidak didukung:", err);
      // Fallback ke modal kustom jika user membatalkan atau terjadi error API
      if (err.name !== 'AbortError') {
        setShareImage(imageDataUrl);
      }
    } finally {
      setIsSharingPromo(false);
    }
  };

  const handleCopyLink = () => {
    const textarea = document.createElement('textarea');
    textarea.value = "https://pixora.ai/shared-showcase?src=creative-studio";
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
    document.body.removeChild(textarea);
  };

  const getShareUrl = (platform) => {
    const defaultText = encodeURIComponent("Lihat karya visual studio produk kustom saya yang luar biasa ini, dibuat otomatis menggunakan AI Pixora Creative!");
    const dummyShowcaseUrl = encodeURIComponent("https://pixora.ai/shared-showcase?src=creative-studio");
    
    switch (platform) {
      case 'whatsapp':
        return `https://api.whatsapp.com/send?text=${defaultText}%20${dummyShowcaseUrl}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${dummyShowcaseUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${defaultText}&url=${dummyShowcaseUrl}`;
      case 'telegram':
        return `https://t.me/share/url?url=${dummyShowcaseUrl}&text=${defaultText}`;
      case 'email':
        return `mailto:?subject=Kreasi%20Visual%20Pixora%20Creative&body=${defaultText}%20${dummyShowcaseUrl}`;
      default:
        return '#';
    }
  };

  // --- RENDERS ---
 
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-6" />
        <h2 className="text-xl font-medium text-slate-600 animate-pulse">Memvalidasi Sesi...</h2>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans selection:bg-orange-200">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-orange-500 mr-2" />
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pixora</h1>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
              <Lock size={18} className="text-slate-400" /> Member Login
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Akses studio kreatif khusus pengguna berbayar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-widest pl-1">Email Langganan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900"
                  placeholder="anda@email.com"
                  required
                />
              </div>
            </div>

            {/* SYARAT & KETENTUAN CHECKBOX */}
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <button 
                type="button"
                onClick={() => setTermsChecked(!checkedTerms)}
                className={`flex-shrink-0 p-1 rounded-lg border transition-all mt-0.5 ${checkedTerms ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-slate-300 text-slate-400 hover:bg-white'}`}
              >
                {checkedTerms ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <span className="text-sm font-medium text-slate-600 leading-relaxed">
                Saya sudah membaca dan menyetujui <button type="button" onClick={() => setShowTermsModal(true)} className="text-orange-500 font-semibold hover:text-orange-600 hover:underline">syarat & ketentuan</button> layanan.
              </span>
            </div>

            {loginError && (
              <div className="w-full text-center">
                 <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 flex items-center justify-center gap-2 mb-3">
                   <X size={16}/> {loginError}
                 </div>
                 {loginError !== "Harap centang kotak persetujuan syarat & ketentuan terlebih dahulu." && (
                   <button type="button" onClick={() => window.open('http://lynk.id/pixora.ai/r287pq2kywql/checkout', '_blank')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 underline underline-offset-4 decoration-orange-200">
                     Email belum terdaftar? Beli Paket.
                   </button>
                 )}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || !checkedTerms}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {loginLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Masuk Dashboard'}
            </button>
          </form>
        </div>

        {/* TERMS MODAL */}
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTermsModal(false)}>
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_20px_50px_rgb(0,0,0,0.1)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
               <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <AlertTriangle className="text-orange-500" size={20}/> Syarat & Ketentuan Penggunaan
                 </h2>
                 <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors"><X size={20}/></button>
               </div>
               
               <div className="p-6 md:p-8 overflow-y-auto text-sm text-slate-600 space-y-4 custom-scrollbar bg-white">
                  <p className="mb-4 font-medium">Dengan menggunakan layanan Pixora, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut.</p>
                  <ol className="space-y-5 list-decimal list-inside font-medium">
                    <li>
                      <strong className="text-slate-900">Penggunaan Layanan</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Pixora adalah layanan berbasis AI yang membantu pengguna menghasilkan foto produk dan konten visual untuk kebutuhan bisnis, pemasaran, dan marketplace.</p>
                      <p className="pl-5 mt-1 text-slate-500 leading-relaxed">Pengguna bertanggung jawab penuh atas seluruh gambar, produk, dan materi yang diunggah ke dalam sistem.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Kepemilikan Konten</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Pengguna tetap memiliki hak atas foto atau materi yang diunggah ke Pixora.</p>
                      <p className="pl-5 mt-1 text-slate-500 leading-relaxed">Hasil gambar yang dihasilkan melalui Pixora dapat digunakan untuk keperluan pribadi maupun komersial oleh pengguna.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Larangan Penggunaan</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Pengguna dilarang menggunakan Pixora untuk:</p>
                      <ul className="pl-10 mt-1 list-disc list-inside space-y-1 text-slate-500">
                        <li>Konten yang melanggar hukum.</li>
                        <li>Produk ilegal atau terlarang.</li>
                        <li>Konten pornografi atau eksplisit.</li>
                        <li>Penipuan, pemalsuan, atau penyalahgunaan identitas.</li>
                        <li>Pelanggaran hak cipta pihak lain.</li>
                      </ul>
                      <p className="pl-5 mt-2 text-slate-500 leading-relaxed">Pixora berhak menolak atau menghentikan akses pengguna yang melanggar ketentuan ini.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Kualitas Hasil AI</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Pixora menggunakan teknologi kecerdasan buatan untuk menghasilkan gambar.</p>
                      <p className="pl-5 mt-1 text-slate-500 leading-relaxed">Karena sifat AI yang generatif, hasil dapat bervariasi dan tidak selalu identik dengan ekspektasi pengguna. Pixora tidak menjamin hasil yang sempurna pada setiap proses generasi.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Ketersediaan Layanan</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Kami berupaya menjaga layanan tetap tersedia dan berjalan dengan baik. Namun, Pixora tidak bertanggung jawab atas gangguan layanan, pemeliharaan sistem, atau kendala teknis di luar kendali kami.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Kebijakan Refund</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Karena produk yang diberikan berupa layanan digital, seluruh pembelian yang telah berhasil diproses pada umumnya tidak dapat dikembalikan atau direfund.</p>
                      <p className="pl-5 mt-1 text-slate-500 leading-relaxed">Apabila terjadi kendala teknis yang menyebabkan layanan tidak dapat digunakan, pengguna dapat menghubungi tim dukungan untuk peninjauan lebih lanjut.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Perubahan Ketentuan</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Pixora berhak mengubah atau memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan pada platform.</p>
                    </li>
                    <li>
                      <strong className="text-slate-900">Persetujuan</strong>
                      <p className="pl-5 mt-1.5 text-slate-500 leading-relaxed">Dengan menggunakan Pixora, pengguna menyatakan telah membaca dan menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
                    </li>
                  </ol>
               </div>
               
               <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                 <button onClick={() => { setShowTermsModal(false); setTermsChecked(true); }} className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                   Mengerti & Setuju
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN DASHBOARD 
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 md:p-8 font-sans text-slate-900 selection:bg-orange-200">
      <header className="max-w-6xl mx-auto mb-10 text-center relative z-10">
        <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-4 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 flex items-center justify-end gap-1.5"><Crown size={14} className="text-orange-500"/> {userEmail}</p>
            <p className="text-xs font-medium text-slate-500">Paket {userPlan} • Exp: {userExpiry ? new Date(userExpiry).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}</p>
          </div>
          <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>
          <button onClick={() => setCurrentView('membership')} className="p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all group relative" title="Status Membership">
             <CreditCard size={18} className="group-hover:scale-110 transition-transform"/>
          </button>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group relative" title="Keluar">
             <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform"/>
          </button>
        </div>

        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 mt-16 sm:mt-0">
          <Sparkles className="w-6 h-6 text-orange-500 mr-2" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pixora Creative
          </h1>
        </div>
        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">Ubah produk menjadi aset visual studio kelas atas dengan keajaiban AI.</p>
      </header>

      {currentView === 'membership' ? (
        <main className="max-w-3xl mx-auto relative z-10">
          <button onClick={() => setCurrentView('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors">
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </button>
         
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-slate-900 tracking-tight">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500"><CreditCard size={24} /></div>
              Status Membership
            </h2>
           
            {calculateRemainingDays(userExpiry) < 7 && (
              <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-orange-800">Perhatian</h4>
                  <p className="text-sm text-orange-700 font-medium mt-1">Langganan Anda akan berakhir dalam {calculateRemainingDays(userExpiry)} hari. Silakan lakukan perpanjangan.</p>
                </div>
              </div>
            )}
           
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium text-sm mb-1 sm:mb-0 uppercase tracking-wider">Email Pengguna</span>
                <span className="font-bold text-slate-900 flex items-center gap-2"><Mail size={16} className="text-slate-400"/> {userEmail}</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium text-sm mb-1 sm:mb-0 uppercase tracking-wider">Nama Paket</span>
                <span className="font-bold text-slate-900 flex items-center gap-2"><Crown size={16} className="text-orange-500"/> Paket {userPlan}</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium text-sm mb-1 sm:mb-0 uppercase tracking-wider">Status Membership</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs tracking-wide">AKTIF</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium text-sm mb-1 sm:mb-0 uppercase tracking-wider">Berakhir Pada</span>
                <span className="font-bold text-slate-900">{userExpiry ? new Date(userExpiry).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
              </div>
             
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-slate-400 font-medium text-sm mb-1 sm:mb-0 uppercase tracking-wider">Sisa Hari Langganan</span>
                <span className="font-black text-2xl text-white">{Math.max(0, calculateRemainingDays(userExpiry))} Hari</span>
              </div>
            </div>

            <div className="mt-10">
              <a href="http://lynk.id/pixora.ai/r287pq2kywql/checkout" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-orange-500 text-white font-semibold py-4 rounded-2xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                Perpanjang Langganan
              </a>
            </div>
          </div>
        </main>
      ) : (
        <>
          <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            <section className="lg:col-span-5 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <ImagePlus size={16} /> Referensi ({referenceImages.length}/4)
                    </label>
                    {showWarning && <span className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 px-2 py-1 rounded-full animate-pulse">Wajib Diisi</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {referenceImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                        <img src={img.preview} alt="Ref" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <button type="button" onClick={() => removeReferenceImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm scale-90 group-hover:scale-100"><X size={14} strokeWidth={2.5} /></button>
                      </div>
                    ))}
                  </div>
                  {referenceImages.length < 4 && (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col items-center justify-center w-full h-24 border border-slate-200 border-dashed rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-all group bg-white">
                        <Upload className="text-slate-400 group-hover:text-orange-500 transition-colors mb-1.5" size={20} />
                        <span className="text-[11px] font-semibold text-slate-500 group-hover:text-orange-600">Pilih Galeri</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleReferenceUpload} />
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-24 border border-slate-200 border-dashed rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-all group bg-white">
                        <Camera className="text-slate-400 group-hover:text-orange-500 transition-colors mb-1.5" size={20} />
                        <span className="text-[11px] font-semibold text-slate-500 group-hover:text-orange-600">Buka Kamera</span>
                        <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleReferenceUpload} />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest">Tuliskan Prompt</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none h-24 transition-all resize-none font-medium text-slate-900 placeholder:text-slate-400 text-sm"
                    placeholder="Contoh: Buat hasil foto bertemakan hotel mewah..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest">Properti Tambahan</label>
                  <input
                    type="text"
                    value={properties}
                    onChange={(e) => setProperties(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm"
                    placeholder="Contoh: kayu, marmer, koin emas, pasir pantai"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest">Tema Visual</label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-800 text-sm"
                    >
                      {themes.map(theme => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest">Rasio Foto</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-800 text-sm"
                    >
                      <option value="1:1">1:1 (Square)</option>
                      <option value="4:5">4:5 Feed Instagram</option>
                      <option value="9:16">9:16 (Portrait)</option>
                      <option value="16:9">16:9 (Landscape)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                    {isGenerating ? "Menciptakan Keajaiban..." : "Generate Foto"}
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''} text-slate-400`} />
                    Generate Ulang
                  </button>
                </div>
              </form>
            </section>

            <section className="lg:col-span-7 space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col min-h-[450px]">
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-slate-900 tracking-tight">
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-600"><ImageIcon size={18} /></div>
                  Hasil Terbaru
                </h2>
             
                {isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-orange-500 bg-orange-50/50 rounded-3xl border border-dashed border-orange-200">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 opacity-80" />
                    <p className="font-semibold text-sm animate-pulse">Menghasilkan 4 Skenario Studio...</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} onClick={() => setSelectedPromoImage(img)} className={`relative group w-full aspect-square overflow-hidden rounded-2xl shadow-sm border cursor-pointer transition-all duration-300 ${selectedPromoImage === img ? 'ring-4 ring-orange-500/30 border-transparent scale-[1.02]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <img src={img} alt={`Result ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }} className="p-3 bg-white text-slate-700 rounded-full hover:bg-orange-50 hover:text-orange-600 hover:scale-110 transition-all shadow-sm" title="Preview">
                            <Eye size={18} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleShareClick(img); }} className="p-3 bg-white text-slate-700 rounded-full hover:bg-orange-50 hover:text-orange-600 hover:scale-110 transition-all shadow-sm" title="Bagikan">
                            {isSharingProcess ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDownload(img); }} className="p-3 bg-white text-slate-700 rounded-full hover:bg-orange-50 hover:text-orange-600 hover:scale-110 transition-all shadow-sm" title="Download">
                            <Download size={18} />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                          View {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-medium text-sm">Belum ada foto yang di-generate</p>
                  </div>
                )}
              </div>

              {history.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-slate-900 tracking-tight">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-600"><History size={18} /></div>
                    Riwayat Foto <span className="text-sm font-medium text-slate-400 font-normal ml-1">(10 Terakhir)</span>
                  </h2>
               
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.map((item) => (
                      <div key={item.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                            {new Date(item.id).toLocaleTimeString()}
                          </span>
                          <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{item.prompt}</p>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {item.images.map((img, i) => (
                            <div key={i} onClick={() => setSelectedPromoImage(img)} className={`relative group aspect-square rounded-2xl overflow-hidden shadow-sm border cursor-pointer transition-all ${selectedPromoImage === img ? 'ring-2 ring-orange-500 border-transparent' : 'border-slate-200 hover:border-slate-300'}`}>
                              <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="History" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }} className="p-1.5 bg-white/90 rounded-full text-slate-700 shadow-sm hover:scale-110 transition-transform"><Eye size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </main>

          <section className="max-w-6xl mx-auto mt-12 bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
            <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-slate-900 tracking-tight">
              <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-sm"><Megaphone size={22} /></div>
              Studio Promosi
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Foto Pilihan Utama
                    </label>
                    {selectedPromoImage && (
                       <button onClick={() => setSelectedPromoImage(null)} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider">Hapus Pilihan</button>
                    )}
                  </div>
                  {selectedPromoImage ? (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-orange-500/30 relative group">
                      <img src={selectedPromoImage} className="w-full h-full object-cover" alt="Selected" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-bold px-2 py-1 bg-orange-500 rounded-md uppercase tracking-wider">Terpilih</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-200 border-dashed rounded-2xl text-center flex flex-col items-center justify-center bg-white">
                        <ImagePlus className="text-slate-300 mb-2" size={20} />
                        <span className="text-slate-500 text-[11px] font-semibold">Pilih dari hasil di atas</span>
                      </div>
                      <label className="p-4 border border-slate-200 border-dashed rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-all bg-white group">
                        <Upload className="text-slate-300 group-hover:text-orange-500 transition-colors mb-2" size={20} />
                        <span className="text-slate-500 group-hover:text-orange-600 text-[11px] font-semibold">Upload foto manual</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePromoImageUpload} />
                      </label>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest flex items-center gap-1.5"><Type size={14}/> Detail Promosi</label>
                  <textarea
                    value={promoDetails}
                    onChange={(e) => setPromoDetails(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all resize-none h-32 font-medium text-sm text-slate-900 placeholder:text-slate-400"
                    placeholder="Contoh : Bahan kulit premium asli, ketahanan 24 jam..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest">Gaya Desain</label>
                    <select
                      value={promoStyle}
                      onChange={(e) => setPromoStyle(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all appearance-none font-semibold text-slate-800 text-sm"
                    >
                      <option value="random">Random</option>
                      <option value="Modern and clean minimalist aesthetic, bold typography, ample whitespace">Modern Minimalist</option>
                      <option value="Vibrant flash sale, high energy, colorful, striking discount badge style">Flash Sale / Discount</option>
                      <option value="Elegant luxury, serif fonts, gold accents, premium cinematic feel">Elegant Luxury</option>
                      <option value="Instagram story style layout, modern social media aesthetic, trendy">Social Media Story</option>
                      <option value="Edgy streetwear style, grunge elements, bold contrasting colors">Streetwear / Edgy</option>
                      <option value="Earthy Organic, natural tones, soft lighting, botanical elements, eco-friendly, warm and inviting">Earthy Organic</option>
                      <option value="Corporate Professional, clean corporate blue and white, geometric shapes, trustworthy, formal and highly structured">Corporate Professional</option>
                      <option value="Classic vintage heritage, warm moody lighting, wood and leather textures, elegant serif typography">Classic Vintage Heritage</option>
                      <option value="Industrial warehouse aesthetic, raw concrete and metal textures, harsh directional lighting, bold typography">Industrial Modern</option>
                      <option value="Tropical beach vibe, bright harsh sunlight, palm leaf shadows, fresh summer aesthetic">Tropical / Holiday</option>
                      <option value="Cozy home lifestyle, soft morning sunlight through window, warm and inviting atmosphere, soft textiles">Cozy Home Lifestyle</option>
                      <option value="Outdoor adventure, majestic mountain or deep forest background, natural sunlight, rugged and dynamic">Wild Nature & Adventure</option>
                      <option value="Zen spa retreat aesthetic, tranquil atmosphere, smooth river stones, soft bamboo textures, gentle water ripples, soothing neutral colors, highly relaxing">Zen Spa Retreat</option>
                      <option value="Artisan coffee shop vibe, rustic wooden table surface, warm inviting lighting, blurred background of a cozy cafe, organic and rich">Artisan Cafe & Coffee</option>
                      <option value="High-end monochrome elegance, pure black and white styling, dramatic chiaroscuro lighting, minimalist gallery aesthetic, extremely sophisticated">Monochrome Elegance</option>
                      <option value="Active sports and fitness environment, sleek gym floor surface, high-energy dramatic lighting, dynamic composition, strong and resilient aesthetic">Sports & Fitness</option>
                      <option value="Modern pristine kitchen setting, clean marble countertop, fresh natural ingredients softly blurred in background, bright and crisp daylight, appetizing">Modern Kitchen Aesthetic</option>
                      <option value="Dark moody elegance, deep shadows, single dramatic spotlight on the product, premium velvet or dark slate textures, highly luxurious and mysterious">Dark Luxury Moody</option>
                      <option value="Vibrant commercial studio pop, solid vivid seamless paper background, hard directional shadows, editorial magazine photography style, bold and striking">Vibrant Studio Pop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1 uppercase tracking-widest">Format Rasio</label>
                    <select
                      value={promoAspectRatio}
                      onChange={(e) => setPromoAspectRatio(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/20 outline-none transition-all appearance-none font-semibold text-slate-800 text-sm"
                    >
                      <option value="1:1">1:1 Square</option>
                      <option value="4:5">4:5 Feed Instagram</option>
                      <option value="9:16">9:16 Portrait</option>
                      <option value="16:9">16:9 Landscape</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGeneratePromo}
                  disabled={isGeneratingPromo || !selectedPromoImage}
                  className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-40 mt-4 shadow-sm"
                >
                  {isGeneratingPromo ? <Loader2 className="animate-spin w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
                  {isGeneratingPromo ? "Merancang Poster..." : "Generate Media Promosi"}
                </button>
                {promoError && <p className="text-red-500 text-xs font-semibold mt-2 text-center bg-red-50 py-2.5 rounded-xl border border-red-100">{promoError}</p>}
              </div>

              <div className={`bg-slate-50 rounded-3xl border border-slate-200 flex flex-col p-6 min-h-[400px] ${generatedPromoImages.length > 0 ? '' : 'items-center justify-center'}`}>
                {isGeneratingPromo ? (
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-semibold text-sm animate-pulse">Menyiapkan aset promosi...</p>
                  </div>
                ) : generatedPromoImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 h-full w-full">
                    {generatedPromoImages.map((img, idx) => {
                      const labels = ["Hero Banner", "Lifestyle Context", "Edukasi Pemakaian", "Katalog Grid"];
                      return (
                        <div key={idx} className="relative group w-full aspect-square overflow-hidden rounded-2xl shadow-sm border border-slate-200 bg-white">
                          <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Promo Result ${idx}`} />
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => setPreviewImage(img)} className="p-2.5 bg-white text-slate-700 rounded-full hover:bg-orange-50 hover:text-orange-600 hover:scale-110 transition-all shadow-sm" title="Preview">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleShareClick(img)} className="p-2.5 bg-white text-slate-700 rounded-full hover:bg-orange-50 hover:text-orange-600 hover:scale-110 transition-all shadow-sm" title="Bagikan">
                              {isSharingProcess ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                            </button>
                            <button onClick={() => handleDownload(img, `pixora-promo-${idx}-${Date.now()}.png`)} className="p-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 hover:scale-110 transition-all shadow-sm" title="Download">
                              <Download size={16} />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0 uppercase tracking-wider">
                            {labels[idx]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center opacity-40">
                    <Megaphone className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                    <p className="font-medium text-sm text-slate-500">Poster Promosi Anda akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Fullscreen Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out transition-opacity" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex justify-center">
            <img src={previewImage} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/10" alt="Preview" />
            <button className="absolute -top-4 -right-4 p-2.5 bg-white text-slate-900 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors" onClick={() => setPreviewImage(null)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* --- SHARE FALLBACK MODAL --- */}
      {shareImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShareImage(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-[0_20px_50px_rgb(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                <Share2 className="text-orange-500" size={18}/> Bagikan Kreasi Visual
              </h2>
              <button onClick={() => setShareImage(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors">
                <X size={18}/>
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              {/* Mini Preview */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <img src={shareImage} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-200" alt="To Share" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pixora Studio Asset</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Siap dibagikan ke jejaring sosial Anda</p>
                </div>
              </div>

              {/* Social Media Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* WhatsApp */}
                <a href={getShareUrl('whatsapp')} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.753-1.464L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402 0 9.794-4.381 9.797-9.761.002-2.605-2.084-5.053-3.929-6.89C15.286 2.106 13.013 1.63 12.015 1.63c-5.405 0-9.8 4.386-9.803 9.768-.001 1.554.52 3.082 1.511 4.4l-.993 3.614 3.717-.958z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a href={getShareUrl('facebook')} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">Facebook</span>
                </a>

                {/* Telegram */}
                <a href={getShareUrl('telegram')} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.03-.2-.01-.29.01-.12.02-2.03 1.24-5.7 3.73-.54.37-1.03.55-1.47.54-.48-.01-1.4-.27-2.08-.49-.83-.27-1.49-.41-1.43-.87.03-.24.39-.49 1.07-.75 4.19-1.82 6.98-3.02 8.37-3.6 3.98-1.66 4.81-1.95 5.35-1.96.12 0 .38.03.55.17.14.12.18.28.2.42.01.06.02.21.01.29z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">Telegram</span>
                </a>

                {/* X / Twitter */}
                <a href={getShareUrl('twitter')} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 7.56 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.085L1.254 2.25h6.88l4.712 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">X / Twitter</span>
                </a>

                {/* Instagram (Info Copy) */}
                <div onClick={handleCopyLink} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">Instagram</span>
                </div>

                {/* Email */}
                <a href={getShareUrl('email')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
                    <Mail size={18} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">Email</span>
                </a>
              </div>

              {/* Direct Copy Row */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 mb-2 pl-1 uppercase tracking-widest">ATAU SALIN TAUTAN SHOWCASE</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://pixora.ai/shared-showcase?src=creative-studio" 
                    className="flex-1 bg-slate-50 text-slate-500 text-xs font-medium px-4 py-3 rounded-xl border border-slate-200 outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors font-semibold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {copySuccess ? <Check size={14}/> : <Clipboard size={14}/>}
                    {copySuccess ? "Disalin!" : "Salin"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
     
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-white border-l-4 border-red-500 p-4 rounded-xl shadow-lg z-50">
          <p className="text-sm font-semibold text-red-600 flex items-center gap-2">
            <X className="bg-red-50 text-red-500 rounded-full p-1 w-6 h-6" /> {error}
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}