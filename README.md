# Custom Cabinet Generator Form

A dynamic Webflow-embedded form that generates AI-powered custom cabinet visualizations using image-to-image transformation with user-specified parameters.

## Overview

This project provides an interactive form interface that allows users to upload a photo of their space and customize cabinet designs through an intuitive UI. The form collects user preferences (cabinet type, colors, style, functionality) and sends them to an AI image generation API, then displays a before/after comparison of the results.

## Key Features

### 🎨 Dynamic Form Generation

- **JSON-driven configuration** - All form fields, options, and AI prompts defined in a single data structure
- **Multiple input types** - Pills for text selections, color circles for color choices
- **Real-time validation** - Submit button enables only when all fields are selected
- **Responsive design** - Mobile-first layout that adapts from mobile to desktop

### 🖼️ Image Upload & Processing

- **Drag-and-drop support** - Users can drag images onto the upload area
- **Live preview** - Uploaded images display immediately in the form
- **Base64 encoding** - Images converted to base64 for API transmission

### 🔄 AI Image Generation

- **Asynchronous task processing** - Uses polling mechanism to handle long-running AI operations
- **Real-time status updates** - Loading spinner and status messages during generation
- **Error handling** - Comprehensive error messages for failed generations

### 📊 Before/After Comparison

- **Interactive slider** - Users can drag to compare original vs generated images
- **Smooth animations** - Polished transitions and hover effects
- **Download functionality** - One-click download of generated results
- **Reset capability** - Easy form reset to create another design

## Architecture

### File Structure

```
custom-form/
├── webflow-embed.html    # Production-ready embed for Webflow
├── preview.html          # Local development/preview version
├── original.png          # Sample original image
├── modified.png          # Sample generated image
└── README.md            # This file
```

### Configuration System

The form uses a JSON-based configuration system that separates data from logic:

```javascript
const formConfig = {
  sections: [
    {
      id: "kasttype",
      label: "Kies een kasttype",
      type: "pills",
      options: [
        { id: 0, name: "Boekkast", prompt: "a bookshelf cabinet" },
        // ... more options
      ],
    },
    // ... more sections
  ],
};
```

**Benefits:**

- Non-developers can update options and prompts
- Easy to add new sections or modify existing ones
- Prompt fragments automatically combine into coherent AI instructions

### Data Flow

1. **User Input** → Form selections stored in `selections` object
2. **Prompt Building** → `buildPrompt()` assembles fragments into AI prompt
3. **Task Creation** → POST to `/task` endpoint with image + prompt
4. **Polling** → GET to `/result/:taskId` every 5 seconds until completion
5. **Display** → Show before/after comparison with interactive slider

### API Integration

The form communicates with a backend API:

```
Base URL: https://knapkast-express-api.vercel.app

POST /task
  - Creates new image generation task
  - Body: { prompt, imageBase64, aspectRatio, resolution, outputFormat }
  - Returns: { taskId }

GET /result/:taskId
  - Polls for task completion
  - Returns: { status, imageUrl, error }
  - Status: "pending" | "success" | "failed"
```

## Technology Choices

### Why JSON-Driven Form Fields?

**Decision**: Store all form configuration (UI + prompts) in a single JSON structure

**Reasoning**:

- **Client autonomy** - Non-technical users can update options/prompts
- **Maintainability** - All related data in one place
- **Scalability** - Adding new sections requires only JSON updates
- **Prompt flexibility** - Easy to iterate on AI prompt phrasing

**Trade-offs**:

- No type safety (pure JavaScript)
- Specialized UI behaviors require code changes
- Higher initial development time

**Result**: Client can independently add cabinet types, modify prompts, and adjust options without developer involvement.

### Why Single-File HTML?

**Decision**: Package entire application in one HTML file

**Reasoning**:

- **Webflow compatibility** - Easy to embed via custom code block
- **No build process** - Direct copy-paste deployment
- **Self-contained** - No external dependencies or file requests
- **Portability** - Easy to share, preview, and version control

**Trade-offs**:

- Larger file size
- No module system or code splitting
- Limited code organization

## Form Sections

1. **Kies een kasttype** (Cabinet Type)

   - Boekkast, Wandkast, Bijkeuken, Kledingkast, Bureaukast, Gangkast

2. **Space** (Configuration)

   - Whole wall, Loose, Handle Doors, No Doors, Sliding Doors

3. **Colors**

   - Wood, Wood Stripes, White, Beige, Grey, Dark Grey, Mahogany
   - Visual color circles for intuitive selection

4. **Vibe** (Style)

   - Modern, Clean, Farm, Openkast, Bureaukast, Gangkast

5. **Functionality** (Features)
   - Row of open space, Drawers, Table, Seats

## Image Comparison Slider

The before/after comparison slider is based on [this CodePen by pig3onkick3r](https://codepen.io/pig3onkick3r/pen/YzqqWKY).

**Features:**

- Drag handle to reveal before/after
- Touch and mouse support
- Responsive sizing
- Smooth dragging performance

**Implementation**: [webflow-embed.html:1112-1197](webflow-embed.html#L1112-L1197)

## Usage

### For Webflow

1. Copy the contents of `webflow-embed.html`
2. In Webflow, add an Embed element to your page
3. Paste the code into the embed
4. Publish your site

### For Local Preview

1. Open `preview.html` in a browser
2. The form will work with the production API
3. No build process or server required

## Customization

### Adding a New Cabinet Type

```javascript
// In formConfig.sections, find the kasttype section
{
  id: 6,
  name: "New Cabinet",
  prompt: "a new style cabinet"
}
```

### Changing Colors

```javascript
// In formConfig.sections, find the colors section
{
  id: 7,
  name: "Custom Color",
  color: "#FF5733",
  prompt: "in custom orange color"
}
```

### Modifying Prompts

Update the `prompt` field for any option to change how the AI interprets selections.

### Styling

All styles are scoped to `#cabinet-generator-wrapper` to avoid conflicts with Webflow styles.

## Performance Considerations

- **Base64 encoding**: Images converted client-side to avoid multipart form complexity
- **Polling interval**: 5-second intervals balance responsiveness vs API load
- **Timeout**: 5-minute maximum (60 polls) prevents infinite loops
- **Image optimization**: Consider resizing large uploads before encoding

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Touch devices (iOS, Android)
- Responsive breakpoints: 1024px, 768px, 480px

## Credits

- **Image Comparison Slider**: Based on [CodePen by pig3onkick3r](https://codepen.io/pig3onkick3r/pen/YzqqWKY)
- **Font**: Inter from Google Fonts
- **Icons**: SVG icons inline

## License

Proprietary - Knapkast Project
