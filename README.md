# Custom Cabinet Generator Form

An AI-powered cabinet visualization form for Webflow that generates custom cabinet designs based on user selections.

## Quick Start

### Installation

```bash
# Install dependencies (one-time setup)
npm install
```

### Building for Webflow

Webflow has a 50,000 character limit for embed code, so we minify the CSS before deployment.

```bash
# Minify CSS for Webflow deployment
npm run minify
```

This creates `webflow-embed.min.html` from `webflow-embed.html`.

### Deployment to Webflow

1. Run `npm run minify`
2. Copy the contents of `webflow-embed.min.html`
3. In Webflow, add an Embed element
4. Paste the code
5. Publish

**Important:** Always edit `webflow-embed.html`, never edit the `.min.html` file (it gets overwritten on build).

## Customization

### Updating Form Options

All form options are defined in the `formConfig` object in [webflow-embed.html](webflow-embed.html) (around line 912).

**Add a new cabinet type:**

```javascript
// In the "kasttype" section
{
  id: 6,
  name: "New Cabinet Type",
  prompt: "a custom built-in cabinet with specific features"
}
```

**Add a new color:**

```javascript
// In the "colors" section
{
  id: 12,
  name: "Custom Color",
  color: "#FF5733",
  prompt: "in vibrant orange finish"
}
```

**Modify any option:**

- Change `name` to update the UI button text
- Change `prompt` to modify what the AI generates
- For colors, also update the `color` hex value

### Updating the Base Prompt

The base prompt is constructed in the `buildPrompt()` function at [webflow-embed.html:1483](webflow-embed.html#L1483).

**Current implementation:**

```javascript
return `Generate ${parts.join(" ")} without changing the layout of the room`;
```

To change the base instruction:

1. Find the `buildPrompt()` function (line ~1457)
2. Modify the return statement (line 1483)
3. Add or change text before/after the `${parts.join(" ")}` placeholder

**Example - Add style instruction:**

```javascript
return `Generate a photorealistic ${parts.join(" ")} without changing the layout of the room`;
```

## How It Works

1. **User Input** - User selects options and uploads a room photo
2. **Prompt Building** - Selected options combine into an AI prompt
3. **API Request** - Photo + prompt sent to backend API
4. **Polling** - Frontend polls every 5 seconds for completion
5. **Display** - Before/after slider shows original vs generated image

**Form Configuration** - JSON structure defines all options:

```javascript
const formConfig = {
  sections: [
    {
      id: "kasttype",
      label: "Kies een kasttype",
      type: "pills", // or "color-circles"
      multiSelect: false, // or true
      options: [
        { id: 0, name: "Boekkast", prompt: "a bookshelf cabinet" }
      ]
    }
  ]
};
```

**API Endpoints:**

- `POST /task` - Creates generation task, returns taskId
- `GET /result/:taskId` - Polls for status/result

## Files

- `webflow-embed.html` - **Edit this** - Source version
- `webflow-embed.min.html` - **Don't edit** - Minified for Webflow
- `preview.html` - Local preview (open in browser)
- `minify-for-webflow.js` - Build script

## Credits

- Image Comparison Slider: [CodePen by pig3onkick3r](https://codepen.io/pig3onkick3r/pen/YzqqWKY)
