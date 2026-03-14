const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const data = [
  {
    "id": "m1",
    "name": "Prega News Pregnancy Test Kit",
    "type": "Device",
    "description": "One step urine HCG pregnancy test kit device, provides 99% accurate results in 5 minutes.",
    "price": "₹50",
    "category": "Wellness & Nutrition",
    "imageSrc": "/catalogue/mankind/prega-news-test-kit.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/p/r/pre0478_1_1_.jpg"
  },
  {
    "id": "m2",
    "name": "Manforce 100 mg Tablet",
    "type": "Tablet",
    "description": "Used for the treatment of erectile dysfunction in men, containing Sildenafil.",
    "price": "₹170",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/manforce-100-tablet.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/M/A/MAN0166_1_1.jpg"
  },
  {
    "id": "m3",
    "name": "Manforce Ultra Feel Bubble Gum Condoms",
    "type": "Device",
    "description": "Ultra-thin lubricated condoms with bubble gum flavour for enhanced sensitivity.",
    "price": "₹125",
    "category": "OTC Medicines",
    "imageSrc": "/catalogue/mankind/manforce-condoms.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/m/a/man0585_1-may_2_.jpg"
  },
  {
    "id": "m4",
    "name": "HealthOK Multivitamin Tablet",
    "type": "Tablet",
    "description": "Daily multivitamin and multimineral supplement with Ginseng and Taurine for energy.",
    "price": "₹150",
    "category": "Wellness & Nutrition",
    "imageSrc": "/catalogue/mankind/healthok-tablets.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/h/e/hea0849_1_2_.jpg"
  },
  {
    "id": "m5",
    "name": "HealthOK Syrup",
    "type": "Syrup",
    "description": "Vitality supplement for adults and children to improve immunity and overall health.",
    "price": "₹145",
    "category": "Wellness & Nutrition",
    "imageSrc": "/catalogue/mankind/healthok-syrup.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/H/E/HEA0855_1.jpg"
  },
  {
    "id": "m6",
    "name": "AcneStar Gel",
    "type": "Gel",
    "description": "Anti-acne gel with Clindamycin and Nicotinamide to treat pimples and acne effectively.",
    "price": "₹120",
    "category": "OTC Medicines",
    "imageSrc": "/catalogue/mankind/acnestar-gel.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/a/c/acne0091_1.jpg"
  },
  {
    "id": "m7",
    "name": "Alograce Bathing Bar",
    "type": "Soap",
    "description": "Moisturizing soap enriched with Aloe Vera and Vitamin E for soft and supple skin.",
    "price": "₹85",
    "category": "Wellness & Nutrition",
    "imageSrc": "/catalogue/mankind/alograce-soap.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/a/l/alo0243_2-1.jpg"
  },
  {
    "id": "m8",
    "name": "Gas-O-Fast Active Jeera Sachet",
    "type": "Powder",
    "description": "Ayurvedic antacid for quick relief from acidity, gas, and indigestion.",
    "price": "₹10",
    "category": "OTC Medicines",
    "imageSrc": "/catalogue/mankind/gasofast-jeera.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/G/A/GAS0003_1.jpg"
  },
  {
    "id": "m9",
    "name": "Unwanted-72 Tablet",
    "type": "Tablet",
    "description": "Emergency contraceptive pill to prevent pregnancy after unprotected intercourse.",
    "price": "₹100",
    "category": "OTC Medicines",
    "imageSrc": "/catalogue/mankind/unwanted-72.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/v1600122176/cropped/on8uofv8m04skonkhmjt.png"
  },
  {
    "id": "m10",
    "name": "Nurokind-OD Tablet",
    "type": "Tablet",
    "description": "Mecobalamin supplement for nerve health and treatment of Vitamin B12 deficiency.",
    "price": "₹175",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/nurokind-od.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/N/U/NUR0296_1_1.jpg"
  },
  {
    "id": "m11",
    "name": "Telmikind 40 Tablet",
    "type": "Tablet",
    "description": "Antihypertensive medication containing Telmisartan for managing high blood pressure.",
    "price": "₹45",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/telmikind-40.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/f44bb5db-b7b4-4df1-b962-e936679549cd.jpg"
  },
  {
    "id": "m12",
    "name": "Kofarest-PD Syrup",
    "type": "Syrup",
    "description": "Expectorant and bronchodilator for cough relief in children and adults.",
    "price": "₹115",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/kofarest-syrup.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/83726053f3e1436eb18395f87be81df9.jpg"
  },
  {
    "id": "m13",
    "name": "Ring-Out Cream",
    "type": "Gel",
    "description": "Anti-fungal cream for the treatment of ringworm, itching, and skin infections.",
    "price": "₹90",
    "category": "OTC Medicines",
    "imageSrc": "/catalogue/mankind/ring-out-cream.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/7996c507-6804-460d-8386-89d107a61d15.jpg"
  },
  {
    "id": "m14",
    "name": "Amlokind 5 Tablet",
    "type": "Tablet",
    "description": "Contains Amlodipine, used to treat high blood pressure and chest pain (Angina).",
    "price": "₹30",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/amlokind-5.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/A/M/AML0395_1_1.jpg"
  },
  {
    "id": "m15",
    "name": "Moxikind-CV 625 Tablet",
    "type": "Tablet",
    "description": "Broad-spectrum antibiotic for bacterial infections of the lungs, throat, and ears.",
    "price": "₹210",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/moxikind-cv.jpg",
    "sourceImageUrl": "https://images.apollo247.in/pub/media/catalog/product/M/O/MOX0026_1_1.jpg"
  },
  {
    "id": "m16",
    "name": "Zady 500 Tablet",
    "type": "Tablet",
    "description": "Azithromycin antibiotic used to treat various bacterial infections.",
    "price": "₹120",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/zady-500.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/v1600122176/cropped/on8uofv8m04skonkhmjt.png"
  },
  {
    "id": "m17",
    "name": "Gudcef 200 Tablet",
    "type": "Tablet",
    "description": "Cefpodoxime antibiotic for respiratory and urinary tract infections.",
    "price": "₹155",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/gudcef-200.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/cropped/vsqvpxrjy8n5q6z0m4v9.jpg"
  },
  {
    "id": "m18",
    "name": "Glimestar-M 1 Tablet",
    "type": "Tablet",
    "description": "Combination medicine for managing Type 2 Diabetes Mellitus.",
    "price": "₹110",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/glimestar-m1.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/cropped/zpxzqfzyrryyrpwyzq9r.jpg"
  },
  {
    "id": "m19",
    "name": "Pantakind 40 Tablet",
    "type": "Tablet",
    "description": "Proton pump inhibitor used to treat acidity, heartburn, and stomach ulcers.",
    "price": "₹60",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/pantakind-40.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/cropped/vsqvpxrjy8n5q6z0m4v9.jpg"
  },
  {
    "id": "m20",
    "name": "Candiforce 200 Capsule",
    "type": "Capsule",
    "description": "Anti-fungal medication containing Itraconazole for persistent fungal infections.",
    "price": "₹220",
    "category": "Prescription Medicines",
    "imageSrc": "/catalogue/mankind/candiforce-200.jpg",
    "sourceImageUrl": "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/v1600122176/cropped/on8uofv8m04skonkhmjt.png"
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error("Request Failed With a Status Code: " + res.statusCode));
      }
    }).on('error', reject);
  });
};

async function main() {
  const finalData = [];
  const publicDir = path.join(__dirname, 'public');
  
  for (const item of data) {
    const { sourceImageUrl, ...rest } = item;
    
    const destPath = path.join(publicDir, rest.imageSrc);
    try {
      console.log("Downloading " + sourceImageUrl + " to " + destPath);
      await downloadImage(sourceImageUrl, destPath);
    } catch(err) {
      console.error("Failed to download " + sourceImageUrl + ":", err);
    }
    finalData.push(rest);
  }

  let tsContent = "export interface Product {\\n  id: string;\\n  name: string;\\n  type: string;\\n  description: string;\\n  price: string;\\n  category: string;\\n  imageSrc: string;\\n}\\n\\n";
  tsContent += "export const mankindProducts: Product[] = " + JSON.stringify(finalData, null, 2) + ";\\n";

  fs.writeFileSync(path.join(__dirname, 'src', 'data', 'mankindProducts.ts'), tsContent);
  console.log("Done!");
}

main();
