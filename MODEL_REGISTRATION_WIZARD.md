# Model Registration Wizard - Complete Implementation

## 📋 Overview

Implementiran je **kompletan 9-step registracioni wizard** za modele, identičan and6.com procesu.

## 🎯 Features

### ✅ Multi-Step Registration Process

1. **Biography (Step 1/9)**
   - Basic BIO: Showname, Slogan, Gender, Ethnicity, Nationality, Age
   - Physical Features: Hair Color, Eye Color, Height, Weight, Dress Size, Shoe Size
   - Body Measurements: Bust, Waist, Hip, Cup Size, Pubic Hair
   - Additional Info: Smoking, Drinking, Special Characteristics
   - Block Countries: Block/Allow countries functionality

2. **About Me (Step 2/9)**
   - Rich text description (25,000 characters max)
   - Text formatting buttons (Bold, Italic, Underline)

3. **Languages (Step 3/9)**
   - Multi-language selection with proficiency levels
   - Add/Remove languages dynamically
   - Levels: Basic, Intermediate, Fluent, Native

4. **Area / Address (Step 4/9)**
   - Swiss regions selection (Deutschschweiz, Romandie)
   - Exact location (City, ZIP)
   - Address details (Club Name, Street, Number)
   - Display address checkbox
   - Available For: Incall/Outcall

5. **Services (Step 5/9)**
   - Sexual Orientation
   - Services Offered For: Men, Women, Couples, Trans, Gays, 2+
   - **Main Services** (17 options) - Collapsible
   - **Extra Services** (32 options) - Collapsible
   - **Fetish / Bizarre** (19 options) - Collapsible
   - **Virtual Services** (16 options) - Collapsible
   - **Massage Services** (10 options) - Collapsible

6. **Working Hours (Step 6/9)**
   - Custom Schedule (per day)
   - Same schedule every day
   - 24/7 availability
   - Show as Night Escort checkbox

7. **Rates (Step 7/9)**
   - Incall Rates (duration + price in CHF)
   - Outcall Rates (duration + price in CHF)
   - Multiple rates per category
   - Add/Remove rates dynamically

8. **Contact Details (Step 8/9)**
   - Phone Number with country code
   - Show phone number checkbox
   - Messengers: Viber, WhatsApp, Telegram
   - Instructions: SMS and Call, SMS Only, No SMS
   - No Withheld Numbers checkbox
   - Web: Skype ID, Videogirls URL, Email, Website

9. **Pictures / Video (Step 9/9)**
   - Photo upload with requirements
   - Video upload with requirements
   - Gallery management
   - FINISH button

## 📁 File Structure

```
nice-models/src/
├── app/
│   └── register/
│       └── model/
│           └── page.tsx                    # Model registration page
├── components/
│   └── registration/
│       ├── ModelRegistrationWizard.tsx     # Main wizard component
│       └── steps/
│           ├── BiographyStep.tsx           # Step 1
│           ├── AboutMeStep.tsx             # Step 2
│           ├── LanguagesStep.tsx           # Step 3
│           ├── AreaAddressStep.tsx         # Step 4
│           ├── ServicesStep.tsx            # Step 5
│           ├── WorkingHoursStep.tsx        # Step 6
│           ├── RatesStep.tsx               # Step 7
│           ├── ContactDetailsStep.tsx      # Step 8
│           └── PicturesVideoStep.tsx       # Step 9
```

## 🎨 Design Features

### Pink Header Bar
- Gradient: `from-pink-600 to-pink-500`
- Back arrow (ChevronLeft icon)
- Step title
- Progress indicator (e.g., "1/9")

### Form Elements
- Clean, modern inputs with focus states
- Pink accent color (`focus:ring-pink-500`)
- Rounded corners and shadows
- Hover effects on buttons
- Checkbox and radio button styling

### Navigation
- "NEXT STEP" button (pink gradient)
- Back arrow in header
- Automatic scroll to top on step change

## 🔄 Data Flow

### Registration Data Interface
```typescript
interface RegistrationData {
  // Biography
  showname: string
  slogan: string
  gender: string
  // ... (50+ fields)
  
  // Photos/Videos
  photos: File[]
  videos: File[]
}
```

### State Management
- Centralized state in `ModelRegistrationWizard`
- `updateFormData()` function for partial updates
- Step navigation with `nextStep()` and `prevStep()`

## 🚀 Usage

### 1. User Registration Flow

```typescript
// In RegisterForm.tsx
if (formData.role === 'model') {
  router.push('/register/model')  // Redirect to wizard
}
```

### 2. Accessing the Wizard

```
/register/model
```

### 3. Completing Registration

After clicking "FINISH" on Step 9:
- Data is logged to console
- TODO: Submit to Supabase
- TODO: Create model profile
- TODO: Upload photos/videos to storage

## 🔧 Integration Points

### Supabase Integration (TODO)

```typescript
// In PicturesVideoStep.tsx - handleSubmit()
const handleSubmit = async () => {
  // 1. Upload photos to Supabase Storage
  // 2. Upload videos to Supabase Storage
  // 3. Create model_details record
  // 4. Create model_services records
  // 5. Create model_rates records
  // 6. Create model_languages records
  // 7. Update profile status to 'active'
  // 8. Redirect to dashboard
}
```

### Required Database Tables
- `profiles` - Basic user info
- `model_details` - Model-specific info
- `model_services` - Services offered
- `model_rates` - Pricing information
- `model_languages` - Languages spoken
- `model_photos` - Photo gallery
- `model_videos` - Video gallery

## 🎯 Next Steps

1. **Backend Integration**
   - Connect wizard to Supabase
   - Implement file upload to Storage
   - Create database records

2. **Validation**
   - Add form validation per step
   - Prevent navigation without required fields
   - Show error messages

3. **Progress Saving**
   - Auto-save draft data
   - Allow users to continue later
   - Session storage for temporary data

4. **Photo/Video Management**
   - Image preview before upload
   - Drag & drop functionality
   - Crop/resize tools
   - Video thumbnail generation

5. **Multi-language Support**
   - Translate all wizard steps
   - Use `useLanguage()` hook
   - Add translations to all text

## 📸 Screenshots Reference

Wizard je dizajniran prema slikama:
- Biography page (1/9)
- About Me page (2/9)
- Languages page (3/9)
- Area/Address page (4/9)
- Services page (5/9)
- Working Hours page (6/9)
- Rates page (7/9)
- Contact Details page (8/9)
- Pictures/Video page (9/9)

## ✨ Key Features

- ✅ **9 comprehensive steps**
- ✅ **Pink gradient header with progress**
- ✅ **Collapsible service categories**
- ✅ **Dynamic add/remove for rates & languages**
- ✅ **File upload for photos & videos**
- ✅ **Swiss region selection**
- ✅ **Multiple contact methods**
- ✅ **Working hours flexibility**
- ✅ **Responsive design**
- ✅ **Clean, modern UI**

---

**Status**: ✅ Frontend Complete | ⏳ Backend Integration Pending

