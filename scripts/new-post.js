#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const title = process.argv[2] || 'New Post';
const description = process.argv[3] || 'A new post';
const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const date = new Date().toISOString().split('T')[0];

const frontmatter = `---
title: "${title}"
description: "${description}"
categories: [Journal]
date: ${date}
draft: true
image:
    src: ../../assets/salad.png
    alt: ""
    caption: ""
---

`;

const filePath = path.join(__dirname, '..', 'src', 'content', 'posts', `${slug}.md`);

fs.writeFileSync(filePath, frontmatter);
console.log(`Created new post: ${filePath}`);