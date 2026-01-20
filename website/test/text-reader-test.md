# Text Reader Component Test

## Introduction

This page is used to test the TextReader component functionality.

## Basic Usage

<TextReader>
  This is a simple test sentence. Click the speaker icon to hear it read aloud.
</TextReader>

## Multiple Paragraphs

<TextReader>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</TextReader>
<TextReader>
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</TextReader>

## With Headings

<TextReader>
  And this is the paragraph text that follows it. The component should read all the content including the heading.
</TextReader>

## Lists

<TextReader>

  - Item 1: This is the first list item.
  - Item 2: This is the second list item. 
  - Item 3: This is the third list item.
</TextReader>

## Mixed Content

<TextReader>
  Here's some bold text and italic text. The component should read all of this content smoothly.

  1. First ordered item.
  2. Second ordered item.
  3. Third ordered item.

  The component handles various types of Markdown content.
</TextReader>