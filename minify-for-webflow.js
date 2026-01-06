#!/usr/bin/env node

/**
 * Minify CSS and HTML for Webflow
 *
 * This script extracts CSS from <style> tags in webflow-embed.html,
 * minifies it, removes comments, and outputs a production-ready file under 50k characters.
 *
 * Usage:
 *   node minify-for-webflow.js
 *
 * Output:
 *   webflow-embed.min.html - Minified version for Webflow
 */

const fs = require('fs');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

// Configuration
const INPUT_FILE = 'webflow-embed.html';
const OUTPUT_FILE = 'webflow-embed.min.html';
const MAX_CHARS = 50000; // Webflow's limit

console.log('🔧 Minifying for Webflow...\n');

async function minifyFile() {
  try {
    // Read the source HTML file
    let html = fs.readFileSync(INPUT_FILE, 'utf8');

    // Step 1: Remove HTML comments
    html = html.replace(/<!--[\s\S]*?-->/g, '');

    // Step 2: Extract and minify CSS
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);

    if (!styleMatch) {
      console.error('❌ No <style> tags found in the HTML file');
      process.exit(1);
    }

    const originalCSS = styleMatch[1];

    const cssMinifier = new CleanCSS({
      level: 2, // Advanced optimizations
      format: false, // No formatting (fully minified)
    });

    const cssResult = cssMinifier.minify(originalCSS);

    if (cssResult.errors.length > 0) {
      console.error('❌ CSS minification errors:');
      cssResult.errors.forEach(err => console.error('  ', err));
      process.exit(1);
    }

    // Replace CSS in HTML
    html = html.replace(
      /<style>[\s\S]*?<\/style>/,
      `<style>${cssResult.styles}</style>`
    );

    // Step 3: Extract and minify JavaScript
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

    if (scriptMatch) {
      const originalJS = scriptMatch[1];

      const jsResult = await minifyJS(originalJS, {
        compress: {
          dead_code: true,
          drop_console: false,
          drop_debugger: true,
          keep_classnames: false,
          keep_fargs: true,
          keep_fnames: false,
          keep_infinity: false,
        },
        mangle: {
          toplevel: false,
        },
        format: {
          comments: false,
        },
      });

      if (jsResult.error) {
        console.error('❌ JavaScript minification error:', jsResult.error);
        process.exit(1);
      }

      // Replace JavaScript in HTML
      html = html.replace(
        /<script>[\s\S]*?<\/script>/,
        `<script>${jsResult.code}</script>`
      );
    }

    // Step 4: Remove excess whitespace (but preserve structure)
    html = html.replace(/\n\s*\n/g, '\n'); // Remove empty lines

    // Write output file
    fs.writeFileSync(OUTPUT_FILE, html);

    // Calculate savings
    const originalFileSize = fs.statSync(INPUT_FILE).size;
    const minifiedSize = html.length;
    const saved = originalFileSize - minifiedSize;
    const savedPercent = ((saved / originalFileSize) * 100).toFixed(1);

    // Display results
    console.log('✅ Minification complete!\n');
    console.log('📊 Results:');
    console.log(`   Original:  ${originalFileSize.toLocaleString()} characters`);
    console.log(`   Minified:  ${minifiedSize.toLocaleString()} characters`);
    console.log(`   Saved:     ${saved.toLocaleString()} characters (${savedPercent}%)`);
    console.log();

    // Check if under Webflow limit
    if (minifiedSize <= MAX_CHARS) {
      const remaining = MAX_CHARS - minifiedSize;
      console.log(`✅ Under Webflow limit! (${remaining.toLocaleString()} characters remaining)`);
    } else {
      const overflow = minifiedSize - MAX_CHARS;
      console.log(`⚠️  Still over Webflow limit by ${overflow.toLocaleString()} characters`);
      console.log('   Consider externalizing CSS or JavaScript to reduce further.');
    }

    console.log();
    console.log(`📄 Output: ${OUTPUT_FILE}`);

    // Show CSS warnings if any
    if (cssResult.warnings.length > 0) {
      console.log('\n⚠️  CSS Warnings:');
      cssResult.warnings.forEach(warn => console.log('  ', warn));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the async function
minifyFile();
